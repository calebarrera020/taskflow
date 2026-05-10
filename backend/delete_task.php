<?php

include "config.php";

$data = json_decode(file_get_contents("php://input"));

$id = $data->id;

$stmt = $conn->prepare("DELETE FROM tasks WHERE id = ?");

$stmt->bind_param("i", $id);

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