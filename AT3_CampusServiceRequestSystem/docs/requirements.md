# Requirements Document

## Background and problem statement

Campus ICT, facilities, cleaning, and general service problems are currently reported by calls, conversations, or handwritten notes. These channels make ownership, progress, and resolution difficult to track.

## Objectives and scope

The system records requests, validates input, assigns responsibility, controls progress, records history, persists simulated JSON data, and produces management reports. It does not include payment, confidential records, authentication, or a database.

## Actors

- **Student/Staff requester:** register, submit, view, update eligible Submitted requests, and cancel owned requests.
- **Service Officer:** review, prioritise, assign technicians, verify resolution, and close requests.
- **Technician:** view assigned work, start work, record progress, and resolve assigned requests.
- **System Administrator:** inspect audit records and management reports.

## Functional requirements

1. Register unique users with valid names and email addresses.
2. Submit unique requests in supported categories and priorities.
3. View by ID, view by requester, view all, search, filter, and sort.
4. Update or cancel only eligible requests owned by the requester.
5. Enforce `Submitted → Reviewed → Assigned → In Progress → Resolved → Closed`.
6. Allow `Cancelled` only as a final state.
7. Persist and restore plain JSON records without a database.
8. Maintain request history and audit records.
9. Generate status, category, priority, urgent, overdue, technician, resolution, and location reports.

## Non-functional requirements

The system should be understandable, modular, testable, deterministic, clear about errors, and safe to run with simulated data only.

## User stories

1. As a student, I can register with a unique ID.
2. As a staff member, I can submit a facilities request.
3. As a requester, I can view only my own request records.
4. As a requester, I can update a Submitted request I own.
5. As a requester, I can cancel my own Submitted request.
6. As an officer, I can review a request.
7. As an officer, I can assign priority and a technician.
8. As a technician, I can start and resolve work assigned to me.
9. As an officer, I can close a verified resolved request.
10. As an administrator, I can inspect reports and audit outcomes.
