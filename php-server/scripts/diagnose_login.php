<?php
require 'vendor/autoload.php';
use Dotenv\Dotenv;
use Diafat\Config\Database;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

try {
    $pdo = Database::getConnection();
    echo "✅ Database Connection Successful\n";
    
    $stmt = $pdo->prepare("SELECT id, name, role FROM User WHERE email = ?");
    $stmt->execute(['admin@diafat.com']);
    $user = $stmt->fetch();
    
    if ($user) {
        echo "✅ User Found: " . $user['name'] . " (Role: " . $user['role'] . ")\n";
    } else {
        echo "❌ User admin@diafat.com NOT found in database.\n";
        
        // Let's see some users that DO exist
        $stmt = $pdo->query("SELECT email FROM User LIMIT 5");
        $users = $stmt->fetchAll(PDO::FETCH_COLUMN);
        echo "Existing users: " . implode(', ', $users) . "\n";
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

