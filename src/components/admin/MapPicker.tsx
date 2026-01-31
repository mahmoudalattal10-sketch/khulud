import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { Search, MapPin, Loader2, Check, Save, X, AlertTriangle, Layers, Link2, Copy, ExternalLink } from 'lucide-react';

interface MapPickerProps {
    initialLat?: string;
    initialLng?: string;
    onLocationSelect: (lat: string, lng: string) => void;
    onSave?: (lat: string, lng: string) => Promise<boolean>;
    isSaving?: boolean;
}

const MapPicker: React.FC<MapPickerProps> = ({ initialLat, initialLng, onLocationSelect, onSave, isSaving = false }) => {
    // Default to Makkah if no initial coords
    const [lat, setLat] = useState(initialLat || '21.4225');
    const [lng, setLng] = useState(initialLng || '39.8262');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchMessage, setSearchMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
    const [mapStyle, setMapStyle] = useState<'roadmap' | 'satellite'>('roadmap');
    const [copied, setCopied] = useState(false);

    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const tileLayerRef = useRef<any>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Tile URLs for different styles
    const tileUrls = {
        roadmap: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        satellite: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}' // Hybrid satellite
    };

    // Initialize Leaflet Map
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!L || !mapContainerRef.current) return;

        if (!mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current, {
                center: [parseFloat(lat), parseFloat(lng)],
                zoom: 17,
                zoomControl: false // We'll add custom controls
            });

            // Add zoom control to bottom right (Google-style)
            L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);

            tileLayerRef.current = L.tileLayer(tileUrls[mapStyle], {
                attribution: '&copy; Google Maps',
                maxZoom: 21
            }).addTo(mapRef.current);

            // Create Google-style Marker
            const googleIcon = L.divIcon({
                className: 'google-map-marker',
                html: `
                    <div class="marker-wrapper">
                        <svg viewBox="0 0 27 43" width="32" height="48">
                            <path fill="#EA4335" d="M13.5 0C6.044 0 0 6.044 0 13.5 0 23.625 13.5 43 13.5 43S27 23.625 27 13.5C27 6.044 20.956 0 13.5 0z"/>
                            <circle fill="#B31412" cx="13.5" cy="13.5" r="5.5"/>
                            <circle fill="#fff" cx="13.5" cy="13.5" r="3"/>
                        </svg>
                    </div>
                `,
                iconSize: [32, 48],
                iconAnchor: [16, 48]
            });

            markerRef.current = L.marker([parseFloat(lat), parseFloat(lng)], {
                draggable: true,
                icon: googleIcon
            }).addTo(mapRef.current);

            // Sync marker drag
            markerRef.current.on('dragend', (e: any) => {
                const position = e.target.getLatLng();
                const newLat = position.lat.toString();
                const newLng = position.lng.toString();
                setLat(newLat);
                setLng(newLng);
                onLocationSelect(newLat, newLng);
            });

            // Click map to move marker with animation
            mapRef.current.on('click', (e: any) => {
                const newLat = e.latlng.lat.toString();
                const newLng = e.latlng.lng.toString();
                markerRef.current.setLatLng(e.latlng);
                setLat(newLat);
                setLng(newLng);
                onLocationSelect(newLat, newLng);
            });

            // Fix for map not rendering fully - invalidate size after a short delay
            setTimeout(() => {
                if (mapRef.current) {
                    mapRef.current.invalidateSize();
                }
            }, 100);

            // Also invalidate on window resize
            const handleResize = () => {
                if (mapRef.current) {
                    mapRef.current.invalidateSize();
                }
            };
            window.addEventListener('resize', handleResize);
        }

        return () => { };
    }, []);

    // Update tile layer when style changes
    useEffect(() => {
        if (mapRef.current && tileLayerRef.current && L) {
            mapRef.current.removeLayer(tileLayerRef.current);
            tileLayerRef.current = L.tileLayer(tileUrls[mapStyle], {
                attribution: '&copy; Google Maps',
                maxZoom: 21
            }).addTo(mapRef.current);
        }
    }, [mapStyle]);

    // Update map when initial coords change
    const updateMapPosition = (newLat: string, newLng: string) => {
        const l = parseFloat(newLat);
        const g = parseFloat(newLng);
        if (mapRef.current && markerRef.current) {
            mapRef.current.flyTo([l, g], 18, { duration: 1.5 });
            markerRef.current.setLatLng([l, g]);
        }
    };

    useEffect(() => {
        if (initialLat && initialLng && (initialLat !== lat || initialLng !== lng)) {
            setLat(initialLat);
            setLng(initialLng);
            updateMapPosition(initialLat, initialLng);
        }
    }, [initialLat, initialLng]);

    // Debounced Search Handler
    const performSearch = useCallback(async (query: string) => {
        if (!query.trim() || query.length < 3) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        setSearchMessage(null);

        // Process HTML or direct input
        let processedQuery = query.trim();
        if (processedQuery.startsWith('<')) {
            const srcMatch = processedQuery.match(/src=["']([^"']+)["']/);
            if (srcMatch) {
                processedQuery = srcMatch[1];
            }
        }

        // Patterns for coordinate extraction (Ordered by priority: POI/Pin > Camera Center)
        const patterns = [
            { regex: /!2d([-+]?\d{1,3}\.\d+)!3d([-+]?\d{1,2}\.\d+)/, latIdx: 2, lngIdx: 1 }, // !2d(lng)!3d(lat) - Embed/Pin priority
            { regex: /!3d([-+]?\d{1,2}\.\d+)!4d([-+]?\d{1,3}\.\d+)/, latIdx: 1, lngIdx: 2 }, // !3d(lat)!4d(lng) - Internal/Pin priority
            { regex: /q=([-+]?\d{1,2}\.\d+)[,\s]+([-+]?\d{1,3}\.\d+)/, latIdx: 1, lngIdx: 2 }, // q=lat,lng - Search/Pin priority
            { regex: /@([-+]?\d{1,2}\.\d+)[,\s]+([-+]?\d{1,3}\.\d+)/, latIdx: 1, lngIdx: 2 }, // @lat,lng - Camera view (Lower priority)
            { regex: /^([-+]?\d{1,2}\.\d+)[,\s]+([-+]?\d{1,3}\.\d+)$/, latIdx: 1, lngIdx: 2 } // Raw lat,lng
        ];

        let foundLat = '', foundLng = '';
        for (const p of patterns) {
            const match = processedQuery.match(p.regex);
            if (match) {
                foundLat = match[p.latIdx];
                foundLng = match[p.lngIdx];
                break;
            }
        }

        if (foundLat && foundLng) {
            setLat(foundLat);
            setLng(foundLng);
            onLocationSelect(foundLat, foundLng);
            updateMapPosition(foundLat, foundLng);
            setSearchMessage({ type: 'success', text: "تم استخراج الإحداثيات بنجاح! 🎯" });
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        // Special handling for Short Links (goo.gl / maps.app.goo.gl)
        if (processedQuery.includes('goo.gl') || processedQuery.includes('maps.app.goo')) {
            setSearchMessage({
                type: 'info',
                text: "هذا رابط مختصر. يرجى استخدام رابط المتصفح الطويل أو كود الـ HTML 'تضمين خريطة' لدقة 100%."
            });
            // We don't return here, we let it fall through to search by the link string as a fallback
        }

        // Smart query enhancement for hotels
        const hotelKeywords = ['فندق', 'hotel', 'فنادق', 'hotels', 'رافلز', 'سويس', 'هيلتون', 'ماريوت', 'موفنبيك', 'شيراتون', 'كراون بلازا', 'إنتركونتيننتال', 'انتركونتينينتال', 'ريتز', 'فورسيزونز', 'أدريس', 'العنوان', 'فيرمونت', 'بولمان', 'شذا', 'أنجم', 'جبل عمر', 'قصر مكة', 'دار التوحيد', 'مكارم', 'اجياد'];
        const isHotelSearch = hotelKeywords.some(kw => query.toLowerCase().includes(kw.toLowerCase()));

        const hotelSearchQuery = isHotelSearch ? query : `${query} فندق`;

        // Parallel API search with geographic bias for Saudi Arabia
        const fetchWithTimeout = async (url: string, timeout = 5000) => {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);
            try {
                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(id);
                return response;
            } catch (e) {
                clearTimeout(id);
                throw e;
            }
        };

        const saudiBbox = '34.0,16.0,56.0,32.5';

        try {
            const searchStrategies = [
                (async () => {
                    try {
                        const res = await fetchWithTimeout(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=ar&lat=21.4&lon=39.8`);
                        const data = await res.json();
                        return (data.features || []).map((f: any) => ({
                            name: f.properties.name || f.properties.city || 'موقع',
                            address: [f.properties.street, f.properties.city, f.properties.state, f.properties.country].filter(Boolean).join(', '),
                            lat: f.geometry.coordinates[1],
                            lng: f.geometry.coordinates[0],
                            type: f.properties.osm_value || f.properties.osm_key || 'place',
                            isHotel: ['hotel', 'hostel', 'motel', 'guest_house', 'apartment'].includes(f.properties.osm_value)
                        }));
                    } catch { return []; }
                })(),
                (async () => {
                    try {
                        const res = await fetchWithTimeout(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&accept-language=ar&addressdetails=1&bounded=1&viewbox=${saudiBbox}`);
                        const data = await res.json();
                        return (data || []).map((f: any) => ({
                            name: f.name || f.display_name?.split(',')[0] || 'موقع',
                            address: f.display_name,
                            lat: parseFloat(f.lat),
                            lng: parseFloat(f.lon),
                            type: f.type || f.class || 'place',
                            isHotel: ['hotel', 'hostel', 'motel', 'guest_house', 'apartment', 'tourism'].includes(f.type) || f.class === 'tourism'
                        }));
                    } catch { return []; }
                })(),
                (async () => {
                    try {
                        const res = await fetchWithTimeout(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(hotelSearchQuery + ' السعودية')}&format=json&limit=3&accept-language=ar&addressdetails=1`);
                        const data = await res.json();
                        return (data || []).map((f: any) => ({
                            name: f.name || f.display_name?.split(',')[0] || 'موقع',
                            address: f.display_name,
                            lat: parseFloat(f.lat),
                            lng: parseFloat(f.lon),
                            type: f.type || f.class || 'place',
                            isHotel: true
                        }));
                    } catch { return []; }
                })()
            ];

            const allResults = await Promise.all(searchStrategies);
            const flattenedResults = allResults.flat();

            // Intelligent Scoring System
            const resultsWithScores = flattenedResults.map(r => {
                let score = 0;
                const lowerName = r.name.toLowerCase();
                const lowerQuery = query.toLowerCase();
                const queryWords = lowerQuery.split(' ').filter(w => w.length > 2);

                // 1. Exact Name Match (Highest priority)
                if (lowerName === lowerQuery) score += 1000;
                // 2. Starts with Query
                else if (lowerName.startsWith(lowerQuery)) score += 500;
                // 3. Includes all query words
                else if (queryWords.every(word => lowerName.includes(word))) score += 300;

                // 4. Hotel prioritization
                if (r.isHotel) score += 200;

                // 5. Holy Cities Weighting
                if (r.address?.includes('مكة') || r.address?.includes('المدينة') || r.address?.includes('Makkah') || r.address?.includes('Madinah')) {
                    score += 150;
                }

                return { ...r, score };
            });

            // Filter unique results with strict coordinate deduplication
            const sortedResults = resultsWithScores.sort((a, b) => b.score - a.score);

            const uniqueResults = sortedResults.filter((v, i, a) =>
                a.findIndex(t =>
                    (t.name === v.name && Math.abs(t.lat - v.lat) < 0.005) ||
                    (Math.abs(t.lat - v.lat) < 0.0001 && Math.abs(t.lng - v.lng) < 0.0001)
                ) === i
            ).slice(0, 6);

            setSearchResults(uniqueResults);
            if (uniqueResults.length === 0 && query.length > 3) {
                setSearchMessage({ type: 'info', text: 'لم نجد نتائج دقيقة. جرب إضافة اسم المدينة أو "فندق" للبحث.' });
            }
        } catch (error) {
            setSearchMessage({ type: 'error', text: 'خطأ في البحث. جرب مرة أخرى.' });
        } finally {
            setIsSearching(false);
        }
    }, [onLocationSelect]);

    // Debounced input handler
    const handleSearchInput = (value: string) => {
        setSearchQuery(value);
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            performSearch(value);
        }, 400);
    };

    const selectResult = (result: any) => {
        const nLat = result.lat.toString();
        const nLng = result.lng.toString();
        setLat(nLat);
        setLng(nLng);
        onLocationSelect(nLat, nLng);
        updateMapPosition(nLat, nLng);
        setSearchQuery(result.name);
        setSearchResults([]);
        setSearchMessage({ type: 'success', text: "تم تحديد الموقع ✅" });
    };

    const copyCoords = () => {
        navigator.clipboard.writeText(`${lat}, ${lng}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const openInGoogleMaps = () => {
        window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    };

    return (
        <div className="relative">
            {/* Google-Style Map Container */}
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-slate-200">

                {/* Search Bar - Google Style */}
                <div className="absolute top-4 left-4 right-4 z-[1000]">
                    <div className="relative">
                        <div className="flex items-center bg-white rounded-lg shadow-lg border border-slate-100 overflow-hidden">
                            <div className="px-4 py-3 text-slate-400">
                                {isSearching ? (
                                    <Loader2 size={20} className="animate-spin text-blue-500" />
                                ) : (
                                    <Search size={20} />
                                )}
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearchInput(e.target.value)}
                                onKeyDown={(e) => e.stopPropagation()}
                                placeholder="ابحث عن مكان أو الصق رابط Google Maps..."
                                autoComplete="off"
                                spellCheck={false}
                                className="flex-1 py-3 pl-2 pr-2 text-sm font-medium text-text placeholder-slate-400 focus:outline-none bg-transparent min-w-0"
                                dir="rtl"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => { setSearchQuery(''); setSearchResults([]); setSearchMessage(null); }}
                                    className="px-2 py-3 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            )}

                            {/* Map Style Toggle - Inside Search Bar */}
                            <div className="flex border-r border-slate-200">
                                <button
                                    onClick={() => setMapStyle('roadmap')}
                                    className={`px-3 py-3 text-xs font-bold transition-colors ${mapStyle === 'roadmap' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    خريطة
                                </button>
                                <button
                                    onClick={() => setMapStyle('satellite')}
                                    className={`px-3 py-3 text-xs font-bold transition-colors flex items-center gap-1 ${mapStyle === 'satellite' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <Layers size={14} />
                                    قمر صناعي
                                </button>
                            </div>
                        </div>

                        {/* Search Results Dropdown - Google Style */}
                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-slate-100 overflow-hidden z-[9999]">
                                <div className="max-h-72 overflow-y-auto">
                                    {searchResults.map((result, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => selectResult(result)}
                                            className="w-full px-4 py-3 text-right hover:bg-slate-50 transition-colors flex items-start gap-3 border-b border-slate-50 last:border-0"
                                        >
                                            <div className="mt-1 w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                                <MapPin size={16} className="text-red-500" />
                                            </div>
                                            <div className="flex-1 text-right">
                                                <div className="text-sm font-bold text-text leading-tight">{result.name}</div>
                                                <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{result.address}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* The Map */}
                <div ref={mapContainerRef} className="w-full h-full" />

                {/* Coordinates Bar - Google Style */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 z-[1000]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={copyCoords}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/90 hover:bg-white rounded-full text-xs font-bold text-slate-700 shadow transition-all"
                            >
                                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                {copied ? 'تم النسخ!' : 'نسخ الإحداثيات'}
                            </button>
                            <button
                                onClick={openInGoogleMaps}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/90 hover:bg-white rounded-full text-xs font-bold text-slate-700 shadow transition-all"
                            >
                                <ExternalLink size={14} />
                                Google Maps
                            </button>
                        </div>
                        <div className="flex items-center gap-3 text-white text-xs font-mono">
                            <span className="opacity-70">Lat:</span>
                            <span className="font-bold">{parseFloat(lat).toFixed(6)}</span>
                            <span className="opacity-50">|</span>
                            <span className="opacity-70">Lng:</span>
                            <span className="font-bold">{parseFloat(lng).toFixed(6)}</span>
                        </div>
                    </div>
                </div>

                {/* Paste Link Hint */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
                    <div className="bg-primary/70 text-white text-[10px] font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                        <Link2 size={12} />
                        <span>نصيحة: الصق رابط Google Maps للحصول على دقة أعلى</span>
                    </div>
                </div>
            </div>

            {/* Status Messages */}
            {searchMessage && (
                <div className={`mt-4 flex items-center gap-3 px-4 py-3 rounded-xl border ${searchMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' :
                    searchMessage.type === 'info' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-red-50 text-red-700 border-red-100'
                    }`}>
                    {searchMessage.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
                    <span className="text-sm font-bold">{searchMessage.text}</span>
                </div>
            )}

            {/* Save Button */}
            {onSave && (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={async () => {
                            const success = await onSave(lat, lng);
                            if (success) {
                                setSearchMessage({ type: 'success', text: 'تم حفظ الموقع بنجاح! ✅' });
                            } else {
                                setSearchMessage({ type: 'error', text: 'حدث خطأ أثناء الحفظ. حاول مرة أخرى.' });
                            }
                        }}
                        disabled={isSaving}
                        className={`px-8 py-4 rounded-xl font-black text-sm flex items-center gap-3 shadow-xl transition-all active:scale-95 ${isSaving
                            ? 'bg-slate-200 text-slate-500'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30'
                            }`}
                    >
                        {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        <span>حفظ الموقع</span>
                    </button>
                </div>
            )}

            {/* Custom marker styles */}
            <style>{`
                .google-map-marker .marker-wrapper {
                    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
                    animation: markerDrop 0.3s ease-out;
                }
                @keyframes markerDrop {
                    0% { transform: translateY(-20px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                .leaflet-control-zoom {
                    border: none !important;
                    box-shadow: 0 1px 5px rgba(0,0,0,0.25) !important;
                }
                .leaflet-control-zoom a {
                    width: 32px !important;
                    height: 32px !important;
                    line-height: 32px !important;
                    font-size: 18px !important;
                    border: none !important;
                }
            `}</style>
        </div>
    );
};

export default MapPicker;
