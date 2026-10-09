// The manager coordinates users and requests using JavaScript arrays only.

class ServiceRequestManager {
  // Start with empty or supplied arrays for simple Credit-stage testing.
  constructor(users = [], requests = []) { this.users = users; this.requests = requests; }

  // Register one unique user.
  registeruser(user) { if (this.finduserbyid(user.userId)) throw new Error('Duplicate user ID.'); this.users.push(user); return user; }

  // Provide the conventional camel-case alias.
  registerUser(user) { return this.registeruser(user); }

  // Find one user by exact identifier.
  finduserbyid(userId) { return this.users.find(user => user.userId === userId); }

  // Submit one unique request.
  submitRequest(request) { if (this.findRequestbyid(request.requestId)) throw new Error('Duplicate request ID.'); this.requests.push(request); return request; }

  // Find one request by exact identifier.
  findRequestbyid(requestId) { return this.requests.find(request => request.requestId === requestId); }

  // Return only requests belonging to one requester.
  getRequestsbyuser(userId) { return this.requests.filter(request => request.requester.userId === userId); }

  // Return a copy of all current requests.
  getallrequests() { return [...this.requests]; }

  // Update through the request's controlled ownership method.
  updateRequest(requestId, userId, changes) { const request = this.requireRequest(requestId); const user = this.requireUser(userId); return request.updateDetails(changes, user); }

  // Cancel through the request's controlled ownership method.
  cancelRequest(requestId, userId) { const request = this.requireRequest(requestId); const user = this.requireUser(userId); return request.cancelRequest(user); }

  // Search the request ID, title, and description.
  searchRequests(searchText) { const query = String(searchText).toLowerCase(); return this.requests.filter(request => [request.requestId, request.title, request.description].some(value => String(value).toLowerCase().includes(query))); }

  // Return counts grouped by request status.
  getRequestsummarybystatus() { return this.requests.reduce((summary, request) => { summary[request.status] = (summary[request.status] || 0) + 1; return summary; }, {}); }

  // Filter by category, status, priority, or assigned technician.
  filterRequests({ category, status, priority, assignedTechnicianId } = {}) { return this.requests.filter(request => (!category || request.category === category) && (!status || request.status === status) && (!priority || request.priority === priority) && (!assignedTechnicianId || request.assignedTechnicianId === assignedTechnicianId)); }

  // Sort by submission date or by each subclass's priority score.
  sortRequests(requests = this.requests, by = 'dateSubmitted') { return [...requests].sort((left, right) => by === 'priority' ? right.calculatePriorityScore() - left.calculatePriorityScore() : new Date(left.dateSubmitted) - new Date(right.dateSubmitted)); }

  // Only an officer may review a Submitted request.
  reviewRequest(requestId, officerId, comment = 'Officer review completed') { const request = this.requireRequest(requestId); const officer = this.requireRole(officerId, 'ServiceOfficer'); request.transitionTo('Reviewed', officer, comment); return request; }

  // Only an officer may assign priority and a technician after review.
  assignTechnician(requestId, officerId, technicianId, priority = 'Normal') { const request = this.requireRequest(requestId); const officer = this.requireRole(officerId, 'ServiceOfficer'); const technician = this.requireRole(technicianId, 'Technician'); if (request.status !== 'Reviewed') throw new Error('Only Reviewed requests can be assigned.'); request.priority = priority; request.assignedTechnicianId = technician.userId; request.transitionTo('Assigned', officer, `Assigned to ${technician.userId}`); return request; }

  // Only the assigned technician may start work.
  startWork(requestId, technicianId) { const request = this.requireRequest(requestId); const technician = this.requireRole(technicianId, 'Technician'); if (request.assignedTechnicianId !== technician.userId) throw new Error('Only the assigned Technician can start work.'); request.transitionTo('In Progress', technician, 'Technician began work'); return request; }

  // Only the assigned technician may resolve work.
  resolveRequest(requestId, technicianId, note = 'Work resolved') { const request = this.requireRequest(requestId); const technician = this.requireRole(technicianId, 'Technician'); if (request.assignedTechnicianId !== technician.userId) throw new Error('Only the assigned Technician can resolve work.'); request.transitionTo('Resolved', technician, note); return request; }

  // Only an officer may close a Resolved request.
  closeRequest(requestId, officerId, comment = 'Completion verified') { const request = this.requireRequest(requestId); const officer = this.requireRole(officerId, 'ServiceOfficer'); request.transitionTo('Closed', officer, comment); return request; }

  // Require a request or show a clear error.
  requireRequest(requestId) { const request = this.findRequestbyid(requestId); if (!request) throw new Error('Request not found.'); return request; }

  // Require a user or show a clear error.
  requireUser(userId) { const user = this.finduserbyid(userId); if (!user) throw new Error('User not found.'); return user; }

  // Require an exact role before a protected workflow action.
  requireRole(userId, role) { const user = this.requireUser(userId); if (user.userType !== role) throw new Error(`Only ${role} may perform this action.`); return user; }
}

// Export the Credit manager.
module.exports = { ServiceRequestManager };
