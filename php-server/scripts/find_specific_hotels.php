<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;
use Diafat\Config\Database;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$pdo = Database::getConnection();
$stmt = $pdo->prepare("SELECT id, name, nameEn FROM Hotel WHERE name LIKE :q1 OR name LIKE :q2");
$stmt->execute([':q1' => '%وأبراج مكة%', ':q2' => '%الصفوة%']);
$hotels = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($hotels, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

