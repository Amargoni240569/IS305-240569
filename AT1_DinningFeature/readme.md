# IS305 – Lab 3: Dining Account Distinction Extension

**Student Name:** Abel M. WAMANIMBO
**Student ID:** 240569
**GitHub Repository URL:** `<add your IS305-240569 repository URL here>`
**Technology:** JavaScript and Node.js (no database)

---

## 1. How Lab 3 Extends Labs 1 and 2

Lab 3 is an extension of the same Dining Meal Booking application. No new application was created.

| Lab | What was built |
| --- | --- |
| Lab 1 | `MealBooking` class, private fields, constructor, methods, arrays |
| Lab 2 | `Student` class connected to `MealBooking` objects |
| Lab 3 | Dining accounts (inheritance), payment for bookings, transaction history |

Files changed or added in Lab 3:

| File | Change |
| --- | --- |
| `DiningAccount.js` | **New** – base class |
| `RewardsDiningAccount.js` | **New** – subclass with reward rate |
| `CreditDiningAccount.js` | **New** – subclass with credit limit |
| `Student.js` | Added `#diningAccount`, `assignDiningAccount()` and a getter |
| `MealBooking.js` | Added `#paymentStatus` and `processPayment()` |
| `DiningApp.js` | Lab 2 code kept; Lab 3 demonstrations added |
| `Lab3Tests.js` | **New** – automatic tests |
| `package.json` | Sets `"type": "module"` so `import`/`export` work |

## 2. How to Run

```bash
node DiningApp.js     # runs the full application
node Lab3Tests.js     # runs the tests
```

Optional syntax check: `node --check DiningApp.js`

## 3. Class Inheritance Hierarchy

```text
DiningAccount            (base class)
├── RewardsDiningAccount (adds #rewardRate, calculateReward(), applyReward())
└── CreditDiningAccount  (adds #creditLimit, overrides payForMeal())
```

`DiningAccount` keeps `#accountNumber`, `#balance` and `#transactions` private. The subclasses use small helper methods (`_adjustBalance`, `_validateAmount`, `_cleanDescription`) to change the balance safely.

## 4. Constructor Chaining

Each subclass constructor calls `super(accountNumber, openingBalance)` first. The base class checks the account number and opening balance and records the opening deposit. The subclass then checks and stores its own field (`rewardRate` or `creditLimit`).

```javascript
constructor(accountNumber, openingBalance = 0, creditLimit = 0) {
    super(accountNumber, openingBalance);
    // check and store creditLimit
}
```

## 5. Method Overriding and Polymorphism

* `CreditDiningAccount.payForMeal()` **overrides** the base version. The base version rejects any payment bigger than the balance; the credit version allows the balance to go below zero, down to the credit limit.
* `displayAccountSummary()` is overridden in both subclasses. Each calls `super.displayAccountSummary()` and then prints its own extra lines.
* **Polymorphism:** `DiningApp.js` stores a `DiningAccount`, a `RewardsDiningAccount` and a `CreditDiningAccount` in one array and calls the same methods in a loop. For a K1,200.00 payment with a K1,000.00 balance, the standard and rewards accounts reject it and the credit account accepts it.
* `MealBooking.processPayment()` has no code for each account type. It only calls `payForMeal()`, and the account object decides the result.

## 6. Simulated Overloading in JavaScript

JavaScript cannot have two methods with the same name and different parameters. A later declaration replaces the earlier one. Default (and optional) parameters give a similar result:

```javascript
constructor(accountNumber, openingBalance = 0)      // new DiningAccount("DA001") or ("DA002", 500)
deposit(amount, description = "Deposit")            // deposit(500) or deposit(500, "Weekly meal allowance")
processPayment(diningAccount = this.#student.diningAccount)
displayTransactionHistory(showDateTime = false)
```

When an argument is left out, JavaScript uses the default value, so one method works with a different number of arguments.

## 7. How Student, MealBooking and DiningAccount Are Connected

```text
Student ──has one──> DiningAccount (or Rewards / Credit subclass)
   │
   └── MealBooking (holds the Student)
           └── processPayment() ──> student's account .payForMeal()
```

1. `student.assignDiningAccount(account)` checks the object with `instanceof DiningAccount`, so subclasses are accepted.
2. `booking.processPayment()` uses the student's account by default.
3. The booking total (`calculateTotal()`) is sent to `payForMeal()`.
4. Payment succeeds: payment status is `Successful` and the booking becomes `Confirmed`.
5. Payment fails: payment status is `Failed` and the booking stays `Pending`.
6. A booking that is already paid or `Confirmed` is rejected and is not charged again.

Every deposit, payment and reward is stored in the account's `#transactions` array with its type, amount, description, date and time, and balance after the transaction.

## 8. Tests Completed and Results

Run with `node Lab3Tests.js`. Result: **16 / 16 passed**.

| # | Test | Result |
| - | ---- | ------ |
| 1 | Standard account payment succeeds with enough funds | PASS |
| 2 | Insufficient standard balance rejected, balance unchanged | PASS |
| 3 | Rewards calculated (K50.00) and applied (K2050.00) | PASS |
| 4 | Credit payment within limit accepted (balance K-500.00) | PASS |
| 5 | Credit limit exceeded rejected | PASS |
| 6 | Polymorphic processing correct for each account type | PASS |
| 7 | Successful booking payment confirms the booking | PASS |
| 8 | Duplicate payment is not charged again | PASS |
| 9 | Failed payment keeps the booking Pending | PASS |
| 10 | Subclasses inherit and use `super()` | PASS |
| 11 | Simulated overloading (constructor and deposit) | PASS |
| 12 | Validation rejects bad values | PASS |
| 13 | Student only accepts DiningAccount objects | PASS |
| 14 | Transaction contains type, amount, description, date, balance | PASS |
| 15 | `getTransactions()` returns a safe copy | PASS |
| 16 | Booking paid by a credit account through the same method | PASS |

`node DiningApp.js` ends with the **Example Final Output** from the lab sheet: Maria Kila, RewardsDiningAccount RA001, opening balance K100.00, Dinner x 2 = K40.00, payment successful, booking confirmed, remaining balance K60.00, and two transactions.

## 9. Database Restriction

No database is used. All data is stored temporarily in JavaScript objects and arrays.

## 10. Use of AI Tools

An AI assistant (Claude by Anthropic) was used to help write and test the Lab 3 code from the lab sheet. `<Confirm this matches the AI use allowed in your unit outline and edit this line if needed.>`
