'use strict';



// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: "Roshan Nadar",
  movements: [500,450,650,-850],
  interestRate: 1.2,
  pin: 5555,
}

const account6 = {
  owner: "Lakshmikanth KS",
  movements: [600,5035,-8052,6500],
  interestRate:1,
  pin: 6666,
}

const accounts = [account1, account2, account3, account4,account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const sortMove = sort ? movements.slice().sort((a, b) => a - b) : movements;

  sortMove.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (names) {
        return names[0];
      })
      .join('');
  });
};

createUsernames(accounts);


const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, val) {
    return acc + val;
  }, 0);
  // console.log(balance);
  labelBalance.textContent = `${acc.balance} €`;
};

const totalDeposit = function (acc) {
  const deposit = acc.movements
    .filter(function (val) {
      return val > 0;
    })
    .reduce(function (acc, val) {
      return acc + val;
    }, 0);
  labelSumIn.textContent = `${deposit}€`;
  // console.log(deposit);

  const withdrawed = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(withdrawed)}€`;

  const interestDisplay = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(val => val > 1)
    .reduce((acc, val) => {
      // console.log(val);
      return acc + val;
    }, 0);

  labelSumInterest.textContent = `${interestDisplay}€`;
  // console.log(interestDisplay);
};

const updateUI = function (acc) {
  //Displaying the transactions
  displayMovements(acc.movements);

  // Displaying balance
  displayBalance(acc);

  // Displaying deposit, withdrawal,intrest
  totalDeposit(acc);
};

let currentUser;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentUser = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  console.log(currentUser);
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    console.log('Login');

    // Welcome board
    labelWelcome.textContent = `Welcome back ,${
      currentUser.owner.split(' ')[0]
    } `;

    //login page visible
    containerApp.style.opacity = 100;

    // Clearing the fields
    inputLoginUsername.value = inputLoginPin.value = '';

    updateUI(currentUser);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentUser.balance >= amount &&
    receiverAcc?.username !== currentUser.username
  ) {
    console.log('Valid');
    currentUser.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentUser);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('closed');
  if (
    inputCloseUsername.value === currentUser.username &&
    Number(inputClosePin.value) === currentUser.pin
  ) {
    const closeAcc = accounts.findIndex(function (acc) {
      return acc.username === inputCloseUsername.value;
    });

    accounts.splice(closeAcc, 1);

    containerApp.style.opacity = 0;

    labelWelcome.textContent = 'Login in to get started';
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const LoanAmount = Number(inputLoanAmount.value);
  console.log(LoanAmount);

  if (LoanAmount < currentUser.balance) {
    currentUser.movements.push(LoanAmount);

    updateUI(currentUser);
  }
});

let sort = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentUser.movements, !sort);
  sort = !sort;
});

// const arr = [10, 20, -50, -60, 85, -70];
// console.log(movements.sort());

// const sort = movements.sort((a, b) => b - a);
// console.log(sort);

const fullName = 'Rachana Varma Jain';
const username = fullName
  .toLowerCase()
  .split(' ')
  .map(function (n) {
    return n[0];
  })
  .join('');
// console.log(username);
// console.log(accounts);



const deposits = movements.filter(function (mov) {
  return mov > 0;
});

// console.log(movements);
// console.log(deposits);

const withdraws = movements.filter(function (mov) {
  return mov < 0;
});

// console.log(withdraws);

const balanceFun = movements.reduce(function (acc, val, i) {
  // console.log(`itiration ${i + 1}: ${acc}`);
  return acc + val;
}, 0);
// console.log(balanceFun);


