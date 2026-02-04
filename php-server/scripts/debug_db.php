<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=diafat_db', 'root', '123456789');
    $stmt = $pdo->query('SELECT roomId, startDate, endDate, price FROM PricingPeriod');
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($results, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo $e->getMessage();
}

