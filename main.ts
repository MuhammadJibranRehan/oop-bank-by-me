#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";

class BankAccount {
  balance: number = 0;

  deposit(amount: number) {
    this.balance += amount;
  }
  withdraw(amount: number) {
    if (amount <= this.balance) {
      this.balance -= amount;
    } else {
      console.log(chalk.red("\tInsufficient Funds."));
    }
  }
  getBalance() {
    return this.balance;
  }
  setBalance(amount: number) {
    this.balance = amount;
  }
}
class Customer {
  name: string;
  password: string;
  account: BankAccount;

  constructor(name: string, password: string) {
    this.name = name;
    this.password = password;
    this.account = new BankAccount();
  }
}
class Bank {
  customers: Customer[] = [];

  addCustomer(customer: Customer) {
    this.customers.push(customer);
  }
  findCustomer(name: string): Customer | undefined {
    return this.customers.find(customer => customer.name === name);
  }
}
const bank = new Bank();

const predefinedCustomers = [
  {
    name: "hania",
    password: "3434",
    balance: 1000
  },
  {
    name: "madiha",
    password: "2323",
    balance: 2000
  },
];
predefinedCustomers.forEach(({ name, password, balance }) => {
  const customer = new Customer(name, password);
  customer.account.setBalance(balance);
  bank.addCustomer(customer);
});

const programStart = async () => {
  console.log(chalk.yellow.bold("\tWelcome to the virtual bank!"));

  let authenticatedCustomer: Customer | undefined;

  while (!authenticatedCustomer) {
    const authInfo = await inquirer.prompt([
      {
        name: "action",
        type: "list",
        message: "Do you want to log in or sign up?",
        choices: ["Log In", "Sign Up"]
      },
    ]);
    if (authInfo.action === "Log In") {
      const loginInfo = await inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "Please enter your name:",
        },
        {
          name: "password",
          type: "password",
          message: "Please enter your password:",
        },
      ]);

     const customer = bank.findCustomer(loginInfo.name);

            if (customer && customer.password === loginInfo.password) {
                authenticatedCustomer = customer;
                console.log(chalk.green(`\tWelcome back, ${loginInfo.name}`));
            } else {
                console.log(chalk.red('\tInvalid name or password. Please try again.'));
            }
    } else if (authInfo.action === "Sign Up") {
      const signupInfo = await inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "Please enter your name:",
        },
        {
          name: "password",
          type: "password",
          message: "Please create a password:",
        },
        {
          name: "confirmPassword",
          type: "password",
          message: "Please confirm your password:",
        },
      ]);
      if (signupInfo.password !== signupInfo.confirmPassword) {
        console.log(chalk.red("\tPasswords do not match. Please try  again."));
        continue;
      }
      const exitingCustomer = bank.findCustomer(signupInfo.name);
      if (!exitingCustomer) {
        const newCustomer = new Customer(signupInfo.name, signupInfo.password);
        bank.addCustomer(newCustomer);
        authenticatedCustomer = newCustomer;
        console.log(chalk.green(
         `New account created for ${signupInfo.name}`
        ));
      } else {
        console.log(chalk.yellow(
          `\tAn account already exits for ${signupInfo.name}. Please log in.`
        ));
      }
    }
  }
  let continueBanking = true;
  while (continueBanking) {
    const actionInfo = await inquirer.prompt([
      {
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["Check Balance", "Deposit Money", "Withdraw Money", "Exit"],
      },
    ]);
    switch (actionInfo.action) {
      case "Check Balance":
        console.log(chalk.green
(`\tYour current balance is: $${authenticatedCustomer.account.getBalance()}`
        ));
        break;
      case "Deposit Money":
        const depositInfo = await inquirer.prompt([
          {
            name: "amount",
            type: "number",
            message: "Enter the amount to deposit:",
            validate: (input) => input > 0 || "Please enter a positive amount",
          },
        ]);
        authenticatedCustomer.account.deposit(depositInfo.amount);
        console.log(chalk.green(
          `\t$${
            depositInfo.amount
          } has been deposited. New balance: $${authenticatedCustomer.account.getBalance()}`
        ));
        break;
      case "Withdraw Money":
        const withdrawInfo = await inquirer.prompt([
          {
            name: "amount",
            type: "number",
            message: "Enter the amount to withdraw:",
            validate: (input) => input > 0 || "Please enter a positive amount",
          },
        ]);
        authenticatedCustomer.account.withdraw(withdrawInfo.amount);
        console.log(chalk.green(`\t$${
            withdrawInfo.amount
          } has been withdraw. New balance: $${authenticatedCustomer.account.getBalance()}`
        ));
        break;

      case "Exit":
        continueBanking = false;
        console.log(chalk.yellow.bold("\tThank you for banking with us!"));
        break;
    }
  }
};
programStart().catch((error) => {
  console.error(error);
});
