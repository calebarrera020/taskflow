<?php

$host = "sql113.infinityfree.com";

$user = "if0_41884737";

$password = "Khalifa503";

$database = "if0_41884737_taskflow";

$conn = new mysqli(
    $host,
    $user,
    $password,
    $database
);

if($conn->connect_error){

    die(
        "Connection failed: "
        . $conn->connect_error
    );

}

?>