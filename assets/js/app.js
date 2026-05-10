const API = "backend/";

let currentFilter = "all";

function showToast(message){

    const toast = document.getElementById("toast");

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}

async function loadTasks(){

    const response = await fetch(API + "get_tasks.php");

    const tasks = await response.json();

    const taskList = document.getElementById("taskList");

    const pendingCount = document.getElementById("pendingCount");

    const completedCount = document.getElementById("completedCount");

    const searchInput = document.getElementById("searchInput");

    const searchText = searchInput.value.toLowerCase();

    taskList.innerHTML = "";

    const pendingTasks = tasks.filter(task => task.completed == 0);

    const completedTasks = tasks.filter(task => task.completed == 1);

    pendingCount.innerText = `Pending: ${pendingTasks.length}`;

    completedCount.innerText = `Completed: ${completedTasks.length}`;

    const filteredTasks = tasks.filter(task => {

        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchText);

        if(!matchesSearch){

            return false;

        }

        if(currentFilter === "pending"){

            return task.completed == 0;

        }

        if(currentFilter === "completed"){

            return task.completed == 1;

        }

        return true;

    });

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.classList.add("task");

        if(task.completed == 1){

            li.classList.add("completed-task");

        }

        li.innerHTML = `

            <div style="flex:1;">

                <div
                    class="task-title"
                    onclick="toggleTask(${task.id}, ${task.completed})"
                    style="
                        cursor:pointer;
                        font-size:18px;
                        font-weight:bold;
                        margin-bottom:8px;
                        color:white;
                    "
                >

                    ${task.completed == 1 ? "✅ " : "📌 "}
                    ${task.title}

                </div>

                <div
                    style="
                        display:flex;
                        gap:15px;
                        align-items:center;
                        flex-wrap:wrap;
                        font-size:14px;
                    "
                >

                    <span
                        style="
                            padding:5px 10px;
                            border-radius:8px;
                            background:
                            ${task.priority == 'High'
                                ? '#ef4444'
                                : task.priority == 'Medium'
                                ? '#f59e0b'
                                : '#22c55e'
                            };
                            color:white;
                            font-weight:bold;
                        "
                    >
                        ${task.priority || 'Low'}
                    </span>

                    <span style="color:#cbd5e1;">

                        📅 ${task.due_date || 'No date'}

                    </span>

                    <span style="color:#94a3b8;">

                        🗂️ ${task.category || 'Other'}

                    </span>

                </div>

            </div>

            <div style="display:flex; gap:10px;">

                <button onclick='editTask(${task.id}, ${JSON.stringify(task.title)})'>
                    Edit
                </button>

                <button onclick="deleteTask(${task.id})">
                    Delete
                </button>

            </div>

        `;

        taskList.appendChild(li);

    });

}

async function addTask(){

    const input = document.getElementById("taskInput");

    const priorityInput = document.getElementById("priorityInput");

    const categoryInput = document.getElementById("categoryInput");

    const dateInput = document.getElementById("dateInput");

    if(input.value.trim() === ""){

        showToast("Write a task first");

        return;

    }

    const response = await fetch(API + "add_task.php", {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({

            title: input.value,

            priority: priorityInput.value,

            category: categoryInput.value,

            due_date: dateInput.value

        })

    });

    const data = await response.json();

    if(data.success){

        input.value = "";

        dateInput.value = "";

        priorityInput.value = "Low";

        categoryInput.value = "Other";

        loadTasks();

        showToast("Task added successfully");

    }

}

async function deleteTask(id){

    const response = await fetch(API + "delete_task.php", {

        method:"POST",

        body: JSON.stringify({
            id:id
        })

    });

    const data = await response.json();

    if(data.success){

        loadTasks();

        showToast("Task deleted");

    }

}

async function toggleTask(id, completed){

    const response = await fetch(API + "toggle_task.php", {

        method:"POST",

        body: JSON.stringify({

            id:id,

            completed: completed == 1 ? 0 : 1

        })

    });

    const data = await response.json();

    if(data.success){

        loadTasks();

        showToast("Task updated");

    }

}

async function editTask(id, currentTitle){

    const newTitle = prompt(
        "Edit task:",
        currentTitle
    );

    if(newTitle === null || newTitle.trim() === ""){

        return;

    }

    const response = await fetch(API + "update_task.php", {

        method:"POST",

        body: JSON.stringify({

            id:id,

            title:newTitle

        })

    });

    const data = await response.json();

    if(data.success){

        loadTasks();

        showToast("Task edited");

    }

}

function filterTasks(filter){

    currentFilter = filter;

    loadTasks();

}

function logout(){

    window.location.href = "backend/logout.php";

}

const themeToggle = document.getElementById("themeToggle");

if(themeToggle){

    if(localStorage.getItem("theme") === "light"){

        document.body.classList.add("light-mode");

        themeToggle.innerText = "🌙 Dark Mode";

    }else{

        themeToggle.innerText = "☀️ Light Mode";

    }

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

        if(document.body.classList.contains("light-mode")){

            localStorage.setItem("theme", "light");

            themeToggle.innerText = "🌙 Dark Mode";

        }else{

            localStorage.setItem("theme", "dark");

            themeToggle.innerText = "☀️ Light Mode";

        }

    });

}

loadTasks();