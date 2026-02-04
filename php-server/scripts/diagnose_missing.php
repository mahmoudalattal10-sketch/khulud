<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;
use Diafat\Config\Database;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$pdo = Database::getConnection();

// 1. Total Hotels
$total = $pdo->query("SELECT COUNT(*) FROM Hotel")->fetchColumn();

// 2. Invisible Hotels
$invisible = $pdo->query("SELECT COUNT(*) FROM Hotel WHERE isVisible = 0")->fetchColumn();

// 3. Hotels with BasePrice = 0 or NULL
$zeroPrice = $pdo->query("SELECT COUNT(*) FROM Hotel WHERE basePrice IS NULL OR basePrice = 0")->fetchColumn();

// 4. Hotels with BasePrice = 0 AND No Room Prices (True "Zombie" hotels)
// This is harder to check in one query without complex joins, so keeping it simple for now.
// We'll just check hotels that have NO rooms at all.
$noRooms = $pdo->query("SELECT COUNT(*) FROM Hotel h WHERE NOT EXISTS (SELECT 1 FROM Room r WHERE r.hotelId = h.id)")->fetchColumn();

echo json_encode([
    'total_hotels' => $total,
    'invisible_hotels' => $invisible,
    'zero_base_price' => $zeroPrice,
    'no_rooms' => $noRooms,
    'visible_hotels' => $total - $invisible
], JSON_PRETTY_PRINT);

