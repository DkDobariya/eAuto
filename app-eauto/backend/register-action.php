<?php
// === CORS headers ===
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit(0); // handle preflight
}

// === MongoDB Connection ===
require 'vendor/autoload.php'; // Composer autoload for MongoDB library

try {
    $client = new MongoDB\Client("mongodb://localhost:27017");
    $db = $client->app_eauto;   // database
    $users = $db->users;        // collection
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $e->getMessage()]);
    exit();
}

// === Read JSON input ===
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON input."]);
    exit();
}

$fullname = $data['fullname'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$confirmPassword = $data['confirmPassword'] ?? '';

// === Validation ===
if (!$fullname || !$email || !$password || !$confirmPassword) {
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit();
}

if ($password !== $confirmPassword) {
    echo json_encode(["success" => false, "message" => "Passwords do not match."]);
    exit();
}

// === Check if email already exists ===
$existingUser = $users->findOne(['email' => $email]);
if ($existingUser) {
    echo json_encode(["success" => false, "message" => "Email already registered."]);
    exit();
}

// === Hash password ===
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// === Insert into MongoDB ===
$insertResult = $users->insertOne([
    'fullname' => $fullname,
    'email' => $email,
    'password' => $hashedPassword,
    'created_at' => new MongoDB\BSON\UTCDateTime()
]);

if ($insertResult->getInsertedCount() > 0) {
    echo json_encode(["success" => true, "message" => "Registration successful!"]);
} else {
    echo json_encode(["success" => false, "message" => "Registration failed."]);
}
?>
