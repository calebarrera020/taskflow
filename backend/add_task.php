<?php

session_start();

error_reporting(0);

header("Content-Type: application/json");

include "db.php";

$data = json_decode(file_get_contents("php://input"));

if(!$data){

    echo json_encode([
        "success" => false,
        "error" => "No data received"
    ]);

    exit;

}

$title = trim($data->title);

$priority = trim($data->priority);

$due_date = trim($data->due_date);

$user_id = $_SESSION["user_id"];

$stmt = $conn->prepare("
    INSERT INTO tasks(title, priority, due_date, user_id)
    VALUES(?, ?, ?, ?)
");

$stmt->bind_param(

    "sssi",

    $title,
    $priority,
    $due_date,
    $user_id

);

if($stmt->execute()){

    echo json_encode([
        "success" => true
    ]);

}else{

    echo json_encode([
        "success" => false,
        "error" => $conn->error
    ]);

}
