<?php
require 'vendor/autoload.php'; // Composer autoload

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

// Connect to MongoDB
try {
    $client = new MongoDB\Client("mongodb://localhost:27017");
    $db = $client->app_eauto;
    $ordersCollection = $db->orders;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// Parse ID from query or PATH_INFO
$id = null;
if (isset($_GET['id'])) {
    $id = $_GET['id'];
} elseif (isset($_SERVER['PATH_INFO'])) {
    $pathParts = explode('/', trim($_SERVER['PATH_INFO'], '/'));
    if (count($pathParts) > 0) {
        $id = $pathParts[0];
    }
}

// ---------- GET ORDERS ----------
if ($method === 'GET') {
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';

    try {
        if ($search !== '') {
            $cursor = $ordersCollection->find([
                '$or' => [
                    ['fullname' => ['$regex' => $search, '$options' => 'i']],
                    ['email' => ['$regex' => $search, '$options' => 'i']],
                    ['phone' => ['$regex' => $search, '$options' => 'i']],
                    ['payment_method' => ['$regex' => $search, '$options' => 'i']],
                    ['address' => ['$regex' => $search, '$options' => 'i']],
                    ['city' => ['$regex' => $search, '$options' => 'i']],
                    ['state' => ['$regex' => $search, '$options' => 'i']],
                    ['zip' => ['$regex' => $search, '$options' => 'i']]
                ]
            ], ['sort' => ['created_at' => -1]]);
        } else {
            $cursor = $ordersCollection->find([], ['sort' => ['created_at' => -1]]);
        }

        $orders = [];
        foreach ($cursor as $doc) {
            $doc['_id'] = (string)$doc['_id'];
            $orders[] = $doc;
        }

        echo json_encode(['orders' => $orders]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Query failed: " . $e->getMessage()]);
    }
}

// ---------- CREATE ORDER ----------
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $required = ['user_id','fullname','email','phone','address','city','state','zip','total_amount','payment_method'];

    foreach ($required as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(["message" => "Field '$field' is required"]);
            exit;
        }
    }

    try {
        $insertResult = $ordersCollection->insertOne([
            "user_id" => $data['user_id'],
            "fullname" => $data['fullname'],
            "email" => $data['email'],
            "phone" => $data['phone'],
            "address" => $data['address'],
            "city" => $data['city'],
            "state" => $data['state'],
            "zip" => $data['zip'],
            "total_amount" => (float)$data['total_amount'],
            "payment_method" => $data['payment_method'],
            "created_at" => new MongoDB\BSON\UTCDateTime()
        ]);

        http_response_code(201);
        echo json_encode([
            "message" => "Order created successfully",
            "order_id" => (string)$insertResult->getInsertedId()
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to create order: " . $e->getMessage()]);
    }
}

// ---------- UPDATE ORDER ----------
elseif ($method === 'PUT') {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["message" => "Missing order ID"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    try {
        $updateData = [];
        $allowedFields = ['user_id','fullname','email','phone','address','city','state','zip','total_amount','payment_method'];

        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $updateData[$field] = $field === "total_amount" ? (float)$data[$field] : $data[$field];
            }
        }

        if (empty($updateData)) {
            http_response_code(400);
            echo json_encode(["message" => "No fields to update"]);
            exit;
        }

        $result = $ordersCollection->updateOne(
            ['_id' => new MongoDB\BSON\ObjectId($id)],
            ['$set' => $updateData]
        );

        if ($result->getModifiedCount() > 0) {
            echo json_encode(["message" => "Order updated successfully"]);
        } else {
            echo json_encode(["message" => "No changes made"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to update order: " . $e->getMessage()]);
    }
}

// ---------- DELETE ORDER ----------
elseif ($method === 'DELETE') {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["message" => "Missing order ID"]);
        exit;
    }

    try {
        $result = $ordersCollection->deleteOne(['_id' => new MongoDB\BSON\ObjectId($id)]);

        if ($result->getDeletedCount() > 0) {
            echo json_encode(["message" => "Order deleted successfully"]);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Order not found"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to delete order: " . $e->getMessage()]);
    }
}

// ---------- METHOD NOT ALLOWED ----------
else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
}
?>