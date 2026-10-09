// Import the user roles required by the Credit demonstration.
const { StudentRequester, ServiceOfficer, Technician } = require('./User');

// Import the ICT specialised request used in the demonstration.

const { ICTSupportRequest } = require('./specialisedRequests');
// Import the Credit-stage manager.

const { ServiceRequestManager } = require('./ServiceRequestManager');

// Run a complete Credit workflow from registration through closure.
function runCreditDemo() {

  // Create the in-memory manager used by the Credit stage.
  const manager = new ServiceRequestManager();

  // Register a requester who submits the service request.
  const requester = manager.registeruser(new StudentRequester('STU001', 'Ava', 'Kila', 'ava@example.com', 'Information Systems', 3));
  
  // Register the officer who reviews, assigns, and closes the request.
  const officer = manager.registeruser(new ServiceOfficer('OFF001', 'Mila', 'Toma', 'mila@example.com', 'Campus Services'));

  // Register the technician who performs the assigned work.
  const technician = manager.registeruser(new Technician('TECH001', 'Noah', 'Sali', 'noah@example.com', 'Network Support'));

  // Create a specialised ICT request with its required fields.
  const request = manager.submitRequest(new ICTSupportRequest({ requestId: 'REQ-CREDIT-001', requester, title: 'Unable to access campus Wi-Fi', description: 'The laptop cannot authenticate on the library network.', location: 'Library Level 2', priority: 'High' }, { deviceType: 'Laptop', systemName: 'Campus Wi-Fi', faultType: 'Authentication failure', networkImpact: 'High' }));

  // Print the initial Submitted state.
  console.log(`Initial: ${request.getRequestSummary()}`);

  // Let the Service Officer review the request.
  manager.reviewRequest(request.requestId, officer.userId);

  // Let the Service Officer assign priority and the Technician.
  manager.assignTechnician(request.requestId, officer.userId, technician.userId, 'High');

  // Let only the assigned Technician start the work.
  manager.startWork(request.requestId, technician.userId);

  // Let only the assigned Technician resolve the work.
  manager.resolveRequest(request.requestId, technician.userId, 'Network credentials reset and tested.');

  // Let only the Service Officer verify and close the request.
  manager.closeRequest(request.requestId, officer.userId);

  // Print the final state and history for assessment evidence.
  console.log(`Final: ${request.getRequestSummary()}`);
  console.log(`History entries: ${request.history.length}`);
  console.log('Summary:', manager.getRequestsummarybystatus());

  // Return objects for automated or interactive demonstrations.
  return { manager, requester, officer, technician, request };
}

// Run the demonstration when Node executes this file directly.
if (require.main === module) runCreditDemo();

// Export the demonstration for tests or later Distinction integration.
module.exports = { runCreditDemo };
