<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require 'vendor/autoload.php'; // Load MongoDB library

use MongoDB\Client;

try {
    // Connect to MongoDB
    $client = new Client("mongodb://localhost:27017");
    $db = $client->app_eauto;
    $admins = $db->admins;
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

// Read input
$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input['email'], $input['password'])) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit;
}

$email = trim($input['email']);
$pass = $input['password'];

// Check if email exists
$existingAdmin = $admins->findOne(["email" => $email]);

if ($existingAdmin) {
    echo json_encode(["success" => false, "message" => "Email already registered"]);
    exit;
}

if (strlen($pass) < 6) {
    echo json_encode(["success" => false, "message" => "Password too short"]);
    exit;
}

// Hash password
$passHash = password_hash($pass, PASSWORD_DEFAULT);

try {
    // Insert admin
    $result = $admins->insertOne([
        "email" => $email,
        "password" => $passHash,
        "created_at" => new MongoDB\BSON\UTCDateTime()
    ]);

    if ($result->getInsertedCount() > 0) {
        echo json_encode(["success" => true, "message" => "Admin user created"]);
    } else {
        echo json_encode(["success" => false, "message" => "Insert failed"]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>