const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("money-plus");
const moneyMinus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

// const dummyTransactions = [
//   { id: 1, text: "Flower", amount: -20 },
//   { id: 2, text: "Salary", amount: 300 },
//   { id: 3, text: "Book", amount: -10 },
//   { id: 4, text: "Camera", amount: 150 },
// ];

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

//add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add a text and amount.");
  } else {
    const transaction = {
      id: generateId(),
      text: text.value,
      amount: Number(amount.value),
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();

    updateLocalStorage();

    text.value = "";
    amount.value = "";
  }
}

//generate random id
function generateId() {
  return Math.floor(Math.random() * 100000000);
}

//add transactions to DOM list
function addTransactionDOM(transaction) {
  //get sign
  const sign = transaction.amount < 0 ? "-" : "+";

  const item = document.createElement("li");

  //add class based on value
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
  ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class = "delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>
  
  `;

  list.appendChild(item);
}

//update the balance, income, and expense
function updateValues() {
  const amounts = transactions.map((trans) => {
    return trans.amount;
  });

  const total = amounts
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0)
    .toFixed(2);

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0)
    .toFixed(2);

  const expense = amounts
    .filter((item) => item < 0)
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0)
    .toFixed(2);

  balance.innerHTML = `$${total}`;
  moneyPlus.innerText = `$${income}`;
  moneyMinus.innerText = `$${(expense * -1).toFixed(2)}`;
}

function removeTransaction(id) {
  transactions = transactions.filter((trans) => trans.id !== id);
  updateLocalStorage();
  init();
}

//update local storage transactions
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

//Init app
function init() {
  list.innerHTML = "";

  transactions.forEach((item) => addTransactionDOM(item));
  updateValues();
}

init();

//event listeners

form.addEventListener("submit", addTransaction);
