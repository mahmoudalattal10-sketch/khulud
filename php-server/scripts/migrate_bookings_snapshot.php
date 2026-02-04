<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Diafat\Config\Database;

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

try {
    $pdo = Database::getConnection();
    echo "Connected to database.\n";

    // Columns to add
    $columns = [
        "ADD COLUMN bookedRoomName VARCHAR(255) NULL",
        "ADD COLUMN bookedHotelName VARCHAR(255) NULL",
        "ADD COLUMN bookedHotelAddress VARCHAR(255) NULL",
        "ADD COLUMN bookedBoardBasis VARCHAR(100) NULL",
        "ADD COLUMN bookedView VARCHAR(100) NULL",
        "ADD COLUMN bookedBedding VARCHAR(100) NULL",
        "ADD COLUMN bookedExtraBedPrice DECIMAL(10,2) DEFAULT 0.00"
    ];

    foreach ($columns as $col) {
        try {
            // Check if column exists strictly before adding would be better, but generic catch works for simple migration
            $sql = "ALTER TABLE Booking $col";
            $pdo->exec($sql);
            echo "Executed: $sql\n";
        } catch (PDOException $e) {
            // Error 1060: Duplicate column name
            if (strpos($e->getMessage(), 'Duplicate column') !== false || $e->getCode() == '42S21') {
                echo "Skipped (Exists): $col\n";
            } else {
                echo "Error executing $col: " . $e->getMessage() . "\n";
            }
        }
    }

    echo "Migration completed successfully.\n";

} catch (Exception $e) {
    echo "Critical Error: " . $e->getMessage() . "\n";
}

