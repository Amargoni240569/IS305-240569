/*
---------------------------------------------------------
Program : Dining Meal Booking Feature
Student Name : Abel M. WAMANIMBO
Student ID : 240569
Date : 28 September 2026
Description :
IS305 Object Oriented Programming: RewardsDiningAccount
class that inherits from DiningAccount for Lab 3.
---------------------------------------------------------
*/

// Import the base class
import DiningAccount from "./DiningAccount.js";

// RewardsDiningAccount inherits from DiningAccount
class RewardsDiningAccount extends DiningAccount {

    // Private field
    #rewardRate;

    // Constructor chaining: super() sets up the base account
    constructor(accountNumber, openingBalance = 0, rewardRate = 0) {

        super(accountNumber, openingBalance);

        // Check the reward rate (a percentage from 0 to 100)
        if (
            typeof rewardRate !== "number" ||
            !Number.isFinite(rewardRate) ||
            rewardRate < 0 ||
            rewardRate > 100
        ) {
            throw new Error("Reward rate must be between 0 and 100.");
        }

        this.#rewardRate = rewardRate;
    }

    // Getter for reward rate
    get rewardRate() {
        return this.#rewardRate;
    }

    // Reward = current balance x reward rate / 100
    calculateReward() {
        return DiningAccount.roundMoney(this.getBalance() * this.#rewardRate / 100);
    }

    // Add the reward to the account and record the transaction
    applyReward() {

        const reward = this.calculateReward();

        if (reward > 0) {
            this._adjustBalance(
                reward,
                "Reward",
                "Reward bonus at " + this.#rewardRate + "%"
            );
        }

        return reward;
    }

    // Override: show the base summary and the reward rate
    displayAccountSummary() {
        super.displayAccountSummary();
        console.log("Reward Rate: " + this.#rewardRate + "%");
    }
}

// Export RewardsDiningAccount class
export default RewardsDiningAccount;
