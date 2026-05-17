<?php

session_start();

header("Content-Type: application/json");

require "db.php";

$data = json_decode(
    file_get_contents("php://input")
);

if(!$data){

    echo json_encode([
        "success" => false
    ]);

    exit;

}

$id = $data->id;

$title = trim($data->title);

$user_id = $_SESSION["user_id"];

$stmt = $conn->prepare(

    "UPDATE tasks
     SET title = ?
     WHERE id = ?
     AND user_id = ?"

);

$stmt->bind_param(
    "sii",
    $title,
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