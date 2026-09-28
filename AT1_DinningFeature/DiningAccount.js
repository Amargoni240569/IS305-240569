/*
---------------------------------------------------------
Program : Dining Meal Booking Feature
Student Name : Abel M. WAMANIMBO
Student ID : 240569
Date : 28 September 2026
Description :
IS305 Object Oriented Programming: DiningAccount base class
for Lab 3 (Distinction Extension).
---------------------------------------------------------
*/

// Create the DiningAccount base class
class DiningAccount {

    // Private fields
    #accountNumber;
    #balance;
    #transactions;

    // Constructor (openingBalance is optional, default is 0)
    constructor(accountNumber, openingBalance = 0) {

        // Check the account number
        if (typeof accountNumber !== "string" || accountNumber.trim() == "") {
            throw new Error("Account number cannot be empty.");
        }

        // Check the opening balance
        if (typeof openingBalance !== "number" || !Number.isFinite(openingBalance)) {
            throw new Error("Opening balance must be a number.");
        }

        if (openingBalance < 0) {
            throw new Error("Opening balance cannot be negative.");
        }

        // Set up the account
        this.#accountNumber = accountNumber.trim();
        this.#balance = 0;
        this.#transactions = [];

        // Record the opening balance as the first transaction
        if (openingBalance > 0) {
            this._adjustBalance(openingBalance, "Deposit", "Opening balance");
        }
    }

    // Getter for account number
    get accountNumber() {
        return this.#accountNumber;
    }

    // Return the account type (the class name of the object)
    getAccountType() {
        return this.constructor.name;
    }

    // Return the current balance
    getBalance() {
        return this.#balance;
    }

    // Return a safe copy of the transaction history
    getTransactions() {
        return this.#transactions.map((transaction) => {
            return { ...transaction, dateTime: new Date(transaction.dateTime) };
        });
    }

    // Deposit money (description is optional)
    deposit(amount, description = "Deposit") {

        amount = this._validateAmount(amount, "Deposit");
        description = this._cleanDescription(description, "Deposit");

        this._adjustBalance(amount, "Deposit", description);
    }

    // Pay for a meal (only when there are enough funds)
    payForMeal(amount, description = "Meal payment") {

        amount = this._validateAmount(amount, "Payment");
        description = this._cleanDescription(description, "Meal payment");

        // A standard account cannot go below zero
        if (amount > this.#balance) {
            console.log(
                "Payment rejected: insufficient funds. " +
                "Balance: " + DiningAccount.formatMoney(this.#balance) +
                ", Payment: " + DiningAccount.formatMoney(amount)
            );
            return false;
        }

        this._adjustBalance(-amount, "Meal Payment", description);
        return true;
    }

    // Display the account summary
    displayAccountSummary() {
        console.log("Account Number: " + this.#accountNumber);
        console.log("Account Type: " + this.getAccountType());
        console.log("Current Balance: " + DiningAccount.formatMoney(this.#balance));
    }

    // Display the transaction history (date and time are optional)
    displayTransactionHistory(showDateTime = false) {

        DiningAccount.printHeading("TRANSACTION HISTORY");

        this.#transactions.forEach((transaction, index) => {

            console.log(
                (index + 1) + ". " +
                transaction.type + " - " +
                DiningAccount.formatMoney(transaction.amount)
            );
            console.log("   Description: " + transaction.description);

            if (showDateTime) {
                console.log("   Date: " + transaction.dateTime.toLocaleString());
            }

            console.log("   Balance: " + DiningAccount.formatMoney(transaction.balanceAfter));
            console.log("");
        });

        console.log("Total Transactions: " + this.#transactions.length);
        console.log("========================================");
    }

    // Helper for subclasses: change the balance and record the transaction
    // (the underscore means "use inside the account classes only")
    _adjustBalance(change, type, description) {

        this.#balance = DiningAccount.roundMoney(this.#balance + change);

        this.#transactions.push(Object.freeze({
            type: type,
            amount: Math.abs(change),
            description: description,
            dateTime: new Date(),
            balanceAfter: this.#balance
        }));
    }

    // Helper for subclasses: check that an amount is greater than zero
    _validateAmount(amount, label) {

        const rounded = DiningAccount.roundMoney(amount);

        if (typeof amount !== "number" || !Number.isFinite(amount) || rounded <= 0) {
            throw new Error(label + " amount must be greater than zero.");
        }

        return rounded;
    }

    // Helper for subclasses: use a default when no description is given
    _cleanDescription(description, fallback) {

        if (typeof description !== "string" || description.trim() == "") {
            return fallback;
        }

        return description.trim();
    }

    // Round money to 2 decimal places
    static roundMoney(amount) {
        return Math.round(amount * 100) / 100;
    }

    // Format money, for example K30.00
    static formatMoney(amount) {
        return "K" + amount.toFixed(2);
    }

    // Print a centred heading between two lines
    static printHeading(title) {

        const width = 40;
        const spaces = Math.floor((width - title.length) / 2);

        console.log("=".repeat(width));
        console.log(" ".repeat(Math.max(spaces, 0)) + title);
        console.log("=".repeat(width));
    }
}

// Export DiningAccount class
export default DiningAccount;
