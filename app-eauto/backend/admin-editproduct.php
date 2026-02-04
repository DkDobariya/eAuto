<?php
require 'vendor/autoload.php'; // MongoDB library

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// MongoDB connection
try {
    $manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
    $db = "app_eauto";
    $collection = "products"; // Make sure this matches your collection name
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "MongoDB connection failed: " . $e->getMessage()]);
    exit();
}

// Helper: validate ObjectId
function isValidObjectId($id) {
    return preg_match('/^[a-f\d]{24}$/i', $id);
}

// GET — Fetch single product by ID
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['id']) || !isValidObjectId($_GET['id'])) {
        echo json_encode(["success" => false, "message" => "Invalid or missing Product ID"]);
        exit();
    }

    $id = $_GET['id'];

    try {
        $filter = ['_id' => new MongoDB\BSON\ObjectId($id)];
        $query = new MongoDB\Driver\Query($filter);
        $cursor = $manager->executeQuery("$db.$collection", $query);

        $product = current($cursor->toArray());
        if ($product) {
            // Convert BSONDocument to array for React
            $product = json_decode(json_encode($product), true);
            echo json_encode(["success" => true, "product" => $product]);
        } else {
            echo json_encode(["success" => false, "message" => "Product not found"]);
        }
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error fetching product: " . $e->getMessage()]);
    }
    exit();
}

// POST — Update product
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode(["success" => false, "message" => "Invalid JSON"]);
        exit();
    }

    if (!isset($data['id']) || !isValidObjectId($data['id'])) {
        echo json_encode(["success" => false, "message" => "Invalid or missing Product ID"]);
        exit();
    }

    $id = $data['id'];
    unset($data['id']); // remove id from update data

    // Remove _id if sent accidentally
    if (isset($data['_id'])) {
        unset($data['_id']);
    }

    // Ensure numeric fields are properly typed
    $numericFields = ['price', 'original_price', 'discount_amount', 'rating', 'reviews'];
    foreach ($numericFields as $field) {
        if (isset($data[$field])) {
            $data[$field] = is_numeric($data[$field]) ? (float)$data[$field] : 0;
        }
    }

    try {
        $bulk = new MongoDB\Driver\BulkWrite;
        $bulk->update(
            ['_id' => new MongoDB\BSON\ObjectId($id)], // filter by _id
            ['$set' => $data], // set only fields from form
            ['multi' => false, 'upsert' => false]
        );

        $result = $manager->executeBulkWrite("$db.$collection", $bulk);

        if ($result->getModifiedCount() > 0) {
            echo json_encode(["success" => true, "message" => "Product updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "No changes made or product not found"]);
        }
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "MongoDB update error: " . $e->getMessage()]);
    }
    exit();
}

// If request method is invalid
echo json_encode(["success" => false, "message" => "Invalid request method"]);
?>
