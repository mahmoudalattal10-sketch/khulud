<?php
require __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$host = $_ENV['DB_HOST'] ?? '127.0.0.1';
$user = $_ENV['DB_USER'] ?? 'root';
$pass = $_ENV['DB_PASS'] ?? '';
$dbname = $_ENV['DB_NAME'] ?? 'diafat_db';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Checking Coupon table schema...\n";

    // Check if column exists
    $stmt = $pdo->query("SHOW COLUMNS FROM Coupon LIKE 'hotelId'");
    $exists = $stmt->fetch();

    if (!$exists) {
        echo "Adding 'hotelId' column to Coupon table...\n";
        $pdo->exec("ALTER TABLE Coupon ADD COLUMN hotelId VARCHAR(36) NULL AFTER usedCount");
        $pdo->exec("ALTER TABLE Coupon ADD CONSTRAINT `Coupon_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel` (`id`) ON DELETE SET NULL");
        echo "✅ Column added successfully.\n";
    } else {
        echo "ℹ️ Column 'hotelId' already exists.\n";
    }

} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

