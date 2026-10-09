# User Guide

## Start

Install Node.js 18+, open a terminal in the project folder, and run:

```bash
npm install
npm start
```

Run verification with `npm test`.

## Normal workflow

Create a requester, officer, and technician in the app or in a calling script. Submit a request with a unique ID, title, description, location, supported category, and priority. Use the officer methods to review and assign. Use the assigned technician methods to start and resolve. Use the officer close method after verification.

## Search and reports

Use `manager.searchRequests('wifi')` for text search. Use `manager.filterRequests({ status: 'Submitted' })` for filtering and `manager.sortRequests(requests, 'priority')` for priority ordering. Pass all requests to `buildReports()` for grouped status/category/priority, urgent and overdue lists, technician allocations, average resolution time, and location volume.

## Common errors

- **Duplicate user/request ID:** choose a new identifier.
- **Invalid email/category/priority:** use the supported format and values in the requirements document.
- **Only requester/officer/technician errors:** perform the action using the permitted role.
- **Invalid transition:** follow the displayed workflow order.
- **JSON write error:** check that the data folder is writable and that no file is locked.

## Demonstration evidence

Capture terminal output from `npm start` and the passing output from `npm test`. Replace the placeholder student name, ID, and repository URL in `README.md` before submission.
