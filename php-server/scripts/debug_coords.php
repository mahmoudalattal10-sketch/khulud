<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Diafat\Config\Database;

$pdo = Database::getConnection();
$stmt = $pdo->query("SELECT id, name, city, lat, lng FROM Hotel WHERE lat = 0 OR lng = 0 OR lat IS NULL OR lng IS NULL");
$hotels = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "Hotels with zero or NULL coordinates:\n";
foreach ($hotels as $hotel) {
    echo "ID: {$hotel['id']} | Name: {$hotel['name']} | City: {$hotel['city']} | Lat: {$hotel['lat']} | Lng: {$hotel['lng']}\n";
}

