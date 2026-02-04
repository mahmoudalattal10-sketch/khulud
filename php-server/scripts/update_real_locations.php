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
    $pdo = new PDO("mysql:host=$host;dbname=diafat_db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Massive real-world coordinate mapping
    $updates = [
        // Makkah
        'Fairmont Makkah' => ['lat' => 21.418706, 'lng' => 39.825317],
        'Raffles Makkah' => ['lat' => 21.419200, 'lng' => 39.825800],
        'Dar Al Tawhid' => ['lat' => 21.419803, 'lng' => 39.822728],
        'Anjum Hotel' => ['lat' => 21.424456, 'lng' => 39.818819],
        'Kiswah Towers' => ['lat' => 21.430489, 'lng' => 39.809189],
        'Swissôtel Al Maqam' => ['lat' => 21.419515, 'lng' => 39.824705],
        'Al Shohada Hotel' => ['lat' => 21.415064, 'lng' => 39.828859],
        'Le Méridien Makkah' => ['lat' => 21.415610, 'lng' => 39.829987],
        'Sheraton Makkah Jabal Al Kaaba' => ['lat' => 21.425232, 'lng' => 39.817452],
        'Pullman ZamZam Makkah' => ['lat' => 21.418049, 'lng' => 39.824147], // Corrected, it was confused with Madinah before? Wait, the name says Makkah now.

        // Madinah
        'Pullman Zamzam Madina' => ['lat' => 24.466887, 'lng' => 39.608331],
        'Emaar Royal' => ['lat' => 24.471852, 'lng' => 39.608930],
        'Saja Al Madinah' => ['lat' => 24.472506, 'lng' => 39.604724],
        'Crowne Plaza Madinah' => ['lat' => 24.469956, 'lng' => 39.608316],
        'Dallah Taibah' => ['lat' => 24.471676, 'lng' => 39.605943],
        'InterContinental Dar Al Hijra' => ['lat' => 24.472149, 'lng' => 39.607147],
        'Zowar International' => ['lat' => 24.473582, 'lng' => 39.605331],
        'Dar Al Taqwa' => ['lat' => 24.469149, 'lng' => 39.609447],
        'Artal Al Munawarrah' => ['lat' => 24.465100, 'lng' => 39.609100], // Approx

        // Riyadh
        'Ritz-Carlton, Riyadh' => ['lat' => 24.662584, 'lng' => 46.609538],
        'Fairmont Riyadh' => ['lat' => 24.821175, 'lng' => 46.733589],
        'Mansard Riyadh' => ['lat' => 24.789123, 'lng' => 46.619076],
        'JW Marriott Hotel Riyadh' => ['lat' => 24.757362, 'lng' => 46.638519],
        
        // Jeddah
        'The Venue Jeddah' => ['lat' => 21.571408, 'lng' => 39.110292],
        'Park Hyatt Jeddah' => ['lat' => 21.514660, 'lng' => 39.155502],
        'The Hotel Galleria' => ['lat' => 21.545800, 'lng' => 39.163000],
        'Jeddah Hilton Hotel' => ['lat' => 21.609930, 'lng' => 39.108604],

        // Cairo
        'Four Seasons Hotel Cairo' => ['lat' => 30.036625, 'lng' => 31.227447],
        'Kempinski Nile' => ['lat' => 30.040220, 'lng' => 31.228965],
        'St. Regis Cairo' => ['lat' => 30.063162, 'lng' => 31.228801],

        // Alexandria
        'Four Seasons Hotel Alexandria' => ['lat' => 31.245230, 'lng' => 29.966770],

        // Sharm El Sheikh
        'Steigenberger Alcazar' => ['lat' => 28.049470, 'lng' => 34.434310],

        // Hurghada
        'Rixos Premium Magawish' => ['lat' => 27.151740, 'lng' => 33.824290],
        'Steigenberger ALDAU Beach' => ['lat' => 27.165400, 'lng' => 33.822800],

        // North Coast
        'Address Marassi' => ['lat' => 30.957500, 'lng' => 28.790000],
        'Al Alamein Hotel' => ['lat' => 30.938800, 'lng' => 28.847500],

        // Doha
        'Souq Waqif Boutique' => ['lat' => 25.286950, 'lng' => 51.532349],
        'Mandarin Oriental, Doha' => ['lat' => 25.284241, 'lng' => 51.528090],
        'St. Regis Doha' => ['lat' => 25.353360, 'lng' => 51.531770],
        'Mondrian Doha' => ['lat' => 25.340000, 'lng' => 51.520000],
        'Sheraton Grand Doha' => ['lat' => 25.319760, 'lng' => 51.534290],
        
        // Dubai
        'Atlantis, The Palm' => ['lat' => 25.130420, 'lng' => 55.116964],
        'Burj Al Arab' => ['lat' => 25.141151, 'lng' => 55.185244],
        'Kempinski Hotel Mall of the Emirates' => ['lat' => 25.118180, 'lng' => 55.197960],
        
        // Kuwait
        'Courtyard by Marriott' => ['lat' => 29.378772, 'lng' => 47.990422],
        'Magic Suite' => ['lat' => 29.135000, 'lng' => 48.113000], // Approx
        'ibis Kuwait Salmiya' => ['lat' => 29.340200, 'lng' => 48.077600],
        'Safir Fintas' => ['lat' => 29.176300, 'lng' => 48.114700],
        'Symphony Style' => ['lat' => 29.344400, 'lng' => 48.093300],
        'St. Regis Kuwait' => ['lat' => 29.362000, 'lng' => 47.958000], // Approx
        'Al Kout Beach' => ['lat' => 29.075800, 'lng' => 48.140000],
        'Best Western Plus Salmiya' => ['lat' => 29.340000, 'lng' => 48.077000],
        'Millennium Hotel' => ['lat' => 29.336000, 'lng' => 48.067000],

        // Bahrain
        'Four Seasons Hotel Bahrain' => ['lat' => 26.248386, 'lng' => 50.584985],
        'Mövenpick Hotel Bahrain' => ['lat' => 26.262692, 'lng' => 50.627798],
        'The Grove Resort' => ['lat' => 26.295478, 'lng' => 50.628867],
        'Elite Resort' => ['lat' => 26.241551, 'lng' => 50.601705],
        'Majestic Arjaan' => ['lat' => 26.265213, 'lng' => 50.605584],
        'Nordic Resort' => ['lat' => 26.071000, 'lng' => 50.490000],
        'The Art Hotel' => ['lat' => 26.280000, 'lng' => 50.660000],
        'Novotel Bahrain' => ['lat' => 26.245000, 'lng' => 50.603000],
        'Wyndham Grand Manama' => ['lat' => 26.242500, 'lng' => 50.582800],
        'The Merchant House' => ['lat' => 26.230000, 'lng' => 50.575000],

        // Oman
        'Al Bustan Palace' => ['lat' => 23.568390, 'lng' => 58.610530],
        'Salalah Rotana' => ['lat' => 17.025345, 'lng' => 54.195450],
        'Hilton Salalah' => ['lat' => 17.001710, 'lng' => 54.066551],
        'Juweira Boutique' => ['lat' => 17.027156, 'lng' => 54.205737],
        'Royal Gardens Hotel' => ['lat' => 24.364402, 'lng' => 56.711833],
        'InterContinental Muscat' => ['lat' => 23.613900, 'lng' => 58.441900],
        'Crowne Plaza Resort Salalah' => ['lat' => 17.007000, 'lng' => 54.135000],
        'Mercure Sohar' => ['lat' => 24.375000, 'lng' => 56.720000], // Approx

        // UAE Others
        'Waldorf Astoria RAK' => ['lat' => 25.702587, 'lng' => 55.773347],
        'Citymax Hotel RAK' => ['lat' => 25.767988, 'lng' => 55.942732],
        'Ramada Beach Hotel Ajman' => ['lat' => 25.420846, 'lng' => 55.441951],
        'Wyndham Garden Ajman' => ['lat' => 25.419266, 'lng' => 55.441006],
        'Qasr Al Sarab' => ['lat' => 22.900971, 'lng' => 54.333261], 
        'Retaj Inn Al Wakrah' => ['lat' => 25.176465, 'lng' => 51.602568],
        'Rixos Bab Al Bahr' => ['lat' => 25.722600, 'lng' => 55.748300],
        'Action Hotel RAK' => ['lat' => 25.790000, 'lng' => 55.950000], // Approx
        'DoubleTree Marjan Island' => ['lat' => 25.672000, 'lng' => 55.738000],
        'Pullman Sharjah' => ['lat' => 25.322000, 'lng' => 55.376000],
        'Novotel Sharjah Expo' => ['lat' => 25.308000, 'lng' => 55.372000],
        'Sahara Beach Resort' => ['lat' => 25.334000, 'lng' => 55.362000],
        
        // Qatar
        'Zulal Wellness Resort' => ['lat' => 26.113000, 'lng' => 51.171000]
    ];

    echo "🌍 Updating All Hotel Coordinates...\n";

    $sql = "UPDATE Hotel SET lat = :lat, lng = :lng, coords = :coords WHERE nameEn LIKE :namePattern";
    $stmt = $pdo->prepare($sql);

    foreach ($updates as $nameFragment => $coords) {
        $coordsString = "{$coords['lat']},{$coords['lng']}";
        $stmt->execute([
            ':lat' => $coords['lat'],
            ':lng' => $coords['lng'],
            ':coords' => $coordsString,
            ':namePattern' => "%$nameFragment%"
        ]);
        
        if ($stmt->rowCount() > 0) {
            echo "✅ Updated '$nameFragment'\n";
        }
    }

    echo "✨ All location updates completed!\n";

} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

