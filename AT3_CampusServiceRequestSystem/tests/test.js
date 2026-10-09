// Import Node's readline promises API for interactive console input.
const readline = require('node:readline/promises');

// Import standard input and output streams.
const { stdin: input, stdout: output } = require('node:process');

// Import the Pass User class.
const { User } = require('./User');

// Import the Pass request class.
const { ServiceRequest } = require('./ServiceRequest');

// Import the Pass manager.
const { ServiceRequestManager } = require('./ServiceRequestManager');

// Store the exact console menu required by the Pass component.
const MENU = '\nCAMPUS SERVICE REQUEST SYSTEM\n1. Register User\n2. Submit Service Request\n3. View Request by ID\n4. View My Requests\n5. View All Requests\n6. Update My Request\n7. Cancel My Request\n8. Search Requests\n9. View Request Summary\n10. Exit';

// Ask a question and remove surrounding spaces from the response.
async function ask(rl, question) { return (await rl.question(question)).trim(); }

// Print one or more request summaries to the console.
function printRequests(requests) { if (!requests.length) return console.log('No requests found.'); requests.forEach(request => console.log(request.getRequestSummary())); }

// Register a base Pass User.
async function registerUser(rl, manager) { const user = new User(await ask(rl, 'User ID: '), await ask(rl, 'First name: '), await ask(rl, 'Last name: '), await ask(rl, 'Email: '), await ask(rl, 'User type: ') || 'Requester'); manager.registeruser(user); console.log(`User registered: ${user.displayInfo()}`); }

// Submit a base Pass ServiceRequest.
async function submitRequest(rl, manager) { const requester = manager.finduserbyid(await ask(rl, 'Requester user ID: ')); if (!requester) throw new Error('Requester user was not found.'); const request = new ServiceRequest({ requestId: await ask(rl, 'Request ID (REQ-...): '), requester, title: await ask(rl, 'Title: '), description: await ask(rl, 'Description: '), location: await ask(rl, 'Campus location: '), category: await ask(rl, 'Category (ICT Support/Facilities Maintenance/Cleaning and Sanitation/General Campus Service): '), priority: await ask(rl, 'Priority (Low/Normal/High/Urgent): ') || 'Normal' }); manager.submitRequest(request); console.log(`Request submitted: ${request.getRequestSummary()}`); }

// Run the required menu until the user selects option 10.
async function runMenu(manager = new ServiceRequestManager()) { const rl = readline.createInterface({ input, output }); let running = true; while (running) { console.log(MENU); const choice = await ask(rl, 'Select an option: '); try { if (choice === '1') await registerUser(rl, manager); else if (choice === '2') await submitRequest(rl, manager); else if (choice === '3') printRequests([manager.requireRequest(await ask(rl, 'Request ID: '))]); else if (choice === '4') printRequests(manager.getRequestsbyuser(await ask(rl, 'Your user ID: '))); else if (choice === '5') printRequests(manager.getallrequests()); else if (choice === '6') { const requestId = await ask(rl, 'Request ID: '); const userId = await ask(rl, 'Your user ID: '); const title = await ask(rl, 'New title: '); const description = await ask(rl, 'New description: '); manager.updateRequest(requestId, userId, { title, description }); console.log('Request updated successfully.'); } else if (choice === '7') { manager.cancelRequest(await ask(rl, 'Request ID: '), await ask(rl, 'Your user ID: ')); console.log('Request cancelled successfully.'); } else if (choice === '8') printRequests(manager.searchRequests(await ask(rl, 'Search text: '))); else if (choice === '9') console.log('Request summary:', manager.getRequestsummarybystatus()); else if (choice === '10') running = false; else console.log('Please select a menu number from 1 to 10.'); } catch (error) { console.log(`Error: ${error.message}`); } } rl.close(); console.log('Application closed.'); return manager; }

// Start the interactive menu only when this file is run directly.
if (require.main === module) runMenu().catch(error => console.error(`Fatal error: ${error.message}`));

// Export the menu and functions for tests and future Credit extension.
module.exports = { MENU, runMenu };
