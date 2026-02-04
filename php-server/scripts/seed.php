<?php

require __DIR__ . '/../vendor/autoload.php';

use Diafat\Config\Database;
use Ramsey\Uuid\Uuid;
use Dotenv\Dotenv;

// Load Environment Variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$pdo = Database::getConnection();

// --- DATA DEFINITIONS ---

$amenities = [
    'wifi' => ['label' => 'واي فاي مجاني', 'icon' => 'Wifi'],
    'parking' => ['label' => 'مواقف سيارات', 'icon' => 'Car'],
    'pool' => ['label' => 'مسبح فندقي', 'icon' => 'Waves'],
    'gym' => ['label' => 'نادي رياضي', 'icon' => 'Dumbbell'],
    'food' => ['label' => 'مطعم فاخر', 'icon' => 'Utensils'],
    'shuttle' => ['label' => 'نقل للحرم 24/7', 'icon' => 'Bus'],
    'spa' => ['label' => 'مركز سبا وعافية', 'icon' => 'Sparkles'],
    'room_service' => ['label' => 'خدمة غرف 24/7', 'icon' => 'Bell'],
    'kids_club' => ['label' => 'نادي أطفال', 'icon' => 'Gamepad2'],
    'business' => ['label' => 'مركز أعمال', 'icon' => 'Briefcase'],
    'laundry' => ['label' => 'خدمة غسيل', 'icon' => 'Shirt'],
    'concierge' => ['label' => 'كونسيرج', 'icon' => 'UserCheck'],
    'cafe' => ['label' => 'مقهى', 'icon' => 'Coffee'],
    'valet' => ['label' => 'صف سيارات', 'icon' => 'Key'],
];

$hotels = [
    [
        'name' => "فندق ساعة مكة فيرمونت (Fairmont Makkah Clock Royal Tower)",
        'nameEn' => "Fairmont Makkah Clock Royal Tower",
        'location' => "أبراج البيت - وقف الملك عبدالعزيز",
        'locationEn' => "Abraj Al Bait - King Abdulaziz Endowment",
        'city' => "makkah",
        'rating' => 5,
        'basePrice' => 1500,
        'coords' => "21.41818,39.82557",
        'distanceFromHaram' => "100 متر",
        'description' => "أيقونة مكة المكرمة وأقرب فندق للحرم المكي الشريف. يقع داخل برج الساعة الشهير ويوفر إطلالات مباشرة على الكعبة المشرفة.",
        'image' => "https://images.unsplash.com/photo-1519817650390-1c069b275f0f?q=80&w=1000",
        'amenities' => ["wifi", "food", "concierge", "valet", "business", "room_service", "kids_club"],
        'isFeatured' => 1,
        'view' => 'Kaaba View'
    ],
    [
        'name' => "قصر رافلز مكة (Raffles Makkah Palace)",
        'nameEn' => "Raffles Makkah Palace",
        'location' => "أبراج البيت",
        'locationEn' => "Abraj Al Bait",
        'city' => "makkah",
        'rating' => 5,
        'basePrice' => 2000,
        'coords' => "21.41893,39.82615",
        'distanceFromHaram' => "100 متر",
        'description' => "أجنحة فاخرة فقط بإطلالات بانورامية على الحرم. يتميز بخدمة الخادم الشخصي (البتلر) والهدوء التام والخصوصية.",
        'image' => "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000",
        'amenities' => ["wifi", "spa", "food", "concierge", "valet"],
        'isFeatured' => 1,
         'view' => 'Haram View'
    ],
    [
        'name' => "دار التوحيد إنتركونتيننتال (Dar Al Tawhid Intercontinental)",
        'nameEn' => "Dar Al Tawhid Intercontinental",
        'location' => "شارع إبراهيم الخليل",
        'locationEn' => "Ibrahim Al Khalil St",
        'city' => "makkah",
        'rating' => 5,
        'basePrice' => 1800,
        'coords' => "21.42096,39.82272",
        'distanceFromHaram' => "150 متر",
        'description' => "الفندق المفضل لكبار الشخصيات. يقع مباشرة أمام بوابة الملك فهد. يتميز بالفخامة الكلاسيكية والمصلى الخاص المطل على الحرم.",
        'image' => "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000",
        'amenities' => ["wifi", "food", "business", "laundry", "concierge", "valet"],
        'isFeatured' => 1,
         'view' => 'Haram View'
    ],
    [
         'name' => "فندق أنجم مكة (Anjum Hotel Makkah)",
         'nameEn' => "Anjum Hotel Makkah",
         'location' => "جبل الكعبة",
         'locationEn' => "Jabal Al Kaaba",
         'city' => "makkah",
         'rating' => 5,
         'basePrice' => 600,
         'coords' => "21.4250,39.8200",
         'distanceFromHaram' => "500 متر",
         'description' => "أكبر فندق في مكة من حيث عدد الغرف. يتميز بباحته الأمامية الواسعة ومدخله الخاص عبر نفق للمشاة للحرم.",
         'image' => "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1000",
         'amenities' => ["wifi", "food", "shuttle", "kids_club", "parking"],
         'isFeatured' => 0,
          'view' => 'City View'
     ],
     [
         'name' => "أبراج الكسوة (Kiswah Towers Hotel)",
         'nameEn' => "Kiswah Towers Hotel",
         'location' => "حي التيسير",
         'locationEn' => "At Taysir Dist",
         'city' => "makkah",
         'rating' => 3,
         'basePrice' => 200,
         'coords' => "21.4300,39.8100",
         'distanceFromHaram' => "1500 متر",
         'description' => "الخيار الاقتصادي الأضخم. يوفر آلاف الغرف بأسعار منافسة جداً مع خدمة نقل مجانية للحرم على مدار الساعة.",
         'image' => "https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=1000",
         'amenities' => ["wifi", "shuttle", "food", "laundry"],
         'isFeatured' => 0,
          'view' => 'City View'
     ],
     [
        'name' => "بولمان زمزم المدينة (Pullman Zamzam Madina)",
        'nameEn' => "Pullman Zamzam Madina",
        'location' => "شارع عمرو بن الجموح",
        'locationEn' => "Amr Bin Al Jamooh St",
        'city' => "madinah",
        'rating' => 5,
        'basePrice' => 550,
        'coords' => "24.4672,39.6100",
        'distanceFromHaram' => "150 متر",
        'description' => "فندق فاخر يمزج الضيافة العربية والفرنسية. يقع على بعد خطوات من باب السلام.",
        'image' => "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000",
        'amenities' => ["wifi", "food", "cafe", "room_service"],
        'isFeatured' => 1,
         'view' => 'Prophet Mosque View'
    ]
];

// --- HELPER FUNCTIONS ---

function cleanDatabase($pdo) {
    echo "🧹 Cleaning database...\n";
    $tables = ['Review', 'Booking', 'RoomImage', 'RoomFeature', 'PricingPeriod', 'Room', 'HotelImage', 'HotelAmenity', 'NearbyPlace', 'Hotel', 'Amenity', 'User', 'Coupon'];
    
    // Disable FK checks
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
    foreach ($tables as $table) {
        $pdo->exec("TRUNCATE TABLE $table");
    }
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
    echo "✨ Valid tables truncated.\n";
}

function seedAmenities($pdo, $list) {
    echo "🌱 Seeding Amenities...\n";
    $sql = "INSERT INTO Amenity (id, name, nameEn, icon) VALUES (:id, :name, :nameEn, :icon)";
    $stmt = $pdo->prepare($sql);
    
    $map = []; 
    foreach ($list as $key => $data) {
        $id = Uuid::uuid4()->toString();
        $stmt->execute([
            ':id' => $id,
            ':name' => $key,
            ':nameEn' => ucfirst($key),
            ':icon' => $data['icon']
        ]);
        $map[$key] = $id;
    }
    return $map;
}

function seedUsers($pdo) {
    echo "👤 Seeding Users...\n";
    $id = Uuid::uuid4()->toString();
    $hash = password_hash('123123', PASSWORD_BCRYPT);
    
    $sql = "INSERT INTO User (id, email, password, name, phone, country, role) 
            VALUES (:id, 'admin@diafat.com', :hash, 'Admin User', '966500000000', 'SA', 'ADMIN')";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $id, ':hash' => $hash]);
    echo "✅ Admin created: admin@diafat.com / 123123\n";
}

function seedHotels($pdo, $hotels, $amenityMap) {
    echo "🏨 Seeding Hotels...\n";
    
    foreach ($hotels as $h) {
        $hotelId = Uuid::uuid4()->toString();
        $slug = strtolower(str_replace(' ', '-', $h['nameEn'])) . '-' . rand(1000,9999);
        
        // 1. Insert Hotel
        $sql = "INSERT INTO Hotel (id, slug, name, nameEn, location, locationEn, city, rating, reviews, basePrice, image, coords, description, isFeatured, discount, distanceFromHaram, view, createdAt, updatedAt) 
                VALUES (:id, :slug, :name, :nameEn, :location, :locationEn, :city, :rating, :reviews, :basePrice, :image, :coords, :description, :isFeatured, :discount, :distanceFromHaram, :view, :createdAt, :updatedAt)";
        
        $pdo->prepare($sql)->execute([
            ':id' => $hotelId,
            ':slug' => $slug,
            ':name' => $h['name'],
            ':nameEn' => $h['nameEn'],
            ':location' => $h['location'],
            ':locationEn' => $h['locationEn'],
            ':city' => $h['city'],
            ':rating' => $h['rating'],
            ':reviews' => rand(50, 500),
            ':basePrice' => $h['basePrice'],
            ':image' => $h['image'],
            ':coords' => $h['coords'],
            ':description' => $h['description'],
            ':isFeatured' => $h['isFeatured'] ?? 0,
            ':discount' => rand(0, 1) ? '10%' : null,
            ':distanceFromHaram' => $h['distanceFromHaram'],
            ':view' => $h['view'] ?? null,
            ':createdAt' => date('Y-m-d H:i:s'),
            ':updatedAt' => date('Y-m-d H:i:s')
        ]);

        // 2. Link Amenities
        $amenitySql = "INSERT INTO HotelAmenity (hotelId, amenityId) VALUES (:hotelId, :amenityId)";
        $amenityStmt = $pdo->prepare($amenitySql);
        
        foreach ($h['amenities'] as $aKey) {
            if (isset($amenityMap[$aKey])) {
                $amenityStmt->execute([':hotelId' => $hotelId, ':amenityId' => $amenityMap[$aKey]]);
            }
        }

        // 3. Add Images
        $imgSql = "INSERT INTO HotelImage (id, url, isMain, hotelId) VALUES (:id, :url, 1, :hotelId)";
        $pdo->prepare($imgSql)->execute([
            ':id' => Uuid::uuid4()->toString(),
            ':url' => $h['image'], // Using main image as gallery image 1
            ':hotelId' => $hotelId
        ]);

        // 4. Add Rooms
        seedRooms($pdo, $hotelId, $h['basePrice']);
        
        echo "   + $h[name]\n";
    }
}

function seedRooms($pdo, $hotelId, $basePrice) {
    $roomTypes = [
        ['name' => 'غرفة ديلوكس كينغ', 'type' => 'Double', 'capacity' => 2, 'priceMult' => 1],
        ['name' => 'غرفة ثلاثية', 'type' => 'Triple', 'capacity' => 3, 'priceMult' => 1.3],
        ['name' => 'جناح تنفيذي', 'type' => 'Suite', 'capacity' => 4, 'priceMult' => 2.5],
    ];

    $sql = "INSERT INTO Room (id, name, type, capacity, price, availableStock, mealPlan, isVisible, hotelId, view) 
            VALUES (:id, :name, :type, :capacity, :price, :stock, :mealPlan, 1, :hotelId, :view)";
    $stmt = $pdo->prepare($sql);

    foreach ($roomTypes as $rt) {
        $stmt->execute([
            ':id' => Uuid::uuid4()->toString(),
            ':name' => $rt['name'],
            ':type' => $rt['type'],
            ':capacity' => $rt['capacity'],
            ':price' => $basePrice * $rt['priceMult'],
            ':stock' => rand(5, 20),
            ':mealPlan' => 'شامل الإفطار',
            ':hotelId' => $hotelId,
             ':view' => rand(0,1) ? 'City View' : 'Haram View'
        ]);
    }
}

// --- MAIN EXECUTION ---

try {
    cleanDatabase($pdo);
    $amenityMap = seedAmenities($pdo, $amenities);
    seedUsers($pdo);
    seedHotels($pdo, $hotels, $amenityMap);
    echo "\n🚀 Database seeded successfully!\n";
} catch (Exception $e) {
    echo "\n❌ Seeding Failed: " . $e->getMessage() . "\n";
    exit(1);
}

