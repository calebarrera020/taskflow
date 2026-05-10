<?php

include "config.php";

$data = json_decode(file_get_contents("php://input"));

$id = $data->id;

$completed = $data->completed;

$stmt = $conn->prepare("
    UPDATE tasks 
    SET completed = ?
    WHERE id = ?
");

$stmt->bind_param("ii", $completed, $id);

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