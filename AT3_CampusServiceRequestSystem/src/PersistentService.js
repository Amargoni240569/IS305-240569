// Import repository classes for separated JSON access.
const { UserFileRepository, ServiceRequestFileRepository, RequestHistoryFileRepository, AuditFileRepository } = require('../repositories/FileRepositories');

// Import factory functions that recreate active objects.
const { restoreUser, restoreRequest } = require('./RequestFactory');

// Import the in-memory manager.
const { ServiceRequestManager } = require('./ServiceRequestManager');

// Manage persistence without placing file code inside the console application.
class PersistentCampusService {

  // Create four repositories, one for each required JSON file.
  constructor(dataDir) { this.userRepository = new UserFileRepository(`${dataDir}/users.json`); this.requestRepository = new ServiceRequestFileRepository(`${dataDir}/serviceRequests.json`); this.historyRepository = new RequestHistoryFileRepository(`${dataDir}/requestHistory.json`); this.auditRepository = new AuditFileRepository(`${dataDir}/auditLog.json`); this.manager = new ServiceRequestManager(); }

  // Load plain JSON records and restore the correct domain objects.
  async load() { const [userData, requestData, history, auditLog] = await Promise.all([this.userRepository.readAll(), this.requestRepository.readAll(), this.historyRepository.readAll(), this.auditRepository.readAll()]); const users = userData.map(restoreUser); const byId = new Map(users.map(user => [user.userId, user])); const requests = requestData.map(data => restoreRequest({ ...data, history: data.history || history.filter(item => item.requestId === data.requestId) }, byId.get(data.requesterId))); this.manager = new ServiceRequestManager(users, requests, auditLog); return this.manager; }

  // Save only plain JSON data produced by active domain objects.
  async save() { await Promise.all([this.userRepository.saveAll(this.manager.users.map(user => user.toJSON())), this.requestRepository.saveAll(this.manager.requests.map(request => request.toJSON())), this.historyRepository.saveAll(this.manager.requests.flatMap(request => request.history.map(item => ({ requestId: request.requestId, ...item })))), this.auditRepository.saveAll(this.manager.auditLog)]); return true; }
}

// Export the persistence service.
module.exports = { PersistentCampusService };
