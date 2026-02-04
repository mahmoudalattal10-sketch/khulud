<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;
use Diafat\Config\Database;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$pdo = Database::getConnection();
$stmt = $pdo->query("SELECT id, name, nameEn FROM Hotel");
$hotels = $stmt->fetchAll(PDO::FETCH_ASSOC);

$issues = [
    'arabic_in_english' => [],
    'english_in_arabic' => [],  
    'identical' => [],
    'empty_english' => [],
    'short_english' => []
];

foreach ($hotels as $hotel) {
    $name = trim($hotel['name']);
    $nameEn = trim($hotel['nameEn'] ?? '');
    
    // Check 1: Arabic chars in English Name
    if (preg_match('/\p{Arabic}/u', $nameEn)) {
        $issues['arabic_in_english'][] = $hotel;
    }
    
    // Check 2: English chars in Arabic Name (excluding common symbols/numbers)
    // Looking for a-z chars inside the Arabic name field
    if (preg_match('/[a-zA-Z]/', $name)) {
        $issues['english_in_arabic'][] = $hotel;
    }
    
    // Check 3: Identical (case insensitive)
    if (strtolower($name) === strtolower($nameEn)) {
        $issues['identical'][] = $hotel;
    }
    
    // Check 4: Empty NameEn
    if (empty($nameEn)) {
        $issues['empty_english'][] = $hotel;
    }

    // Check 5: Short NameEn
    if (strlen($nameEn) > 0 && strlen($nameEn) < 4) {
        $issues['short_english'][] = $hotel;
    }
}

echo " ANALYSIS REPORT \n";
echo "================\n";
echo "1. Arabic in English Field: " . count($issues['arabic_in_english']) . "\n";
echo "2. English in Arabic Field: " . count($issues['english_in_arabic']) . "\n";
echo "3. Identical Names: " . count($issues['identical']) . "\n";
echo "4. Empty English Name: " . count($issues['empty_english']) . "\n";
echo "5. Short English Name (<4): " . count($issues['short_english']) . "\n";

echo "\n--- DETAILS: Arabic in English ---\n";
foreach ($issues['arabic_in_english'] as $h) echo "{$h['id']} | {$h['current_nameEn']}\n";

echo "\n--- DETAILS: English in Arabic ---\n";
foreach ($issues['english_in_arabic'] as $h) echo "{$h['id']} | {$h['name']}\n";

echo "\n--- DETAILS: Identical ---\n";
foreach ($issues['identical'] as $h) echo "{$h['id']} | {$h['name']} == {$h['nameEn']}\n";

