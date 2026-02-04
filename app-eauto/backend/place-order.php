<?php
// === Error Reporting & Headers ===
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

// === MongoDB Connection ===
require 'vendor/autoload.php';
use MongoDB\Client;

try {
    $client = new Client("mongodb://localhost:27017");
    $db = $client->app_eauto;
    $ordersCollection = $db->orders;
    $orderItemsCollection = $db->order_items;
} catch (Exception $e) {
    echo json_encode(['status'=>'error','message'=>'MongoDB connection failed: '.$e->getMessage()]);
    exit();
}

// === Read POST JSON ===
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode([
        'status'=>'error',
        'message'=>'Invalid JSON payload',
        'raw'=>$raw
    ]);
    exit();
}

// === Validate required fields ===
$required = ['cart','fname','lname','phone','email','total','user_id','address1','city','state','pincode','payment'];
foreach ($required as $field) {
    if (!isset($data[$field]) || (is_string($data[$field]) && trim($data[$field]) === '')) {
        echo json_encode(['status'=>'error','message'=>"Missing field: $field"]);
        exit();
    }
}

// === Validate cart ===
if (!is_array($data['cart']) || count($data['cart']) === 0) {
    echo json_encode([
        'status'=>'error',
        'message'=>"Cart is empty",
        'received'=>$data['cart']
    ]);
    exit();
}

// Debug log cart
error_log("Cart received: ".print_r($data['cart'], true));

// === Prepare order document ===
$fullname = trim($data['fname'].' '.$data['lname']);
$address2 = isset($data['address2']) ? $data['address2'] : '';
$address = trim($data['address1'].' '.$address2);

$orderDoc = [
    'user_id' => (int)$data['user_id'],
    'fullname' => $fullname,
    'email' => $data['email'],
    'phone' => $data['phone'],
    'address' => $address,
    'city' => $data['city'],
    'state' => $data['state'],
    'zip' => $data['pincode'],
    'total_amount' => (float)$data['total'],
    'payment_method' => $data['payment'],
    'created_at' => new MongoDB\BSON\UTCDateTime(),
    'items' => []
];

// === Add items into embedded order document ===
foreach ($data['cart'] as $item) {
    if (!isset($item['id'], $item['product_name'], $item['quantity'], $item['price'])) {
        error_log("Skipping invalid item: ".print_r($item,true));
        continue;
    }

    $orderDoc['items'][] = [
        'product_id' => (int)$item['id'],
        'product_name' => $item['product_name'],
        'quantity' => (int)$item['quantity'],
        'price' => (float)$item['price'],
        'subtotal' => (float)$item['price'] * (int)$item['quantity']
    ];
}

// === Insert order ===
try {
    $result = $ordersCollection->insertOne($orderDoc);
    $orderId = $result->getInsertedId(); // MongoDB ObjectId
} catch (Exception $e) {
    echo json_encode(['status'=>'error','message'=>'Order insert failed: '.$e->getMessage()]);
    exit();
}

// === Insert each item into order_items collection ===
foreach ($data['cart'] as $item) {
    if (!isset($item['id'], $item['product_name'], $item['quantity'], $item['price'])) {
        continue;
    }

    $itemDoc = [
        'order_id' => $orderId, // ObjectId reference
        'product_id' => (int)$item['id'],
        'product_name' => $item['product_name'],
        'quantity' => (int)$item['quantity'],
        'order_price' => (float)$item['price'],
        'subtotal' => (int)$item['quantity'] * (float)$item['price'],
        'image' => $item['image'] ?? null,
        'brand' => $item['brand'] ?? null,
        'created_at' => new MongoDB\BSON\UTCDateTime()
    ];

    try {
        $orderItemsCollection->insertOne($itemDoc);
    } catch (Exception $e) {
        echo json_encode([
            'status'=>'error',
            'message'=>'Order item insert failed: '.$e->getMessage(),
            'item'=>$itemDoc
        ]);
        exit();
    }
}

// === Success Response ===
echo json_encode([
    'status'=>'success',
    'order_id'=>(string)$orderId  // return ObjectId as string
]);
exit();
?>