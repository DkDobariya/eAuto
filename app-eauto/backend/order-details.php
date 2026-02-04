<?php
require 'vendor/autoload.php'; // Composer autoload

// CORS headers (allow your React app at localhost:3000 to call this API)
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

try {
    // MongoDB connection
    $client = new MongoDB\Client("mongodb://localhost:27017");
    $db = $client->app_eauto; // database name
    $ordersCollection = $db->orders;
    $orderItemsCollection = $db->order_items;

    // Validate and get order ID
    $order_id = isset($_GET['id']) ? trim($_GET['id']) : null;
    if (!$order_id) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Missing order ID']);
        exit();
    }

    // Convert to MongoDB ObjectId if needed
    try {
        $mongoOrderId = new MongoDB\BSON\ObjectId($order_id);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid order ID format']);
        exit();
    }

    // Fetch order document
    $order = $ordersCollection->findOne(['_id' => $mongoOrderId]);

    if (!$order) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Order not found']);
        exit();
    }

    // Fetch items for this order (assuming items store order_id as string)
    $itemsCursor = $orderItemsCollection->find(['order_id' => $order_id]);
    $items = iterator_to_array($itemsCursor);

    // Convert BSON objects to PHP array
    $orderArray = json_decode(json_encode($order), true);
    $itemsArray = json_decode(json_encode($items), true);

    // Optional: Sort items by creation date or any other field if needed
    usort($itemsArray, function($a, $b) {
        return strtotime($a['created_at']['$date'] ?? 0) <=> strtotime($b['created_at']['$date'] ?? 0);
    });

    // Return response
    echo json_encode([
        'status' => 'success',
        'order' => $orderArray,
        'items' => $itemsArray
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Server error',
        'error' => $e->getMessage()
    ]);
}
?>