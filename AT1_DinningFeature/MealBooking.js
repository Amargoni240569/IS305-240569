/*
---------------------------------------------------------
Program : Dining Meal Booking Feature
Student Name : Abel M. WAMANIMBO
Student ID : 240569
Date : 21 July 2026
Description :
IS305 Object Oriented Programming: A JavaScript program demonstrating classes, objects, constructors, private fields, getters, setters and methods.
---------------------------------------------------------
*/

// Create the MealBooking class
class MealBooking {

    // Private fields
    #studentId;
    #studentName;
    #mealDate;
    #mealType;
    #quantity;
    #dietaryNote;
    #bookingStatus;

    // Constructor
    constructor(studentId, studentName, mealDate, mealType, quantity, dietaryNote) {

        // Store the student ID
        this.#studentId = studentId;

        // Store the student name
        this.#studentName = studentName;

        // Store the meal date
        this.#mealDate = mealDate;

        // Store the meal type
        this.#mealType = mealType;

        // Store the quantity
        this.#quantity = quantity;

        // Store the dietary note
        this.#dietaryNote = dietaryNote;

        // Default booking status
        this.#bookingStatus = "Pending";
    }

    // Getter for student ID
    get studentId() {
        return this.#studentId;
    }

    // Setter for student ID
    set studentId(studentId) {
        this.#studentId = studentId;
    }

    // Getter for student name
    get studentName() {
        return this.#studentName;
    }

    // Setter for student name
    set studentName(studentName) {
        this.#studentName = studentName;
    }

    // Getter for meal date
    get mealDate() {
        return this.#mealDate;
    }

    // Setter for meal date
    set mealDate(mealDate) {
        this.#mealDate = mealDate;
    }

    // Getter for meal type
    get mealType() {
        return this.#mealType;
    }

    // Setter for meal type
    set mealType(mealType) {
        this.#mealType = mealType;
    }

    // Getter for quantity
    get quantity() {
        return this.#quantity;
    }

    // Setter for quantity
    set quantity(quantity) {
        this.#quantity = quantity;
    }

    // Getter for dietary note
    get dietaryNote() {
        return this.#dietaryNote;
    }

    // Setter for dietary note
    set dietaryNote(dietaryNote) {
        this.#dietaryNote = dietaryNote;
    }

    // Getter for booking status
    get bookingStatus() {
        return this.#bookingStatus;
    }

    // Setter for booking status
    set bookingStatus(bookingStatus) {
        this.#bookingStatus = bookingStatus;
    }

    // Calculate the total meal cost
    calculateTotal() {

        // Variable to store meal price
        let mealPrice = 0;

        // Breakfast price
        if (this.#mealType == "Breakfast") {
            mealPrice = 10;
        }

        // Lunch price
        else if (this.#mealType == "Lunch") {
            mealPrice = 15;
        }

        // Dinner price
        else if (this.#mealType == "Dinner") {
            mealPrice = 20;
        }

        // Return total price
        return mealPrice * this.#quantity;
    }

    // Return booking summary
    getSummary() {

        return (
            "Student ID : " + this.#studentId + "\n" +
            "Student Name : " + this.#studentName + "\n" +
            "Meal Date : " + this.#mealDate + "\n" +
            "Meal Type : " + this.#mealType + "\n" +
            "Quantity : " + this.#quantity + "\n" +
            "Dietary Note : " + this.#dietaryNote + "\n" +
            "Booking Status : " + this.#bookingStatus + "\n" +
            "Total Cost : K" + this.calculateTotal()
        );

    }

}

// Export the class
export default MealBooking;

