// Import Node's readline module for the required console menu.
const readline = require('node:readline/promises');

// Import standard input and output streams.
const { stdin: input, stdout: output } = require('node:process');

// Import user roles used by registration and role workflows.
const { User, StudentRequester, StaffRequester, ServiceOfficer, Technician } = require('./User');

// Import the specialised request classes used by Credit polymorphism.
const { ICTSupportRequest, MaintenanceRequest, CleaningRequest, GeneralCampusRequest } = require('./specialisedRequests');

// Import the Pass and Credit manager.
const { ServiceRequestManager } = require('./ServiceRequestManager');

// Import the base request for the General Campus Service category.
const { ServiceRequest } = require('./ServiceRequest');

// Import the Distinction persistence coordinator.
const { PersistentCampusService } = require('./PersistentService');

// Import the report builder for the Distinction reporting requirement.
const { buildReports } = require('./reports');

// Import path helpers so the application uses its own data folder.
const path = require('node:path');

// Store the exact menu required by the assessment image.
const MENU = '\nCAMPUS SERVICE REQUEST SYSTEM\n1. Register User\n2. Submit Service Request\n3. View Request by ID\n4. View My Requests\n5. View All Requests\n6. Update My Request\n7. Cancel My Request\n8. Search Requests\n9. View Request Summary\n10. Exit';

// Ask one question and trim unnecessary whitespace.
async function ask(rl, question) { return (await rl.question(question)).trim(); }

// Print a collection of requests in a consistent readable format.
function printRequests(requests) { if (!requests.length) return console.log('No requests found.'); requests.forEach(request => console.log(request.getRequestSummary())); }

// Create the correct user subclass from the selected role.
async function registerUser(rl, manager) {

  // Ask for the common identity fields.
  const userId = await ask(rl, 'User ID: ');
  const firstName = await ask(rl, 'First name: ');
  const lastName = await ask(rl, 'Last name: ');
  const email = await ask(rl, 'Email: ');
  const role = await ask(rl, 'Role (student/staff/officer/technician): ');

  // Start with the common User class.
  let user;

  // Select the student subclass when requested.
  if (role.toLowerCase() === 'student') user = new StudentRequester(userId, firstName, lastName, email, await ask(rl, 'Programme: '), Number(await ask(rl, 'Year level: ')));

  // Select the staff requester subclass when requested.
  else if (role.toLowerCase() === 'staff') user = new StaffRequester(userId, firstName, lastName, email, await ask(rl, 'Department: '));

  // Select the service officer subclass when requested.
  else if (role.toLowerCase() === 'officer') user = new ServiceOfficer(userId, firstName, lastName, email, await ask(rl, 'Service section: '));

  // Select the technician subclass when requested.
  else if (role.toLowerCase() === 'technician') user = new Technician(userId, firstName, lastName, email, await ask(rl, 'Technical speciality: '));

  // Reject roles outside the assignment requirements.
  else user = new User(userId, firstName, lastName, email, 'Requester');

  // Register the validated user and show the result.
  manager.registeruser(user);
  
  // Display the successful registration.
  console.log(`User registered: ${user.displayInfo()}`);
}

// Create an ICT, maintenance, cleaning, or general request object.
async function submitRequest(rl, manager) {

  // Ask for common request details.
  const requestId = await ask(rl, 'Request ID (REQ-...): ');
  const requesterId = await ask(rl, 'Requester user ID: ');
  const requester = manager.finduserbyid(requesterId);

  // Stop when the requester has not been registered.
  if (!requester) throw new Error('Requester user was not found.');

  // Read the shared request fields.
  const title = await ask(rl, 'Title: ');
  const description = await ask(rl, 'Description: ');
  const location = await ask(rl, 'Campus location: ');
  const category = await ask(rl, 'Category (ICT Support/Facilities Maintenance/Cleaning and Sanitation/General Campus Service): ');
  const priority = await ask(rl, 'Priority (Low/Normal/High/Urgent): ') || 'Normal';

  // Package shared values for the selected subclass.
  const common = { requestId, requester, title, description, location, priority };

  // Hold the final polymorphic request object.
  let request;

  // Ask the ICT-specific fields and construct an ICT request.
  if (category === 'ICT Support') request = new ICTSupportRequest(common, { deviceType: await ask(rl, 'Device type: '), systemName: await ask(rl, 'System name: '), faultType: await ask(rl, 'Fault type: '), networkImpact: await ask(rl, 'Network impact (Low/High): ') });

  // Ask the maintenance-specific fields and construct a maintenance request.
  else if (category === 'Facilities Maintenance') request = new MaintenanceRequest(common, { building: await ask(rl, 'Building: '), roomNumber: await ask(rl, 'Room number: '), hazardLevel: await ask(rl, 'Hazard level (Low/Medium/High): '), equipmentAffected: await ask(rl, 'Equipment affected: ') });

  // Ask the cleaning-specific fields and construct a cleaning request.
  else if (category === 'Cleaning and Sanitation') request = new CleaningRequest(common, { cleaningArea: await ask(rl, 'Cleaning area: '), hygieneRisk: await ask(rl, 'Hygiene risk (Low/Medium/High): '), serviceType: await ask(rl, 'Service type: '), preferredServiceTime: await ask(rl, 'Preferred service time: ') });

  // General requests use the base category without specialised fields.
  else if (category === 'General Campus Service') request = new GeneralCampusRequest(common);

  // Reject unsupported categories clearly.
  else throw new Error('Unsupported request category.');

  // Add the validated request to the manager.
  manager.submitRequest(request);

  // Confirm the stored Submitted status.
  console.log(`Request submitted: ${request.getRequestSummary()}`);
}
// Run the exact required console menu until the user selects Exit.
async function runMenu(manager = new ServiceRequestManager()) {

  // Create the line-based console interface.
  const rl = readline.createInterface({ input, output });

  // Keep showing the menu while the user remains in the application.
  let running = true;

  // Catch menu actions individually so one validation error does not terminate the app.
  while (running) {

    // Print the required ten menu options.
    console.log(MENU);

    // Ask the user to select an option.
    const choice = await ask(rl, 'Select an option: ');

    // Execute the selected Pass operation.
    try {

      // Register a new requester or staff role.
      if (choice === '1') await registerUser(rl, manager);

      // Submit a new service request.
      else if (choice === '2') await submitRequest(rl, manager);

      // View one request by its identifier.
      else if (choice === '3') printRequests([manager.requireRequest(await ask(rl, 'Request ID: '))]);

      // View requests belonging to the selected requester.
      else if (choice === '4') printRequests(manager.getRequestsbyuser(await ask(rl, 'Your user ID: ')));

      // View every request currently stored.
      else if (choice === '5') printRequests(manager.getallrequests());

      // Update an owned Submitted request.
      else if (choice === '6') { const id = await ask(rl, 'Request ID: '); const userId = await ask(rl, 'Your user ID: '); const title = await ask(rl, 'New title: '); const description = await ask(rl, 'New description: '); manager.updateRequest(id, userId, { title, description }); console.log('Request updated successfully.'); }

      // Cancel an owned Submitted request.
      else if (choice === '7') { const id = await ask(rl, 'Request ID: '); const userId = await ask(rl, 'Your user ID: '); manager.cancelRequest(id, userId); console.log('Request cancelled successfully.'); }

      // Search IDs, titles, and descriptions.
      else if (choice === '8') printRequests(manager.searchRequests(await ask(rl, 'Search text: ')));

      // Show status summary and Distinction report groups.
      else if (choice === '9') { console.log('Status summary:', manager.getRequestsummarybystatus()); console.log('Management reports:', buildReports(manager.getallrequests())); }

      // Exit the application cleanly.
      else if (choice === '10') running = false;
      
      // Reject menu numbers outside the required list.
      else console.log('Please select a menu number from 1 to 10.');
    } catch (error) {

      // Display validation and permission errors without hiding the cause.
      console.log(`Error: ${error.message}`);
    }
  }

  // Close the console interface after Exit.
  rl.close();

  // Confirm that the application has stopped.
  console.log('Application closed.');

  // Return the manager so the persistence layer can save current records.
  return manager;
}

// Run the menu only when this file is executed directly with Node.js.
if (require.main === module) (async () => {

  // Create the persistence service for the required JSON files.
  const store = new PersistentCampusService(path.join(__dirname, '..', 'data'));

  // Load saved users, requests, histories, and audits before showing the menu.
  await store.load();

  // Run the interactive menu using the restored manager.
  await runMenu(store.manager);

  // Save valid records after the user exits.
  await store.save();
})().catch(error => console.error(`Fatal error: ${error.message}`));

// Export the menu function for automated tests and technical demonstrations.
module.exports = { MENU, runMenu };
