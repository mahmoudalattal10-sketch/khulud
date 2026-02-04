<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;
use Diafat\Config\Database;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$pdo = Database::getConnection();

// Check Makkah counts with various spellings
$makkahLike = $pdo->query("SELECT COUNT(*) FROM Hotel WHERE city LIKE '%makkah%' OR city LIKE '%مكة%'")->fetchColumn();
$makkahExact = $pdo->query("SELECT COUNT(*) FROM Hotel WHERE city = 'makkah'")->fetchColumn();
$allCities = $pdo->query("SELECT city, COUNT(*) as count FROM Hotel GROUP BY city")->fetchAll(PDO::FETCH_ASSOC);

echo "Makkah (Like): $makkahLike\n";
echo "Makkah (Exact): $makkahExact\n";
echo "\n--- All Cities ---\n";
foreach ($allCities as $c) {
    echo "{$c['city']}: {$c['count']}\n";
}

