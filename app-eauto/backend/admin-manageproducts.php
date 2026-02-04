<?php
require 'vendor/autoload.php'; // Composer autoload

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// MongoDB connection
try {
    $client = new MongoDB\Client("mongodb://localhost:27017");
    $db = $client->app_eauto; // Database name
    $collection = $db->products; // Collection name
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "MongoDB connection failed: " . $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// ---------- GET PRODUCTS ----------
if ($method === "GET") {
    try {
        $cursor = $collection->find([], ['sort' => ['_id' => -1]]);
        $products = [];

        foreach ($cursor as $doc) {
            $products[] = [
                "id" => (string)$doc["_id"], // Mongo uses ObjectId
                "name" => $doc["product_name"] ?? "",
                "price" => isset($doc["price"]) ? (float)$doc["price"] : 0,
                "original" => isset($doc["original_price"]) ? (float)$doc["original_price"] : 0,
                "discount" => isset($doc["discount_amount"]) ? (float)$doc["discount_amount"] : 0,
                "image" => $doc["image"] ?? "",
                "brand" => $doc["brand"] ?? "",
                "mainBrand" => $doc["main_brand"] ?? "",
                "rating" => isset($doc["rating"]) ? (float)$doc["rating"] : 0,
                "reviews" => isset($doc["reviews"]) ? (int)$doc["reviews"] : 0,
                "stock" => $doc["stock_status"] ?? "in stock"
            ];
        }
        echo json_encode($products);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Query failed: " . $e->getMessage()]);
    }
}

// ---------- ADD PRODUCT ----------
elseif ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON"]);
        exit;
    }

    try {
        $insertResult = $collection->insertOne([
            "product_name" => $data["name"],
            "price" => (float)$data["price"],
            "original_price" => (float)$data["original"],
            "discount_amount" => (float)$data["discount"],
            "image" => $data["image"],
            "brand" => $data["brand"],
            "main_brand" => $data["mainBrand"],
            "rating" => (float)$data["rating"],
            "reviews" => (int)$data["reviews"],
            "stock_status" => $data["stock"]
        ]);

        echo json_encode([
            "success" => true,
            "insertedId" => (string)$insertResult->getInsertedId()
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Insert failed: " . $e->getMessage()]);
    }
}
?>