// Task Manager
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentTaskIndex = null;
let selectedTaskName = null;

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task.title;
    if (task.completed) li.classList.add("completed");

    const buttonsDiv = document.createElement("div");

    // Start Pomodoro
    const pomodoroBtn = document.createElement("button");
    pomodoroBtn.textContent = "⏱️ Start Pomodoro";
    pomodoroBtn.onclick = () => selectTaskForPomodoro(index);
    buttonsDiv.appendChild(pomodoroBtn);

    // Delete Task
    const del = document.createElement("button");
    del.textContent = "🗑️";
    del.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };
    buttonsDiv.appendChild(del);

    li.appendChild(buttonsDiv);
    taskList.appendChild(li);
  });
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newTask = taskInput.value.trim();
  if (newTask) {
    tasks.push({ title: newTask, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = "";
  }
});

renderTasks();

// Pomodoro Timer
let time = 25 * 60;
let timerInterval = null;
let isPaused = false;

function updateTimerDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  document.getElementById("timer").textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function selectTaskForPomodoro(index) {
  currentTaskIndex = index;
  selectedTaskName = tasks[index].title;
  document.getElementById("current-task-label").textContent = `🎯 Focused Task: ${selectedTaskName}`;
  resetTimer(); // Optional: reset timer when a new task is selected
}

function startTimer() {
  if (!selectedTaskName) {
    alert("Please select a task for Pomodoro first.");
    return;
  }
  if (timerInterval || isPaused) return;

  timerInterval = setInterval(() => {
    time--;
    updateTimerDisplay();
    if (time <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      document.getElementById("alarm").play();
      markTaskCompleted();
      incrementStreak();
      time = 25 * 60;
      updateTimerDisplay();
      selectedTaskName = null;
      currentTaskIndex = null;
      document.getElementById("current-task-label").textContent = "🎯 No task selected";
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isPaused = true;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  time = 25 * 60;
  isPaused = false;
  updateTimerDisplay();
}

function markTaskCompleted() {
  if (currentTaskIndex !== null && tasks[currentTaskIndex]) {
    tasks[currentTaskIndex].completed = true;
    saveTasks();
    renderTasks();
  }
}

updateTimerDisplay();

// Streak Tracker
function incrementStreak() {
  const today = new Date().toISOString().slice(0, 10);
  const streaks = JSON.parse(localStorage.getItem("streaks")) || {};
  streaks[today] = (streaks[today] || 0) + 1;
  localStorage.setItem("streaks", JSON.stringify(streaks));
  document.getElementById("streak-count").textContent = streaks[today];
}

function loadTodayStreak() {
  const today = new Date().toISOString().slice(0, 10);
  const streaks = JSON.parse(localStorage.getItem("streaks")) || {};
  document.getElementById("streak-count").textContent = streaks[today] || 0;
}

loadTodayStreak();

