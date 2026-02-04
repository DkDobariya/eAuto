<?php
// cart.php - MongoDB version

require 'vendor/autoload.php'; 
use MongoDB\Client;

// --- CORS Headers ---
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Content-Type: application/json");

// Handle pre-flight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// MongoDB Connection
try {
    $client = new Client("mongodb://localhost:27017");
    $db = $client->app_eauto;
    $collection = $db->cart;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "MongoDB connection failed"]);
    exit();
}

// --- Helper: fetch all cart items ---
function getCartItems($collection) {
    $cursor = $collection->find([], [
        'projection' => [
            'product_name' => 1,
            'brand' => 1,
            'price' => 1,
            'quantity' => 1,
            'image' => 1
        ]
    ]);

    $cartItems = [];
    foreach ($cursor as $doc) {
        $doc['_id'] = (string)$doc['_id'];
        $doc['price'] = (float)$doc['price'];
        $doc['quantity'] = (int)$doc['quantity'];
        $cartItems[] = $doc;
    }
    return $cartItems;
}

// --- DELETE item from cart ---
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['remove'])) {
    $id = $_GET['remove'];

    try {
        $result = $collection->deleteOne(["_id" => new MongoDB\BSON\ObjectId($id)]);
        if ($result->getDeletedCount() > 0) {
            echo json_encode([
                "message" => "Item removed",
                "cart" => getCartItems($collection)
            ]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Item not found"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to remove item"]);
    }
    exit();
}

// --- POST: Insert or update ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    // UPDATE quantity
    if (!empty($input['updateQty']) && isset($input['id'], $input['qty'])) {
        try {
            $updateResult = $collection->updateOne(
                ["_id" => new MongoDB\BSON\ObjectId($input['id'])],
                ['$set' => ["quantity" => max(1, (int)$input['qty'])]]
            );

            if ($updateResult->getModifiedCount() > 0) {
                echo json_encode([
                    "message" => "Quantity updated",
                    "cart" => getCartItems($collection)
                ]);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Item not found"]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to update quantity"]);
        }
        exit();
    }

    // INSERT new item
    if (!empty($input['product_name']) && !empty($input['brand']) &&
        isset($input['price'], $input['quantity'], $input['image'])) {

        try {
            $existing = $collection->findOne([
                "product_name" => $input['product_name'],
                "brand" => $input['brand']
            ]);

            if ($existing) {
                http_response_code(409);
                echo json_encode(["error" => "Item already in cart"]);
                exit();
            }

            $collection->insertOne([
                "product_name" => $input['product_name'],
                "brand" => $input['brand'],
                "price" => (float)$input['price'],
                "quantity" => (int)$input['quantity'],
                "image" => $input['image']
            ]);

            echo json_encode([
                "message" => "Item added to cart",
                "cart" => getCartItems($collection)
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error inserting item"]);
        }
        exit();
    }

    http_response_code(400);
    echo json_encode(["error" => "Invalid POST data"]);
    exit();
}

// --- GET all cart items (default) ---
try {
    echo json_encode(getCartItems($collection));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch cart items"]);
}
?>
