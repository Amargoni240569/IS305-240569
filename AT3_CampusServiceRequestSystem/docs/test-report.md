# Test Report

Run command: `npm test`

| Test ID | Feature tested | Expected result |
|---|---|---|
| T01 | Valid user construction | User is created and getters return safe values |
| T02 | Invalid email | Clear validation error is thrown |
| T03 | Duplicate user ID | Second registration is rejected |
| T04 | Specialised behaviour | ICT summary, score, and target are specialised |
| T05 | Invalid request data | Unsupported data is rejected |
| T06 | Requester permissions | Another user cannot update the request |
| T07 | Full Credit workflow | Request reaches Closed and history is recorded |
| T08 | Invalid transition | Closing too early is rejected |
| T09 | Technician permission | Unassigned technician cannot start work |
| T10 | Search/filter/sort | Correct records and order are returned |
| T11 | Management reports | Grouping and urgent report are correct |
| T12 | JSON restore | Correct specialised class is recreated |
| T13 | Missing files | Empty arrays are returned |
| T14 | Cancellation final state | A cancelled request cannot be cancelled again |

Actual result: **14 passed, 0 failed** using Node.js built-in test runner.
