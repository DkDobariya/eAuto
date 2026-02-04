<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require 'vendor/autoload.php'; // MongoDB PHP Library (composer require mongodb/mongodb)

try {
    // Connect to MongoDB
    $client = new MongoDB\Client("mongodb://localhost:27017");

    // Select database & collection
    $db = $client->app_eauto; 
    $collection = $db->products;

    // Fetch Hero brand products
    $cursor = $collection->find(
        ["main_brand" => "Hero"] // equivalent to WHERE main_brand = 'Hero'
    );

    // Convert cursor to array
    $products = iterator_to_array($cursor);

    // Ensure proper JSON encoding (MongoDB\BSON\ObjectId → string)
    $products = array_map(function($doc) {
        $doc['_id'] = (string)$doc['_id']; // convert ObjectId to string
        return $doc;
    }, $products);

    echo json_encode($products);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit();
}
?>