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

    const pendingTasks = tasks.filter(
        task => task.completed == 0
    );

    const completedTasks = tasks.filter(
        task => task.completed == 1
    );

    pendingCount.innerText =
        `Pending: ${pendingTasks.length}`;

    completedCount.innerText =
        `Completed: ${completedTasks.length}`;

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

        li.innerHTML = `

            <div class="task-info">

                <div
                    class="task-title
                    ${task.completed == 1 ? "completed" : ""}"
                    onclick="toggleTask(${task.id}, ${task.completed})"
                >

                    ${task.completed == 1 ? "✅" : "📌"}
                    ${task.title}

                </div>

                <div class="task-details">

                    <span
                        class="priority"
                        style="
                            background:
                            ${task.priority == 'High'
                                ? '#ef4444'
                                : task.priority == 'Medium'
                                ? '#f59e0b'
                                : '#22c55e'
                            };
                        "
                    >
                        ${task.priority || 'Low'}
                    </span>

                    <span class="date">

                        📅 ${task.due_date || 'No date'}

                    </span>

                    <span class="category">

                        🗂️ ${task.category || 'Other'}

                    </span>

                </div>

            </div>

            <div class="task-actions">

                <button
                    class="edit-btn"
                    onclick='editTask(${task.id}, ${JSON.stringify(task.title)})'
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>

        `;

        taskList.appendChild(li);

    });

}

async function addTask(){

    const input =
        document.getElementById("taskInput");

    const priorityInput =
        document.getElementById("priorityInput");

    const categoryInput =
        document.getElementById("categoryInput");

    const dateInput =
        document.getElementById("dateInput");

    if(input.value.trim() === ""){

        showToast("Write a task first");

        return;

    }

    const response = await fetch(
        API + "add_task.php",
        {

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

        }
    );

    const data = await response.json();

    if(data.success){

        input.value = "";

        dateInput.value = "";

        priorityInput.value = "Low";

        categoryInput.value = "Other";

        loadTasks();

        showToast(
            "Task added successfully"
        );

    }

}

async function deleteTask(id){

    const response = await fetch(
        API + "delete_task.php",
        {

            method:"POST",

            body: JSON.stringify({
                id:id
            })

        }
    );

    const data = await response.json();

    if(data.success){

        loadTasks();

        showToast("Task deleted");

    }

}

async function toggleTask(id, completed){

    const response = await fetch(
        API + "toggle_task.php",
        {

            method:"POST",

            body: JSON.stringify({

                id:id,

                completed:
                    completed == 1 ? 0 : 1

            })

        }
    );

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

    if(
        newTitle === null ||
        newTitle.trim() === ""
    ){

        return;

    }

    const response = await fetch(
        API + "update_task.php",
        {

            method:"POST",

            body: JSON.stringify({

                id:id,

                title:newTitle

            })

        }
    );

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

    window.location.href =
        "backend/logout.php";

}

const themeToggle =
    document.getElementById(
        "themeToggle"
    );

themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );

        if(
            document.body.classList.contains(
                "dark-mode"
            )
        ){

            localStorage.setItem(
                "theme",
                "dark"
            );

        }else{

            localStorage.setItem(
                "theme",
                "light"
            );

        }

    }
);

window.addEventListener(
    "load",
    () => {

        const savedTheme =
            localStorage.getItem("theme");

        if(savedTheme === "dark"){

            document.body.classList.add(
                "dark-mode"
            );

        }

    }
);

loadTasks();