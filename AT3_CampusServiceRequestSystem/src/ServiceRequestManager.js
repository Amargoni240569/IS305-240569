// The manager stores all users and requests in JavaScript arrays for the Pass component.
class ServiceRequestManager {

  // Create the in-memory collections used by the application.
  constructor(users = [], requests = [], auditLog = []) {

    // Keep registered users in one collection.
    this.users = users;

    // Keep submitted requests in one collection.
    this.requests = requests;

    // Keep audit records in one collection for the Distinction component.
    this.auditLog = auditLog;
  }

  // Register a user only when the identifier is unique.
  registeruser(user) {

    // Reject a second user with the same ID.
    if (this.finduserbyid(user.userId)) throw new Error('Duplicate user ID.');

    // Store the valid user in the users array.
    this.users.push(user);

    // Record the successful registration for the audit trail.
    this.audit('User registration', null, user.userId, 'User registered successfully');

    // Return the new user to the caller.
    return user;
  }

  // Provide the JavaScript naming style used by the earlier source code.
  registerUser(user) { return this.registeruser(user); }

  // Find a user by exact user ID.
  finduserbyid(userId) { return this.users.find(user => user.userId === userId); }

  // Provide a readable camel-case alias for application code.
  findUserById(userId) { return this.finduserbyid(userId); }

  // Submit a request only when the request ID is unique.
  submitRequest(request) {

    // Reject duplicate request identifiers.
    if (this.findRequestbyid(request.requestId)) throw new Error('Duplicate request ID.');

    // Store the validated request in the requests array.
    this.requests.push(request);

    // Record the request creation event.
    this.audit('Request creation', request.requestId, request.requester.userId, 'Request submitted');

    // Return the submitted request.
    return request;
  }

  // Find a request by exact request ID.
  findRequestbyid(requestId) { return this.requests.find(request => request.requestId === requestId); }

  // Provide a camel-case alias for compatibility with normal JavaScript style.
  findRequestById(requestId) { return this.findRequestbyid(requestId); }

  // Return only requests belonging to one requester.
  getRequestsbyuser(userId) { return this.requests.filter(request => request.requester.userId === userId); }

  // Provide a readable camel-case alias.
  getRequestsByUser(userId) { return this.getRequestsbyuser(userId); }

  // Return a copy of all request records.
  getallrequests() { return [...this.requests]; }

  // Provide a readable camel-case alias.
  getAllRequests() { return this.getallrequests(); }

  // Update an owned Submitted request through its controlled method.
  updateRequest(requestId, userId, changes) {

    // Locate the request or produce a clear error.
    const request = this.requireRequest(requestId);

    // Locate the acting requester or produce a clear error.
    const user = this.requireUser(userId);

    // Let the domain object enforce ownership and editable-state rules.
    request.updateDetails(changes, user);

    // Record the approved update in the audit trail.
    this.audit('Request update', requestId, userId, 'Request details updated');

    // Return the changed request.
    return request;
  }

  // Cancel only an owned Submitted request.
  cancelRequest(requestId, userId) {

    // Locate the request before changing it.
    const request = this.requireRequest(requestId);

    // Locate the requester who is asking to cancel it.
    const user = this.requireUser(userId);

    // Let the request enforce ownership and final-state rules.
    request.cancelRequest(user);

    // Record the cancellation in the audit trail.
    this.audit('Request cancellation', requestId, userId, 'Request cancelled');

    // Return the cancelled request.
    return request;
  }

  // Search request IDs, titles, and descriptions using case-insensitive text.
  searchRequests(searchText) {

    // Convert the search value to comparable lowercase text.
    const query = String(searchText).toLowerCase();

    // Return every request containing the search text.
    return this.requests.filter(request => [request.requestId, request.title, request.description].some(value => String(value).toLowerCase().includes(query)));
  }

  // Count requests grouped by their current status.
  getRequestsummarybystatus() {

    // Reduce the array into a status-to-count object.
    return this.requests.reduce((summary, request) => {

      // Increase the count for the request status.
      summary[request.status] = (summary[request.status] || 0) + 1;

      // Continue the reduction with the updated object.
      return summary;
    }, {});
  }

  // Provide the previous camel-case summary name.
  getRequestSummaryByStatus() { return this.getRequestsummarybystatus(); }

  // Filter by category, status, priority, or assigned technician.
  filterRequests({ category, status, priority, assignedTechnicianId } = {}) {
    // Keep only records that match every supplied filter.
    return this.requests.filter(request => (!category || request.category === category) && (!status || request.status === status) && (!priority || request.priority === priority) && (!assignedTechnicianId || request.assignedTechnicianId === assignedTechnicianId));
  }

  // Sort requests by date submitted or specialised priority score.
  sortRequests(requests = this.requests, by = 'dateSubmitted') {
    // Copy before sorting so the original collection order is preserved.
    return [...requests].sort((left, right) => by === 'priority' ? right.calculatePriorityScore() - left.calculatePriorityScore() : new Date(left.dateSubmitted) - new Date(right.dateSubmitted));
  }

  // Allow only a Service Officer to review a request.
  reviewRequest(requestId, officerId, comment = 'Officer review completed') {

    // Locate the request and officer.
    const request = this.requireRequest(requestId);

    // Require the correct role before changing state.
    const officer = this.requireRole(officerId, 'ServiceOfficer');

    // Apply the controlled Submitted-to-Reviewed transition.
    request.transitionTo('Reviewed', officer, comment);

    // Record the approved action.
    this.audit('Status change', requestId, officerId, comment);

    // Return the updated request.
    return request;
  }

    // Allow only an officer to set priority and assign a technician.
  assignTechnician(requestId, officerId, technicianId, priority = 'Normal') {

    // Locate the request and acting officer.
    const request = this.requireRequest(requestId);

    // Check the officer role.
    const officer = this.requireRole(officerId, 'ServiceOfficer');

    // Check the technician role.
    const technician = this.requireRole(technicianId, 'Technician');

    // Assignment is allowed only after review.
    if (request.status !== 'Reviewed') throw new Error('Only Reviewed requests can be assigned.');

    // Store the controlled priority value.
    request.priority = priority;

    // Store the assigned technician relationship.
    request.assignedTechnicianId = technician.userId;

    // Apply the Reviewed-to-Assigned transition.
    request.transitionTo('Assigned', officer, `Assigned to ${technician.userId}`);

    // Record the assignment event.
    this.audit('Technician assignment', requestId, officerId, `Assigned to ${technician.userId}`);

    // Return the assigned request.
    return request;
  }

  // Allow only the assigned technician to begin work.
  startWork(requestId, technicianId) {

    // Locate the request and technician.
    const request = this.requireRequest(requestId);

    // Require a technician role.
    const technician = this.requireRole(technicianId, 'Technician');

    // Prevent another technician from starting the work.
    if (request.assignedTechnicianId !== technician.userId) throw new Error('Only the assigned Technician can start work.');

    // Apply the Assigned-to-In Progress transition.
    request.transitionTo('In Progress', technician, 'Technician began work');

    // Record the status change.
    this.audit('Status change', requestId, technicianId, 'Work started');

    // Return the updated request.
    return request;
  }

  // Allow only the assigned technician to resolve work.
  resolveRequest(requestId, technicianId, note = 'Work resolved') {

    // Locate the request and technician.
    const request = this.requireRequest(requestId);

    // Require a technician role.
    const technician = this.requireRole(technicianId, 'Technician');

    // Prevent an unassigned technician from resolving it.
    if (request.assignedTechnicianId !== technician.userId) throw new Error('Only the assigned Technician can resolve work.');

    // Apply the In Progress-to-Resolved transition.
    request.transitionTo('Resolved', technician, note);

    // Record the resolution.
    this.audit('Request resolution', requestId, technicianId, note);

    // Return the resolved request.
    return request;
  }

  // Allow only a Service Officer to close a Resolved request.
  closeRequest(requestId, officerId, comment = 'Completion verified') {

    // Locate the request and officer.
    const request = this.requireRequest(requestId);

    // Require the officer role.
    const officer = this.requireRole(officerId, 'ServiceOfficer');

    // Apply the Resolved-to-Closed transition.
    request.transitionTo('Closed', officer, comment);

    // Record the closure.
    this.audit('Request closure', requestId, officerId, comment);

    // Return the closed request.
    return request;
  }

  // Locate a request or raise a clear error.
  requireRequest(requestId) { const request = this.findRequestbyid(requestId); if (!request) throw new Error('Request not found.'); return request; }

  // Locate a user or raise a clear error.
  requireUser(userId) { const user = this.finduserbyid(userId); if (!user) throw new Error('User not found.'); return user; }

  // Locate a user and check the required role.
  requireRole(userId, role) { const user = this.requireUser(userId); if (user.userType !== role) throw new Error(`Only ${role} may perform this action.`); return user; }

  // Add a plain audit record for the Distinction persistence layer.
  audit(action, requestId, actorIdOrRole, description, result = 'Success') { this.auditLog.push({ actorIdOrRole, action, affectedRequestId: requestId, description, dateTime: new Date().toISOString(), result }); }
}

// Export the manager for the console app, tests, and other project files.
module.exports = { ServiceRequestManager };
