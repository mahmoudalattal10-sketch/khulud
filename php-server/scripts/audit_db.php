<?php
require __DIR__ . '/../vendor/autoload.php';
use Diafat\Config\Database;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$pdo = Database::getConnection();

function getCount($pdo, $table) {
    return $pdo->query("SELECT COUNT(*) FROM $table")->fetchColumn();
}

$tables = ['Hotel', 'Room', 'HotelImage', 'RoomImage', 'NearbyPlace', 'Review', 'Amenity', 'HotelAmenity'];
echo "Database Audit Results:\n";
echo "-----------------------\n";
foreach ($tables as $table) {
    try {
        echo "$table: " . getCount($pdo, $table) . "\n";
    } catch (Exception $e) {
        echo "$table: Error - " . $e->getMessage() . "\n";
    }
}

