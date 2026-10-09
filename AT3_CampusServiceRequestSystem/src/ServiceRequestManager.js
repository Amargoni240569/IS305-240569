// The manager coordinates Pass users and requests using JavaScript arrays.
class ServiceRequestManager {

  // Start with empty arrays or supplied arrays for testing and later extensions.
  constructor(users = [], requests = []) { this.users = users; this.requests = requests; }

  // Register a user only when its user ID is unique.
  registeruser(user) { if (this.finduserbyid(user.userId)) throw new Error('Duplicate user ID.'); this.users.push(user); return user; }

  // Provide a standard camel-case alias for the required method.
  registerUser(user) { return this.registeruser(user); }

  // Find one user by exact user ID.
  finduserbyid(userId) { return this.users.find(user => user.userId === userId); }

  // Submit one request only when its request ID is unique.
  submitRequest(request) { if (this.findRequestbyid(request.requestId)) throw new Error('Duplicate request ID.'); this.requests.push(request); return request; }

  // Find one request by exact request ID.
  findRequestbyid(requestId) { return this.requests.find
  (request => request.requestId === requestId); }

  // Return only requests belonging to the selected requester.
  getRequestsbyuser(userId) { return this.requests.filter(request => request.requester.userId === userId); }

  // Return a copy of all request records.
  getallrequests() { return [...this.requests]; }

  // Update a request through its ownership and validation rules.
  updateRequest(requestId, userId, changes) { const request = this.requireRequest(requestId); const user = this.requireUser(userId); return request.updateDetails(changes, user); }

  // Cancel a request through its ownership and status rules.
  cancelRequest(requestId, userId) { const request = this.requireRequest(requestId); const user = this.requireUser(userId); return request.cancelRequest(user); }

  // Search request ID, title, and description without case sensitivity.
  searchRequests(searchText) { const query = String(searchText).toLowerCase(); return this.requests.filter(request => [request.requestId, request.title, request.description].some(value => String(value).toLowerCase().includes(query))); }

  // Count requests grouped by Submitted or Cancelled status.
  getRequestsummarybystatus() { return this.requests.reduce((summary, request) => { summary[request.status] = (summary[request.status] || 0) + 1; return summary; }, {}); }

  // Provide the readable camel-case summary alias.
  getRequestSummaryByStatus() { return this.getRequestsummarybystatus(); }

  // Require a request or provide a clear error message.
  requireRequest(requestId) { const request = this.findRequestbyid(requestId); if (!request) throw new Error('Request not found.'); return request; }
  
  // Require a user or provide a clear error message.
  requireUser(userId) { const user = this.finduserbyid(userId); if (!user) throw new Error('User not found.'); return user; }
}

// Export the Pass manager for the console application and tests.
module.exports = { ServiceRequestManager };
