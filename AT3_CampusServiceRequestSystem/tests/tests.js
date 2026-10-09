// Import Node's built-in test runner.
const test = require('node:test');

// Import strict assertions for exact verification.
const assert = require('node:assert/strict');

// Import User subclasses for inheritance and role tests.
const { User, StudentRequester, StaffRequester, ServiceOfficer, Technician } = require('../src/User');

// Import all Credit request subclasses.
const { ICTSupportRequest, MaintenanceRequest, CleaningRequest } = require('../src/specialisedRequests');

// Import the Credit manager.
const { ServiceRequestManager } = require('../src/ServiceRequestManager');

// Create a common Credit-stage test fixture.
function fixture() { const manager = new ServiceRequestManager(); const student = manager.registeruser(new StudentRequester('STU001', 'Ava', 'Kila', 'ava@example.com', 'Information Systems', 3)); const staff = manager.registeruser(new StaffRequester('STAFF001', 'Mila', 'Toma', 'mila@example.com', 'Finance')); const officer = manager.registeruser(new ServiceOfficer('OFF001', 'Owen', 'Sali', 'owen@example.com', 'Campus Services')); const technician = manager.registeruser(new Technician('TECH001', 'Noah', 'Sali', 'noah@example.com', 'Network Support')); return { manager, student, staff, officer, technician }; }

// Confirm that all required User subclasses inherit from User.
test('Credit user inheritance and constructor chaining work', () => { const { student, staff, officer, technician } = fixture(); assert.ok(student instanceof User); assert.ok(staff instanceof User); assert.ok(officer instanceof User); assert.ok(technician instanceof User); });
// Confirm that all three required request subclasses use inheritance.
test('Credit request subclasses inherit from ServiceRequest', () => { const { student } = fixture(); const common = { requester: student, title: 'T', description: 'D', location: 'L' }; const ict = new ICTSupportRequest({ ...common, requestId: 'REQ-I' }, { deviceType: 'Laptop', systemName: 'Wi-Fi', faultType: 'No access', networkImpact: 'High' }); const maintenance = new MaintenanceRequest({ ...common, requestId: 'REQ-M' }, { building: 'B', roomNumber: '1', hazardLevel: 'Low', equipmentAffected: 'Door' }); const cleaning = new CleaningRequest({ ...common, requestId: 'REQ-C' }, { cleaningArea: 'Hall', hygieneRisk: 'Low', serviceType: 'Bins', preferredServiceTime: 'Morning' }); assert.equal(ict.constructor.name, 'ICTSupportRequest'); assert.equal(maintenance.constructor.name, 'MaintenanceRequest'); assert.equal(cleaning.constructor.name, 'CleaningRequest'); });

// Confirm that specialised fields reject incomplete data.
test('specialised fields are validated', () => { const { student } = fixture(); assert.throws(() => new ICTSupportRequest({ requestId: 'REQ-BAD', requester: student, title: 'T', description: 'D', location: 'L' }, { deviceType: 'Laptop' }), /ICT/); });

// Confirm that overridden methods return specialised information.
test('method overriding provides specialised summary and score behaviour', () => { const { student } = fixture(); const request = new ICTSupportRequest({ requestId: 'REQ-OVR', requester: student, title: 'Wi-Fi', description: 'Down', location: 'Library', priority: 'High' }, { deviceType: 'Laptop', systemName: 'Campus Wi-Fi', faultType: 'Network failure', networkImpact: 'High' }); assert.match(request.getRequestSummary(), /Laptop/); assert.equal(request.getTargetResolutionHours(), 4); assert.ok(request.calculatePriorityScore() > 35); });

// Confirm only Service Officers can review requests.
test('only Service Officers can review requests', () => { const { manager, student, technician } = fixture(); const request = manager.submitRequest(new ICTSupportRequest({ requestId: 'REQ-ROLE', requester: student, title: 'T', description: 'D', location: 'L' }, { deviceType: 'Laptop', systemName: 'Wi-Fi', faultType: 'Down', networkImpact: 'Low' })); assert.throws(() => manager.reviewRequest(request.requestId, technician.userId), /ServiceOfficer/); });

// Confirm the complete Credit workflow is controlled and recorded.
test('controlled workflow reaches Closed and records history', () => { const { manager, student, officer, technician } = fixture(); const request = manager.submitRequest(new ICTSupportRequest({ requestId: 'REQ-FLOW', requester: student, title: 'Network', description: 'Down', location: 'Lab' }, { deviceType: 'PC', systemName: 'LAN', faultType: 'Cable', networkImpact: 'Low' })); assert.equal(request.status, 'Submitted'); manager.reviewRequest(request.requestId, officer.userId); manager.assignTechnician(request.requestId, officer.userId, technician.userId, 'High'); manager.startWork(request.requestId, technician.userId); manager.resolveRequest(request.requestId, technician.userId, 'Cable replaced.'); manager.closeRequest(request.requestId, officer.userId); assert.equal(request.status, 'Closed'); assert.equal(request.history.length, 5); });

// Confirm invalid transitions are rejected.
test('invalid status transitions are rejected', () => { const { manager, student, officer } = fixture(); const request = manager.submitRequest(new ICTSupportRequest({ requestId: 'REQ-INVALID', requester: student, title: 'T', description: 'D', location: 'L' }, { deviceType: 'PC', systemName: 'LAN', faultType: 'Down', networkImpact: 'Low' })); assert.throws(() => manager.closeRequest(request.requestId, officer.userId), /Invalid transition/); });

// Confirm only the assigned technician can work on a request.
test('only the assigned technician can start or resolve work', () => { const { manager, student, officer, technician } = fixture(); const wrongTechnician = manager.registeruser(new Technician('TECH002', 'Wrong', 'Person', 'wrong@example.com', 'Cleaning')); const request = manager.submitRequest(new MaintenanceRequest({ requestId: 'REQ-TECH', requester: student, title: 'Door', description: 'Broken', location: 'B' }, { building: 'B', roomNumber: '2', hazardLevel: 'High', equipmentAffected: 'Door' })); manager.reviewRequest(request.requestId, officer.userId); manager.assignTechnician(request.requestId, officer.userId, technician.userId); assert.throws(() => manager.startWork(request.requestId, wrongTechnician.userId), /assigned/); });

// Confirm search, filtering, and sorting use the request collection correctly.
test('search filter and sort return correct results', () => { const { manager, student } = fixture(); const ict = manager.submitRequest(new ICTSupportRequest({ requestId: 'REQ-SEARCH', requester: student, title: 'Wi-Fi failure', description: 'Network issue', location: 'Library', priority: 'Urgent' }, { deviceType: 'Laptop', systemName: 'Wi-Fi', faultType: 'Down', networkImpact: 'High' })); const cleaning = manager.submitRequest(new CleaningRequest({ requestId: 'REQ-CLEAN', requester: student, title: 'Bins', description: 'Full bins', location: 'Hall', priority: 'Low' }, { cleaningArea: 'Hall', hygieneRisk: 'Low', serviceType: 'Bins', preferredServiceTime: 'Morning' })); assert.equal(manager.searchRequests('Wi-Fi').length, 1); assert.equal(manager.filterRequests({ category: 'ICT Support' }).length, 1); assert.equal(manager.sortRequests([cleaning, ict], 'priority')[0].requestId, 'REQ-SEARCH'); });

// Confirm requester-only update and cancellation permissions.
test('requesters can update and cancel only their own Submitted requests', () => { const { manager, student, staff } = fixture(); const request = manager.submitRequest(new CleaningRequest({ requestId: 'REQ-OWNER', requester: student, title: 'Bins', description: 'Full', location: 'Hall' }, { cleaningArea: 'Hall', hygieneRisk: 'Low', serviceType: 'Bins', preferredServiceTime: 'Morning' })); assert.throws(() => manager.updateRequest(request.requestId, staff.userId, { title: 'Other' }), /requester/); manager.updateRequest(request.requestId, student.userId, { title: 'Overflowing bins' }); assert.equal(request.title, 'Overflowing bins'); manager.cancelRequest(request.requestId, student.userId); assert.equal(request.status, 'Cancelled'); });

// Confirm status summaries group requests by current state.
test('request status summary returns correct counts', () => { const { manager, student } = fixture(); manager.submitRequest(new CleaningRequest({ requestId: 'REQ-SUM', requester: student, title: 'Bins', description: 'Full', location: 'Hall' }, { cleaningArea: 'Hall', hygieneRisk: 'Low', serviceType: 'Bins', preferredServiceTime: 'Morning' })); assert.deepEqual(manager.getRequestsummarybystatus(), { Submitted: 1 }); });
