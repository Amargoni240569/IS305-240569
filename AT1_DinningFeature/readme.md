# DWU IS305 – Dining Meal Booking Feature

## Object-Oriented Programming – Assessment Task 1

This repository contains my **IS305 – Object-Oriented Programming Assessment Task 1**, which develops a simple **Dining Meal Booking Feature** using **JavaScript and Node.js**.

The program demonstrates the basic principles of Object-Oriented Programming (OOP), including:

* Classes
* Objects
* Constructors
* Private fields
* Getters and setters
* Methods
* Arrays
* Input validation
* Error handling
* Node.js console input
* Booking calculations
* Booking status management

> **Database restriction:** This activity does not use a database. Booking information is stored temporarily in JavaScript objects and arrays.

---

## Project Purpose

The purpose of this activity is to create a simple console-based dining meal booking system for students.

The system allows a student to provide:

1. Student ID
2. Student name
3. Meal date
4. Meal type
5. Quantity
6. Dietary note

The program calculates the total meal cost and displays a clear booking summary.

The available meal prices are:

| Meal Type | Price per Meal |
| --------- | -------------: |
| Breakfast |         K10.00 |
| Lunch     |         K15.00 |
| Dinner    |         K20.00 |

The total cost is calculated using:

```text
Total Cost = Meal Price × Quantity
```

---

# Assessment Structure

The assessment is divided into two main parts.

```text
Assessment Task 1
│
├── Part 1 – In-Class OOP Foundation
│   │
│   ├── MealBooking.js
│   └── DiningApp.js
│
└── Part 2 – Complete Dining Meal Booking Feature
    │
    ├── Extended MealBooking.js
    └── Extended DiningApp.js
```

Part 1 establishes the basic OOP structure.

Part 2 extends the Part 1 program into a complete working Node.js console application.

---

# Part 1 – In-Class OOP Foundation

## Purpose

Part 1 creates the basic foundation of the Dining Meal Booking Feature.

The main objective is to demonstrate:

* A JavaScript class
* Private fields
* A constructor
* Getters
* Setters
* Methods
* An object
* Import and export
* A calculated meal total
* A booking summary

---

## MealBooking.js

`MealBooking.js` contains the main `MealBooking` class.

The class acts as a blueprint for creating meal booking objects.

### Private Fields

The class contains the following private fields:

```text
#studentId
#studentName
#mealDate
#mealType
#quantity
#dietaryNote
#bookingStatus
```

The `#` symbol identifies these fields as private.

The private fields protect the internal booking information of the object.

---

## Constructor

The constructor receives the booking information:

```text
studentId
studentName
mealDate
mealType
quantity
dietaryNote
```

The constructor stores these values inside the appropriate private fields.

The booking status is automatically set to:

```text
Pending
```

---

## Getters

Getters are used to read the values stored in the private fields.

Examples include:

```text
studentId
studentName
mealDate
mealType
quantity
dietaryNote
bookingStatus
```

---

## Setters

Setters are used to update the values stored in the private fields.

For example:

```javascript
booking1.quantity = 2;
```

uses the quantity setter to update the private quantity field.

---

## calculateTotal()

The `calculateTotal()` method calculates the cost of the meal.

The calculation is:

```text
Meal Price × Quantity
```

For example:

```text
Lunch = K15
Quantity = 2

K15 × 2 = K30
```

Therefore:

```text
Total Cost = K30
```

---

## getSummary()

The `getSummary()` method returns the booking information in a readable format.

It includes:

* Student ID
* Student name
* Meal date
* Meal type
* Quantity
* Dietary note
* Booking status
* Total cost

---

## DiningApp.js

`DiningApp.js` uses the `MealBooking` class.

The class is imported using:

```javascript
import MealBooking from "./MealBooking.js";
```

A `MealBooking` object is then created.

For example:

```text
booking1
```

The object's `getSummary()` method is then called to display the booking information.

---

# Part 2 – Complete Dining Meal Booking Feature

Part 2 extends the Part 1 foundation into a complete interactive Node.js application.

The user enters the booking information through the console.

The application must ask for:

```text
Student ID
Student Name
Meal Date
Meal Type
Quantity
Dietary Note
```

---

## Accepted Meal Types

The application accepts:

```text
Breakfast
Lunch
Dinner
```

Other meal types must be rejected.

---

## Validation

The completed application validates the entered information.

The application rejects:

* Missing student ID
* Missing student name
* Missing meal date
* Invalid meal type
* Quantity below 1

Invalid information should produce a clear error message rather than causing the program to crash.

---

## Booking Status

A new booking begins with:

```text
Pending
```

The application can then change the status using:

```text
confirmBooking()
```

or:

```text
cancelBooking()
```

### Confirming a Booking

```text
Pending → Confirmed
```

### Cancelling a Booking

```text
Pending → Cancelled
```

---

# Booking Array

Part 2 stores the created booking objects in a JavaScript array.

Conceptually:

```text
bookingList
│
├── Booking 1
├── Booking 2
├── Booking 3
└── ...
```

The array provides temporary storage while the program is running.

No database or permanent storage is used.

---

# Duplicate Booking Prevention

The application prevents the same student from creating another booking when all three of the following are the same:

```text
Student ID
Meal Date
Meal Type
```

For example:

```text
Student ID: DWU2026001
Meal Date: 2026-07-20
Meal Type: Lunch
```

If the same student attempts to book:

```text
Student ID: DWU2026001
Meal Date: 2026-07-20
Meal Type: Lunch
```

the second booking must be rejected.

---

# Required Methods

The completed Part 2 program uses the following methods:

| Method             | Purpose                                     |
| ------------------ | ------------------------------------------- |
| `validate()`       | Checks whether booking information is valid |
| `calculateTotal()` | Calculates meal price × quantity            |
| `confirmBooking()` | Changes Pending to Confirmed                |
| `cancelBooking()`  | Changes Pending to Cancelled                |
| `getSummary()`     | Returns/displays the booking receipt        |

---

# Node.js Input

Part 2 uses Node.js console input.

The application uses Node.js `readline` functionality to ask the user questions.

The basic flow is:

```text
Start
  ↓
Ask Student ID
  ↓
Ask Student Name
  ↓
Ask Meal Date
  ↓
Ask Meal Type
  ↓
Ask Quantity
  ↓
Ask Dietary Note
  ↓
Validate Information
  ↓
Check Duplicate Booking
  ↓
Create MealBooking Object
  ↓
Store Object in Array
  ↓
Calculate Total
  ↓
Display Booking Summary
  ↓
End
```

---

# Example Booking

Example input:

```text
Student ID: DWU2026001
Student Name: Maria Kila
Meal Date: 2026-07-18
Meal Type: Lunch
Quantity: 2
Dietary Note: No peanuts
```

Calculation:

```text
Lunch = K15

K15 × 2 = K30
```

Example result:

```text
================================
       BOOKING CREATED
================================

Student: Maria Kila (DWU2026001)
Meal: Lunch x 2
Date: 2026-07-18
Dietary: No peanuts
Status: Pending
Total cost: K30.00

================================
```

---

# Files

The main JavaScript files are:

```text
MealBooking.js
DiningApp.js
```

### MealBooking.js

Contains the:

```text
MealBooking class
```

and its:

```text
Private fields
Constructor
Getters
Setters
Methods
```

### DiningApp.js

Contains the application logic for:

```text
User input
Object creation
Arrays
Validation
Duplicate checking
Error handling
Booking confirmation/cancellation
Displaying results
```

---

# Relationship Between the Two Files

The two files work together.

```text
              MealBooking.js
                    │
                    │ export
                    ↓
              MealBooking class
                    │
                    │ import
                    ↓
              DiningApp.js
                    │
                    ↓
            Create Booking Object
                    │
                    ↓
             Store in Array
                    │
                    ↓
             Process Booking
                    │
                    ↓
             Display Summary
```

In simple terms:

> **MealBooking.js defines what a booking is, while DiningApp.js controls what the application does with the booking.**

---

# Running the Program

## Requirements

The project requires:

* Windows 11
* Node.js
* Git Bash
* Visual Studio Code or another code editor

---

## Open Git Bash

Open Git Bash and move into the project folder.

Example:

```bash
cd /c/Users/YourName/Documents/DiningMealBooking
```

Check the files:

```bash
ls
```

The folder should contain:

```text
MealBooking.js
DiningApp.js
package.json
```

---

# Check Node.js

Run:

```bash
node -v
```

A Node.js version should be displayed.

Example:

```text
v22.x.x
```

---

# Check JavaScript Syntax

Before running the application, check the JavaScript files.

For `MealBooking.js`:

```bash
node --check MealBooking.js
```

For `DiningApp.js`:

```bash
node --check DiningApp.js
```

If there are no syntax errors, Node.js returns to the command prompt without displaying an error.

---

# Run the Application

Run:

```bash
node DiningApp.js
```

The application will start in the Git Bash terminal.

---

# Required Tests

The completed application should demonstrate at least three tests.

## Test 1 – Valid Booking

Use valid information.

Expected result:

```text
Booking is created
Correct total is displayed
```

---

## Test 2 – Invalid Booking

Enter invalid information.

Examples:

```text
Missing student ID
Missing student name
Invalid meal type
Quantity = 0
```

Expected result:

```text
Error message
Booking is rejected
Program continues without crashing
```

---

## Test 3 – Duplicate Booking

Create a booking using:

```text
Student ID
Meal Date
Meal Type
```

Then attempt the same combination again.

Expected result:

```text
First booking → Accepted

Second booking → Rejected
```

---

# Database Restriction

This project does **not** use a database.

Do not use:

```text
MySQL
MongoDB
Mongoose
SQLite
MongoDB Atlas
ORM
Local Storage
```

The booking information is stored temporarily using JavaScript objects and arrays.

When the program closes, the temporary booking information can be lost.

---

# OOP Concepts Demonstrated

This project demonstrates the following OOP concepts.

### Class

A blueprint for creating booking objects.

```javascript
class MealBooking
```

### Object

An actual booking created from the class.

```javascript
let booking1 = new MealBooking(...);
```

### Constructor

Initialises the object.

```javascript
constructor(...)
```

### Private Fields

Protect the internal booking information.

```javascript
#studentId
#studentName
```

### Getter

Reads a private value.

```javascript
get studentName()
```

### Setter

Changes a private value.

```javascript
set studentName(value)
```

### Methods

Perform actions on the booking.

```text
validate()
calculateTotal()
confirmBooking()
cancelBooking()
getSummary()
```

### Encapsulation

The private fields keep the booking data inside the `MealBooking` class and provide controlled access through getters and setters.

---

# Part 1 to Part 2 Development

The project develops in stages.

```text
PART 1
│
├── Create MealBooking class
├── Create private fields
├── Create constructor
├── Add getters/setters
├── Add calculateTotal()
├── Add getSummary()
├── Export class
└── Create one booking object
        │
        ↓
PART 2
│
├── Add readline
├── Ask for user information
├── Add validation
├── Add error handling
├── Add booking array
├── Add duplicate checking
├── Add confirmation
├── Add cancellation
└── Display final booking receipt
```

Part 1 therefore provides the **foundation**, while Part 2 adds the **complete application functionality**.

---

# GitHub Submission Checklist

Before submitting the project, check the following:

* [ ] `MealBooking.js` is included.
* [ ] `DiningApp.js` is included.
* [ ] `package.json` is included if required by the project setup.
* [ ] Program headers contain my name and student ID.
* [ ] Private fields are used correctly.
* [ ] Constructor works correctly.
* [ ] Booking status starts as `Pending`.
* [ ] Getters and setters work.
* [ ] `calculateTotal()` calculates correctly.
* [ ] `getSummary()` displays the booking information.
* [ ] `validate()` rejects invalid information.
* [ ] `confirmBooking()` changes the booking status.
* [ ] `cancelBooking()` changes the booking status.
* [ ] Booking objects are stored in a JavaScript array.
* [ ] Duplicate bookings are rejected.
* [ ] Error handling prevents the program from crashing.
* [ ] Valid booking test works.
* [ ] Invalid booking test works.
* [ ] Duplicate booking test works.
* [ ] No database is used.
* [ ] JavaScript files contain no syntax errors.
* [ ] The program runs successfully using Node.js.

---

# Simple Project Summary

The **Dining Meal Booking Feature** is a Node.js console application developed using JavaScript Object-Oriented Programming.

`MealBooking.js` provides the **class and booking structure**, including private fields, a constructor, getters, setters, calculations, booking status and the booking summary.

`DiningApp.js` provides the **application functionality**, including user input, validation, object creation, array storage, duplicate checking, error handling and displaying the booking receipt.

Together, the two files demonstrate how a JavaScript class can be used to create and manage real booking objects while keeping the program simple, organised and compliant with the IS305 assessment requirements.
