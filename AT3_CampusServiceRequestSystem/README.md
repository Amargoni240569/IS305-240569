# Campus Service Request Management System

**IS305 Object-Oriented Programming — Assessment Task 3**

Student name: **Abel M. WAMANIMBO**  
Student ID: **240569**  


## How to run the project

Open a terminal in this folder and run:

```bash
npm install
npm start
```

The actual application file is `src/CampusServiceApp.js`. It displays the required interactive menu. Run the automated tests with:

```bash
npm test
```

The test file is `tests/system.test.js`.

## Required project files

The five core Pass files are provided in the `src` folder:

- `src/User.js`
- `src/ServiceRequest.js`
- `src/ServiceRequestManager.js`
- `src/CampusServiceApp.js`
- `README.md`

Credit and Distinction supporting files are also included:

- `src/specialisedRequests.js`
- `src/PersistentService.js`
- `src/RequestFactory.js`
- `src/reports.js`
- `repositories/FileRepositories.js`
- `tests/system.test.js`
- `docs/requirements.md`
- `docs/technical-documentation.md`
- `docs/user-guide.md`
- `docs/test-report.md`
- `uml/`
- `data/`

Every source file contains explanatory comments beside the code statements to explain classes, constructors, fields, methods, validation, workflow, and persistence operations.

## Required Console Menu

`src/CampusServiceApp.js` displays this exact overall console menu:

```text
CAMPUS SERVICE REQUEST SYSTEM
1. Register User
2. Submit Service Request
3. View Request by ID
4. View My Requests
5. View All Requests
6. Update My Request
7. Cancel My Request
8. Search Requests
9. View Request Summary
10. Exit
```

The menu supports the Pass workflow from registration through submission, viewing, searching, updating, and cancellation. Invalid input displays a clear error and returns to the menu.

## Pass requirements implemented

- `User` contains private fields for user ID, first name, last name, email address, and user type.
- `User` provides a constructor, getters, controlled setters, `getFullName()`, `validate()`, and `displayInfo()`.
- `ServiceRequest` contains request ID, requester, title, description, campus location, category, priority, status, date submitted, and date updated.
- The default request status is `Submitted`.
- `ServiceRequest` provides validation, controlled updates, cancellation, and `getRequestSummary()`.
- `ServiceRequestManager` uses JavaScript arrays and provides `registeruser`, `finduserbyid`, `submitRequest`, `findRequestbyid`, `getRequestsbyuser`, `getallrequests`, `updateRequest`, `cancelRequest`, `searchRequests`, and `getRequestsummarybystatus`.
- Categories are `ICT Support`, `Facilities Maintenance`, `Cleaning and Sanitation`, and `General Campus Service`.
- Priorities are `Low`, `Normal`, `High`, and `Urgent`.
- Pass statuses are `Submitted` and `Cancelled`.
- Validation rejects missing IDs, invalid names, invalid emails, duplicate IDs, missing titles/descriptions, unsupported categories/priorities, unauthorised updates, and unauthorised or repeated cancellation.

## Credit requirements implemented

- `User` inheritance: `StudentRequester`, `StaffRequester`, `ServiceOfficer`, and `Technician`.
- Request inheritance: `ICTSupportRequest`, `MaintenanceRequest`, and `CleaningRequest`.
- Every subclass uses `super()` constructor chaining.
- Controlled workflow: `Submitted → Reviewed → Assigned → In Progress → Resolved → Closed`.
- `Cancelled` is a final status.
- Requesters update/cancel only their own Submitted requests.
- Officers review, assign, and close requests.
- Only the assigned technician starts and resolves work.
- Specialised classes override `getRequestSummary()`, `calculatePriorityScore()`, and `getTargetResolutionHours()`.
- Search, filter, sorting, and request history are implemented.

## Distinction requirements implemented

### Polymorphism and abstract-style base class

A single request collection contains the specialised request objects. The manager and reports call the same methods on each object, while each subclass supplies its own behaviour. The base `ServiceRequest` methods `calculatePriorityScore()` and `getTargetResolutionHours()` throw clear errors until a subclass implements them.

### JSON persistence

JSON files are stored in the `data` folder:

- `users.json`
- `serviceRequests.json`
- `requestHistory.json`
- `auditLog.json`

They contain plain simulated data only. No database, MongoDB, Mongoose, MySQL, or SQLite is used.

### Example Saved Request

The following is the required example of the plain JSON shape stored in `serviceRequests.json`:

```json
{
  "requestId": "REQ-001",
  "requestType": "ICTSupportRequest",
  "requesterId": "DWU2026001",
  "title": "Unable to access campus Wi-Fi",
  "description": "The laptop cannot authenticate on the library network.",
  "location": "Library Level 2",
  "category": "ICT Support",
  "priority": "High",
  "status": "Assigned",
  "assignedTechnicianId": "TECH001",
  "dateSubmitted": "2026-08-10T09:30:00.000Z"
}
```

`FileRepositories.js` performs file reading and writing. `RequestFactory.js` restores the correct specialised active object from plain JSON data. The console and domain classes do not directly perform JSON file operations.

### Audit and reports

Audit entries record actor, action, affected request ID, description, date/time, and result. Reports group requests by status, category, priority, technician, and location, and calculate urgent requests, overdue requests, completed requests, and average resolution time.

### Automated tests

The built-in Node test runner checks valid and invalid construction, duplicate IDs, permissions, status transitions, specialised behaviour, polymorphic calls, JSON saving and restoring, missing files, report calculations, and error handling.

## Technical defence checklist

During a demonstration, explain:

1. The `User` and `ServiceRequest` inheritance hierarchies.
2. Private fields, getters, setters, and controlled methods.
3. Constructor chaining through `super()`.
4. Overriding and polymorphism.
5. The controlled status workflow and role permissions.
6. Repository separation and JSON object restoration.
7. Audit records, management reports, and automated tests.

## Documentation and evidence

See `docs/requirements.md`, `docs/technical-documentation.md`, `docs/user-guide.md`, and `docs/test-report.md`. Mermaid UML sources and rendered diagrams are in `uml/`.

## AI use declaration

AI assistance was used to help interpret the supplied assessment requirements, draft commented code, and identify test cases. The student remains responsible for reviewing, understanding, testing, modifying, and defending every submitted file and for replacing the placeholder identity and repository URL.
