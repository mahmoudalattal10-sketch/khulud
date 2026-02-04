<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;
use Diafat\Config\Database;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$pdo = Database::getConnection();

$stmt = $pdo->query("SELECT id, name FROM Hotel WHERE nameEn IS NULL OR nameEn = '' OR LENGTH(TRIM(nameEn)) = 0");
$hotels = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "Missing NameEn Count: " . count($hotels) . "\n";
print_r($hotels);

