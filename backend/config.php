<?php

$host = "localhost";
$user = "root";
$password = "";
$database = "taskflow";

$conn = new mysqli(
    $host,
    $user,
    $password,
    $database
);

if($conn->connect_error){

    die(json_encode([
        "success" => false,
        "error" => "Database connection failed"
    ]));

}

?>