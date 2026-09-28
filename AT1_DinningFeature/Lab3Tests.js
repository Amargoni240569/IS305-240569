/*
---------------------------------------------------------
Program : Dining Meal Booking Feature
Student Name : Abel M. WAMANIMBO
Student ID : 240569
Date : 28 September 2026
Description :
IS305 Object Oriented Programming: Lab 3 tests.
Run with: node Lab3Tests.js
---------------------------------------------------------
*/

import Student from "./Student.js";
import MealBooking from "./MealBooking.js";
import DiningAccount from "./DiningAccount.js";
import RewardsDiningAccount from "./RewardsDiningAccount.js";
import CreditDiningAccount from "./CreditDiningAccount.js";

// Counters
let passed = 0;
let failed = 0;

// Run one test and show PASS or FAIL
function test(name, action) {

    // Hide the rejection messages printed by the accounts
    const originalLog = console.log;
    console.log = () => {};

    try {
        action();
        console.log = originalLog;
        console.log("PASS - " + name);
        passed++;
    } catch (error) {
        console.log = originalLog;
        console.log("FAIL - " + name + " (" + error.message + ")");
        failed++;
    }
}

// Stop the test if the condition is false
function check(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

// Check that an action throws an error
function checkThrows(action, message) {
    try {
        action();
    } catch (error) {
        return;
    }
    throw new Error(message);
}

// Create a student with a booking for tests
function makeStudent() {
    return new Student("DWU2026001", "Maria", "Kila");
}

console.log("========================================");
console.log("        LAB 3 TESTS");
console.log("========================================");

// ----- Required tests -----

test("1. Standard account payment succeeds with enough funds", () => {
    const account = new DiningAccount("DA001", 500);
    check(account.payForMeal(200) === true, "payment should succeed");
    check(account.getBalance() === 300, "balance should be 300");
});

test("2. Insufficient standard balance is rejected, balance unchanged", () => {
    const account = new DiningAccount("DA001", 100);
    check(account.payForMeal(200) === false, "payment should be rejected");
    check(account.getBalance() === 100, "balance should stay 100");
});

test("3. Rewards calculation is correct and applied", () => {
    const account = new RewardsDiningAccount("RA001", 1500, 2.5);
    account.deposit(500);
    check(account.calculateReward() === 50, "reward should be 50");
    account.applyReward();
    check(account.getBalance() === 2050, "balance should be 2050");
});

test("4. Credit account payment within limit is accepted", () => {
    const account = new CreditDiningAccount("CA001", 1000, 500);
    check(account.payForMeal(1500) === true, "payment should succeed");
    check(account.getBalance() === -500, "balance should be -500");
});

test("5. Credit limit exceeded is rejected", () => {
    const account = new CreditDiningAccount("CA001", 1000, 500);
    account.payForMeal(1500);
    check(account.payForMeal(1) === false, "payment should be rejected");
    check(account.getBalance() === -500, "balance should stay -500");
});

test("6. Polymorphic processing gives the correct result for each type", () => {
    const accounts = [
        new DiningAccount("DA010", 1000),
        new RewardsDiningAccount("RA010", 1000, 2.5),
        new CreditDiningAccount("CA010", 1000, 500)
    ];
    const results = accounts.map((account) => account.payForMeal(1200));
    check(results[0] === false, "standard should reject");
    check(results[1] === false, "rewards should reject");
    check(results[2] === true, "credit should accept");
});

test("7. Successful booking payment confirms the booking", () => {
    const student = makeStudent();
    student.assignDiningAccount(new DiningAccount("DA001", 100));
    const booking = new MealBooking(student, "14 August 2026", "Dinner", 2, "None");

    check(booking.processPayment() === true, "payment should succeed");
    check(booking.bookingStatus === "Confirmed", "booking should be Confirmed");
    check(booking.paymentStatus === "Successful", "payment should be Successful");
    check(student.diningAccount.getBalance() === 60, "balance should be 60");
});

test("8. Duplicate payment is not charged again", () => {
    const student = makeStudent();
    student.assignDiningAccount(new DiningAccount("DA001", 100));
    const booking = new MealBooking(student, "14 August 2026", "Dinner", 2, "None");

    booking.processPayment();
    check(booking.processPayment() === false, "second payment should be rejected");
    check(student.diningAccount.getBalance() === 60, "balance should stay 60");
    check(student.diningAccount.getTransactions().length === 2, "only 2 transactions");
});

// ----- Extra tests -----

test("9. Failed booking payment keeps the booking Pending", () => {
    const student = makeStudent();
    student.assignDiningAccount(new DiningAccount("DA001", 10));
    const booking = new MealBooking(student, "14 August 2026", "Dinner", 2, "None");

    check(booking.processPayment() === false, "payment should fail");
    check(booking.bookingStatus === "Pending", "booking should stay Pending");
    check(booking.paymentStatus === "Failed", "payment should be Failed");
});

test("10. Subclasses inherit from DiningAccount (constructor chaining)", () => {
    const rewards = new RewardsDiningAccount("RA001", 200, 2);
    const credit = new CreditDiningAccount("CA001", 300, 100);
    check(rewards instanceof DiningAccount, "rewards should inherit");
    check(credit instanceof DiningAccount, "credit should inherit");
    check(rewards.accountNumber === "RA001" && rewards.getBalance() === 200, "super() values");
    check(credit.accountNumber === "CA001" && credit.getBalance() === 300, "super() values");
});

test("11. Simulated overloading: constructor and deposit", () => {
    const one = new DiningAccount("DA001");
    const two = new DiningAccount("DA002", 500);
    check(one.getBalance() === 0 && two.getBalance() === 500, "default balance");

    two.deposit(100);
    two.deposit(100, "Additional meal funds");
    const history = two.getTransactions();
    check(history[1].description === "Deposit", "default description");
    check(history[2].description === "Additional meal funds", "given description");
});

test("12. Validation rejects bad values", () => {
    checkThrows(() => new DiningAccount(""), "empty account number");
    checkThrows(() => new DiningAccount("DA001", -1), "negative opening balance");
    checkThrows(() => new DiningAccount("DA001", 100).deposit(0), "zero deposit");
    checkThrows(() => new DiningAccount("DA001", 100).payForMeal(-5), "negative payment");
    checkThrows(() => new CreditDiningAccount("CA001", 0, -1), "negative credit limit");
    checkThrows(() => new RewardsDiningAccount("RA001", 0, 101), "reward rate over 100");
});

test("13. Student only accepts DiningAccount objects", () => {
    const student = makeStudent();
    checkThrows(() => student.assignDiningAccount({}), "plain object accepted");
    student.assignDiningAccount(new CreditDiningAccount("CA001", 0, 100));
    check(student.diningAccount.getAccountType() === "CreditDiningAccount", "subclass accepted");
});

test("14. Transaction history records type, amount, description, date, balance", () => {
    const account = new DiningAccount("DA001", 100);
    account.payForMeal(40, "Dinner booking");
    const second = account.getTransactions()[1];
    check(second.type === "Meal Payment", "type");
    check(second.amount === 40, "amount");
    check(second.description === "Dinner booking", "description");
    check(second.dateTime instanceof Date, "date and time");
    check(second.balanceAfter === 60, "balance after");
});

test("15. getTransactions returns a safe copy", () => {
    const account = new DiningAccount("DA001", 100);
    const copy = account.getTransactions();
    copy.push({ type: "Fake" });
    copy[0].amount = 999;
    check(account.getTransactions().length === 1, "history length changed");
    check(account.getTransactions()[0].amount === 100, "history amount changed");
});

test("16. Booking can be paid by a credit account through the same method", () => {
    const student = makeStudent();
    student.assignDiningAccount(new CreditDiningAccount("CA001", 10, 50));
    const booking = new MealBooking(student, "14 August 2026", "Dinner", 2, "None");

    check(booking.processPayment() === true, "credit should allow K40 with K10 + K50");
    check(student.diningAccount.getBalance() === -30, "balance should be -30");
});

// ----- Summary -----
console.log("========================================");
console.log("Tests Passed: " + passed + " / " + (passed + failed));
console.log("========================================");

// Show a failing exit code if any test failed
if (failed > 0) {
    process.exitCode = 1;
}
