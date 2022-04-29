'use strict';

const account1 = {
  owner: 'Matheus Cerozi',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30, 500, 300],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
    '2022-04-14T12:01:20.894Z',
    '2022-04-18T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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


// ============================================================= //

// Returns the timer;

let sec = 10;
const timeFunc = function() {
    const timer = function() {
        const timerMin = String(Math.trunc(sec / 60)).padStart(2, 0);
        const timerSec = String(sec % 60).padStart(2, 0);

        labelTimer.textContent = `${timerMin}:${timerSec}`

        if (sec === 0) {
            containerApp.style.opacity = '0';
            labelWelcome.textContent = `Log in to get started`
            clearInterval(timer)
        }

        sec--;
    }

    timer()
    const startTiming = setInterval(timer, 1000)

    return true;
}


// Returns the formated Date Movement

const formatDate = (acc, date) => {
    const daysPassed = (date1, date2) => {
        return Math.floor((date1 - date2) / (1000 * 60 * 60 * 24))
    }

    const days = daysPassed(new Date(), date)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days > 1 && days <= 7) return `${days} days ago`

    return new Intl.DateTimeFormat(acc.locale).format(date)
}

// Returns the formated cash number

const formatNum = (acc, num) => {
    return new Intl.NumberFormat(acc.locale, {style: 'currency', currency: acc.currency}).format(num)
}

// Creates USERNAME property for each account:

accounts.forEach(acc => {
    acc.username = acc.owner
                .split(' ')
                .map(name => name[0].toLowerCase())
                .join('')
})

// Updates the User Interface

const UpdateUI = function() {
    // Calculates the balance for the current user:

    const balance = currentAcount.movements.reduce((acum, elem) => acum + elem, 0)
    labelBalance.textContent = formatNum(currentAcount, balance);

    // Adds all the transactions into the DIV movement

    containerMovements.innerHTML = ''
    currentAcount.movements.forEach((mov, ind) => {
        const movType = mov > 0 ? 'deposit' : 'withdrawal'
        const movDate = new Date(currentAcount.movementsDates[ind])
        const formattedDate = formatDate(currentAcount, movDate)

        containerMovements.insertAdjacentHTML('afterbegin',
        `<div class="movements__row">
            <div class="movements__type movements__type--${movType}">${ind} ${movType}</div>
            <div class="movements__date">${formattedDate}</div>
            <div class="movements__value">${formatNum(currentAcount, mov)}</div>
        </div>`
        )
    })

    // Calculates the income, outcome and interest...

    const income = currentAcount.movements.filter(elem => elem > 0).reduce((sum, elem) => sum + elem, 0)
    const outcome = currentAcount.movements.filter(elem => elem < 0).reduce((sum, elem) => sum + Math.abs(elem), 0)
    const interest = currentAcount.movements.filter(elem => elem > 0)
                                        .map(elem => elem * (currentAcount.interestRate / 100))
                                        .filter(elem => elem > 1)
                                        .reduce((sum, elem) => sum + elem, 0)

    labelSumIn.textContent = formatNum(currentAcount, income)
    labelSumOut.textContent = formatNum(currentAcount, outcome)
    labelSumInterest.textContent = formatNum(currentAcount, interest)

}

// Declaring the current acount so we can use while transfering and requesting money;
let currentAcount;

// LOGIN

btnLogin.addEventListener('click', function(e) {
    // Don't let the page refresh
    e.preventDefault()

    currentAcount = accounts.find(acc => acc.username === inputLoginUsername.value)
    
    if (currentAcount?.pin === Number(inputLoginPin.value)) {
        /* shows the user interface */
        UpdateUI()

        /* opacity set to 100 so the user can see his bank account */
        containerApp.style.opacity = '100';

        /* changes the welcome label */
        labelWelcome.textContent = `Welcome, ${currentAcount.owner.split(' ')[0]}`

        /* cleans the input */
        inputLoginUsername.value = '';
        inputLoginPin.value = '';
        inputLoginPin.blur()

        /* gets the current date and time and puts in the date label */
        const date = new Intl.DateTimeFormat(navigator.language, {
            'year': "numeric",
            'month': "numeric",
            'day': "numeric"
        }).format(new Date())
        const time = new Intl.DateTimeFormat(navigator.language, {
            'hour': "numeric",
            'minute': "numeric",
        }).format(new Date())
        labelDate.textContent = `${date}, ${time}`

        /* start counting */
        
    } 
})

// >>> User activities <<<
    // 1. Money transfer;

btnTransfer.addEventListener('click', function(e) {
    e.preventDefault()

    const receiver = accounts.find(acc => acc.username === inputTransferTo.value);
    const amount = Number(Number(inputTransferAmount.value).toFixed(2));

    // Validation
    if (receiver && receiver !== currentAcount 
        && amount <= currentAcount.movements.reduce((sum, elem) => sum + elem, 0)
        && amount > 0) {
            /* adds the movment to the current user arrays */
            currentAcount.movements.push(-amount);
            currentAcount.movementsDates.push(new Date().toISOString())
            /* adds the movment to the receiver user arrays */
            receiver.movements.push(amount)
            receiver.movementsDates.push(new Date().toISOString())

            /* clears the input */
            inputTransferTo.value = '';
            inputTransferAmount.value = '';

            /* updates user interface */
            UpdateUI()
        } 
})

    // 2. request loan;

btnLoan.addEventListener('click', function(e) {
    e.preventDefault()

    const loanAmount = Number(Number(inputLoanAmount.value).toFixed(2))

    if (currentAcount.movements.some(mov => mov * 10 >= loanAmount)) {
        /* pushs the amount into to the users arrays */
        currentAcount.movements.push(loanAmount);
        currentAcount.movementsDates.push(new Date().toISOString())
        /* updates the user interface */
        UpdateUI()
    } 
})

     // 3. delete account;

btnClose.addEventListener('click', function(e) {
    e.preventDefault()

    const accToClose = accounts.find(acc => acc.username === inputCloseUsername.value)

    if (accToClose === currentAcount && Number(inputClosePin.value) === currentAcount.pin) {

        /* takes the current account from the accounts array */
        accounts.splice(accounts.findIndex(acc => acc.username === inputCloseUsername.value), 1);
        containerApp.style.opacity = '0';
    }
})