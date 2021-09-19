'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const dogsJulia1 = [3, 5, 2, 12, 7];
// const dogsJulia2 = [9, 16, 6, 8, 3];
// const dogsKate1 = [4, 1, 15, 8, 3];
// const dogsKate2 = [10, 5, 6, 1, 4];

// const checkDogs = function (dogsJulia, dogsKate) {
//   const crctDogsJulia = dogsJulia.slice(1, -2);
//   const joinArray = dogsKate.concat(crctDogsJulia);
//   joinArray.forEach(function (dogAge, i) {
//     if (dogAge >= 3) {
//       console.log(
//         `Dog number ${i + 1} is an adult, and is ${dogAge} years old`
//       );
//     } else if (dogAge < 3) {
//       console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//     }
//   });
// };

// checkDogs(dogsJulia1, dogsKate1);

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

const accounts = [account1, account2, account3, account4];

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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
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

// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

const dogAge1 = [5, 2, 4, 1, 15, 8, 3];
const dogAge2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function (ages) {
  const humanAge = ages.map(function (dogAge) {
    if (dogAge <= 2) {
      return 2 * dogAge;
    } else if (dogAge > 2) {
      return 16 + dogAge * 4;
    }
    return humanAge;
  });
  // console.log(humanAge);

  const aboveAgeDogs = humanAge.filter(function (dogAge) {
    return dogAge > 18;
  });
  // console.log(aboveAgeDogs);

  const avgAge =
    aboveAgeDogs.reduce(function (acc, dogAge, i) {
      // console.log(`${i + 1}`);
      return acc + dogAge;
    }, 0) / aboveAgeDogs.length;
  return avgAge;
};

// console.log(calcAverageHumanAge(dogAge1));
