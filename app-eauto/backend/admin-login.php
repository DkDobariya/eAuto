<?php
require 'vendor/autoload.php'; // Ensure you installed: composer require mongodb/mongodb

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Change "*" to your domain in production
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Connect to MongoDB
try {
    $client = new MongoDB\Client("mongodb://localhost:27017");
    $db = $client->app_eauto; // same DB name as MySQL
    $adminsCollection = $db->admins;
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "MongoDB connection failed: " . $e->getMessage()
    ]);
    exit;
}

// Get JSON input from POST body
$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input['email']) || !isset($input['password'])) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid input."
    ]);
    exit;
}

$email = trim($input['email']);
$password = $input['password'];

try {
    // Find admin by email
    $admin = $adminsCollection->findOne(["email" => $email]);

    if (!$admin) {
        echo json_encode([
            "success" => false,
            "message" => "Admin with this email not found."
        ]);
        exit;
    }

    // Verify password (stored as hashed password)
    if (password_verify($password, $admin['password'])) {
        echo json_encode([
            "success" => true,
            "admin_email" => $admin['email'],
            "message" => "Login successful."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Incorrect password."
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Query error: " . $e->getMessage()
    ]);
    exit;
}
?>