/*
---------------------------------------------------------
Program : Dining Meal Booking Feature
Student Name : Abel M. WAMANIMBO
Student ID : 240569
Date : 21 July 2026
Description :
IS305 Object Oriented Programming: This program creates one MealBooking object and displays its booking summary.
---------------------------------------------------------
*/

// Import the MealBooking class
import MealBooking from "./MealBooking.js";

// Create one MealBooking object
let booking1 = new MealBooking(

    "DWU2026001",      // Student ID
    "Maria Kila",      // Student Name
    "2026-07-20",      // Meal Date
    "Lunch",           // Meal Type
    2,                 // Quantity
    "No Peanuts"       // Dietary Note

);

// Display the booking summary
console.log("-----------------------------------");
console.log("     DWU DINING MEAL BOOKING");
console.log("-----------------------------------");

// Call the getSummary() method
console.log(booking1.getSummary());

console.log("-----------------------------------");
