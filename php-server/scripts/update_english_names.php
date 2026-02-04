<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use Diafat\Config\Database;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$pdo = Database::getConnection();

// Creative Translations Mapping
$translations = [
    '3e0202b7-2f57-4e94-8412-901948559714' => [
        'nameEn' => 'New Horizon Hotel', // فندق جديد -> New Hotel (Creative: New Horizon)
        'slug' => 'new-horizon-hotel'
    ],
    '4343c6db-bf64-48e7-9e01-24b371da2afd' => [
        'nameEn' => 'Alpha Experience Hotel', // فندق تجربة الفا
        'slug' => 'alpha-experience-hotel'
    ],
    '9dd88a30-8437-4f14-a4a2-567d85b2a138' => [
        'nameEn' => 'Makkah Hotel & Towers', // فندق وأبراج مكة
        'slug' => 'makkah-hotel-towers'
    ],
    'bed231de-4af9-4918-ae46-6e59e84f00a2' => [
        'nameEn' => 'Al Safwah Royale Orchid', // فندق الصفوة البرج الاول (Creative)
        'slug' => 'al-safwah-royale-orchid'
    ]
];

foreach ($translations as $id => $data) {
    try {
        $stmt = $pdo->prepare("UPDATE Hotel SET nameEn = :nameEn, slug = :slug WHERE id = :id");
        $stmt->execute([
            ':nameEn' => $data['nameEn'],
            ':slug' => $data['slug'] . '-' . substr($id, 0, 8), // Append partial ID to slug for uniqueness
            ':id' => $id
        ]);
        echo "Updated Hotel ID: $id -> {$data['nameEn']}\n";
    } catch (PDOException $e) {
        echo "Error updating Hotel ID: $id - " . $e->getMessage() . "\n";
    }
}

echo "Done.";

