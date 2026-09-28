/*
---------------------------------------------------------
Program : Dining Meal Booking Feature
Student Name : Abel M. WAMANIMBO
Student ID : 240569
Date : 16 August 2026
Description :
IS305 Object Oriented Programming: Lab 2 application
using Student and MealBooking objects and arrays,
extended in Lab 3 with dining accounts (Distinction).
---------------------------------------------------------
*/

// Import classes
import Student from "./Student.js";
import MealBooking from "./MealBooking.js";
import DiningAccount from "./DiningAccount.js";
import RewardsDiningAccount from "./RewardsDiningAccount.js";
import CreditDiningAccount from "./CreditDiningAccount.js";

// Short name for formatting money, for example K30.00
const money = DiningAccount.formatMoney;

// Show a heading for the Lab 2 section
DiningAccount.printHeading("LAB 2: STUDENT AND BOOKINGS");
console.log("");

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

// =========================================================
// LAB 3: DINING ACCOUNTS (Distinction Extension)
// =========================================================

// Part 1: standard account and rewards account
function runPart1() {

    console.log("");
    console.log("######## LAB 3 - PART 1: ACCOUNT FOUNDATION ########");
    console.log("");

    // ----- Standard account -----
    DiningAccount.printHeading("STANDARD DINING ACCOUNT");

    const standard = new DiningAccount("DA001", 1000);
    console.log("Account Number: " + standard.accountNumber);
    console.log("Opening Balance: " + money(standard.getBalance()));

    standard.deposit(500);
    console.log("Deposit: " + money(500));

    console.log("Meal Payment: " + money(200));
    const paid = standard.payForMeal(200, "Meal payment");
    console.log("Payment Status: " + (paid ? "Successful" : "Rejected"));
    console.log("Final Balance: " + money(standard.getBalance()));

    // Extra test: a payment that is too big must be rejected
    console.log("");
    console.log("Extra Payment: " + money(5000));
    const tooBig = standard.payForMeal(5000, "Large catering order");
    console.log("Payment Status: " + (tooBig ? "Successful" : "Rejected"));
    console.log("Balance Unchanged: " + money(standard.getBalance()));

    // ----- Rewards account -----
    console.log("");
    DiningAccount.printHeading("REWARDS DINING ACCOUNT");

    const rewards = new RewardsDiningAccount("RA001", 1500, 2.5);
    rewards.deposit(500);

    console.log("Account Number: " + rewards.accountNumber);
    console.log("Balance Before Reward: " + money(rewards.getBalance()));
    console.log("Reward Rate: " + rewards.rewardRate + "%");
    console.log("Reward Earned: " + money(rewards.calculateReward()));

    rewards.applyReward();
    console.log("Final Balance: " + money(rewards.getBalance()));
    console.log("========================================");
}

// Part 2, credit account
function runCreditDemo() {

    console.log("");
    console.log("######## LAB 3 - PART 2: DISTINCTION EXTENSION ########");
    console.log("");

    DiningAccount.printHeading("CREDIT DINING ACCOUNT");

    const credit = new CreditDiningAccount("CA001", 1000, 500);
    console.log("Account Number: " + credit.accountNumber);
    console.log("Opening Balance: " + money(credit.getBalance()));
    console.log("Credit Limit: " + money(credit.creditLimit));

    // Payment inside the credit limit (balance goes below zero)
    console.log("");
    console.log("Catering Payment: " + money(1500));
    const first = credit.payForMeal(1500, "Catering payment");
    console.log("Payment Status: " + (first ? "Successful" : "Rejected"));
    console.log("Resulting Balance: " + money(credit.getBalance()));

    // Payment that goes past the credit limit
    console.log("");
    console.log("Second Payment: " + money(100));
    const second = credit.payForMeal(100, "Extra meal");
    console.log("Payment Status: " + (second ? "Successful" : "Rejected"));
    console.log("Final Balance: " + money(credit.getBalance()));
    console.log("========================================");
}

// Polymorphism: one array, the same method calls on every object
function runPolymorphismDemo() {

    console.log("");
    DiningAccount.printHeading("POLYMORPHISM DEMONSTRATION");

    const diningAccounts = [
        new DiningAccount("DA010", 1000),
        new RewardsDiningAccount("RA010", 1000, 2.5),
        new CreditDiningAccount("CA010", 1000, 500)
    ];

    // Same method, different output for each account type
    console.log("Same method: displayAccountSummary()");
    console.log("");
    for (const account of diningAccounts) {
        account.displayAccountSummary();
        console.log("");
    }

    // Same method, different behaviour for each account type
    console.log("Same method: payForMeal(" + money(1200) + ")");
    console.log("");
    for (const account of diningAccounts) {
        const result = account.payForMeal(1200, "Function catering");
        console.log(account.getAccountType() + ": " + (result ? "Accepted" : "Rejected"));
        console.log("");
    }
    console.log("========================================");
}

// Simulated overloading using default parameters
function runOverloadingDemo() {

    console.log("");
    DiningAccount.printHeading("SIMULATED OVERLOADING");

    // Constructor with one argument and with two arguments
    const accountA = new DiningAccount("DA001");
    const accountB = new DiningAccount("DA002", 500);
    console.log("new DiningAccount(\"DA001\")       -> " + money(accountA.getBalance()));
    console.log("new DiningAccount(\"DA002\", 500)  -> " + money(accountB.getBalance()));

    // Deposit with one argument and with two arguments
    accountB.deposit(100);
    accountB.deposit(100, "Additional meal funds");
    console.log("");
    console.log("deposit(100) and deposit(100, \"Additional meal funds\"):");

    accountB.getTransactions().forEach((transaction, index) => {
        console.log(
            "  " + (index + 1) + ". " + transaction.type + " " +
            money(transaction.amount) + " - " + transaction.description
        );
    });
    console.log("========================================");
}

// Validation and exception handling: the program keeps running
function runErrorDemo() {

    console.log("");
    DiningAccount.printHeading("VALIDATION AND ERRORS");

    // Each test is expected to throw an error
    const tests = [
        ["Empty account number", () => new DiningAccount("   ")],
        ["Negative opening balance", () => new DiningAccount("DA020", -50)],
        ["Deposit of zero", () => new DiningAccount("DA021", 100).deposit(0)],
        ["Negative credit limit", () => new CreditDiningAccount("CA020", 0, -1)],
        ["Reward rate over 100", () => new RewardsDiningAccount("RA020", 0, 150)],
        ["Invalid account for Student", () => new Student("S1", "Test", "User").assignDiningAccount({})]
    ];

    for (const [name, action] of tests) {
        try {
            action();
            console.log(name + ": no error (unexpected)");
        } catch (error) {
            console.log(name + " -> Error: " + error.message);
        }
    }
    console.log("========================================");
}

// Booking payments: failed payment, then success, then duplicate payment
function runBookingPaymentTests() {

    console.log("");
    DiningAccount.printHeading("BOOKING PAYMENT TESTS");

    const peter = new Student("DWU2026002", "Peter", "Naru");
    peter.assignDiningAccount(new DiningAccount("DA030", 30));

    const booking = new MealBooking(peter, "15 August 2026", "Dinner", 2, "None");
    console.log("Booking cost: " + money(booking.calculateTotal()) +
        " | Account balance: " + money(peter.diningAccount.getBalance()));

    // Test 1: not enough money, booking stays Pending
    console.log("");
    console.log("Test 1: Pay with insufficient funds");
    booking.processPayment();
    console.log("Payment Status: " + booking.paymentStatus);
    console.log("Booking Status: " + booking.bookingStatus);

    // Test 2: add money and pay again, booking is Confirmed
    console.log("");
    console.log("Test 2: Deposit K20.00 and pay again");
    peter.diningAccount.deposit(20, "Top-up");
    booking.processPayment();
    console.log("Payment Status: " + booking.paymentStatus);
    console.log("Booking Status: " + booking.bookingStatus);
    console.log("Balance: " + money(peter.diningAccount.getBalance()));

    // Test 3: the same booking cannot be charged again
    console.log("");
    console.log("Test 3: Try to pay the same booking again");
    booking.processPayment();
    console.log("Balance Unchanged: " + money(peter.diningAccount.getBalance()));
    console.log("========================================");
}

// Final demonstration: student, account, booking and transaction history
function runFinalDemo() {

    console.log("");
    console.log("######## FINAL OUTPUT ########");
    console.log("");

    // Connect Student -> DiningAccount
    const account = new RewardsDiningAccount("RA001", 100, 2.5);
    student.assignDiningAccount(account);
    const openingBalance = account.getBalance();

    // Connect Student -> MealBooking, then pay through the account
    const booking3 = new MealBooking(
        student,
        "14 August 2026",
        "Dinner",
        2,
        "None"
    );
    bookings.push(booking3);

    const paid = booking3.processPayment(student.diningAccount);

    // Student and account details
    DiningAccount.printHeading("STUDENT DINING ACCOUNT");
    console.log("Student: " + student.getFullName());
    console.log("Student ID: " + student.studentId);
    console.log("Account Type: " + account.getAccountType());
    console.log("Account Number: " + account.accountNumber);
    console.log("Opening Balance: " + money(openingBalance));

    // Booking and payment details
    console.log("");
    DiningAccount.printHeading("MEAL BOOKING");
    console.log("Meal: " + booking3.mealType);
    console.log("Quantity: " + booking3.quantity);
    console.log("Total Cost: " + money(booking3.calculateTotal()));
    console.log("Payment Status: " + (paid ? "Successful" : "Failed"));
    console.log("Booking Status: " + booking3.bookingStatus);
    console.log("Remaining Balance: " + money(account.getBalance()));

    // Transaction history
    console.log("");
    account.displayTransactionHistory();
}

// Run all Lab 3 sections
try {
    runPart1();
    runCreditDemo();
    runPolymorphismDemo();
    runOverloadingDemo();
    runErrorDemo();
    runBookingPaymentTests();
    runFinalDemo();
} catch (error) {
    // Show a clear message instead of crashing
    console.log("Program error: " + error.message);
}
