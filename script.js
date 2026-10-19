const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const filter = document.getElementById("filter");
const sortBtn = document.getElementById("sortBtn");
const loadApiBtn = document.getElementById("loadApiBtn");

let tasks = [];

addBtn.addEventListener("click", addTask);
searchInput.addEventListener("input", displayTasks);
filter.addEventListener("change", displayTasks);
loadApiBtn.addEventListener("click", loadApiTasks);

sortBtn.addEventListener("click", function () {
    tasks.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
    saveTasks();
    displayTasks();
});


function addTask() {
    let taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("გთხოვთ შეიყვანოთ დავალება.");
        return;
    }
    
    let task = {
        name: taskText,
        completed: false,
        date: new Date().toLocaleString("ka-GE")
    };

    tasks.push(task);
    saveTasks();
    displayTasks();
    
    taskInput.value = ""; 
}


function displayTasks() {
    taskList.innerHTML = "";
    
    for (let i = 0; i < tasks.length; i++) {
        
        if (
            searchInput.value !== "" &&
            !tasks[i].name.toLowerCase().includes(searchInput.value.toLowerCase())
        ) {
            continue;
        }
        
        if (filter.value === "completed" && tasks[i].completed === false) {
            continue;
        }
        if (filter.value === "notCompleted" && tasks[i].completed === true) {
            continue;
        }

        let li = document.createElement("li");
        
        if (tasks[i].completed) {
            li.classList.add("completed");
        }

        let title = document.createElement("h3");
        title.textContent = tasks[i].name;

        let date = document.createElement("p");
        date.textContent = "თარიღი: " + tasks[i].date;
        date.style.fontSize = "12px"; 
        date.style.color = "gray";

        let status = document.createElement("p");
        if (tasks[i].completed) {
            status.textContent = "სტატუსი: შესრულებული";
            status.style.color = "gray";
        } else {
            status.textContent = "სტატუსი: შეუსრულებელი";
        }
        status.style.fontSize = "12px";
        
        let button = document.createElement("button");
        button.textContent = "სტატუსის შეცვლა";
        button.className = "btn-status"; 
        button.addEventListener("click", function () {
            changeStatus(i);
        });
        
        let infoDiv = document.createElement("div");
        infoDiv.appendChild(title);
        infoDiv.appendChild(date);
        infoDiv.appendChild(status);

        li.appendChild(infoDiv);
        li.appendChild(button);
        
        taskList.appendChild(li);
    }
}

// სტატუსის შეცვლა
function changeStatus(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    displayTasks();
}

// შენახვა ლოკალ სტორიჯში
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ლოკალ სტორიჯიდან ჩატვირთვა
function loadTasks() {
    let data = localStorage.getItem("tasks");
    if (data) {
        tasks = JSON.parse(data);
        displayTasks();
    }
}

// Fetch API - მონაცემების მიღება
async function loadApiTasks() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
        const data = await response.json();
        
        for (let i = 0; i < data.length; i++) {
            let exists = false;
            
            for (let j = 0; j < tasks.length; j++) {
                if (tasks[j].name === data[i].title) {
                    exists = true;
                }
            }
            
            if (!exists) {
                let task = {
                    name: data[i].title,
                    completed: data[i].completed,
                    date: new Date().toLocaleString("ka-GE")
                };
                tasks.push(task);
            }
        }
        saveTasks();
        displayTasks();
    } catch (error) {
        alert("API-დან მონაცემების მიღება ვერ მოხერხდა.");
        console.log(error);
    }
}

loadTasks();

setInterval(function () {
    console.log("Task Manager აქტიურ რეჟიმშია...");
}, 5000);