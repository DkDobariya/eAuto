<?php
// === CORS Headers ===
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// === Preflight ===
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// === Session Configuration ===
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => 'localhost',
    'secure' => false,          // true if using HTTPS
    'httponly' => true,
    'samesite' => 'None'        // use 'Lax' if not cross-site
]);
session_start();

// === MongoDB Connection ===
require 'vendor/autoload.php';  // make sure you installed mongodb via composer: composer require mongodb/mongodb

try {
    $client = new MongoDB\Client("mongodb://localhost:27017");
    $db = $client->app_eauto;  // database
    $users = $db->users;       // collection
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

// === GET: Check Login Status ===
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_SESSION['user'])) {
        echo json_encode([
            'status' => 'success',
            'user' => $_SESSION['user']
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    }
    exit();
}

// === POST: Handle Login ===
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // JSON or Form Data
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (!$email || !$password) {
        $data = json_decode(file_get_contents("php://input"), true);
        $email = trim($data['email'] ?? '');
        $password = trim($data['password'] ?? '');
    }

    // Validate fields
    if (empty($email) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Email and password are required']);
        exit();
    }

    // Find user in MongoDB
    $user = $users->findOne(['email' => $email]);

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = (string) $user['_id'];
        $_SESSION['user'] = [
            'id' => (string) $user['_id'],
            'fullname' => $user['fullname'],
            'email' => $user['email']
        ];

        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful',
            'user' => $_SESSION['user']
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email or password']);
    }
}
?>