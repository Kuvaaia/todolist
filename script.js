const input = document.getElementById("task-input");
const button = document.getElementById("add-task-btn");
const list = document.getElementById("task-list");
const filterAll = document.getElementById("filter-all");
const filterActive = document.getElementById("filter-active");
const filterCompleted = document.getElementById("filter-completed");
const taskCounter = document.getElementById("task-counter");

// charger au démarrage
loadTasks();

button.addEventListener("click", function () {
    const taskText = input.value.trim();

    if (taskText === "") return;

    addTask(taskText);
    saveTasks();
    updateTaskCounter();

    input.value = "";
});

// -------- FONCTIONS --------

function addTask(text, completed = false) {
    const li = document.createElement("li");
    li.classList.add("task-item");

    const span = document.createElement("span");
    span.textContent = text;

    if (completed) {
        span.classList.add("completed");
    }

    const completeButton = document.createElement("button");
    completeButton.textContent = "Terminer";
    completeButton.classList.add("complete-btn");

    const undoButton = document.createElement("button");
    undoButton.textContent = "Annuler";
    undoButton.classList.add("undo-btn");
    undoButton.style.display = completed ? "inline-block" : "none";

    if (completed) {
        completeButton.style.display = "none";
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Supprimer";
    deleteButton.classList.add("delete-btn");

    completeButton.addEventListener("click", function () {
        span.classList.add("completed");
        completeButton.style.display = "none";
        undoButton.style.display = "inline-block";
        saveTasks();
        updateTaskCounter();
    });

    undoButton.addEventListener("click", function () {
        span.classList.remove("completed");
        undoButton.style.display = "none";
        completeButton.style.display = "inline-block";
        saveTasks();
        updateTaskCounter();
    });

    deleteButton.addEventListener("click", function () {
        li.remove();
        saveTasks();
        updateTaskCounter();
    });

    li.appendChild(span);
    li.appendChild(completeButton);
    li.appendChild(undoButton);
    li.appendChild(deleteButton);

    list.appendChild(li);
    updateTaskCounter();
}

function saveTasks() {
    const tasks = [];

    document.querySelectorAll(".task-item").forEach(li => {
        const text = li.querySelector("span").textContent;
        const completed = li.querySelector("span").classList.contains("completed");

        tasks.push({ text, completed });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    savedTasks.forEach(task => {
        addTask(task.text, task.completed);
    });
    updateTaskCounter();
}

function setActiveButton(activeBtn) {
    document.querySelectorAll(".filters button").forEach(btn => {
        btn.classList.remove("active");
    });

    activeBtn.classList.add("active");
}

function updateTaskCounter() {
    const tasks = document.querySelectorAll(".task-item");
    const completedTasks = document.querySelectorAll(".task-item span.completed").length;
    const activeTasks = tasks.length - completedTasks;

    taskCounter.textContent = `${activeTasks} à faire · ${completedTasks} terminée(s)`;
}

function filterTasks(filter) {
    const tasks = document.querySelectorAll(".task-item");

    tasks.forEach(li => {
        const span = li.querySelector("span");
        const isCompleted = span.classList.contains("completed");

        if (filter === "all") {
            li.style.display = "flex";
        } else if (filter === "active") {
            li.style.display = isCompleted ? "none" : "flex";
        } else if (filter === "completed") {
            li.style.display = isCompleted ? "flex" : "none";
        }
    });
}

filterAll.addEventListener("click", function () {
    filterTasks("all");
    setActiveButton(filterAll);
});

filterActive.addEventListener("click", function () {
    filterTasks("active");
    setActiveButton(filterActive);
});

filterCompleted.addEventListener("click", function () {
    filterTasks("completed");
    setActiveButton(filterCompleted);
});