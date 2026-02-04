<?php
require_once 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$host = $_ENV['DB_HOST'];
$db   = $_ENV['DB_NAME'];
$user = $_ENV['DB_USER'];
$pass = $_ENV['DB_PASS'];
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
     $stmt = $pdo->query("DESCRIBE Hotel");
     $columns = $stmt->fetchAll();
     echo "Hotel Table Structure:\n";
     foreach ($columns as $col) {
         echo $col['Field'] . " (" . $col['Type'] . ")\n";
     }

     $stmt = $pdo->query("SELECT id, name, childPolicy FROM Hotel LIMIT 5");
     $hotels = $stmt->fetchAll();
     echo "\nHotels:\n";
     print_r($hotels);

} catch (\PDOException $e) {
     throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

