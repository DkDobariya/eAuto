<?php
// =====================
// Error Reporting & Headers
// =====================
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// =====================
// MongoDB Connection
// =====================
require 'vendor/autoload.php';

try {
    $client = new MongoDB\Client("mongodb://localhost:27017");
    $db = $client->app_eauto;
    $ordersCollection = $db->orders;
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed: " . $e->getMessage()
    ]);
    exit();
}

// =====================
// Validate Order ID
// =====================
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Order ID missing"
    ]);
    exit();
}

$orderId = $_GET['id'];

// =====================
// Fetch Order
// =====================
try {
    $order = $ordersCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($orderId)]);

    if (!$order) {
        echo json_encode([
            "status" => "error",
            "message" => "Order not found"
        ]);
        exit();
    }

    // Convert BSON to PHP array
    $order = json_decode(json_encode($order), true);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to fetch order: " . $e->getMessage()
    ]);
    exit();
}

// =====================
// Extract and Normalize Items
// =====================
$order_items = [];
$calculated_total = 0;

if (isset($order['items']) && is_array($order['items'])) {
    foreach ($order['items'] as $item) {
        // --- Brand ---
        $brand = "Unknown";
        if (!empty($item['brand'])) {
            $brand = $item['brand'];
        } elseif (!empty($item['product_brand'])) {
            $brand = $item['product_brand'];
        } elseif (!empty($item['product']['brand'])) {
            $brand = $item['product']['brand'];
        }

        // --- Price ---
        $price = $item['price'] 
                 ?? $item['order_price'] 
                 ?? $item['price_paid'] 
                 ?? $item['unit_price'] 
                 ?? 0;

        $quantity = $item['quantity'] ?? 1;
        $subtotal = $price * $quantity;
        $calculated_total += $subtotal;

        // --- Image ---
        $imageUrl = "http://localhost:8080/app-eauto/uploads/fallback.jpg";
        if (!empty($item['image'])) {
            $imageUrl = "http://localhost:8080/app-eauto/uploads/" . $item['image'];
        }

        $order_items[] = [
            "id"         => $item['product_id'] ?? null,
            "productName"=> $item['product_name'] ?? "Unknown Product",
            "brand"      => $brand,
            "quantity"   => $quantity,
            "pricePaid"  => $price,
            "totalPaid"  => $subtotal,
            "imageUrl"   => $imageUrl
        ];
    }
}

// Remove embedded items from order
unset($order['items']);

// Add calculated total
$order['calculated_total'] = $calculated_total;

// =====================
// Format created_at safely
// =====================
if (isset($order['created_at'])) {
    if (is_array($order['created_at']) && isset($order['created_at']['$date'])) {
        $dateVal = $order['created_at']['$date'];
        if (is_array($dateVal) && isset($dateVal['$numberLong'])) {
            $ts = (int) floor((float)$dateVal['$numberLong'] / 1000);
            $order['created_at'] = date('Y-m-d H:i:s', $ts);
        } else {
            $order['created_at'] = date('Y-m-d H:i:s', strtotime($dateVal));
        }
    } else {
        $order['created_at'] = (string)$order['created_at'];
    }
}

// =====================
// Response
// =====================
echo json_encode([
    "status" => "success",
    "order"  => $order,
    "items"  => $order_items
], JSON_PRETTY_PRINT);

exit();
?>
