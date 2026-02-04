<?php
// CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000"); // match React dev server
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'vendor/autoload.php'; // MongoDB PHP library

try {
    // Validate product ID
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "No valid product ID provided"
        ]);
        exit();
    }

    $id = $_GET['id']; // Could be MongoDB ObjectId or custom string/number

    // Connect to MongoDB
    $client = new MongoDB\Client("mongodb://localhost:27017");
    $db = $client->app_eauto;
    $productsCollection = $db->products;

    // Try to parse id as ObjectId
    try {
        $objectId = new MongoDB\BSON\ObjectId($id);
        $filter = ['_id' => $objectId];
    } catch (Exception $e) {
        // If not ObjectId, assume plain string or numeric id field
        $filter = ['id' => (int) $id]; 
    }

    // Perform delete
    $result = $productsCollection->deleteOne($filter);

    if ($result->getDeletedCount() > 0) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Product not found or already deleted"
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to delete product",
        "details" => $e->getMessage()
    ]);
}
?>