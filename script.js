const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const themeButtons = document.querySelectorAll(".theme-btn");
const ding = document.getElementById("ding");

// Load and apply saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.body.className = savedTheme;
}

// Tasks Logic

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render existing tasks
tasks.forEach(task => addTaskToDOM(task.text, task.completed));

// Add new task
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = taskInput.value.trim();
  if (task === "") return;

  const newTask = { text: task, completed: false };
  tasks.push(newTask);
  saveTasks();
  addTaskToDOM(task, false);
  taskInput.value = "";
});

// Add task to DOM
function addTaskToDOM(text, completed) {
  const li = document.createElement("li");
  li.className = "task-item";
  if (completed) li.classList.add("completed");

  const span = document.createElement("span");
  span.textContent = text;

  const btnDiv = document.createElement("div");
  btnDiv.className = "task-btns";

  const doneBtn = document.createElement("button");
  doneBtn.innerHTML = "✅";
  doneBtn.addEventListener("click", () => {
    li.classList.toggle("completed");

    const index = Array.from(taskList.children).indexOf(li);
    tasks[index].completed = !tasks[index].completed;
    saveTasks();

    if (li.classList.contains("completed")) {
      ding.currentTime = 0;
      ding.play();
      launchConfetti();
    }
  });

  const delBtn = document.createElement("button");
  delBtn.innerHTML = "🗑️";
  delBtn.addEventListener("click", () => {
    const index = Array.from(taskList.children).indexOf(li);
    tasks.splice(index, 1);
    saveTasks();
    li.remove();
  });

  btnDiv.appendChild(doneBtn);
  btnDiv.appendChild(delBtn);

  li.appendChild(span);
  li.appendChild(btnDiv);
  taskList.appendChild(li);
}

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Theme Switching

themeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const selectedTheme = btn.dataset.theme;
    document.body.className = selectedTheme;
    localStorage.setItem("theme", selectedTheme);
  });
});


// Confetti

function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#f7d6e0', '#88b04b', '#00b4d8', '#fff', '#ffc8dd'],
  });
}
