/*
---------------------------------------------------------
Program : Dining Meal Booking Feature
Student Name : Abel M. WAMANIMBO
Student ID : 240569
Date : 16 August 2026
Description :
IS305 Object Oriented Programming: MealBooking class
connected with the Student class for Lab 2.
---------------------------------------------------------
*/

// Import Student class
import Student from "./Student.js";

// Create MealBooking class
class MealBooking {

    // Private fields
    #student;
    #mealDate;
    #mealType;
    #quantity;
    #dietaryNote;
    #bookingStatus;

    // Constructor
    constructor(student, mealDate, mealType, quantity, dietaryNote) {

        // Check that a Student object was supplied
        if (!(student instanceof Student)) {
            throw new Error("Invalid Student object.");
        }

        // Store Student object
        this.#student = student;

        // Store booking information
        this.#mealDate = mealDate;
        this.#mealType = mealType;
        this.#quantity = quantity;
        this.#dietaryNote = dietaryNote;

        // Default status
        this.#bookingStatus = "Pending";

        // Validate booking
        this.validateBooking();
    }

    // Getter for Student
    get student() {
        return this.#student;
    }

    // Getter for meal date
    get mealDate() {
        return this.#mealDate;
    }

    // Getter for meal type
    get mealType() {
        return this.#mealType;
    }

    // Getter for quantity
    get quantity() {
        return this.#quantity;
    }

    // Getter for dietary note
    get dietaryNote() {
        return this.#dietaryNote;
    }

    // Getter for booking status
    get bookingStatus() {
        return this.#bookingStatus;
    }

    // Setter for booking status
    set bookingStatus(bookingStatus) {
        this.#bookingStatus = bookingStatus;
    }

    // Validate booking information
    validateBooking() {

        // Check meal date
        if (!this.#mealDate || this.#mealDate.trim() == "") {
            throw new Error("Meal date cannot be empty.");
        }

        // Check meal type
        if (
            this.#mealType != "Breakfast" &&
            this.#mealType != "Lunch" &&
            this.#mealType != "Dinner"
        ) {
            throw new Error("Invalid meal type.");
        }

        // Check quantity
        if (this.#quantity <= 0) {
            throw new Error("Quantity must be greater than zero.");
        }
    }

    // Calculate meal cost
    calculateTotal() {

        let mealPrice = 0;

        // Breakfast
        if (this.#mealType == "Breakfast") {
            mealPrice = 10;
        }

        // Lunch
        else if (this.#mealType == "Lunch") {
            mealPrice = 15;
        }

        // Dinner
        else if (this.#mealType == "Dinner") {
            mealPrice = 20;
        }

        // Return total cost
        return mealPrice * this.#quantity;
    }

    // Return booking summary
    getSummary() {

        return (
            "Student ID: " + this.#student.studentId + "\n" +
            "Student Name: " + this.#student.getFullName() + "\n" +
            "Meal Date: " + this.#mealDate + "\n" +
            "Meal Type: " + this.#mealType + "\n" +
            "Quantity: " + this.#quantity + "\n" +
            "Booking Status: " + this.#bookingStatus + "\n" +
            "Cost: K" + this.calculateTotal().toFixed(2)
        );
    }
}

// Export MealBooking class
export default MealBooking;