
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useHotelDetails } from '../hooks/useHotelDetails';
import {
    Monitor, Eye, EyeOff, LayoutGrid, X, Trash2, Edit2, Play, Pause, Save,
    ExternalLink, Map, MapPinned, Star, Bed, BedDouble, Check, Plus, Minus, Info, Globe, Calendar,
    ChevronLeft, ChevronRight, Search, Filter, ArrowRight, Share2, Heart, MessageCircle,
    Clock, Baby, CreditCard, Shield, Award, Sparkles, Plane, Sun, Mountain, SlidersHorizontal, ArrowUpDown, RefreshCw,
    Maximize, Users, Lock, Unlock, LogOut, LogIn, Key, Bell, HelpCircle, FileText, Printer, Briefcase,
    FireExtinguisher, Cctv, Siren, Accessibility, Sofa, Tv, TabletSmartphone, Coffee, UtensilsCrossed,
    CigaretteOff, Bath, ShowerHead, Utensils, Droplets, Wind, Percent,
    ShoppingBag, VolumeX, Flame, Speaker, ChefHat, Scissors, Wifi, Car, CheckCircle2, Loader2, AlertCircle, Moon, UserCheck, Armchair, User, Zap, Waves, Dumbbell, Gamepad2, Shirt, ArrowLeft,
    MapPin, Footprints, Phone, GlassWater, ShieldCheck, Building
} from 'lucide-react';
import MobileSearchOverlay from '../components/MobileSearchOverlay';
import HotelBookingSearch from '../components/HotelBookingSearch';
import HotelViewMap from '../components/HotelViewMap';
import AvailabilityBadge from '../components/AvailabilityBadge';
import { useSearch, formatDateArabic } from '../contexts/SearchContext';


const HOTEL_FACILITIES_DATA = [
    {
        category: "أبرز المرافق",
        icon: <Star className="w-5 h-5 text-[#D6B372]" />,
        items: [
            { name: "واي فاي مجاني", icon: <Wifi size={16} /> },
            { name: "حمّام خاص", icon: <Bath size={16} /> },
            { name: "غرف عائلية", icon: <Users size={16} /> },
            { name: "موقف سيارات", icon: <Car size={16} /> },
            { name: "مطعم", icon: <Utensils size={16} /> },
            { name: "خدمة الغرف", icon: <Bell size={16} /> },
            { name: "غرف لغير المدخنين", icon: <CigaretteOff size={16} /> },
            { name: "مرافق لذوي الاحتياجات الخاصة", icon: <Accessibility size={16} /> }
        ]
    },
    {
        category: "مرافق الغرفة",
        icon: <BedDouble className="w-5 h-5 text-[#0f172a]" />,
        items: [
            { name: "تكييف", icon: <Wind size={16} /> },
            { name: "تلفزيون بشاشة مسطحة", icon: <Monitor size={16} /> },
            { name: "عازل للصوت", icon: <VolumeX size={16} /> },
            { name: "غلاية كهربائية", icon: <Coffee size={16} /> },
            { name: "مقبس بجانب السرير", icon: <Zap size={16} /> },
            { name: "خزانة", icon: <Lock size={16} /> },
            { name: "منطقة معيشة", icon: <Sofa size={16} /> },
            { name: "مكتب", icon: <Briefcase size={16} /> }
        ]
    },
    {
        category: "الحمام",
        icon: <Bath className="w-5 h-5 text-[#0f172a]" />,
        items: [
            { name: "لوازم استحمام مجانية", icon: <Droplets size={16} /> },
            { name: "دش", icon: <ShowerHead size={16} /> },
            { name: "مرحاض", icon: <HelpCircle size={16} /> },
            { name: "مناشف", icon: <Shirt size={16} /> },
            { name: "نعال", icon: <Footprints size={16} /> },
            { name: "ورق حمام", icon: <FileText size={16} /> },
            { name: "مجفف شعر", icon: <Wind size={16} /> }
        ]
    },
    {
        category: "ميديا وتكنولوجيا",
        icon: <Tv className="w-5 h-5 text-[#0f172a]" />,
        items: [
            { name: "تلفزيون", icon: <Tv size={16} /> },
            { name: "قنوات فضائية", icon: <Tv size={16} /> },
            { name: "هاتف", icon: <Phone size={16} /> },
        ]
    },
    {
        category: "مأكولات ومشروبات",
        icon: <UtensilsCrossed className="w-5 h-5 text-[#D6B372]" />,
        items: [
            { name: "مقهى في الموقع", icon: <Coffee size={16} /> },
            { name: "فواكه", icon: <Utensils size={16} /> },
            { name: "وجبات أطفال", icon: <Baby size={16} /> },
            { name: "ميني بار", icon: <GlassWater size={16} /> },
            { name: "آلة صنع الشاي / القهوة", icon: <Coffee size={16} /> },
            { name: "طاولات طعام", icon: <Utensils size={16} /> }
        ]
    },
    {
        category: "خدمات استقبال",
        icon: <Bell className="w-5 h-5 text-[#0f172a]" />,
        items: [
            { name: "مكتب استقبال على مدار 24 ساعة", icon: <Clock size={16} /> },
            { name: "تسجيل سريع للوصول والمغادرة", icon: <Zap size={16} /> },
            { name: "خدمة كونسيرج", icon: <UserCheck size={16} /> },
            { name: "خزائن", icon: <Lock size={16} /> },
            { name: "يمكن طلب فاتورة", icon: <FileText size={16} /> }
        ]
    },
    {
        category: "خدمات تنظيف",
        icon: <Sparkles className="w-5 h-5 text-[#0f172a]" />,
        items: [
            { name: "خدمة تنظيف يومية", icon: <Sparkles size={16} /> },
            { name: "ضاغط للسراويل", icon: <Shirt size={16} /> },
            { name: "خدمة كي الملابس", icon: <Shirt size={16} /> },
            { name: "التنظيف الجاف للملابس", icon: <Shirt size={16} /> },
            { name: "مرافق غسيل الملابس", icon: <Waves size={16} /> }
        ]
    },
    {
        category: "الأمان والحماية",
        icon: <Shield className="w-5 h-5 text-[#0f172a]" />,
        items: [
            { name: "طفايات حريق", icon: <FireExtinguisher size={16} /> },
            { name: "أجهزة إنذار الدخان", icon: <Siren size={16} /> },
            { name: "أمن على مدار الساعة", icon: <Shield size={16} /> },
            { name: "بطاقات مفاتيح الدخول", icon: <Key size={16} /> },
            { name: "صندوق الأمانات", icon: <Lock size={16} /> },
            { name: "كاميرات دوائر تلفزيونية", icon: <Cctv size={16} /> }
        ]
    },
    {
        category: "لغات التحدث",
        icon: <Globe className="w-5 h-5 text-blue-600" />,
        items: [
            { name: "العربية", icon: <Globe size={16} /> },
            { name: "الإنجليزية", icon: <Globe size={16} /> },
            { name: "الفرنسية", icon: <Globe size={16} /> },
            { name: "التركية", icon: <Globe size={16} /> },
            { name: "الأردوية", icon: <Globe size={16} /> },
            { name: "الإندونيسية", icon: <Globe size={16} /> }
        ]
    }
];

// Helper Map for Amenities
const amenityTranslations: Record<string, string> = {
    'wifi': 'واي فاي مجاني',
    'parking': 'مواقف سيارات',
    'pool': 'مسبح فندقي',
    'gym': 'نادي رياضي',
    'food': 'مطعم فاخر',
    'shuttle': 'نقل للحرم 24/7',
    'spa': 'مركز سبا وعافية',
    'room_service': 'خدمة غرف 24/7',
    'kids_club': 'نادي أطفال',
    'business': 'مركز أعمال',
    'laundry': 'خدمة غسيل',
    'concierge': 'كونسيرج',
    'cafe': 'مقهى',
    'valet': 'صف سيارات',
};

const getAmenityDetails = (key: string) => {
    if (!key || typeof key !== 'string') return { name: 'مرفق', icon: <CheckCircle2 size={20} /> };
    const k = key.toLowerCase();
    let name = amenityTranslations[k] || key;
    let icon = <CheckCircle2 size={20} />;

    if (k.includes('wifi')) icon = <Wifi size={20} />;
    else if (k.includes('parking')) icon = <Car size={20} />;
    else if (k.includes('pool')) icon = <Waves size={20} />;
    else if (k.includes('gym')) icon = <Dumbbell size={20} />;
    else if (k.includes('food') || k.includes('restaurant')) icon = <Utensils size={20} />;
    else if (k.includes('shuttle') || k.includes('transport')) icon = <Plane size={20} />;
    else if (k.includes('spa')) icon = <Sparkles size={20} />;
    else if (k.includes('room_service')) icon = <Bell size={20} />;
    else if (k.includes('kids')) icon = <Gamepad2 size={20} />;
    else if (k.includes('business')) icon = <Briefcase size={20} />;
    else if (k.includes('laundry')) icon = <Shirt size={20} />;
    else if (k.includes('concierge')) icon = <UserCheck size={20} />;
    else if (k.includes('cafe')) icon = <Coffee size={20} />;
    else if (k.includes('valet')) icon = <Key size={20} />;

    return { name, icon };
};

const HotelDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
    const [extraBedCounts, setExtraBedCounts] = useState<Record<string, number>>({});
    const [roomQuantities, setRoomQuantities] = useState<Record<string, number>>({});
    const [activeMobileImage, setActiveMobileImage] = useState(1);
    const mobileScrollRef = React.useRef<HTMLDivElement>(null);
    const roomsRef = React.useRef<HTMLDivElement>(null);

    const handleMobileScroll = () => {
        if (mobileScrollRef.current) {
            const scrollLeft = mobileScrollRef.current.scrollLeft;
            const width = mobileScrollRef.current.clientWidth;
            const index = Math.round(scrollLeft / width) + 1;
            setActiveMobileImage(index);
        }
    };

    // Use shared search context
    const { searchData } = useSearch();

    // 🚀 Fetch hotel from API
    const { hotel, rooms, loading, error, refetch } = useHotelDetails(id, {
        checkIn: searchData.hasSearched ? searchData.checkIn : undefined,
        checkOut: searchData.hasSearched ? searchData.checkOut : undefined,
        guests: searchData.hasSearched ? (searchData.adults || 0) + (searchData.children || 0) : undefined
    });

    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [galleryActiveIndex, setGalleryActiveIndex] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        setSelectedRoom(null); // ✅ Reset selected room when hotel changes to prevent out-of-bounds access
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [id]);

    // 📍 Dynamic Nearby Places from API
    const nearbyPlacesList = useMemo(() => {
        if (!hotel?.nearbyLandmarks || hotel.nearbyLandmarks.length === 0) return [];

        const iconMap: Record<string, any> = {
            'MapPin': <MapPin size={18} />,
            'Building': <Building size={18} />,
            'Globe': <Globe size={18} />,
            'Car': <Car size={18} />,
            'Plane': <Plane size={18} />,
            'ShoppingBag': <ShoppingBag size={18} />,
            'Utensils': <Utensils size={18} />,
            'Briefcase': <Briefcase size={18} />
        };

        return hotel.nearbyLandmarks.map((p: any) => ({
            name: p.name,
            distance: p.distance,
            icon: iconMap[p.icon] || <MapPin size={18} />
        }));
    }, [hotel]);

    // Dynamic Facilities Logic
    const dynamicFacilities = useMemo(() => {
        if (!hotel || !hotel.amenities) return [];
        const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : [];
        return amenities.map(key => getAmenityDetails(key));
    }, [hotel]);

    // Simplified Display Images Logic - No Padding
    const displayImages = useMemo(() => {
        if (!hotel) return [];
        // Only return real images that are non-null strings
        const baseImages = [hotel.image, ...(hotel.images || [])].filter(img => img && typeof img === 'string');
        // Remove duplicates if any (e.g. if hotel.image is also in hotel.images)
        return Array.from(new Set(baseImages));
    }, [hotel]);

    // Transform API rooms to display format
    const roomsData = useMemo(() => {
        if (rooms && Array.isArray(rooms) && rooms.length > 0) {
            return rooms.map((room, idx) => ({
                id: room.id,
                name: room.name,
                price: room.price,
                capacity: room.capacity,
                size: room.area,
                bed: room.beds,
                type: room.type,
                view: room.view,
                mealPlan: room.mealPlan,
                tags: [
                    room.view || 'إطلالة على المدينة',
                    room.mealPlan === 'breakfast' ? 'شامل الإفطار' :
                        room.mealPlan === 'half_board' ? 'وجبتين' :
                            room.mealPlan === 'full_board' ? 'ثلاث وجبات' :
                                'بدون وجبات'
                ].filter(Boolean),
                images: (room.images && room.images.length > 0) ? room.images : [hotel?.image].filter(Boolean),
                pricingPeriods: room.pricingPeriods || [],
                sofa: room.sofa || false,
                amenities: Array.isArray(room.features) ? room.features : [],
                inventory: room.availableStock || 0,
                allowExtraBed: room.allowExtraBed || false,
                extraBedPrice: room.extraBedPrice || 0,
                maxExtraBeds: room.maxExtraBeds || 1,
                isVisible: room.isVisible !== false, // [NEW] Availability flag
                partialMetadata: room.partialMetadata, // [NEW] Availability metadata from backend
                originalIdx: idx // Keep original index for booking
            }));
        }
        return [];
    }, [rooms, hotel]);

    // 📦 GROUP ROOMS BY NAME
    const groupedRooms = useMemo(() => {
        if (!roomsData.length) return [];

        const groups: Record<string, any> = {};

        // 🔍 Apply Search Filters (Capacity & Visibility)
        const filteredRooms = roomsData.filter(room => {
            // Filter by visibility first
            if (room.isVisible === false) return false;

            if (searchData.adults) {
                const totalGuests = (searchData.adults || 0) + (searchData.children || 0);
                const guestsPerRoom = Math.ceil(totalGuests / (searchData.rooms || 1));
                return room.capacity >= guestsPerRoom;
            }
            return true;
        });

        filteredRooms.forEach(room => {
            if (!groups[room.name]) {
                groups[room.name] = {
                    name: room.name,
                    images: room.images,
                    capacity: room.capacity,
                    size: room.size,
                    bed: room.bed,
                    view: room.view, // Use view of the first room
                    variants: []
                };
            }
            groups[room.name].variants.push(room);
        });

        // Sort variants by price within each group
        Object.values(groups).forEach((group: any) => {
            group.variants.sort((a: any, b: any) => a.price - b.price);
        });

        return Object.values(groups);
    }, [roomsData, searchData]);

    // 💰 CALCULATE TOTAL PRICE (STAY TOTAL)
    const totalPriceSummary = useMemo(() => {
        let total = 0;
        Object.entries(roomQuantities).forEach(([roomId, quantity]) => {
            if (quantity <= 0) return;
            const room = roomsData.find(r => r.id === roomId);
            if (!room) return;

            let roomTotal = 0;
            if (room.partialMetadata?.isPartial && room.partialMetadata.totalPrice) {
                roomTotal = room.partialMetadata.totalPrice;
                // Add extra beds for the AVAILABLE nights
                const extraBedCount = extraBedCounts[room.id] || 0;
                roomTotal += (extraBedCount * (room.extraBedPrice || 0) * (room.partialMetadata.availableNightsCount || 1));
            } else {
                // --- PRICING LOGIC ---
                let currentPrice = room.price;
                if (searchData.checkIn) {
                    const checkInDate = new Date(searchData.checkIn);
                    const specialPeriod = room.pricingPeriods?.find((p: any) => {
                        const start = new Date(p.startDate);
                        const end = new Date(p.endDate);
                        return checkInDate >= start && checkInDate <= end;
                    });
                    if (specialPeriod) {
                        currentPrice = specialPeriod.price;
                    }
                }
                const extraBedCount = extraBedCounts[room.id] || 0;
                const nights = searchData.nights || 1;
                roomTotal = (currentPrice + (extraBedCount * (room.extraBedPrice || 0))) * nights;
            }
            total += roomTotal * quantity;
        });
        return total;
    }, [roomQuantities, extraBedCounts, roomsData, searchData.checkIn, searchData.nights]);

    const handleExtraBedChange = (roomId: string, delta: number, maxStock: number) => {
        setExtraBedCounts(prev => {
            const currentCount = prev[roomId] || 0;
            const newCount = Math.max(0, Math.min(currentCount + delta, maxStock));
            return { ...prev, [roomId]: newCount };
        });
    };

    const handleBookNow = (idx?: number) => {
        const targetIdx = idx !== undefined ? idx : selectedRoom;

        if (targetIdx === null) {
            alert('يرجى اختيار غرفة أولاً لإكمال الحجز');
            return;
        }

        const room = roomsData[targetIdx];
        const quantity = roomQuantities[room.id] || 0;

        if (quantity === 0) {
            alert('يرجى اختيار عدد الغرف أولاً');
            return;
        }

        // Use the same logic as the render loop to find the base price (base or special period)
        let roomBasePrice = room.price;
        let checkIn = searchData.checkIn;
        let checkOut = searchData.checkOut;

        if (room.partialMetadata?.isPartial) {
            // Override with available dates
            checkIn = new Date(room.partialMetadata.availableFrom);
            checkOut = new Date(room.partialMetadata.availableTo);
            roomBasePrice = room.partialMetadata.avgPrice || room.price;
        } else if (searchData.checkIn) {
            const checkInDate = new Date(searchData.checkIn);
            const specialPeriod = room.pricingPeriods?.find(p => {
                const start = new Date(p.startDate);
                const end = new Date(p.endDate);
                return checkInDate >= start && checkInDate <= end;
            });
            if (specialPeriod) {
                roomBasePrice = specialPeriod.price;
            }
        }

        navigate(`/booking/${hotel?.id}`, {
            state: {
                roomIdx: targetIdx,
                roomId: room.id,
                price: roomBasePrice,
                roomCount: quantity, // Pass selected quantity
                extraBedCount: extraBedCounts[room.id] || 0,
                checkIn: checkIn?.toISOString(),
                checkOut: checkOut?.toISOString()
            }
        });
    };



    // Loading Skeleton (Silent) - Prevents Error Flash
    if (loading && !hotel) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] font-cairo animate-pulse">
                <div className="h-24 md:h-28" />
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
                    <div className="w-full h-[500px] bg-slate-200/50 rounded-[3rem] mb-12"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        <div className="lg:col-span-8 space-y-8">
                            <div className="h-10 w-2/3 bg-slate-200/50 rounded-2xl"></div>
                            <div className="h-6 w-1/3 bg-slate-200/50 rounded-xl"></div>
                            <div className="h-96 w-full bg-slate-200/50 rounded-[2rem]"></div>
                        </div>
                        <div className="lg:col-span-4 space-y-6">
                            <div className="h-80 w-full bg-slate-200/50 rounded-[2.5rem]"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || (!loading && !hotel)) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] font-cairo flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md mx-auto p-8">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-text">عذراً، حدث خطأ</h2>
                    <p className="text-slate-500">{error || 'لم يتم العثور على الفندق'}</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => refetch()}
                            className="px-6 py-3 bg-gold text-white rounded-xl font-bold hover:bg-gold-dark transition-colors"
                        >
                            إعادة المحاولة
                        </button>
                        <button
                            onClick={() => navigate('/hotels')}
                            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                        >
                            العودة للفنادق
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Dynamic SEO (JSON-LD)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Hotel",
        "name": hotel?.name || "",
        "description": hotel?.description || "",
        "image": hotel?.image || "",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": hotel?.location || "",
            "addressCountry": "SA"
        },
        "starRating": {
            "@type": "Rating",
            "ratingValue": hotel?.rating || 0
        },
        "priceRange": `${hotel?.basePrice || 0} SAR`
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="min-h-screen bg-[#F9FAFB] font-cairo text-text pb-20 animate-fade-in-up">
                {/* Top Spacing for Navbar */}
                <div className="h-24 md:h-28" />

                {/* Main Container */}
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">

                    {/* 1. Gallery Section (Responsive: Mosaic for Desktop, Carousel for Mobile) */}
                    <div className="relative group/gallery mb-12 overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-xl">

                        {/* 🖥️ Desktop View: Mosaic (Airbnb Style) */}
                        <div className="hidden md:grid md:grid-cols-4 gap-2 md:gap-3 aspect-[21/10]" dir="ltr">
                            {/* 🏠 Left: Main Hero Image */}
                            <div className="md:col-span-2 md:row-span-2 relative overflow-hidden group/main cursor-pointer h-full">
                                <img src={displayImages[0]} alt={hotel.name} className="w-full h-full object-cover transition-all duration-1000 group-hover/main:scale-105" />
                                <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover/main:opacity-100 transition-opacity duration-500" />
                            </div>

                            {/* 🖼️ Right: 4 Small Images */}
                            {displayImages.slice(1, 5).map((img, idx) => (
                                <div key={idx} className="relative overflow-hidden group/tile cursor-pointer h-full">
                                    <img src={img} alt={`Gallery ${idx + 2}`} className="w-full h-full object-cover transition-all duration-1000 group-hover/tile:scale-110" />
                                    <div className="absolute inset-0 bg-secondary/20 opacity-0 group-hover/tile:opacity-100 transition-opacity duration-500" />
                                    {idx === 3 && (
                                        <button
                                            onClick={() => { setGalleryActiveIndex(0); setShowGalleryModal(true); }}
                                            className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md border border-slate-200 px-5 py-3 rounded-2xl text-secondary font-black text-xs shadow-2xl flex items-center gap-3 hover:bg-white transition-all active:scale-95 z-20 group/btn"
                                        >
                                            <div className="grid grid-cols-2 gap-1 group-hover/btn:rotate-12 transition-transform duration-500">
                                                {[...Array(4)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-gold rounded-full" />)}
                                            </div>
                                            <span>عرض كافة الصور</span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* 📱 Mobile View: Horizontal Carousel with Index Indicator */}
                        <div className="md:hidden relative aspect-[4/3] w-full" dir="ltr">
                            <div
                                ref={mobileScrollRef}
                                onScroll={handleMobileScroll}
                                className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full w-full"
                            >
                                {displayImages.map((img, idx) => (
                                    <div key={idx} className="min-w-full h-full snap-center shrink-0">
                                        <img
                                            src={img}
                                            alt={`${hotel.name} ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* 🏷️ Floating Index Indicator (e.g., 1 / 10) */}
                            <div className="absolute bottom-4 right-4 bg-primary/60 backdrop-blur-md px-3 py-1 rounded-lg text-white text-[10px] font-bold tracking-widest z-10 border border-white/10">
                                {activeMobileImage} / {displayImages.length}
                            </div>
                        </div>
                    </div>

                    {/* 2. Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                        {/* Right Column: Hotel Info & Content (Span 8) */}
                        <div className="lg:col-span-8 space-y-8">

                            {/* Hotel Header & Title (Animated) */}
                            {/* Hotel Header & Title (Redesigned) */}
                            {/* Hotel Header & Title (Redesigned v2) */}
                            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                                <div className="flex flex-col items-start w-full">

                                    {/* 🏨 Right Side (First in DOM = Right in RTL): Hotel Details */}
                                    <div className="flex-1 w-full flex flex-col items-start text-right">

                                        {/* Rating */}
                                        <div className="flex items-center justify-start gap-4 mb-4 w-full">
                                            <div className="flex items-center gap-2 bg-[#059669] text-white px-4 py-1.5 rounded-xl border border-[#059669] shadow-lg shadow-emerald-500/20 order-2">
                                                <span className="text-xl font-black leading-none">{hotel?.rating}</span>
                                                <div className="w-px h-4 bg-white/20" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">ممتاز</span>
                                            </div>
                                            <div className="flex gap-1 text-gold order-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={24}
                                                        fill={i < Math.floor(hotel?.rating || 4) ? "currentColor" : "none"}
                                                        strokeWidth={1.5}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h1 className="text-4xl md:text-6xl font-black text-secondary mb-6 leading-[1.1] tracking-tight w-full drop-shadow-sm">
                                            {hotel?.name}
                                        </h1>

                                        {/* Location Badges */}
                                        <div className="flex flex-wrap items-center justify-start gap-4 mt-2 w-full text-right">
                                            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl text-secondary shrink-0 shadow-sm">
                                                <MapPin size={20} />
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 text-base font-bold">
                                                <span>{hotel?.location}</span>
                                            </div>
                                            <span className="text-slate-200">|</span>
                                            <div className="flex items-center gap-3">
                                                {(() => {
                                                    const city = (hotel?.city || '').toLowerCase();
                                                    const rawDist = parseFloat(hotel?.distanceFromHaram?.toString().replace(/[^0-9.]/g, '') || '0');
                                                    let label = 'عن المركز';
                                                    let unit = 'كم';
                                                    if (city.includes('مكة') || city.includes('makkah') || city.includes('mecca')) {
                                                        label = 'عن الكعبة'; unit = 'متر';
                                                    } else if (city.includes('المدينة') || city.includes('madinah') || city.includes('medina')) {
                                                        label = 'عن المسجد النبوي'; unit = 'متر';
                                                    }
                                                    const normalizedMeters = rawDist < 10 ? rawDist * 1000 : rawDist;
                                                    const isPrimeLoaction = normalizedMeters <= 700;

                                                    return (
                                                        <div className="flex items-center gap-3">
                                                            {isPrimeLoaction && (
                                                                <div className="text-gold px-4 py-2 rounded-2xl text-[11px] font-black flex items-center gap-2 border border-gold/20 bg-gold/5 shadow-sm">
                                                                    <Star size={14} fill="currentColor" />
                                                                    <span>موقع استثنائي</span>
                                                                </div>
                                                            )}
                                                            <div className="px-4 py-2 rounded-2xl text-[11px] font-bold flex items-center gap-2 border border-slate-100 bg-white text-slate-600 shadow-sm">
                                                                <span className="font-black text-secondary">
                                                                    {rawDist} {unit}
                                                                </span>
                                                                <span className="opacity-70 text-slate-400">{label}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>


                                    </div>


                                </div>
                            </div>

                            {/* Booking Search Bar */}
                            <div className="animate-fade-in relative z-50" style={{ animationDelay: '200ms' }}>
                                <div className="hidden md:block">
                                    <HotelBookingSearch
                                        hotelId={hotel?.id || ""}
                                        hotelName={hotel?.name || ""}
                                        basePrice={hotel?.basePrice || 0}
                                        onSearch={() => refetch()}
                                    />
                                </div>

                                {/* Mobile Research Trigger */}
                                <button
                                    onClick={() => setShowMobileSearch(true)}
                                    className="md:hidden w-full bg-white border border-slate-200 p-4 rounded-[2.5rem] flex items-center justify-between shadow-sm active:scale-95 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#0f172a]">
                                            <Search size={20} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تعديل البحث</p>
                                            <p className="text-xs font-black text-text">
                                                {formatDateArabic(searchData.checkIn)} - {formatDateArabic(searchData.checkOut)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                        <ChevronLeft size={16} />
                                    </div>
                                </button>
                            </div>

                            {/* Diafat Khulud Verification Badge */}
                            <div className="bg-[#f8fafc] border border-slate-100 rounded-3xl p-5 flex items-center gap-5 hover:border-emerald-500/30 transition-all duration-500 group/badge">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-600 shrink-0 group-hover/badge:scale-110 transition-transform duration-500">
                                    <Award className="w-8 h-8 animate-pulse-slow" />
                                </div>
                                <div>
                                    <h3 className="font-black text-secondary text-lg leading-tight mb-1">إقامة موثقة من ضيافة خلود</h3>
                                    <p className="text-slate-500 text-xs font-bold leading-relaxed">نضمن لك أعلى معايير الجودة والراحة بتفويض مباشر من منصتنا المعتمدة.</p>
                                </div>
                            </div>


                            {/* About Section */}
                            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                                <h2 className="text-2xl font-black text-secondary mb-6 flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-gold rounded-full" />
                                    عن الفندق
                                </h2>
                                <p className="text-slate-500 leading-relaxed text-base font-medium">
                                    {hotel?.description || "لا يوجد وصف متاح لهذا الفندق حالياً."}
                                </p>
                            </div>

                            {/* Facilities Grid */}
                            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                                <h2 className="text-xl font-black text-text mb-6">أبرز المرافق</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                                    {dynamicFacilities.length > 0 ? (
                                        dynamicFacilities.map((fac, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-slate-600 hover:text-gold transition-colors cursor-default group">
                                                <span className="text-slate-400 group-hover:text-gold transition-colors group-hover:scale-110 transform duration-300 block">{fac.icon}</span>
                                                <span className="text-sm font-bold">{fac.name}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-slate-400 text-sm font-medium">لم يتم إضافة مرافق محددة</div>
                                    )}
                                </div>
                            </div>

                            {/* Rooms Section Header */}
                            <div className="pt-16 mb-12 animate-fade-in" style={{ animationDelay: '400ms' }}>
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-end justify-between">
                                        <div className="flex flex-col gap-2">
                                            <h2 className="text-4xl font-black text-text tracking-tight">خيارات الإقامة</h2>
                                            <p className="text-slate-500 font-medium">اختر المساحة التي تناسب نمط حياتك</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rooms List - Grouped Layout */}
                            <div ref={roomsRef} className="space-y-12 animate-fade-in" style={{ animationDelay: '450ms' }}>
                                {groupedRooms.length > 0 ? (
                                    groupedRooms.map((group, gIdx) => (
                                        <div
                                            key={gIdx}
                                            className="bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-700"
                                        >
                                            <div className="flex flex-col lg:flex-row">
                                                {/* Right: Media (30%) */}
                                                <div className="lg:w-[30%] aspect-square lg:aspect-auto relative overflow-hidden group/img">
                                                    <img
                                                        src={group.images?.[0] || hotel?.image}
                                                        alt={group.name}
                                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent hidden lg:block"></div>
                                                    <div className="absolute bottom-6 left-6 lg:left-auto lg:right-6 z-10 flex items-center gap-2">
                                                        <span className="bg-primary/40 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-white border border-white/20">
                                                            +{group.images?.length || 1} صور
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Left: Variations & Controls (70%) */}
                                                <div className="lg:w-[70%] p-6 md:p-8 space-y-8">
                                                    {/* Group Header */}
                                                    <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                                                        <div>
                                                            <h3 className="text-2xl md:text-3xl font-black text-secondary tracking-tight mb-2 flex items-center gap-3">
                                                                <div className="w-1.5 h-6 bg-gold rounded-full" />
                                                                {group.name}
                                                            </h3>
                                                            <div className="flex items-center gap-4 text-slate-500 text-xs font-bold">
                                                                <div className="flex items-center gap-1.5">
                                                                    <Users size={16} className="text-gold" />
                                                                    <span>حتى {group.capacity} أشخاص</span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5">
                                                                    <Maximize size={16} className="text-gold" />
                                                                    <span>{group.size} م²</span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5">
                                                                    <BedDouble size={16} className="text-gold" />
                                                                    <span>{group.bed}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Room Variations (Rows) */}
                                                    <div className="divide-y divide-slate-50">
                                                        {group.variants.map((room: any) => {
                                                            const isSelected = selectedRoom === room.originalIdx;

                                                            // --- PRICING LOGIC ---
                                                            let currentPrice = room.price;
                                                            let isSpecialPrice = false;
                                                            if (searchData.checkIn) {
                                                                const checkInDate = new Date(searchData.checkIn);
                                                                const specialPeriod = room.pricingPeriods?.find((p: any) => {
                                                                    const start = new Date(p.startDate);
                                                                    const end = new Date(p.endDate);
                                                                    return checkInDate >= start && checkInDate <= end;
                                                                });
                                                                if (specialPeriod) {
                                                                    currentPrice = specialPeriod.price;
                                                                    isSpecialPrice = true;
                                                                }
                                                            }
                                                            const extraBedCount = extraBedCounts[room.id] || 0;
                                                            currentPrice += extraBedCount * (room.extraBedPrice || 0);

                                                            return (
                                                                <div
                                                                    key={room.id}
                                                                    className={`py-4 md:py-6 flex flex-col gap-4 transition-colors rounded-2xl px-4 -mx-4 group ${isSelected ? 'bg-gold-50/30' : 'hover:bg-slate-50/50'}`}
                                                                >
                                                                    {/* Partial Availability Banner */}
                                                                    {room.partialMetadata?.isPartial && (
                                                                        <div className="bg-amber-50/80 border border-amber-100/50 p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                                                            <div className="flex items-center gap-4">
                                                                                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-amber-500 shrink-0">
                                                                                    <Info size={20} />
                                                                                </div>
                                                                                <div>
                                                                                    <h5 className="text-[13px] font-black text-amber-900 leading-tight mb-0.5">متاح لفترة جزئية فقط</h5>
                                                                                    <p className="text-[11px] font-bold text-amber-700/80 mb-1">
                                                                                        المواعيد المتاحة: من {formatDateArabic(room.partialMetadata.availableFrom)} إلى {formatDateArabic(room.partialMetadata.availableTo)}
                                                                                    </p>
                                                                                    <p className="text-[10px] font-bold text-amber-600">
                                                                                        هل التاريخ لا يناسبك؟ تواصل معنا وسنوفر لك الغرفة المطلوبة.
                                                                                    </p>
                                                                                </div>
                                                                            </div>

                                                                            <a
                                                                                href={`https://wa.me/966553882445?text=${encodeURIComponent(`السلام عليكم، لم أجد التواريخ المناسبة في فندق ${hotel?.name}، غرفة ${room.name}، وأرغب في المساعدة لتوفير فترة أخرى.`)}`}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-2xl text-[11px] font-black hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 active:scale-95 whitespace-nowrap"
                                                                            >
                                                                                <MessageCircle size={16} />
                                                                                اطلب فترتك الآن
                                                                            </a>
                                                                        </div>
                                                                    )}

                                                                    <div className="flex items-center justify-between gap-4">
                                                                        {/* 1. Selector & Pricing Group */}
                                                                        <div className="flex items-center gap-4 md:gap-8">
                                                                            <div className="flex flex-col items-center gap-1.5">
                                                                                <div className="flex flex-col items-center gap-1.5">
                                                                                    {roomQuantities[room.id] > 0 ? (
                                                                                        <div className="flex items-center bg-white rounded-full border border-slate-100 shadow-sm overflow-hidden h-10 md:h-12">
                                                                                            <button
                                                                                                onClick={() => setRoomQuantities(prev => ({ ...prev, [room.id]: Math.min((prev[room.id] || 0) + 1, room.inventory) }))}
                                                                                                className="w-8 md:w-10 h-full flex items-center justify-center hover:bg-gold-50 text-gold transition-colors"
                                                                                            >
                                                                                                <Plus size={14} strokeWidth={3} />
                                                                                            </button>
                                                                                            <span className="w-8 md:w-10 text-center font-black text-secondary text-xs md:text-sm">{roomQuantities[room.id]}</span>
                                                                                            <button
                                                                                                onClick={() => setRoomQuantities(prev => ({ ...prev, [room.id]: Math.max(0, (prev[room.id] || 0) - 1) }))}
                                                                                                className="w-8 md:w-10 h-full flex items-center justify-center hover:bg-red-50 text-slate-400 transition-colors"
                                                                                            >
                                                                                                <Minus size={14} strokeWidth={3} />
                                                                                            </button>
                                                                                        </div>
                                                                                    ) : (
                                                                                        !searchData.checkIn || !searchData.checkOut ? (
                                                                                            <button
                                                                                                onClick={() => {
                                                                                                    if (window.innerWidth < 768) {
                                                                                                        setShowMobileSearch(true);
                                                                                                    } else {
                                                                                                        window.scrollTo({ top: 400, behavior: 'smooth' });
                                                                                                    }
                                                                                                }}
                                                                                                className="h-10 md:h-12 px-4 md:px-6 rounded-full border border-amber-200 bg-amber-50 text-amber-700 font-black text-[10px] md:text-xs hover:bg-amber-100 transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap shadow-sm"
                                                                                            >
                                                                                                <Calendar size={14} strokeWidth={3} />
                                                                                                <span>حدد التاريخ أولاً</span>
                                                                                            </button>
                                                                                        ) : (
                                                                                            <button
                                                                                                onClick={() => {
                                                                                                    setRoomQuantities(prev => ({ ...prev, [room.id]: 1 }));
                                                                                                    setSelectedRoom(room.originalIdx);
                                                                                                }}
                                                                                                className="h-10 md:h-12 px-4 md:px-6 rounded-full border border-slate-200 bg-white text-secondary font-black text-[10px] md:text-xs hover:bg-secondary hover:border-secondary hover:text-white transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap shadow-sm hover:shadow-secondary/20"
                                                                                            >
                                                                                                <Plus size={14} strokeWidth={3} />
                                                                                                <span>إختر</span>
                                                                                            </button>
                                                                                        )
                                                                                    )}
                                                                                    {roomQuantities[room.id] > 0 && (
                                                                                        <button
                                                                                            onClick={() => handleBookNow(room.originalIdx)}
                                                                                            className="text-[9px] md:text-[10px] font-black text-gold underline underline-offset-4"
                                                                                        >
                                                                                            تأكيد الحجز
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex flex-col items-center">
                                                                                <div className="flex items-baseline gap-1.5">
                                                                                    <span className={`text-2xl md:text-3xl font-black ${isSpecialPrice ? 'text-amber-500' : 'text-secondary'}`}>{currentPrice * (roomQuantities[room.id] || 1)}</span>
                                                                                    <div className="flex flex-col text-[9px] md:text-[10px] font-bold text-slate-400 leading-none">
                                                                                        <span>ريال / ليلة</span>
                                                                                        <span>شامل الضريبة</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* 2. Variant Info Block */}
                                                                        <div className="flex flex-col items-end gap-1.5 md:gap-2 text-right">
                                                                            <div className="flex items-center gap-2 text-slate-700">
                                                                                <span className="text-[10px] md:text-xs font-black">
                                                                                    {room.mealPlan === 'breakfast' ? 'شامل الإفطار' :
                                                                                        room.mealPlan === 'half_board' ? 'إقامة وجبتين' :
                                                                                            room.mealPlan === 'full_board' ? 'إقامة كاملة' : 'بدون وجبات'}
                                                                                </span>
                                                                                <Utensils size={12} className="text-gold" />
                                                                            </div>
                                                                            <div className="flex items-center gap-2 text-slate-400">
                                                                                <span className="text-[9px] md:text-[10px] font-bold">{room.view || 'إطلالة مدينة'}</span>
                                                                                <Moon size={10} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Extra Bed Section (Shared for group if applicable) */}
                                                    {group.variants.some((v: any) => v.allowExtraBed) && (() => {
                                                        const isRoomSelected = group.variants.some((v: any) => roomQuantities[v.id] > 0);
                                                        const activeVariant = group.variants.find((v: any) => roomQuantities[v.id] > 0) || group.variants.find((v: any) => v.allowExtraBed) || group.variants[0];
                                                        const extraBedPrice = activeVariant.extraBedPrice || 0;

                                                        return (
                                                            <div className={`bg-slate-50/70 p-4 rounded-[2rem] border border-slate-100 mt-2 transition-all ${!isRoomSelected ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                                                                <div className="flex items-center justify-between gap-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gold border border-slate-50 shrink-0">
                                                                            <BedDouble size={18} />
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-black text-text text-[11px] md:text-sm leading-tight flex items-center gap-2">
                                                                                سرير إضافي
                                                                                <span className="text-gold px-1.5 py-0.5 bg-gold-50 rounded-lg text-[9px] md:text-[10px]">
                                                                                    {extraBedPrice > 0 ? `+${extraBedPrice} ر.س` : 'مجاني'}
                                                                                </span>
                                                                            </h4>
                                                                            <p className="text-[9px] md:text-[10px] text-slate-400 font-bold whitespace-nowrap">
                                                                                {!isRoomSelected ? 'اختر الغرفة أولاً' : `حتى ${activeVariant.maxExtraBeds} أسرة`}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-3 md:gap-4 dir-ltr bg-white/50 px-3 py-1.5 rounded-2xl border border-slate-100">
                                                                        <button
                                                                            onClick={() => isRoomSelected && handleExtraBedChange(activeVariant.id, 1, hotel?.extraBedStock || 2)}
                                                                            disabled={!isRoomSelected}
                                                                            className="w-7 h-7 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-gold transition-colors disabled:cursor-not-allowed"
                                                                        >
                                                                            <Plus size={14} />
                                                                        </button>
                                                                        <span className="font-black text-text tabular-nums text-sm">
                                                                            {Object.entries(extraBedCounts)
                                                                                .filter(([id]) => group.variants.some((v: any) => v.id === id))
                                                                                .reduce((sum, [, count]) => sum + count, 0)}
                                                                        </span>
                                                                        <button
                                                                            onClick={() => {
                                                                                if (!isRoomSelected) return;
                                                                                const activeRoomWithBed = group.variants.find((v: any) => extraBedCounts[v.id] > 0) || activeVariant;
                                                                                handleExtraBedChange(activeRoomWithBed.id, -1, hotel?.extraBedStock || 2);
                                                                            }}
                                                                            disabled={!isRoomSelected}
                                                                            className="w-7 h-7 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors disabled:cursor-not-allowed"
                                                                        >
                                                                            <Minus size={14} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-[2rem] border-2 border-slate-50 shadow-xl text-center">
                                        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 text-amber-500">
                                            <AlertCircle size={40} />
                                        </div>
                                        <h3 className="text-2xl font-black text-text mb-2">عذراً، لا توجد غرف متاحة</h3>
                                        <p className="text-slate-500 max-w-md mx-auto">
                                            {searchData.hasSearched
                                                ? "لا توجد غرف تطابق معايير بحثك في التواريخ المختارة. يرجى تجربة تواريخ أخرى أو تقليل عدد الأفراد."
                                                : "لا توجد غرف متاحة حالياً في هذا الفندق. يرجى مراجعة إدارة الفندق."}
                                        </p>
                                        <button
                                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                            className="mt-8 px-8 py-3 bg-gold text-white rounded-2xl font-black shadow-lg shadow-gold-200 hover:bg-gold-dark transition-all"
                                        >
                                            تغيير تواريخ البحث
                                        </button>
                                    </div>
                                )}
                            </div>



                            {/* Reviews Section (New) */}
                            <div className="animate-fade-in" style={{ animationDelay: "525ms" }}>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-black text-text flex items-center gap-2">
                                        <MessageCircle className="text-amber-500" />
                                        تقييمات الضيوف
                                    </h2>
                                    <div className="flex items-center gap-2 bg-gold-50 px-3 py-1.5 rounded-full">
                                        <Star className="text-gold fill-gold" size={14} />
                                        <span className="text-sm font-black text-gold-dark">4.9 / 5</span>
                                        <span className="text-[10px] text-gold/60 font-bold">(120 تقييم)</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {hotel?.guestReviews && hotel?.guestReviews.length > 0 ? (
                                        hotel?.guestReviews.map((review, i) => (
                                            <div key={review.id || i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-400 border border-slate-100 uppercase">
                                                            {(review.userName || 'G').charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-text text-sm">{review.userName}</h4>
                                                            <span className="text-[10px] text-slate-400 font-medium">{review.date}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, star) => (
                                                            <Star
                                                                key={star}
                                                                size={12}
                                                                className={star < review.rating ? "text-[#F5C34A] fill-[#F5C34A]" : "text-slate-200 fill-slate-200"}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                                    {review.text}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                            <MessageCircle className="mx-auto text-slate-300 mb-2" size={32} />
                                            <p className="text-slate-400 font-bold text-sm">لا توجد تقييمات حتى الآن</p>
                                        </div>
                                    )}

                                    <button className="w-full py-4 rounded-2xl border border-dashed border-slate-200 text-slate-400 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                                        قراءة جميع التقييمات
                                    </button>
                                </div>
                            </div>

                            {/* Detailed Facilities (New) */}
                            <div className="animate-fade-in" style={{ animationDelay: '540ms' }}>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-black text-secondary flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-gold rounded-full" />
                                        مرافق متوفرة في {hotel?.name}
                                    </h2>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {HOTEL_FACILITIES_DATA.map((section, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group/card">
                                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-50">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover/card:bg-amber-50 group-hover/card:text-amber-500 transition-colors text-slate-400">
                                                    {section.icon}
                                                </div>
                                                <h3 className="font-bold text-text">{section.category}</h3>
                                            </div>
                                            <div className="space-y-3">
                                                {section.items.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-slate-500 text-sm font-medium hover:text-gold transition-colors">
                                                        <span className="text-gold/60">{item.icon}</span>
                                                        <span>{item.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Policies Section (New) */}
                            <div className="animate-fade-in" style={{ animationDelay: '550ms' }}>
                                <h2 className="text-2xl font-black text-secondary mb-6 flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-gold rounded-full" />
                                    السياسات والتعليمات
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Check-in/out */}
                                    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                                <Clock size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-text mb-2">تسجيل الدخول / الخروج</h4>
                                                <div className="space-y-1 text-sm text-slate-500 font-medium">
                                                    <p>تسجيل الدخول: من 4:00 مساءً</p>
                                                    <p>تسجيل الخروج: حتى 12:00 ظهراً</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Children Policy */}
                                    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                                <Baby size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-text mb-2">سياسة الأطفال</h4>
                                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                                    يرحب بالأطفال من جميع الأعمار. الأطفال من سن 11 سنة يعتبرون بالغين في هذا الفندق.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location Policy (Emerald Green Integration) */}
                                    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-text mb-2">الموقع</h4>
                                                <div className="flex items-center gap-2 bg-[#f8fafc] border border-slate-100 px-4 py-2 rounded-2xl shadow-sm hover:border-emerald-500/30 transition-colors cursor-pointer group/loc" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel?.name || "")}+${encodeURIComponent(hotel?.location || "")}`, '_blank')}>
                                                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-600 group-hover/loc:scale-110 transition-transform">
                                                        <MapPin size={16} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-bold text-slate-400 leading-none mb-1">الموقع</span>
                                                        <span className="text-xs font-black text-secondary leading-none">{hotel?.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Methods */}
                                    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                                <CreditCard size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-text mb-2">طرق الدفع المقبولة</h4>
                                                <div className="flex gap-2 mt-1">
                                                    <div className="w-8 h-5 bg-slate-100 rounded border border-slate-200"></div>
                                                    <div className="w-8 h-5 bg-slate-100 rounded border border-slate-200"></div>
                                                    <div className="w-8 h-5 bg-slate-100 rounded border border-slate-200"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cancellation */}
                                    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                                <Info size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-text mb-2">الإلغاء والدفع المسبق</h4>
                                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                                    تختلف سياسات الإلغاء والدفع المسبق حسب نوع الغرفة وموعد الحجز.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Left Column: Sidebar (Span 4) */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Map Card */}
                            <HotelViewMap
                                lat={hotel.lat || 21.4225}
                                lng={hotel.lng || 39.8262}
                                hotelName={hotel.name}
                                distanceFromHaram={hotel.distanceFromHaram || undefined}
                            />

                            {/* [NEW] Nearby Places Card (Dynamically driven from DB) */}
                            {nearbyPlacesList.length > 0 && (
                                <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-secondary/5 border border-slate-100 animate-fade-in" style={{ animationDelay: '250ms' }}>
                                    <h3 className="text-sm font-black text-secondary mb-5 flex items-center gap-2">
                                        <MapPinned size={18} className="text-gold" />
                                        أماكن قريبة
                                    </h3>
                                    <div className="space-y-4">
                                        {nearbyPlacesList.map((place: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between group/item">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:text-gold group-hover/item:bg-gold-50 transition-all">
                                                        {place.icon}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600 group-hover/item:text-secondary transition-colors">{place.name}</span>
                                                </div>
                                                <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full group-hover/item:bg-gold-50 group-hover/item:text-gold-dark transition-all">{place.distance}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Booking Summary Card (Sticky & Scrollable Fix) */}
                            <div className="sticky top-32 bg-white rounded-[2.5rem] p-0 shadow-2xl shadow-secondary/10 border border-slate-100 overflow-hidden transition-all duration-500 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                                {/* Scrollable Container if content too tall */}
                                <div className="max-h-[calc(100vh-160px)] overflow-y-auto no-scrollbar">

                                    {/* Concierge Header */}
                                    <div className="bg-secondary p-8 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                        <div className="relative z-10 flex items-start justify-between">
                                            <div className="text-right">
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <span className="text-2xl font-black leading-none">{hotel?.rating || '4.5'}</span>
                                                    <Star className="text-gold fill-gold" size={18} />
                                                </div>
                                                <span className="text-[9px] font-bold text-gold/80 uppercase tracking-widest">تقييم استثنائي</span>
                                            </div>
                                            <div className="text-left">
                                                <span className="text-[10px] text-white/50 block font-bold mb-1.5 uppercase tracking-widest">السعر لليلة الواحدة</span>
                                                <div className="flex items-baseline gap-1 dir-rtl">
                                                    {searchData.couponDiscount && searchData.couponDiscount > 0 ? (
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-sm line-through text-white/30 decoration-gold/50 decoration-2">
                                                                {(totalPriceSummary > 0 ? totalPriceSummary : (hotel?.basePrice || 400)).toLocaleString()}
                                                            </span>
                                                            <span className="text-5xl font-black text-gold tracking-tighter leading-none">
                                                                {Math.round((totalPriceSummary > 0 ? totalPriceSummary : (hotel?.basePrice || 400)) * (1 - searchData.couponDiscount / 100)).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-5xl font-black text-white tracking-tighter leading-none">
                                                            {(totalPriceSummary > 0 ? totalPriceSummary : (hotel?.basePrice || 400)).toLocaleString()}
                                                        </span>
                                                    )}
                                                    <div className="flex flex-col ml-1">
                                                        <span className="text-[10px] font-black text-white/80">ريال</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {/* Booking Info Grid (Lux Version) */}
                                        <div className="border border-slate-100 rounded-[2rem] overflow-hidden mb-5 bg-slate-50/50">
                                            <div className="grid grid-cols-2 border-b border-slate-100">
                                                <div className="p-4 flex flex-col gap-1 border-l border-slate-100">
                                                    <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">تاريخ الوصول</span>
                                                    <span className="font-black text-secondary text-xs whitespace-nowrap">
                                                        {formatDateArabic(searchData.checkIn)}
                                                    </span>
                                                </div>
                                                <div className="p-4 flex flex-col gap-1">
                                                    <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">تاريخ المغادرة</span>
                                                    <span className="font-black text-secondary text-xs whitespace-nowrap">
                                                        {formatDateArabic(searchData.checkOut)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <div className="p-4 flex flex-col gap-1 border-l border-slate-100">
                                                    <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">الضيوف</span>
                                                    <span className="font-black text-secondary text-xs whitespace-nowrap">
                                                        {searchData.adults || 1} بالغين، {searchData.children || 0} أطفال
                                                    </span>
                                                </div>
                                                <div className="p-4 flex flex-col gap-1">
                                                    <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">مدة الإقامة</span>
                                                    <span className="font-black text-secondary text-xs">
                                                        {searchData.nights || 1} ليلة
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Selection Status */}
                                        {!searchData.checkIn || !searchData.checkOut ? (
                                            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 mb-8 text-center animate-pulse">
                                                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-3 text-amber-500">
                                                    <Calendar size={20} />
                                                </div>
                                                <h4 className="font-black text-amber-900 text-sm mb-1.5">بانتظار تحديد التاريخ</h4>
                                                <p className="text-[11px] text-amber-700/80 font-bold leading-relaxed px-4">يرجى تحديد تاريخ الوصول والمغادرة أولاً لعرض الأسعار والتوفر</p>
                                            </div>
                                        ) : selectedRoom === null ? (
                                            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 mb-8 text-center">
                                                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-3 text-gold">
                                                    <Info size={20} />
                                                </div>
                                                <h4 className="font-black text-secondary text-sm mb-1.5">بانتظار اختيار الغرفة</h4>
                                                <p className="text-[11px] text-slate-400 font-bold leading-relaxed px-4">يرجى اختيار نوع الغرفة المفضلة من الأسفل لحساب السعر النهائي وتأكيد التوفر</p>
                                            </div>
                                        ) : (
                                            <div className="bg-gold/10 border border-gold/20 rounded-3xl p-5 mb-8 text-center animate-bounce-in">
                                                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-3 text-gold">
                                                    <Check size={20} />
                                                </div>
                                                <h4 className="font-black text-secondary text-sm mb-1.5">تم اختيار الغرفة بنجاح</h4>
                                                <p className="text-[11px] text-gold-dark font-black leading-relaxed">أنت الآن جاهز لإتمام الحجز في غرفتك المختارة</p>
                                            </div>
                                        )}

                                        {/* Price Breakdown */}
                                        <div className="space-y-2 mb-6 text-sm">
                                            <div className="flex justify-between items-center text-slate-500 font-bold">
                                                <span className="text-xs">سعر الغرفة / ليلة</span>
                                                <span className="text-secondary font-black">
                                                    {(selectedRoom !== null ? roomsData[selectedRoom].price : (hotel?.basePrice || 400)).toLocaleString()} ر.س
                                                </span>
                                            </div>
                                            {Object.values(extraBedCounts).some(count => count > 0) && (
                                                <div className="flex justify-between items-center text-slate-500 font-bold">
                                                    <span className="text-xs">خدمة السرير الإضافي</span>
                                                    <span className="badge-gold">
                                                        {Object.values(extraBedCounts).reduce((sum, count) => sum + count, 0)} سرير
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center text-slate-500 font-bold">
                                                <span className="text-xs">إجمالي الليالي</span>
                                                <span className="text-secondary font-black">
                                                    {selectedRoom !== null && roomsData[selectedRoom].partialMetadata?.isPartial
                                                        ? roomsData[selectedRoom].partialMetadata?.availableNightsCount
                                                        : (searchData.nights || 1)} ليلة
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                                                <span className="text-xs font-black text-secondary">الإجمالي النهائي</span>
                                                <div className="flex items-baseline gap-1 dir-rtl">
                                                    {searchData.couponDiscount && searchData.couponDiscount > 0 ? (
                                                        <div className="flex flex-col items-end leading-none gap-0.5">
                                                            <span className="text-[10px] line-through text-slate-300 decoration-red-400">
                                                                {(totalPriceSummary > 0 ? totalPriceSummary : (hotel?.basePrice || 400)).toLocaleString()} ر.س
                                                            </span>
                                                            <span className="text-gold font-black">
                                                                {Math.round((totalPriceSummary > 0 ? totalPriceSummary : (hotel?.basePrice || 400)) * (1 - (searchData.couponDiscount || 0) / 100)).toLocaleString()} ر.س
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-emerald-600 font-black">
                                                            {(totalPriceSummary > 0 ? totalPriceSummary : (hotel?.basePrice || 400)).toLocaleString()} ر.س
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Guarantee - Integrated & Elegant */}
                                        <div className="bg-slate-50/80 rounded-2xl p-3 mb-5 border border-slate-100 flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gold shrink-0">
                                                <ShieldCheck size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-secondary uppercase tracking-wider mb-0.5">تسعير شفاف</span>
                                                <p className="text-[9px] font-bold text-slate-400 leading-tight">
                                                    الأسعار شاملة كافة الرسوم
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={() => handleBookNow()}
                                            className={`w-full text-white py-5 rounded-[2rem] font-black text-sm transition-all shadow-2xl flex items-center justify-center gap-3 group mb-4 active:scale-95 ${selectedRoom !== null ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20' : 'bg-slate-300 cursor-not-allowed opacity-50'}`}
                                            disabled={selectedRoom === null}
                                        >
                                            <span>{selectedRoom !== null ? 'تأكيد وحجز الآن' : 'يرجى اختيار الغرفة'}</span>
                                            <ArrowLeft size={18} className="group-hover:-translate-x-1.5 transition-transform" />
                                        </button>

                                        <p className="text-[10px] text-center text-slate-400 font-bold mt-4 opacity-60">بالمتابعة أنت توافق على شروط وسياسات الحجز الخاصة بنا</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Mobile Sticky Booking Bar - Refined Premium Design (Portalled) */}
                    {createPortal(
                        <div className="fixed bottom-0 left-0 right-0 z-[2000] md:hidden animate-slide-up pointer-events-none">
                            <div className="mx-4 mb-6 pointer-events-auto">
                                <div className="bg-slate-50/95 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] p-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden relative">
                                    {/* Decorative subtle gradient */}
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-[70px] -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] translate-y-1/2 -translate-x-1/2"></div>

                                    {/* Header Section: Dates & Guests (Grey & Gold accents) */}
                                    <div className="relative z-10 flex items-center justify-between mb-3 pb-3 border-b border-slate-200/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center text-gold shrink-0 border border-gold/10">
                                                <Calendar size={14} />
                                            </div>
                                            <div className="flex flex-col text-right">
                                                <span className="text-[10px] font-black text-secondary leading-none">
                                                    {formatDateArabic(searchData.checkIn)} - {formatDateArabic(searchData.checkOut)}
                                                </span>
                                                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">التواريخ</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col text-right items-end">
                                                <span className="text-[10px] font-black text-secondary leading-none">
                                                    {searchData.adults} بالغ، {searchData.children || 0} طفل
                                                </span>
                                                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{searchData.rooms || 1} غرفة</span>
                                            </div>
                                            <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center text-gold shrink-0 border border-gold/10">
                                                <Users size={14} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selected Room Info (Green & Gold accents) */}
                                    {selectedRoom !== null && (
                                        <div className="relative z-10 flex items-center gap-3 mb-4 p-3 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl animate-fade-in">
                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600 border border-emerald-50 shrink-0">
                                                <BedDouble size={18} />
                                            </div>
                                            <div className="flex-1 text-right">
                                                <h5 className="text-[11px] font-black text-secondary leading-tight line-clamp-1">{roomsData[selectedRoom].name}</h5>
                                                <div className="flex items-center justify-end gap-2 mt-0.5">
                                                    <span className="text-[9px] text-slate-500 font-bold">{roomsData[selectedRoom].bed}</span>
                                                    <span className="text-slate-200 text-[8px]">|</span>
                                                    <span className="text-[9px] text-gold-dark font-black">{roomsData[selectedRoom].view || 'إطلالة مدينة'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="relative z-10 flex items-center justify-between gap-4">
                                        {/* Price Side (Emerald Green focal point) */}
                                        <div className="flex flex-col pr-2">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">المجموع النهائي</span>
                                            <div className="flex items-baseline gap-1 dir-rtl">
                                                {searchData.couponDiscount && searchData.couponDiscount > 0 ? (
                                                    <div className="flex flex-col items-start leading-none">
                                                        <span className="text-[9px] line-through text-slate-300 decoration-red-400">
                                                            {(totalPriceSummary > 0 ? totalPriceSummary : (hotel?.basePrice || 400)).toLocaleString()}
                                                        </span>
                                                        <span className="text-xl font-black text-emerald-700">
                                                            {Math.round((totalPriceSummary > 0 ? totalPriceSummary : (hotel?.basePrice || 400)) * (1 - searchData.couponDiscount / 100)).toLocaleString()} <span className="text-[9px]">ر.س</span>
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-2xl font-black text-emerald-700 tracking-tight">
                                                        {(totalPriceSummary > 0 ? totalPriceSummary : (hotel?.basePrice || 400)).toLocaleString()} <span className="text-[10px] font-bold">ر.س</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Button Side (Premium Emerald to Darker Green) */}
                                        <button
                                            onClick={() => {
                                                if (selectedRoom !== null) {
                                                    handleBookNow();
                                                } else {
                                                    roomsRef.current?.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }}
                                            className={`relative group overflow-hidden px-8 py-4 rounded-[2rem] font-black text-sm transition-all duration-500 active:scale-[0.96] flex items-center gap-2 whitespace-nowrap ${selectedRoom !== null
                                                ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-900/40 hover:bg-emerald-700'
                                                : 'bg-slate-900 text-white shadow-2xl shadow-black/20 hover:bg-black'
                                                }`}
                                        >
                                            <span className="relative z-10">{selectedRoom !== null ? 'إتمام الحجز' : 'احجز الآن'}</span>
                                            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center relative z-10 transition-transform group-hover:bg-gold/40">
                                                {selectedRoom !== null ? (
                                                    <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                                                ) : (
                                                    <ArrowLeft size={12} className="rotate-[-90deg] group-hover:translate-y-0.5 transition-transform" />
                                                )}
                                            </div>

                                            {/* Subtle shine effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
                </div>

                <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes bounceIn {
                     0% { transform: scale(0.9); opacity: 0; }
                     60% { transform: scale(1.05); opacity: 1; }
                     100% { transform: scale(1); }
                }
                .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
                .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
                .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; opacity: 0; }
                .animate-bounce-in { animation: bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            `}</style>

                {/* Mobile Search Overlay (iOS Style) */}
                <MobileSearchOverlay
                    isOpen={showMobileSearch}
                    onClose={() => setShowMobileSearch(false)}
                    onSearch={() => refetch()}
                    hideDestination={true}
                    initialStep="dates"
                />

                {/* 🖼️ Full Screen Gallery Modal */}
                {showGalleryModal && createPortal(
                    <div
                        className="fixed inset-0 z-[9999] bg-primary/95 flex flex-col"
                        onClick={() => setShowGalleryModal(false)}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 md:p-6">
                            <div className="text-white font-bold text-sm">
                                {galleryActiveIndex + 1} / {displayImages.length}
                            </div>
                            <button
                                onClick={() => setShowGalleryModal(false)}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="text-white" size={24} />
                            </button>
                        </div>

                        {/* Main Image */}
                        <div
                            className="flex-1 flex items-center justify-center px-4 md:px-20 relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Previous Button */}
                            <button
                                onClick={() => setGalleryActiveIndex(prev => prev > 0 ? prev - 1 : displayImages.length - 1)}
                                className="absolute left-2 md:left-8 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                            >
                                <ChevronLeft className="text-white" size={28} />
                            </button>

                            {/* Image */}
                            <img
                                src={displayImages[galleryActiveIndex]}
                                alt={`${hotel?.name} - ${galleryActiveIndex + 1}`}
                                className="max-h-[70vh] max-w-full object-contain rounded-lg"
                            />

                            {/* Next Button */}
                            <button
                                onClick={() => setGalleryActiveIndex(prev => prev < displayImages.length - 1 ? prev + 1 : 0)}
                                className="absolute right-2 md:right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                            >
                                <ChevronRight className="text-white" size={28} />
                            </button>
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="p-4 md:p-6">
                            <div className="flex gap-2 overflow-x-auto justify-center no-scrollbar">
                                {displayImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setGalleryActiveIndex(idx); }}
                                        className={`shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden border-2 transition-all ${idx === galleryActiveIndex ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-80'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </>
    );
};

export default HotelDetails;
