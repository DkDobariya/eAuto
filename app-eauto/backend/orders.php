<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // allow React frontend
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require 'vendor/autoload.php'; // MongoDB library

try {
    // Connect to MongoDB
    $client = new MongoDB\Client("mongodb://localhost:27017");

    // Select database and collection
    $db = $client->app_eauto;
    $ordersCollection = $db->orders;

    // Validate user_id
    if (!isset($_GET['user_id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing user_id"]);
        exit();
    }

    $user_id = intval($_GET['user_id']); // convert to integer

    // Fetch orders by user_id sorted by created_at DESC
    $ordersCursor = $ordersCollection->find(
        ["user_id" => $user_id],
        ["sort" => ["created_at" => -1]]
    );

    $orders = [];
    foreach ($ordersCursor as $order) {
        // Convert MongoDB ObjectId to string
        $order['_id'] = (string)$order['_id'];

        // Normalize created_at to ISO string if it's a BSON date
        if (isset($order['created_at']) && $order['created_at'] instanceof MongoDB\BSON\UTCDateTime) {
            $order['created_at'] = $order['created_at']->toDateTime()->format(DATE_ATOM); // e.g., 2025-08-31T16:30:00+00:00
        }

        $orders[] = $order;
    }

    echo json_encode(["orders" => $orders]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed", "details" => $e->getMessage()]);
}
?>
