<?php
require __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$host = $_ENV['DB_HOST'] ?? '127.0.0.1';
$user = $_ENV['DB_USER'] ?? 'root';
$pass = $_ENV['DB_PASS'] ?? '';

try {
    echo "🔌 Connecting to MySQL...\n";
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "🔨 Creating Database diafat_db...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS diafat_db");
    $pdo->exec("USE diafat_db");

    echo "📜 Importing Schema...\n";
    $schemaPath = __DIR__ . '/../database/schema.sql';
    if (!file_exists($schemaPath)) {
        die("❌ Schema file not found: $schemaPath\n");
    }
    
    $sql = file_get_contents($schemaPath);
    // PDO::exec can fail on multiple statements if not configured, but MySQL usually allows it.
    // Better to split by ; if issues, but schema is likely compatible.
    $pdo->exec($sql);
    
    echo "✅ Database Initialized!\n";
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}

