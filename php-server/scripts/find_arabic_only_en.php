<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;
use Diafat\Config\Database;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$pdo = Database::getConnection();
// Find hotels where nameEn does NOT have English letters
$stmt = $pdo->query("SELECT id, name, nameEn FROM Hotel WHERE nameEn NOT REGEXP '[a-zA-Z]'");
$hotels = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($hotels, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

