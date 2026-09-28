/*
---------------------------------------------------------
Program : Dining Meal Booking Feature
Student Name : Abel M. WAMANIMBO
Student ID : 240569
Date : 28 September 2026
Description :
IS305 Object Oriented Programming: CreditDiningAccount
class that inherits from DiningAccount for Lab 3.
---------------------------------------------------------
*/

// Import the base class
import DiningAccount from "./DiningAccount.js";

// CreditDiningAccount inherits from DiningAccount
class CreditDiningAccount extends DiningAccount {

    // Private field
    #creditLimit;

    // Constructor chaining: super() sets up the base account
    constructor(accountNumber, openingBalance = 0, creditLimit = 0) {

        super(accountNumber, openingBalance);

        // Check the credit limit
        if (typeof creditLimit !== "number" || !Number.isFinite(creditLimit)) {
            throw new Error("Credit limit must be a number.");
        }

        if (creditLimit < 0) {
            throw new Error("Credit limit cannot be negative.");
        }

        this.#creditLimit = creditLimit;
    }

    // Getter for credit limit
    get creditLimit() {
        return this.#creditLimit;
    }

    // Balance plus credit limit = the most that can be spent
    getAvailableFunds() {
        return DiningAccount.roundMoney(this.getBalance() + this.#creditLimit);
    }

    // Override: the balance may fall below zero, but not below the credit limit
    payForMeal(amount, description = "Meal payment") {

        amount = this._validateAmount(amount, "Payment");
        description = this._cleanDescription(description, "Meal payment");

        // Reject payments bigger than balance + credit limit
        if (amount > this.getAvailableFunds()) {
            console.log(
                "Payment rejected: credit limit exceeded. " +
                "Available funds: " + DiningAccount.formatMoney(this.getAvailableFunds()) +
                ", Payment: " + DiningAccount.formatMoney(amount)
            );
            return false;
        }

        this._adjustBalance(-amount, "Meal Payment", description);
        return true;
    }

    // Override: show the base summary, the credit limit and available funds
    displayAccountSummary() {
        super.displayAccountSummary();
        console.log("Credit Limit: " + DiningAccount.formatMoney(this.#creditLimit));
        console.log("Available Funds: " + DiningAccount.formatMoney(this.getAvailableFunds()));
    }
}

// Export CreditDiningAccount class
export default CreditDiningAccount;
