<?php
require 'vendor/autoload.php'; // Composer autoload for MongoDB

try {
    // Create MongoDB client (localhost:27017 is the default)
    $client = new MongoDB\Client("mongodb://localhost:27017");

    // Select database
    $db = $client->app_eauto; // same as MySQL $dbname = "app_eauto"

    // Example: select collection (like a table)
    $cartCollection = $db->cart;

    echo "MongoDB connection successful!";
} catch (Exception $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
