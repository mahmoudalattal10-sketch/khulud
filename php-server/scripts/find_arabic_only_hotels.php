<?php
echo "HELLO WORLD\n";
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use Diafat\Config\Database;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$pdo = Database::getConnection();

$stmt = $pdo->query("SELECT id, name, nameEn FROM Hotel");
$hotels = $stmt->fetchAll(PDO::FETCH_ASSOC);

$fp = fopen('hotels_list.txt', 'w');
foreach ($hotels as $hotel) {
    // Only dump if name is Arabic
    if (preg_match('/\p{Arabic}/u', $hotel['name'])) {
        fwrite($fp, "ID: {$hotel['id']} || Name: {$hotel['name']} || NameEn: " . ($hotel['nameEn'] ?? 'NULL') . "\n");
    }
}
fclose($fp);
echo "Dumped to hotels_list.txt\n";

