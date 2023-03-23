/* - - - - - - - - - - - - - - - - - - - - - - - - - */
/* - - - - - - - - - - VARIABLES - - - - - - - - - - */
/* - - - - - - - - - - - - - - - - - - - - - - - - - */

// Timer switch
let begin;

// Pomodoro & Break option reference variables.
const pomo = document.getElementById("pomo");
const rest = document.getElementById("break");

// Start & Pause button reference variables.
let start = document.getElementById("start");
let pause = document.getElementById("pause");

// Minutes & Seconds display reference variables.
let minDisplay = document.getElementById("minutes");
let secDisplay = document.getElementById("seconds");

// Display time values from Local Storage or default time on page load.
minDisplay.innerHTML = localStorage.getItem("minutes") || 25;
secDisplay.innerHTML = localStorage.getItem("seconds") || "00";


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* - - - - - - - - - - TIMER SETTINGS - - - - - - - - - - */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

// Default to Pomodoro timer on initial page load.
// Otherwise, keep selected Pomodoro/Break timer option on reload.
window.onload = () => {
    if (localStorage.getItem("timer") == "break") {
        selectOption("break");
    } else {
        selectOption("pomo");
    }
}

// Create Pomodoro & Break settings buttons
const timerOption = document.querySelectorAll("p.option")
timerOption.forEach(option => {
    option.addEventListener("click", e => {
        const optionID = e.target.id;   // Clicked selection reference variable.
        selectOption(optionID);         // Apply Pomodoro/Break timer setting.
        stopTimer();                    // Stop timer upon selection.
    });
});

// Apply classes to Pomodoro/Break selection and change timer values.
function selectOption(optionID) {
    if (optionID == "pomo") {   
        // Pomodoro selected
        localStorage.setItem("minutes", 25);    // 25 min Pomodoro value.
        localStorage.setItem("timer", "pomo");  // Set Pomodoro Timer
        rest.classList.remove("selected");
        pomo.classList.remove("not-selected");
        pomo.classList.add("selected");
        rest.classList.add("not-selected");
    } else {
        // Break selected
        localStorage.setItem("minutes", 5);     // 5 min Break value.
        localStorage.setItem("timer", "break"); // Set Break Timer
        pomo.classList.remove("selected");
        rest.classList.remove("not-selected");
        rest.classList.add("selected");
        pomo.classList.add("not-selected");
    }

    localStorage.setItem("seconds", "00");  // Seconds will always default to "00".
    secDisplay.innerHTML = localStorage.getItem("seconds"); // Display seconds.
    minDisplay.innerHTML = localStorage.getItem("minutes"); // Display minutes.

    start.classList.remove("hidden");   // Show start button.
    pause.classList.add("hidden");      // Hide pause button.
}

// Start Button
start.addEventListener("click", () => {
    if (begin === undefined) {
        start.classList.add("hidden");      // Hide Start button.
        pause.classList.remove("hidden");   // Show Pause button.
        begin = setInterval(timer, 1000);   // Run timer (1000 = 1s).
    }
});

// Pause Button
pause.addEventListener("click", () => {
    pause.classList.add("hidden");      // Hide Pause button.
    start.classList.remove("hidden");   // Show Start button.
    stopTimer();    // Stop timer.
});

// Run Timer Function
async function timer() {
    // Get stored minutes & seconds values.
    // Otherwise, default to 25:00.
    let minutes = localStorage.getItem("minutes") || 25;
    let seconds = localStorage.getItem("seconds") || "00";

    if (seconds != 0) {
        // Decrement seconds while > 0.
        seconds--;
        localStorage.setItem("seconds", seconds);
    } else if (minutes != 0 && seconds == 0) {
        // When seconds reach 0, if minutes is not 0...
        // ...decrement minutes and reset seconds to 59.
        minutes--;
        seconds = 59;
        localStorage.setItem("minutes", minutes);
        localStorage.setItem("seconds", seconds);
    } else {
        // Set timer to 00:00 once finished.
        localStorage.setItem("minutes", "00");
        localStorage.setItem("seconds", "00");
    }

    // Display minutes & seconds.
    minDisplay.innerHTML = minutes;
    secDisplay.innerHTML = seconds;

    // console.log(minutes);
    // console.log(seconds);
}

// Stop Timer Function
async function stopTimer() {
    clearInterval(begin);
    begin = undefined;
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - */
/* - - - - - - - - - - TASK LIST - - - - - - - - - - */
/* - - - - - - - - - - - - - - - - - - - - - - - - - */

const deleteBtn = document.querySelectorAll(".fa-check");
const todoItem = document.querySelectorAll("span.not");
const todoComplete = document.querySelectorAll("span.completed");

Array.from(deleteBtn).forEach(e => e.addEventListener("click", deleteTodo));
Array.from(todoItem).forEach(e => e.addEventListener("click", markComplete));
Array.from(todoComplete).forEach(e => e.addEventListener("click", markIncomplete));

async function deleteTodo() {
    const todoId = this.parentNode.dataset.id;
    try {
        const response = await fetch("todos/deleteTodo", {
            method: "delete",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ "todoIdFromJSFile": todoId })
        });
        const data = await response.json();
        console.log(data);
        location.reload();
    } catch(err) { console.log(err); }
}

async function markComplete() {
    const todoId = this.parentNode.dataset.id;
    try {
        const response = await fetch("todos/markComplete", {
            method: "put",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ "todoIdFromJSFile": todoId })
        });
        const data = await response.json();
        console.log(data);
        location.reload();
    } catch(err) { console.log(err); }
}

async function markIncomplete() {
    const todoId = this.parentNode.dataset.id;
    try {
        const response = await fetch("todos/markIncomplete", {
            method: "put",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ "todoIdFromJSFile": todoId })
        });
        const data = await response.json();
        console.log(data);
        location.reload();
    } catch(err) { console.log(err); }
}
