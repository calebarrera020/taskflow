<?php

session_start();

header("Content-Type: application/json");

require "db.php";

$data = json_decode(
    file_get_contents("php://input"),
    true
);

if(!$data){

    echo json_encode([
        "success" => false,
        "error" => "No data received"
    ]);

    exit;
}

$title = trim($data["title"] ?? "");

$priority = $data["priority"] ?? "Medium";

$category = $data["category"] ?? "Other";

$due_date = $data["due_date"] ?? null;

$user_id = $_SESSION["user_id"] ?? null;

if(!$user_id){

    echo json_encode([
        "success" => false,
        "error" => "User not logged"
    ]);

    exit;
}

$stmt = $conn->prepare(
    "INSERT INTO tasks
    (title, priority, category, due_date, user_id)
    VALUES (?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "ssssi",
    $title,
    $priority,
    $category,
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
        "error" => $stmt->error
    ]);
}
?>