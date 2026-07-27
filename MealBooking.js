// Program: Dining Meal Booking Feature
// Author: Abel WAMANIMBO
// Student ID: 240569
// This class stores and manages one meal booking.

class MealBooking { // Create a class called MealBooking.

  #studentId; // Store the student ID as a private field.
  #studentName; // Store the student name as a private field.
  #mealDate; // Store the meal date as a private field.
  #mealType; // Store the meal type as a private field.
  #quantity; // Store the meal quantity as a private field.
  #dietaryNote; // Store the dietary note as a private field.
  #status; // Store the booking status as a private field.
}

  constructor(studentId, studentName, mealDate, mealType, quantity, dietaryNote) { // Set up a new booking object.
    this.#studentId = studentId; // Save the student ID.
    this.#studentName = studentName; // Save the student name.
    this.#mealDate = mealDate; // Save the meal date.
    this.#mealType = mealType; // Save the meal type.
    this.#quantity = Number(quantity); // Convert and save the quantity as a number.
    this.#dietaryNote = dietaryNote || "None"; // Save dietary note or use None if empty.
    this.#status = "Pending"; // Set the default booking status to Pending.
  }
    get studentId() { // Get the student ID.
    return this.#studentId; // Return the student ID.
  }

  get studentName() { // Get the student name.
    return this.#studentName; // Return the student name.
  }

  get mealDate() { // Get the meal date.
    return this.#mealDate; // Return the meal date.
  }

  get mealType() { // Get the meal type.
    return this.#mealType; // Return the meal type.
  }

  get quantity() { // Get the quantity.
    return this.#quantity; // Return the quantity.
  }

  get dietaryNote() { // Get the dietary note.
    return this.#dietaryNote; // Return the dietary note.
  }

  get status() { // Get the booking status.
    return this.#status; // Return the booking status.
  }



