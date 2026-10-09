# Campus Service Request Management System — User Manual

This manual explains exactly what to type at each console prompt, which characters and formats are accepted, and how to test the system from different user perspectives.

## 1. Start the application

Open a terminal in the project folder:

```bash
cd /home/ubuntu/AT3_CampusServiceRequestSystem
npm install
npm start
```

The application displays:

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
Select an option:
```

Type only the menu number, such as `1`, then press **Enter**.

## 2. Important input rules

| Field | Accepted format | Valid example | Invalid example |
|---|---|---|---|
| User ID | At least 3 letters, numbers, underscores, or hyphens; no spaces | `REQ001`, `DWU2026001`, `TECH-01` | `A`, `user id` |
| First name | Any non-empty name; spaces around it are removed | `Test` | Empty input |
| Last name | Any non-empty name; spaces around it are removed | `Entry` | Empty input |
| Email | A basic address containing one `@` and a domain dot | `testentry@example.com` | `testentry@example`, `testentry` |
| Student programme | Any non-empty text | `Business Studies` | Empty input |
| Student year level | A whole number of `1` or higher; type digits only | `2` | `Year 2`, `second` |
| Department | Any non-empty text | `Finance Department` | Empty input |
| Service section | Any non-empty text | `Campus ICT Services` | Empty input |
| Technical speciality | Any non-empty text | `Network Support` | Empty input |
| Request ID | Must begin with `REQ`, followed by letters, digits, `_`, or `-` | `REQ-001`, `REQICT001` | `001`, `Request 1` |
| Title | Any non-empty text | `Unable to access campus Wi-Fi` | Empty input |
| Description | Any non-empty text | `Laptop cannot connect to the library network.` | Empty input |
| Campus location | Any non-empty text | `Library Level 2` | Empty input |
| Priority | Exact value: `Low`, `Normal`, `High`, or `Urgent` | `High` | `high`, `Urgent priority` |

The program removes leading and trailing spaces from most text fields. It does **not** automatically convert words such as `Year 2` into the number `2`.


Do **not** type `Year 2`. Type `2` and press **Enter**.

## 3. Register a StudentRequester

At the main menu, enter `1`:

```text
Select an option: 1
User ID: DWU2026001
First name: Test
Last name: Entry
Email: testentry@example.com
Role (student/staff/officer/technician): student
Programme: Business Studies
Year level: 2
```

Expected result:

```text
User registered: DWU2026001 | Test Entry | testentry@example.com | StudentRequester | Business Studies | Year 2
```

### StudentRequester rules

- Role must be typed as `student` to use the student subclass.
- Programme must contain text.
- Year level must be a whole number: `1`, `2`, `3`, or `4`.
- Recommended student IDs include `DWU2026001` or `STU-001`.

## 4. Register a StaffRequester

Choose menu option `1` again:

```text
Select an option: 1
User ID: STAFF001
First name: Maria
Last name: Toma
Email: maria.toma@example.com
Role (student/staff/officer/technician): staff
Department: Finance Department
```

Expected result:

```text
User registered: STAFF001 | Maria Toma | maria.toma@example.com | StaffRequester
```

The department may contain spaces. For example, `Student Administration` is valid.

## 5. Register a ServiceOfficer

Choose menu option `1`:

```text
Select an option: 1
User ID: OFF001
First name: Mila
Last name: Kila
Email: mila.kila@example.com
Role (student/staff/officer/technician): officer
Service section: Campus Services
```

Expected result:

```text
User registered: OFF001 | Mila Kila | mila.kila@example.com | ServiceOfficer
```

## 6. Register a Technician

Choose menu option `1`:

```text
Select an option: 1
User ID: TECH001
First name: Noah
Last name: Sali
Email: noah.sali@example.com
Role (student/staff/officer/technician): technician
Technical speciality: Network Support
```

Expected result:

```text
User registered: TECH001 | Noah Sali | noah.sali@example.com | Technician
```

## 7. Register a general requester

If the role is not exactly `student`, `staff`, `officer`, or `technician`, the application creates a base `User` with the role label `Requester`:

```text
Select an option: 1
User ID: USER001
First name: General
Last name: Requester
Email: general@example.com
Role (student/staff/officer/technician): requester
```

Expected result:

```text
User registered: USER001 | General Requester | general@example.com | Requester
```

For assessment demonstrations, use one of the four supported role words so that the specialised fields and Credit permissions can be demonstrated.

## 8. Submit an ICT Support request

Choose menu option `2`:

```text
Select an option: 2
Request ID (REQ-...): REQ-001
Requester user ID: DWU2026001
Title: Unable to access campus Wi-Fi
Description: The laptop cannot authenticate on the library network.
Campus location: Library Level 2
Category (ICT Support/Facilities Maintenance/Cleaning and Sanitation/General Campus Service): ICT Support
Priority (Low/Normal/High/Urgent): High
Device type: Laptop
System name: Campus Wi-Fi
Fault type: Authentication failure
Network impact (Low/High): High
```

Expected result:

```text
Request submitted: REQ-001 | ICT Support | Unable to access campus Wi-Fi | High | Submitted | Laptop/Campus Wi-Fi | Fault: Authentication failure
```

### ICT-specific values

- Device type: `Laptop`, `Desktop`, `Printer`, or `Mobile phone`.
- System name: `Campus Wi-Fi`, `Student Portal`, or `Email System`.
- Fault type: `Authentication failure`, `No network`, or `System error`.
- Network impact: preferably `Low` or `High`.

## 9. Submit a Facilities Maintenance request

Use menu option `2` and enter:

```text
Request ID (REQ-...): REQ-002
Requester user ID: STAFF001
Title: Broken classroom door
Description: The door does not close and creates a safety concern.
Campus location: Building B Room 12
Category (ICT Support/Facilities Maintenance/Cleaning and Sanitation/General Campus Service): Facilities Maintenance
Priority (Low/Normal/High/Urgent): Urgent
Building: Building B
Room number: 12
Hazard level (Low/Medium/High): High
Equipment affected: Classroom door
```

Expected result begins with:

```text
Request submitted: REQ-002 | Facilities Maintenance | Broken classroom door | Urgent | Submitted
```

## 10. Submit a Cleaning and Sanitation request

Use menu option `2` and enter:

```text
Request ID (REQ-...): REQ-003
Requester user ID: DWU2026001
Title: Spill in cafeteria
Description: A liquid spill needs immediate cleaning.
Campus location: Main Cafeteria
Category (ICT Support/Facilities Maintenance/Cleaning and Sanitation/General Campus Service): Cleaning and Sanitation
Priority (Low/Normal/High/Urgent): High
Cleaning area: Main Cafeteria
Hygiene risk (Low/Medium/High): High
Service type: Spill cleanup
Preferred service time: Immediately
```

## 11. Submit a General Campus Service request

Use menu option `2` and enter:

```text
Request ID (REQ-...): REQ-004
Requester user ID: USER001
Title: Request for campus noticeboard
Description: Please install a noticeboard near the student lounge.
Campus location: Student Lounge
Category (ICT Support/Facilities Maintenance/Cleaning and Sanitation/General Campus Service): General Campus Service
Priority (Low/Normal/High/Urgent): Normal
```

No specialised prompts are required after the general category.

## 12. View requests

### View one request by ID

```text
Select an option: 3
Request ID: REQ-001
```

The ID must match an existing request exactly.

### View the current user's requests

```text
Select an option: 4
Your user ID: DWU2026001
```

Only requests whose requester ID is `DWU2026001` are displayed.

### View all requests

```text
Select an option: 5
```

All requests currently loaded in memory are displayed.

## 13. Update a request

Only the owning requester can update a request while its status is `Submitted`.

```text
Select an option: 6
Request ID: REQ-001
Your user ID: DWU2026001
New title: Unable to access library Wi-Fi
New description: Wi-Fi authentication still fails on my laptop.
```

Expected result:

```text
Request updated successfully.
```

The following will fail:

```text
Your user ID: STAFF001
```

because `STAFF001` does not own `REQ-001`.

An update will also fail after the request has moved beyond `Submitted`.

## 14. Cancel a request

Only the owning requester can cancel a request, and it must still be `Submitted`:

```text
Select an option: 7
Request ID: REQ-004
Your user ID: USER001
```

Expected result:

```text
Request cancelled successfully.
```

A cancelled request cannot be cancelled a second time because `Cancelled` is a final status.

## 15. Search requests

Search is case-insensitive and checks the request ID, title, and description:

```text
Select an option: 8
Search text: Wi-Fi
```

Other useful searches include:

```text
Search text: REQ-001
Search text: cafeteria
Search text: network
Search text: broken
```

## 16. View the request summary and reports

Choose menu option `9`:

```text
Select an option: 9
```

The application prints:

- Counts grouped by status.
- Requests grouped by category.
- Requests grouped by priority.
- Urgent requests.
- Overdue requests.
- Requests assigned to technicians.
- Completed requests by technician.
- Average resolution time.
- Request volume by campus location.

## 17. Credit workflow demonstration

The ten-item Pass menu is designed for registration, submission, viewing, updating, searching, and cancellation. The Credit workflow methods are implemented in `ServiceRequestManager.js` and can be demonstrated from a small Node script or automated tests:

```javascript
// Import the classes used for a Credit workflow demonstration.
const { StudentRequester, ServiceOfficer, Technician } = require('./src/User');
// Import the ICT specialised request class.
const { ICTSupportRequest } = require('./src/specialisedRequests');
// Import the manager class.
const { ServiceRequestManager } = require('./src/ServiceRequestManager');

// Create the in-memory manager.
const manager = new ServiceRequestManager();
// Register the requester, officer, and technician.
const requester = manager.registeruser(new StudentRequester('STU001', 'Ava', 'Kila', 'ava@example.com', 'Information Systems', 3));
const officer = manager.registeruser(new ServiceOfficer('OFF001', 'Mila', 'Toma', 'mila@example.com', 'Campus Services'));
const technician = manager.registeruser(new Technician('TECH001', 'Noah', 'Sali', 'noah@example.com', 'Network Support'));
// Create a specialised ICT request.
const request = manager.submitRequest(new ICTSupportRequest({ requestId: 'REQ-CREDIT-001', requester, title: 'Wi-Fi failure', description: 'No connection.', location: 'Library', priority: 'High' }, { deviceType: 'Laptop', systemName: 'Campus Wi-Fi', faultType: 'No network', networkImpact: 'High' }));
// Follow the controlled Credit status workflow.
manager.reviewRequest(request.requestId, officer.userId);
manager.assignTechnician(request.requestId, officer.userId, technician.userId, 'High');
manager.startWork(request.requestId, technician.userId);
manager.resolveRequest(request.requestId, technician.userId, 'Credentials reset and tested.');
manager.closeRequest(request.requestId, officer.userId);
// Display the final status and history.
console.log(request.status);
console.log(request.history);
```

The expected final status is:

```text
Closed
```

The valid workflow is:

```text
Submitted → Reviewed → Assigned → In Progress → Resolved → Closed
```

Only the assigned technician may start or resolve work. Only a Service Officer may review, assign, or close a request.

## 18. JSON persistence demonstration

The application loads JSON data when it starts and saves valid records when option `10` is selected. The files are:

```text
data/users.json
data/serviceRequests.json
data/requestHistory.json
data/auditLog.json
```

The files contain plain JSON data, not executable JavaScript. The saved request format is:

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

Select option `10` to exit normally so the application can save records:

```text
Select an option: 10
Application closed.
```

## 19. Common errors and solutions

### `Student programme and year level are required.`

Use a non-empty programme and digits only for year level:

```text
Programme: Business Studies
Year level: 2
```

### `A valid email is required.`

Use an address such as:

```text
student@example.com
```

### `User ID must contain at least three safe characters.`

Use IDs such as:

```text
STU001
DWU2026001
TECH-01
```

### `Duplicate user ID.` or `Duplicate request ID.`

Choose a new identifier that has not already been saved in the JSON files.

### `Unsupported request category.`

Copy one of the four values exactly:

```text
ICT Support
Facilities Maintenance
Cleaning and Sanitation
General Campus Service
```

### `Unsupported priority value.`

Use exactly one of:

```text
Low
Normal
High
Urgent
```

### `Only the requester can update this request.`

Enter the user ID belonging to the request's `requesterId`.

### `Invalid transition from ...`

Follow the controlled sequence and do not skip a workflow stage.

## 20. Test the full project

Run the automated tests from the project folder:

```bash
npm test
```

The test suite covers valid and invalid construction, duplicate IDs, role permissions, controlled transitions, specialised request behaviour, polymorphism, JSON persistence, restored objects, missing files, reports, and cancellation.

At the time this manual was updated, the project test result was:

```text
14 passed, 0 failed
```
