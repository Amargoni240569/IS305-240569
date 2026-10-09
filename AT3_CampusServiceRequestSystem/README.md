# Campus Service Request Management System — Credit Stage

This is the independent **Credit-stage prerequisite** for the IS305 Campus Service Request Management System. It is reverse-engineered from the working Pass/Credit behaviour in the completed project, but deliberately excludes Distinction-only JSON repositories, object restoration, audit persistence, management reports, and automated persistence tests.

## Credit requirements implemented

- User inheritance: `StudentRequester`, `StaffRequester`, `ServiceOfficer`, and `Technician`.
- Request inheritance: `ICTSupportRequest`, `MaintenanceRequest`, and `CleaningRequest`.
- Constructor chaining through `super()`.
- Controlled request workflow: `Submitted → Reviewed → Assigned → In Progress → Resolved → Closed`.
- Final `Cancelled` status.
- Requester ownership permissions for update and cancellation.
- Service Officer permissions for review, technician assignment, and closure.
- Assigned Technician permissions for starting and resolving work.
- Method overriding for `getRequestSummary()`, `calculatePriorityScore()`, and `getTargetResolutionHours()`.
- Search by request ID, title, and description.
- Filter by category, status, priority, and technician.
- Sort by submission date and specialised priority score.
- Request history entries for approved updates and status transitions.
- JavaScript arrays only; no database and no JSON persistence at this stage.

## Files

```text
src/User.js                  Base User and role subclasses
src/ServiceRequest.js         Base request, validation, transitions, history
src/specialisedRequests.js    ICT, maintenance, and cleaning subclasses
src/ServiceRequestManager.js  Arrays, permissions, workflow, search, filters, sorting
tests/credit.test.js          Credit-focused automated tests
```

All source lines include simple explanatory comments for the class, field, method, validation, permission, and workflow operations.

## Run and test

```bash
npm install
npm test
npm start
```

`npm test` runs 11 Credit-stage tests. `npm start` runs the Credit demonstration in `src/CampusServiceApp.js`.

## Later Distinction extension

The existing finalized Distinction project can extend this stage by adding repositories, `fs/promises` JSON persistence, the restoration factory, audit logs, reports, and additional persistence tests. The Credit domain classes and manager methods are intentionally structured as the prerequisite layer for that extension.
