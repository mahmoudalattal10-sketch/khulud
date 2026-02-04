<?php
require __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$host = $_ENV['DB_HOST'] ?? '127.0.0.1';
$user = $_ENV['DB_USER'] ?? 'root';
$pass = $_ENV['DB_PASS'] ?? '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=diafat_db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "🔍 Listing Hotels and Rooms with Pricing...\n\n";

    $stmt = $pdo->query("SELECT h.id as hotelId, h.name as hotelName, r.id as roomId, r.name as roomName 
                         FROM Hotel h 
                         JOIN Room r ON h.id = r.hotelId
                         JOIN PricingPeriod pp ON r.id = pp.roomId
                         WHERE pp.price = 400");
    $rooms = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($rooms as $room) {
        echo "🏨 Hotel: " . $room['hotelName'] . " | 🛏️ Room: " . $room['roomName'] . "\n";
        
        $pst = $pdo->prepare("SELECT * FROM PricingPeriod WHERE roomId = :roomId ORDER BY startDate ASC");
        $pst->execute([':roomId' => $room['roomId']]);
        $periods = $pst->fetchAll(PDO::FETCH_ASSOC);

        if (empty($periods)) {
            echo "   ❌ No pricing periods found!\n";
        } else {
            foreach ($periods as $p) {
                echo "   📅 " . $p['startDate'] . " to " . $p['endDate'] . " | Price: " . $p['price'] . "\n";
            }
        }
        echo "--------------------------------------------------\n";
    }

} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

