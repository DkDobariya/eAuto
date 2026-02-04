<?php
require 'vendor/autoload.php'; // Make sure MongoDB PHP library is installed

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Connect to MongoDB
    $client = new MongoDB\Client("mongodb://localhost:27017");
    $collection = $client->app_eauto->users; // DB: app_eauto, Collection: users
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed"]);
    exit;
}

// Get query params
$search = $_GET['search'] ?? '';
$page = max(1, (int)($_GET['page'] ?? 1));
$per_page = max(1, min(50, (int)($_GET['per_page'] ?? 20)));
$skip = ($page - 1) * $per_page;

try {
    $filter = [];
    if ($search !== '') {
        $filter = [
            '$or' => [
                ['fullname' => ['$regex' => $search, '$options' => 'i']],
                ['email' => ['$regex' => $search, '$options' => 'i']]
            ]
        ];
    }

    // Total count
    $total = $collection->countDocuments($filter);

    // Fetch paginated results
    $cursor = $collection->find(
        $filter,
        [
            'limit' => $per_page,
            'skip' => $skip,
            'sort' => ['_id' => -1] // descending order
        ]
    );

    $users = [];
    foreach ($cursor as $doc) {
        $users[] = [
            'id' => (string)$doc['_id'],
            'fullname' => $doc['fullname'] ?? '',
            'email' => $doc['email'] ?? '',
            'contact' => $doc['contact'] ?? '',
            'birthdate' => $doc['birthdate'] ?? '',
            'gender' => $doc['gender'] ?? ''
        ];
    }

    // JSON response
    echo json_encode([
        'page' => $page,
        'per_page' => $per_page,
        'total' => $total,
        'total_pages' => ceil($total / $per_page),
        'users' => $users
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Failed to fetch users"]);
    exit;
}
?>