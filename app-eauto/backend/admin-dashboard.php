<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Restrict in production

require 'vendor/autoload.php'; // Composer autoload

try {
    // Connect to MongoDB
    $client = new MongoDB\Client("mongodb://localhost:27017");

    // Select database
    $db = $client->app_eauto;

    // Collections
    $ordersCollection = $db->orders;
    $usersCollection = $db->users;
    $productsCollection = $db->products;

    // Get total orders
    $totalOrders = $ordersCollection->countDocuments();

    // Get total revenue (sum of total_amount field)
    $revenueResult = $ordersCollection->aggregate([
        ['$group' => ['_id' => null, 'revenue' => ['$sum' => '$total_amount']]]
    ])->toArray();
    $totalRevenue = isset($revenueResult[0]['revenue']) ? (float)$revenueResult[0]['revenue'] : 0.0;

    // Get total users
    $totalUsers = $usersCollection->countDocuments();

    // Get total products
    $totalProducts = $productsCollection->countDocuments();

    // Return JSON response
    echo json_encode([
        "totalOrders" => $totalOrders,
        "totalRevenue" => $totalRevenue,
        "totalUsers" => $totalUsers,
        "totalProducts" => $totalProducts
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed or query error", "details" => $e->getMessage()]);
}
?>