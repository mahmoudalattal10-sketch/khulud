<?php
// Normalization logic equivalent to Hotel.php
function normalizeDate($dateStr) {
    if (!$dateStr) return null;
    try {
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateStr)) return $dateStr;
        $dt = new DateTime($dateStr);
        if (strpos($dateStr, 'T') !== false || strpos($dateStr, 'Z') !== false) {
            $dt->setTimezone(new DateTimeZone('Asia/Riyadh'));
        }
        return $dt->format('Y-m-d');
    } catch (Exception $e) {
        return substr($dateStr, 0, 10);
    }
}

// Case 1: ISO UTC Shift (Feb 1 00:00 AST = Jan 31 21:00 UTC)
$filters1 = ['checkIn' => '2026-01-31T21:00:00.000Z', 'checkOut' => '2026-02-17T21:00:00.000Z'];
$ci1 = normalizeDate($filters1['checkIn']); 
$co1 = normalizeDate($filters1['checkOut']);

echo "Search: $ci1 to $co1 (Original: " . $filters1['checkIn'] . ")\n";

$pricingPeriods = [
    ['startDate' => '2026-02-01 00:00:00', 'endDate' => '2026-02-23 00:00:00', 'label' => 'Standard Period']
];

foreach ($pricingPeriods as $p) {
    $pStart = normalizeDate($p['startDate']);
    $pEnd = normalizeDate($p['endDate']);
    $isFull = ($pStart <= $ci1 && $pEnd >= $co1);
    echo "Period: " . $p['label'] . " ($pStart to $pEnd)\n";
    echo "Full Match: " . ($isFull ? 'YES ✅' : 'NO ❌') . "\n";
}

echo "--------------------------\n";

// Case 2: Aggregate Coverage
echo "Search: 2026-03-01 to 2026-03-10\n";
$ci2 = '2026-03-01'; $co2 = '2026-03-10';
$segments = [
    ['start' => '2026-03-01', 'end' => '2026-03-05'],
    ['start' => '2026-03-05', 'end' => '2026-03-15']
];

$currentEdge = $ci2;
foreach ($segments as $seg) {
    if ($seg['start'] <= $currentEdge) {
        $currentEdge = max($currentEdge, $seg['end']);
    }
}
$isFullAgg = ($currentEdge >= $co2);
echo "Aggregate Full Match: " . ($isFullAgg ? 'YES ✅' : 'NO ❌') . "\n";

