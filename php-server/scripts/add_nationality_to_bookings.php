<?php
require __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$host = $_ENV['DB_HOST'] ?? '127.0.0.1';
$user = $_ENV['DB_USER'] ?? 'root';
$pass = $_ENV['DB_PASS'] ?? '';
$dbname = 'diafat_db';

try {
    echo "🔌 Connecting to MySQL...\n";
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "🔨 Adding 'nationality' column to 'Booking' table...\n";
    
    // Check if column already exists
    $checkColumn = $pdo->query("SHOW COLUMNS FROM `Booking` LIKE 'nationality'");
    if ($checkColumn->rowCount() == 0) {
        $pdo->exec("ALTER TABLE `Booking` ADD `nationality` VARCHAR(100) NULL AFTER `guestPhone` ");
        echo "✅ Column 'nationality' added successfully!\n";
    } else {
        echo "ℹ️ Column 'nationality' already exists.\n";
    }

} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}

