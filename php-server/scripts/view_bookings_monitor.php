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

    // Check if Booking table exists and has data
    $stmt = $pdo->query("SELECT * FROM Booking ORDER BY createdAt DESC LIMIT 10");
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmtUsers = $pdo->query("SELECT count(*) as count FROM User");
    $userCount = $stmtUsers->fetch(PDO::FETCH_ASSOC)['count'];

    echo "--- BOOKINGS MONITOR ---\n";
    echo "Total Users Found: " . $userCount . "\n";
    echo "Total Bookings Found: " . count($bookings) . "\n";
    
    foreach ($bookings as $booking) {
        echo "--------------------------------------------------\n";
        echo "ID: " . $booking['id'] . "\n";
        echo "Guest: " . ($booking['guestName'] ?? 'N/A') . "\n";
        echo "Email: " . ($booking['guestEmail'] ?? 'N/A') . "\n";
        echo "Status: " . $booking['status'] . "\n";
        echo "Total Price: " . $booking['totalPrice'] . "\n";
        echo "Created At: " . ($booking['createdAt'] ?? 'N/A') . "\n";
    }
    echo "--------------------------------------------------\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

