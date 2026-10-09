// Import asynchronous Node file operations for JSON persistence.
const fs = require('node:fs/promises');

// Import path helpers for safe cross-platform file paths.
const path = require('node:path');

// A generic repository handles one JSON array file.
class JsonRepository {

  // Save the target file location.
  constructor(filePath) { this.filePath = filePath; }

  // Read an array or return an empty array when the file is missing or empty.
  async readAll() { try { const text = await fs.readFile(this.filePath, 'utf8'); return text.trim() ? JSON.parse(text) : []; } catch (error) { if (error.code === 'ENOENT') return []; throw new Error(`Unable to read ${this.filePath}: ${error.message}`); } }

  // Write a complete JSON array and create its parent directory.
  async saveAll(records) { try { await fs.mkdir(path.dirname(this.filePath), { recursive: true }); await fs.writeFile(this.filePath, JSON.stringify(records, null, 2)); return records; } catch (error) { throw new Error(`Unable to write ${this.filePath}: ${error.message}`); } }

  // Add one record to the existing array.
  async create(record) { const records = await this.readAll(); records.push(record); return this.saveAll(records); }

  // Find one record by its identifier field.
  async findById(id, key = 'requestId') { return (await this.readAll()).find(record => record[key] === id); }

  // Find records owned by a requester.
  async findByRequester(requesterId) { return (await this.readAll()).filter(record => record.requesterId === requesterId); }

  // Find records assigned to a technician.
  async findByTechnician(technicianId) { return (await this.readAll()).filter(record => record.assignedTechnicianId === technicianId); }

  // Replace one record using a controlled update.
  async update(id, changes, key = 'requestId') { const records = await this.readAll(); const index = records.findIndex(record => record[key] === id); if (index < 0) throw new Error('Record not found.'); records[index] = { ...records[index], ...changes }; return this.saveAll(records); }
}

// Give the generic repositories meaningful names required by the brief.
class UserFileRepository extends JsonRepository {}

// Persist service request plain data.
class ServiceRequestFileRepository extends JsonRepository {}

// Persist request history entries.
class RequestHistoryFileRepository extends JsonRepository {}

// Persist audit entries.
class AuditFileRepository extends JsonRepository {}

// Export repositories for the application and tests.
module.exports = { JsonRepository, UserFileRepository, ServiceRequestFileRepository, RequestHistoryFileRepository, AuditFileRepository };
