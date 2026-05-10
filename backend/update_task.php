<?php

include "config.php";

$data = json_decode(file_get_contents("php://input"));

$id = $data->id;

$title = $data->title;

$stmt = $conn->prepare("
    UPDATE tasks 
    SET title = ?
    WHERE id = ?
");

$stmt->bind_param("si", $title, $id);

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