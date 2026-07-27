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

  set studentId(studentId) { // Set a new student ID.
    this.#studentId = studentId; // Save the new student ID.
  }

  set studentName(studentName) { // Set a new student name.
    this.#studentName = studentName; // Save the new student name.
  }

  set mealDate(mealDate) { // Set a new meal date.
    this.#mealDate = mealDate; // Save the new meal date.
  }

  set mealType(mealType) { // Set a new meal type.
    this.#mealType = mealType; // Save the new meal type.
  }

  set quantity(quantity) { // Set a new quantity.
    this.#quantity = Number(quantity); // Convert and save the new quantity.
  }

  set dietaryNote(dietaryNote) { // Set a new dietary note.
    this.#dietaryNote = dietaryNote || "None"; // Save the note or use None.
  }
  validate() { // Check if the booking information is correct.
    const validMeals = ["Breakfast", "Lunch", "Dinner"]; // Store the accepted meal types.

    if (!this.#studentId) { // Check if student ID is missing.
      throw new Error("Student ID is required."); // Show an error message.
    }

    if (!this.#studentName) { // Check if student name is missing.
      throw new Error("Student name is required."); // Show an error message.
    }

    if (!this.#mealDate) { // Check if meal date is missing.
      throw new Error("Meal date is required."); // Show an error message.
    }

    if (!validMeals.includes(this.#mealType)) { // Check if meal type is invalid.
      throw new Error("Meal type must be Breakfast, Lunch, or Dinner."); // Show an error message.
    }

    if (!this.#quantity || this.#quantity <= 0) { // Check if quantity is invalid.
      throw new Error("Quantity must be more than 0."); // Show an error message.
    }

    return true; // Return true if all information is valid.
  }
  calculateTotal() { // Calculate the total booking cost.
    const mealPrices = { Breakfast: 10, Lunch: 15, Dinner: 20 }; // Store prices for each meal.
    return mealPrices[this.#mealType] * this.#quantity; // Return price multiplied by quantity.
  }

  confirmBooking() { // Confirm the booking.
    this.#status = "Confirmed"; // Change the status to Confirmed.
  }

  cancelBooking() { // Cancel the booking.
    this.#status = "Cancelled"; // Change the status to Cancelled.
  }

getSummary() { // Create a booking summary.
    return `
========================================
             BOOKING CREATED
========================================
Student: ${this.#studentName} (${this.#studentId})
Meal: ${this.#mealType} x ${this.#quantity}
Date: ${this.#mealDate}
Dietary note: ${this.#dietaryNote}
Status: ${this.#status}
Total cost: K${this.calculateTotal().toFixed(2)}
========================================`; // Return the full booking summary.
  }


module.exports = MealBooking; // Allow this class to be used in another file.



