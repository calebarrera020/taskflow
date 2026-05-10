<?php

error_reporting(0);

header("Content-Type: application/json");

include "db.php";

$data = json_decode(file_get_contents("php://input"));

$username = trim($data->username);

$password = trim($data->password);

if($username == "" || $password == ""){

    echo json_encode([
        "success" => false,
        "error" => "Complete all fields"
    ]);

    exit;

}

$check = $conn->prepare("
    SELECT id
    FROM users
    WHERE username = ?
");

$check->bind_param("s", $username);

$check->execute();

$result = $check->get_result();

if($result->num_rows > 0){

    echo json_encode([
        "success" => false,
        "error" => "Username already exists"
    ]);

    exit;

}

$hashedPassword = password_hash(
    $password,
    PASSWORD_DEFAULT
);

$stmt = $conn->prepare("
    INSERT INTO users(username, password)
    VALUES(?, ?)
");

$stmt->bind_param(
    "ss",
    $username,
    $hashedPassword
);

if($stmt->execute()){

    echo json_encode([
        "success" => true
    ]);

}else{

    echo json_encode([
        "success" => false,
        "error" => "Register failed"
    ]);

}