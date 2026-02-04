<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');  
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'vendor/autoload.php';

try {
    $client = new MongoDB\Client("mongodb://localhost:27017");
    $db = $client->app_eauto;
    $ordersCollection = $db->orders;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$orderId = $_GET['orderId'] ?? $_GET['id'] ?? '';
if (!$orderId) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing or invalid orderId']);
    exit;
}

try {
    $orderIdObj = preg_match('/^[a-f\d]{24}$/i', $orderId)
        ? new MongoDB\BSON\ObjectId($orderId)
        : $orderId;

    $order = $ordersCollection->findOne(
        ['_id' => $orderIdObj],
        ['typeMap' => ['root' => 'array', 'document' => 'array']]
    );

    if (!$order) {
        http_response_code(404);
        echo json_encode(['error' => 'Order not found']);
        exit;
    }

    $order['id'] = isset($order['_id']) ? (string)$order['_id'] : '';
    unset($order['_id']);
    if (!empty($order['created_at'])) {
        $order['created_at'] = date('Y-m-d H:i:s', strtotime($order['created_at']));
    }

    $items = $order['items'] ?? [];

    // Compute grand total
    $grandTotal = array_reduce($items, fn($sum, $i) => $sum + ($i['subtotal'] ?? 0), 0);

    // Apply 5% discount
    $discountRate = 0.05;
    $discountAmount = $grandTotal * $discountRate;
    $order['total'] = $grandTotal - $discountAmount;

    // Optional fields
    $order['discount_rate'] = $discountRate * 100; // %
    $order['discount_amount'] = $discountAmount;

    echo json_encode([
        'order' => $order,
        'items' => $items
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
