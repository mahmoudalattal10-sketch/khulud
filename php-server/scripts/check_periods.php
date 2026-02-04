<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Diafat\Config\Database;

$pdo = Database::getConnection();
$stmt = $pdo->query("SELECT * FROM PricingPeriod LIMIT 10");
$periods = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($periods, JSON_PRETTY_PRINT);

