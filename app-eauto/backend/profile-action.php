<?php
// === CORS headers ===
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start session
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Unauthorized. Please log in.'
    ]);
    exit();
}

$userId = $_SESSION['user_id'];

// === MongoDB Connection ===
require 'vendor/autoload.php'; // Composer autoload

try {
    $client = new MongoDB\Client("mongodb://localhost:27017");
    $db = $client->app_eauto;
    $users = $db->users;
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit();
}

// ====== GET: Fetch profile data ======
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user = $users->findOne(
        ['_id' => new MongoDB\BSON\ObjectId($userId)],
        ['projection' => ['fullname' => 1, 'email' => 1, 'contact' => 1, 'birthdate' => 1, 'gender' => 1]]
    );

    if ($user) {
        echo json_encode([
            'status' => 'success',
            'data' => $user
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'User not found.'
        ]);
    }
    exit();
}

// ====== POST: Update profile ======
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $fullname  = trim($data['fullname'] ?? '');
    $email     = trim($data['email'] ?? '');
    $contact   = trim($data['contact'] ?? '');
    $birthdate = trim($data['birthdate'] ?? '');
    $gender    = trim($data['gender'] ?? '');

    // ===== Validation =====
    if (empty($fullname) || empty($email)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Full name and email are required.'
        ]);
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid email format.'
        ]);
        exit();
    }

    if (!empty($birthdate) && !preg_match("/^\d{4}-\d{2}-\d{2}$/", $birthdate)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid birthdate format. Use YYYY-MM-DD.'
        ]);
        exit();
    }

    // ===== Check if email already exists for another user =====
    $existingUser = $users->findOne([
        'email' => $email,
        '_id' => ['$ne' => new MongoDB\BSON\ObjectId($userId)]
    ]);

    if ($existingUser) {
        echo json_encode([
            'status' => 'error',
            'message' => 'This email is already taken by another user.'
        ]);
        exit();
    }

    // ===== Update user profile =====
    $updateResult = $users->updateOne(
        ['_id' => new MongoDB\BSON\ObjectId($userId)],
        ['$set' => [
            'fullname' => $fullname,
            'email'    => $email,
            'contact'  => $contact,
            'birthdate'=> $birthdate,
            'gender'   => $gender
        ]]
    );

    if ($updateResult->getModifiedCount() > 0) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Profile updated successfully.'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'No changes made or update failed.'
        ]);
    }
    exit();
}
?>