<?php

session_start();

header("Content-Type: application/json");

require "db.php";

$data = json_decode(
    file_get_contents("php://input")
);

if(!$data){

    echo json_encode([
        "success" => false,
        "error" => "No data received"
    ]);

    exit;

}

$id = $data->id;

$completed = $data->completed;

$user_id = $_SESSION["user_id"];

$stmt = $conn->prepare(

    "UPDATE tasks
     SET completed = ?
     WHERE id = ?
     AND user_id = ?"

);

$stmt->bind_param(
    "iii",
    $completed,
    $id,
    $user_id
);

if($stmt->execute()){

    echo json_encode([
        "success" => true
    ]);

}else{

    echo json_encode([
        "success" => false
    ]);

}

?>