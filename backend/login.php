<?php

session_start();

ini_set('display_errors', 1);

error_reporting(E_ALL);

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

$username = trim($data->username);

$password = trim($data->password);

$stmt = $conn->prepare("
    SELECT *
    FROM users
    WHERE username = ?
");

if(!$stmt){

    echo json_encode([
        "success" => false,
        "error" => $conn->error
    ]);

    exit;

}

$stmt->bind_param("s", $username);

$stmt->execute();

$result = $stmt->get_result();

if($result->num_rows == 0){

    echo json_encode([
        "success" => false,
        "error" => "Invalid credentials"
    ]);

    exit;

}

$user = $result->fetch_assoc();

if(!password_verify($password, $user["password"])){

    echo json_encode([
        "success" => false,
        "error" => "Invalid credentials"
    ]);

    exit;

}

$_SESSION["user_id"] = $user["id"];

$_SESSION["username"] = $user["username"];

echo json_encode([
    "success" => true
]);
