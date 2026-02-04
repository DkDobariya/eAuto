<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require 'vendor/autoload.php'; // require MongoDB PHP Library (composer require mongodb/mongodb)

try {
    // Connect to MongoDB
    $client = new MongoDB\Client("mongodb://localhost:27017");

    // Select database & collection
    $db = $client->eauto;   // database name (was "eauto" in MySQL)
    $collection = $db->products;

    // Fetch Honda brand products
    $cursor = $collection->find(
        ["main_brand" => "Honda"] // MongoDB filter
    );

    // Convert cursor to array
    $products = iterator_to_array($cursor);

    // Convert ObjectId to string for JSON
    $products = array_map(function($doc) {
        $doc['_id'] = (string)$doc['_id'];
        return $doc;
    }, $products);

    echo json_encode($products);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit();
}
?>