/*
---------------------------------------------------------
Program : Dining Meal Booking Feature
Student Name : Abel M. WAMANIMBO
Student ID : 240569
Date : 16 August 2026
Description :
IS305 Object Oriented Programming: Student class for
Lab 2.
---------------------------------------------------------
*/

// Create the Student class
class Student {

    // Private fields
    #studentId;
    #firstName;
    #lastName;

    // Constructor
    constructor(studentId, firstName, lastName) {

        // Store student information using setters
        this.studentId = studentId;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    // Getter for student ID
    get studentId() {
        return this.#studentId;
    }

    // Setter for student ID
    set studentId(studentId) {

        // Reject empty student ID
        if (!studentId || studentId.trim() == "") {
            throw new Error("Student ID cannot be empty.");
        }

        this.#studentId = studentId.trim();
    }

    // Getter for first name
    get firstName() {
        return this.#firstName;
    }

    // Setter for first name
    set firstName(firstName) {

        // Reject empty first name
        if (!firstName || firstName.trim() == "") {
            throw new Error("First name cannot be empty.");
        }

        this.#firstName = firstName.trim();
    }

    // Getter for last name
    get lastName() {
        return this.#lastName;
    }

    // Setter for last name
    set lastName(lastName) {

        // Reject empty last name
        if (!lastName || lastName.trim() == "") {
            throw new Error("Last name cannot be empty.");
        }

        this.#lastName = lastName.trim();
    }

    // Return the student's full name
    getFullName() {
        return this.#firstName + " " + this.#lastName;
    }

    // Display student information
    displayInfo() {
        return (
            "Student ID: " + this.#studentId + "\n" +
            "Student Name: " + this.getFullName()
        );
    }
}

// Export Student class
export default Student;