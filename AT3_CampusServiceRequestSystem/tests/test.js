// Import Node's built-in test runner.
const test = require('node:test');

// Import strict assertions.
const assert = require('node:assert/strict');

// Import the Pass domain classes.
const { User } = require('../src/User');

// Import the Pass request class.
const { ServiceRequest } = require('../src/ServiceRequest');

// Import the Pass manager.
const { ServiceRequestManager } = require('../src/ServiceRequestManager');

// Create a reusable valid Pass fixture.
function fixture() { const manager = new ServiceRequestManager(); const user = manager.registeruser(new User('USR001', 'Test', 'Entry', 'test@example.com', 'Student')); return { manager, user }; }

// Test valid User construction and display methods.
test('valid User construction returns identity information', () => { const { user } = fixture(); assert.equal(user.userId, 'USR001'); assert.equal(user.getFullName(), 'Test Entry'); assert.match(user.displayInfo(), /test@example.com/); });

// Test invalid user IDs.
test('invalid user IDs are rejected', () => { assert.throws(() => new User('A', 'Test', 'Entry', 'test@example.com'), /User ID/); });

// Test invalid email addresses.
test('invalid email addresses are rejected', () => { assert.throws(() => new User('USR002', 'Test', 'Entry', 'bad-email'), /valid email/); });

// Test duplicate user IDs.
test('duplicate user IDs are rejected', () => { const { manager, user } = fixture(); assert.throws(() => manager.registeruser(user), /Duplicate user ID/); });

// Test valid request submission and default Submitted status.
test('valid request submission stores a Submitted request', () => { const { manager, user } = fixture(); const request = manager.submitRequest(new ServiceRequest({ requestId: 'REQ-001', requester: user, title: 'Wi-Fi issue', description: 'No access', location: 'Library', category: 'ICT Support', priority: 'High' })); assert.equal(request.status, 'Submitted'); assert.equal(manager.getallrequests().length, 1); });

// Test duplicate request IDs.
test('duplicate request IDs are rejected', () => { const { manager, user } = fixture(); const details = { requestId: 'REQ-DUP', requester: user, title: 'A', description: 'B', location: 'C', category: 'ICT Support' }; manager.submitRequest(new ServiceRequest(details)); assert.throws(() => manager.submitRequest(new ServiceRequest(details)), /Duplicate request ID/); });

// Test unsupported categories and priorities.
test('unsupported category and priority values are rejected', () => { const { user } = fixture(); assert.throws(() => new ServiceRequest({ requestId: 'REQ-BAD', requester: user, title: 'A', description: 'B', location: 'C', category: 'Unsupported' }), /category/); assert.throws(() => new ServiceRequest({ requestId: 'REQ-BAD2', requester: user, title: 'A', description: 'B', location: 'C', category: 'ICT Support', priority: 'Critical' }), /priority/); });

// Test requester-only viewing and search operations.
test('view by user and search return matching records', () => { const { manager, user } = fixture(); manager.submitRequest(new ServiceRequest({ requestId: 'REQ-SEARCH', requester: user, title: 'Campus Wi-Fi', description: 'Network access', location: 'Library', category: 'ICT Support' })); assert.equal(manager.getRequestsbyuser(user.userId).length, 1); assert.equal(manager.searchRequests('Wi-Fi').length, 1); });

// Test only the owning requester can update a Submitted request.
test('only the owning requester can update a Submitted request', () => { const { manager, user } = fixture(); const other = manager.registeruser(new User('USR002', 'Other', 'Person', 'other@example.com')); const request = manager.submitRequest(new ServiceRequest({ requestId: 'REQ-UPDATE', requester: user, title: 'Old title', description: 'Old description', location: 'Hall', category: 'General Campus Service' })); assert.throws(() => manager.updateRequest(request.requestId, other.userId, { title: 'Wrong user' }), /requester/); manager.updateRequest(request.requestId, user.userId, { title: 'New title' }); assert.equal(request.title, 'New title'); });

// Test only the owner can cancel and that Cancelled is final.
test('only the owner can cancel and Cancelled is final', () => { const { manager, user } = fixture(); const request = manager.submitRequest(new ServiceRequest({ requestId: 'REQ-CANCEL', requester: user, title: 'Cancel me', description: 'Test', location: 'Hall', category: 'Cleaning and Sanitation' })); manager.cancelRequest(request.requestId, user.userId); assert.equal(request.status, 'Cancelled'); assert.throws(() => manager.cancelRequest(request.requestId, user.userId), /Submitted/); });

// Test the status summary required by the Pass component.
test('request summary groups statuses correctly', () => { const { manager, user } = fixture(); manager.submitRequest(new ServiceRequest({ requestId: 'REQ-SUM', requester: user, title: 'Summary', description: 'Test', location: 'Hall', category: 'Facilities Maintenance' })); assert.deepEqual(manager.getRequestsummarybystatus(), { Submitted: 1 }); });
