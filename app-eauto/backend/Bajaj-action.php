<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require 'vendor/autoload.php'; // MongoDB PHP Library

use MongoDB\Client;

try {
    // Connect to MongoDB
    $client = new Client("mongodb://localhost:27017");
    $db = $client->app_eauto;   // database
    $productsCollection = $db->products; // collection
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed."]);
    exit();
}

try {
    // Fetch products where main_brand = "Brand B"
    $cursor = $productsCollection->find(
        ["main_brand" => "Brand B"]
    );

    $products = [];

    foreach ($cursor as $doc) {
        // Convert BSON document to PHP array
        $products[] = [
            "_id" => (string)$doc->_id, // Convert ObjectId to string
            "name" => $doc->name ?? null,
            "price" => $doc->price ?? null,
            "discount" => $doc->discount ?? null,
            "main_brand" => $doc->main_brand ?? null,
            "image" => $doc->image ?? null
        ];
    }

    echo json_encode($products);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Query failed: " . $e->getMessage()]);
}
?>