# Campus Service Request Management System — Pass Stage

This is the independent **Pass-stage foundation** reverse-engineered from the same architecture used for the completed Credit and Distinction projects. It contains only the core Pass functionality and is ready to be committed before adding Credit and Distinction extensions.

## Pass requirements implemented

- `User` class with private fields for user ID, first name, last name, email, and user type.
- User constructor, getters, controlled setters, `getFullName()`, `validate()`, and `displayInfo()`.
- `ServiceRequest` class with request ID, requester, title, description, campus location, category, priority, status, date submitted, and date updated.
- Default request status is `Submitted`.
- `validate()`, `updateDetails()`, `cancelRequest()`, and `getRequestSummary()`.
- `ServiceRequestManager` arrays and required methods:
  - `registeruser(user)`
  - `finduserbyid(userId)`
  - `submitRequest(request)`
  - `findRequestbyid(requestId)`
  - `getRequestsbyuser(userId)`
  - `getallrequests()`
  - `updateRequest(requestId, userId, changes)`
  - `cancelRequest(requestId, userId)`
  - `searchRequests(searchText)`
  - `getRequestsummarybystatus()`
- Required categories:
  - `ICT Support`
  - `Facilities Maintenance`
  - `Cleaning and Sanitation`
  - `General Campus Service`
- Required priorities: `Low`, `Normal`, `High`, `Urgent`.
- Pass statuses: `Submitted`, `Cancelled`.
- Validation for missing values, invalid email, duplicate IDs, unsupported category/priority, unauthorised updates, and unauthorised/repeated cancellation.
- Required 1–10 console menu and complete core workflow.

## Required console menu

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

## Run the Pass component

```bash
cd /home/AT3_CampusServiceRequestSystem_PassStage
npm install
npm test
npm start
```

## Example console test sequence

Register a user:

```text
1
User ID: STU001
First name: Ava
Last name: Kila
Email: ava@example.com
User type: Student
```

Submit a request:

```text
2
Requester user ID: STU001
Request ID (REQ-...): REQ-001
Title: Unable to access campus Wi-Fi
Description: The laptop cannot authenticate on the library network.
Campus location: Library Level 2
Category: ICT Support
Priority: High
```

Then test viewing, searching, updating, cancelling, and summary using menu options `3` through `9`. Exit with `10`.

## Comments and extension structure

Every source file contains simple comments explaining the class, private fields, constructors, setters, validation, manager operations, and console actions. The arrays and domain method names are intentionally compatible with the later Credit extension. Credit can add role subclasses, specialised request subclasses, status transitions, role permissions, overriding, filtering, sorting, and request history without replacing this foundation. Distinction can then add repositories, JSON persistence, object restoration, audits, reports, and expanded tests.

## Tests

The Pass test suite contains 10 automated tests for valid construction, invalid IDs and emails, duplicate identifiers, request submission, categories, priorities, user viewing, search, update ownership, cancellation, final status behaviour, and summaries.
