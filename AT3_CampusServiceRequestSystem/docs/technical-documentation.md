# Technical Documentation

## Responsibilities

- `User.js`: encapsulated base user plus role subclasses.
- `ServiceRequest.js`: common request state, validation, history, transition guard, and abstract-style methods.
- `specialisedRequests.js`: ICT, maintenance, and cleaning data plus overridden score, target, and summary methods.
- `ServiceRequestManager.js`: arrays, permissions, workflow, search, filters, sorting, and audit events.
- `FileRepositories.js`: the only low-level JSON file operations.
- `PersistentService.js`: coordinates repositories and object restoration.
- `RequestFactory.js`: recreates the correct active subclasses from plain records.
- `reports.js`: management reports using `filter`, `map`, `reduce`, and `sort`.

## OOP design

Private fields such as `#userId` and `#requestId` demonstrate encapsulation. Getters and controlled setters prevent invalid identity, contact, title, and description values. `StudentRequester`, `StaffRequester`, `ServiceOfficer`, and `Technician` inherit from `User` and call `super()`.

The three request subclasses inherit from `ServiceRequest`, call `super()`, add specialised fields, and override `calculatePriorityScore()`, `getTargetResolutionHours()`, and `getRequestSummary()`. A single request array can therefore call the same methods polymorphically. The base class throws clear errors for the abstract-style methods.

## Workflow and permissions

The manager requires exact roles for review, assignment, technician work, and closure. `TRANSITIONS` is the single source of truth for valid states. Every successful state change creates a history record with old status, new status, action, actor, comment, and timestamp.

## Persistence

Repositories read missing files as empty arrays and report other read/write errors clearly. Domain classes are converted to plain data by `toJSON()`. `RequestFactory` restores the matching active subclass and reconnects the requester object. The console app does not read or write JSON directly.

## Testing

`tests/system.test.js` uses the built-in Node test runner and temporary directories so normal data is never overwritten. Tests are independent and cover invalid input, permissions, workflow, polymorphism, reports, persistence, missing files, and final cancellation.
