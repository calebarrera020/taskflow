<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>TaskFlow</title>

    <link
        rel="stylesheet"
        href="assets/css/style.css"
    >

</head>

<body>

<?php

session_start();

if(!isset($_SESSION["user_id"])){

    header("Location: auth/login.html");

    exit;

}

?>

<div class="container">

    <div class="top-bar">

        <div>

            <h1>TaskFlow</h1>

            <p class="subtitle">
                Manage your daily tasks efficiently
            </p>

        </div>

        <div class="user-box">

            <span>
                👤 <?php echo $_SESSION["username"]; ?>
            </span>

            <button id="themeToggle"> ☀️ Light Mode </button>

            <button onclick="logout()">
                Logout
            </button>

        </div>

    </div>

    <div class="task-form">

        <input
            type="text"
            id="taskInput"
            placeholder="Add a new task..."
        >

        <select id="priorityInput">

            <option value="Low">
                🟢 Low
            </option>

            <option value="Medium">
                🟠 Medium
            </option>

            <option value="High">
                🔴 High
            </option>

        </select>

        <select id="categoryInput">

            <option value="Work">
                💼 Work
            </option>

            <option value="Personal">
                🏠 Personal
            </option>

            <option value="Study">
                📚 Study
            </option>

            <option value="Other">
                ⭐ Other
            </option>

        </select>

        <input
            type="date"
            id="dateInput"
        >

        <button onclick="addTask()">
            Add
        </button>

    </div>

    <div class="filters">

        <button onclick="filterTasks('all')">
            All
        </button>

        <button onclick="filterTasks('pending')">
            Pending
        </button>

        <button onclick="filterTasks('completed')">
            Completed
        </button>

    </div>

    <div class="stats">

        <p id="pendingCount">
            Pending: 0
        </p>

        <p id="completedCount">
            Completed: 0
        </p>

    </div>

    <input
        type="text"
        id="searchInput"
        placeholder="Search tasks..."
        onkeyup="loadTasks()"
    >

    <ul id="taskList"></ul>

</div>

<div id="toast"></div>

<script src="assets/js/app.js"></script>

</body>

</html>