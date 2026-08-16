/*
---------------------------------------------------------
Program : Dining Meal Booking Feature
Student Name : Abel M. WAMANIMBO
Student ID : 240569
Date : 16 August 2026
Description :
IS305 Object Oriented Programming: Lab 2 application
using Student and MealBooking objects and arrays.
---------------------------------------------------------
*/

// Import classes
import Student from "./Student.js";
import MealBooking from "./MealBooking.js";

// Create Student object
let student = new Student(
    "DWU2026001",
    "Maria",
    "Kila"
);

// Create booking array
let bookings = [];

// Create first booking
let booking1 = new MealBooking(
    student,
    "12 August 2026",
    "Lunch",
    2,
    "No Peanuts"
);

// Set first booking status
booking1.bookingStatus = "Confirmed";

// Add first booking to array
bookings.push(booking1);

// Create second booking
let booking2 = new MealBooking(
    student,
    "13 August 2026",
    "Dinner",
    1,
    "None"
);

// Add second booking to array
bookings.push(booking2);

// Display heading
console.log("======================================");
console.log("         STUDENT INFORMATION");
console.log("======================================");

// Display student information
console.log("Student ID: " + student.studentId);
console.log("Student Name: " + student.getFullName());

// Display booking heading
console.log("");
console.log("======================================");
console.log("          BOOKING HISTORY");
console.log("======================================");

// Variable for combined cost
let combinedCost = 0;

// Display all bookings
bookings.forEach((booking, index) => {

    console.log("");
    console.log(
        (index + 1) + ". " +
        booking.mealType + " - " +
        booking.mealDate
    );

    console.log("   Quantity: " + booking.quantity);
    console.log("   Status: " + booking.bookingStatus);
    console.log(
        "   Cost: K" +
        booking.calculateTotal().toFixed(2)
    );

    // Add booking cost
    combinedCost += booking.calculateTotal();
});

// Display totals
console.log("");
console.log("Total Bookings: " + bookings.length);
console.log(
    "Combined Cost: K" +
    combinedCost.toFixed(2)
);

console.log("======================================");
