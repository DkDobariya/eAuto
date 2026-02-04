<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

// Connect to MongoDB
require 'vendor/autoload.php'; // make sure you installed mongodb/mongodb via Composer
try {
    $client = new MongoDB\Client("mongodb://localhost:27017");
    $db     = $client->app_eauto; // database
    $cart   = $db->cart;          // collection
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "MongoDB connection failed", "details" => $e->getMessage()]);
    exit;
}

// Decode JSON body
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["error" => "Invalid JSON data"]);
    exit;
}

$product_name = $data['product_name'] ?? '';
$price        = $data['price'] ?? 0;
$image        = $data['image'] ?? '';
$brand        = $data['brand'] ?? '';
$quantity     = 1;

// Check if product already exists in cart
$existing = $cart->findOne(["product_name" => $product_name]);

if ($existing) {
    // Update quantity
    $cart->updateOne(
        ["product_name" => $product_name],
        ['$inc' => ["quantity" => 1]]
    );
    echo json_encode(["message" => "Quantity updated"]);
} else {
    // Insert new product
    $cart->insertOne([
        "product_name" => $product_name,
        "price"        => (float)$price,
        "image"        => $image,
        "brand"        => $brand,
        "quantity"     => $quantity
    ]);
    echo json_encode(["message" => "Product added to cart"]);
}
?>