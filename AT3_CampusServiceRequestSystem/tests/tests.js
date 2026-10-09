// Import the Node test runner.
const test = require('node:test');

// Import strict assertions.
const assert = require('node:assert/strict');

// Import temporary directory helpers.
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

// Import application classes.
const { User, StudentRequester, ServiceOfficer, Technician } = require('../src/User');
const { ICTSupportRequest, MaintenanceRequest, CleaningRequest } = require('../src/specialisedRequests');

// Import the base request to test unsupported category validation directly.
const { ServiceRequest } = require('../src/ServiceRequest');
const { ServiceRequestManager } = require('../src/ServiceRequestManager');
const { PersistentCampusService } = require('../src/PersistentService');
const { buildReports } = require('../src/reports');

// Create a valid test fixture.
function fixture() { const manager = new ServiceRequestManager(); const student = manager.registerUser(new StudentRequester('STU001', 'Ava', 'Kila', 'ava@example.com', 'IS', 2)); const officer = manager.registerUser(new ServiceOfficer('OFF001', 'Mila', 'Toma', 'mila@example.com')); const technician = manager.registerUser(new Technician('TECH001', 'Noah', 'Sali', 'noah@example.com', 'Networks')); return { manager, student, officer, technician }; }

// Test valid construction and getters.
test('valid user construction exposes encapsulated data', () => { const user = new User('USR001', 'A', 'B', 'a@example.com'); assert.equal(user.getFullName(), 'A B'); assert.equal(user.userId, 'USR001'); });

// Test invalid email validation.
test('invalid email is rejected', () => { assert.throws(() => new User('USR002', 'A', 'B', 'bad-email'), /valid email/); });

// Test duplicate identifiers.
test('duplicate user identifiers are rejected', () => { const { manager, student } = fixture(); assert.throws(() => manager.registerUser(student), /Duplicate/); });

// Test specialised request fields and polymorphic methods.
test('specialised requests override summary and score methods', () => { const { student } = fixture(); const request = new ICTSupportRequest({ requestId: 'REQ-ICT', requester: student, title: 'Wi-Fi', description: 'No access', location: 'Library', priority: 'High' }, { deviceType: 'Laptop', systemName: 'Wi-Fi', faultType: 'Auth', networkImpact: 'High' }); assert.match(request.getRequestSummary(), /Laptop/); assert.equal(request.getTargetResolutionHours(), 4); assert.ok(request.calculatePriorityScore() > 35); });

// Test invalid category values through the base class.
test('unsupported category is rejected', () => { const { student } = fixture(); assert.throws(() => new ServiceRequest({ requestId: 'REQ-M', requester: student, title: 'Leak', description: 'Leak', location: 'B', category: 'Unsupported', priority: 'Normal' }), { message: /category/ }); });

// Test requester ownership for updates.
test('only the owning requester can update a Submitted request', () => { const { manager, student } = fixture(); const other = new User('USR999', 'Other', 'User', 'o@example.com'); manager.registerUser(other); const request = manager.submitRequest(new CleaningRequest({ requestId: 'REQ-C', requester: student, title: 'Bins', description: 'Full', location: 'Hall', priority: 'Low' }, { cleaningArea: 'Hall', hygieneRisk: 'Low', serviceType: 'Bins', preferredServiceTime: 'Morning' })); assert.throws(() => manager.updateRequest(request.requestId, other.userId, { title: 'No' }), /requester/); });

// Test the complete Credit workflow and history.
test('role-controlled workflow reaches Closed and records history', () => { const { manager, student, officer, technician } = fixture(); const request = manager.submitRequest(new ICTSupportRequest({ requestId: 'REQ-W', requester: student, title: 'Network', description: 'Down', location: 'Lab', priority: 'High' }, { deviceType: 'PC', systemName: 'LAN', faultType: 'Cable', networkImpact: 'Low' })); manager.reviewRequest(request.requestId, officer.userId); manager.assignTechnician(request.requestId, officer.userId, technician.userId, 'High'); manager.startWork(request.requestId, technician.userId); manager.resolveRequest(request.requestId, technician.userId); manager.closeRequest(request.requestId, officer.userId); assert.equal(request.status, 'Closed'); assert.ok(request.history.length >= 4); });

// Test invalid workflow transitions.
test('invalid status transitions are rejected', () => { const { manager, student, officer } = fixture(); const request = manager.submitRequest(new ICTSupportRequest({ requestId: 'REQ-X', requester: student, title: 'X', description: 'X', location: 'X' }, { deviceType: 'PC', systemName: 'X', faultType: 'X', networkImpact: 'Low' })); assert.throws(() => manager.closeRequest(request.requestId, officer.userId), /transition/); });

// Test technician permission.
test('only assigned technician can start work', () => { const { manager, student, officer, technician } = fixture(); const wrong = new Technician('TECH002', 'Wrong', 'Tech', 'wrong@example.com', 'Cleaning'); manager.registerUser(wrong); const request = manager.submitRequest(new ICTSupportRequest({ requestId: 'REQ-P', requester: student, title: 'P', description: 'P', location: 'P' }, { deviceType: 'PC', systemName: 'P', faultType: 'P', networkImpact: 'Low' })); manager.reviewRequest(request.requestId, officer.userId); manager.assignTechnician(request.requestId, officer.userId, technician.userId); assert.throws(() => manager.startWork(request.requestId, wrong.userId), /assigned/); });

// Test search, filter, and sort.
test('search filter and sort return matching records', () => { const { manager, student } = fixture(); const a = manager.submitRequest(new ICTSupportRequest({ requestId: 'REQ-A', requester: student, title: 'Wi-Fi issue', description: 'network', location: 'A', priority: 'Urgent' }, { deviceType: 'PC', systemName: 'Wi-Fi', faultType: 'Down', networkImpact: 'High' })); const b = manager.submitRequest(new MaintenanceRequest({ requestId: 'REQ-B', requester: student, title: 'Door', description: 'broken', location: 'B', priority: 'Low' }, { building: 'B', roomNumber: '2', hazardLevel: 'Low', equipmentAffected: 'Door' })); assert.equal(manager.searchRequests('Wi-Fi').length, 1); assert.equal(manager.filterRequests({ category: 'ICT Support' }).length, 1); assert.equal(manager.sortRequests([a, b], 'priority')[0].requestId, 'REQ-A'); });

// Test reports using array algorithms.
test('reports group records and calculate volume', () => { const { manager, student } = fixture(); manager.submitRequest(new MaintenanceRequest({ requestId: 'REQ-R', requester: student, title: 'Door', description: 'broken', location: 'B', priority: 'Urgent' }, { building: 'B', roomNumber: '2', hazardLevel: 'High', equipmentAffected: 'Door' })); const report = buildReports(manager.requests); assert.equal(report.byCategory['Facilities Maintenance'].length, 1); assert.equal(report.urgent.length, 1); });

// Test JSON persistence and specialised object restoration.
test('JSON persistence restores active specialised objects', async () => { const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'campus-test-')); const store = new PersistentCampusService(dir); const { manager, student } = fixture(); store.manager = manager; store.manager.submitRequest(new CleaningRequest({ requestId: 'REQ-S', requester: student, title: 'Clean', description: 'Mess', location: 'Cafeteria' }, { cleaningArea: 'Cafeteria', hygieneRisk: 'Medium', serviceType: 'Deep clean', preferredServiceTime: 'Evening' })); await store.save(); const loaded = await new PersistentCampusService(dir).load(); assert.equal(loaded.requests[0].constructor.name, 'CleaningRequest'); assert.equal(loaded.requests[0].getTargetResolutionHours(), 18); await fs.rm(dir, { recursive: true, force: true }); });

// Test missing data files return empty arrays.
test('missing JSON files load as empty arrays', async () => { const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'campus-empty-')); const store = new PersistentCampusService(dir); const loaded = await store.load(); assert.equal(loaded.users.length, 0); await fs.rm(dir, { recursive: true, force: true }); });

// Test cancellation is final and cannot be repeated.
test('cancelled requests cannot be cancelled again', () => { const { manager, student } = fixture(); const request = manager.submitRequest(new CleaningRequest({ requestId: 'REQ-CAN', requester: student, title: 'Bins', description: 'Full', location: 'Hall' }, { cleaningArea: 'Hall', hygieneRisk: 'Low', serviceType: 'Bins', preferredServiceTime: 'Morning' })); manager.cancelRequest(request.requestId, student.userId); assert.throws(() => manager.cancelRequest(request.requestId, student.userId), /transition/); });
