<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;
use Diafat\Config\Database;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$pdo = Database::getConnection();

// Fetch all hotels
$stmt = $pdo->query("SELECT id, name, nameEn FROM Hotel");
$hotels = $stmt->fetchAll(PDO::FETCH_ASSOC);

$updatedCount = 0;

foreach ($hotels as $hotel) {
    $currentName = $hotel['name'];
    $currentNameEn = $hotel['nameEn'];
    
    // Pattern to find parenthesized English text at the end of Arabic name
    // e.g. "فندق ريتز (The Ritz)"
    if (preg_match('/^(.*?)\s*\((.*?)\)$/u', $currentName, $matches)) {
        $arabicPart = trim($matches[1]); // "فندق ريتز"
        $englishPart = trim($matches[2]); // "The Ritz"
        
        // If matches, we should update
        // Check if nameEn is empty or we prefer the one from parentheses?
        // Usually the one in parentheses is accurate.
        
        $newNameEn = !empty($currentNameEn) ? $currentNameEn : $englishPart;
        
        // Update DB
        $update = $pdo->prepare("UPDATE Hotel SET name = :name, nameEn = :nameEn WHERE id = :id");
        $update->execute([
            ':name' => $arabicPart,
            ':nameEn' => $newNameEn,
            ':id' => $hotel['id']
        ]);
        
        echo "Fixed: {$currentName} -> AR: {$arabicPart} | EN: {$newNameEn}\n";
        $updatedCount++;
    }
}

echo "\nTotal Hotels Fixed: $updatedCount\n";

