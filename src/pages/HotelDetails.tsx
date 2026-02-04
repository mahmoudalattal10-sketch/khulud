import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHotelDetails } from '../hooks/useHotelDetails';
import {
    Star, Award, ChevronLeft, Search, AlertCircle, MapPin, Tag, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Shared Components
import MobileSearchOverlay from '../features/search/components/MobileSearchOverlay';
import HotelBookingSearch from '../features/search/components/HotelBookingSearch';
// Modular Feature Components
import HotelGallery from '../features/hotels/components/HotelGallery';
import HotelGalleryModal from '../features/hotels/components/HotelGalleryModal';
import HotelHeader from '../features/hotels/components/HotelHeader';
import HotelFacilities from '../features/hotels/components/HotelFacilities';
import HotelNearbyPlaces from '../features/hotels/components/HotelNearbyPlaces';
import HotelRooms from '../features/hotels/components/HotelRooms';
import HotelPolicies from '../features/hotels/components/HotelPolicies';
import MobileBookingDocker from '../features/hotels/components/MobileBookingDocker';
import HotelFullDetails from '../features/hotels/components/HotelFullDetails';
import BookingSummary from '../features/hotels/components/BookingSummary';

// Lazy Load Heavy Components
const HotelViewMap = React.lazy(() => import('../features/hotels/components/HotelViewMap'));
const RelatedHotels = React.lazy(() => import('../features/hotels/components/RelatedHotels'));

import { useSearch, formatDateArabic } from '../contexts/SearchContext';
import { MEAL_PLAN_LABELS } from '../constants/hotelConstants';

const HotelDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { searchData } = useSearch();

    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
    const [extraBedCounts, setExtraBedCounts] = useState<Record<string, number>>({});
    const [roomQuantities, setRoomQuantities] = useState<Record<string, number>>({});
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [searchStep, setSearchStep] = useState<'destination' | 'dates' | 'guests'>('destination');
    const [showGalleryModal, setShowGalleryModal] = useState(false);

    const queryParams = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        const ci = params.get('checkIn');
        const co = params.get('checkOut');
        const g = params.get('guests');
        return {
            checkIn: ci ? new Date(ci) : undefined,
            checkOut: co ? new Date(co) : undefined,
            guests: g ? Number(g) : undefined
        };
    }, [window.location.search]);

    // 🚀 Fetch hotel from API
    const { hotel, rooms, loading, error, refetch } = useHotelDetails(id, {
        checkIn: queryParams.checkIn || (searchData.hasSearched ? searchData.checkIn : undefined),
        checkOut: queryParams.checkOut || (searchData.hasSearched ? searchData.checkOut : undefined),
        guests: queryParams.guests || (searchData.hasSearched ? (searchData.adults || 0) : undefined)
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        setSelectedRoom(null);
    }, [id]);

    // [PERSISTENCE] Sync Search Context with URL for robustness
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const hasUrlParams = params.has('checkIn') && params.has('checkOut');

        if (!hasUrlParams && searchData.hasSearched && searchData.checkIn && searchData.checkOut) {
            const newParams = new URLSearchParams(window.location.search);
            newParams.set('checkIn', searchData.checkIn.toLocaleDateString('en-CA'));
            newParams.set('checkOut', searchData.checkOut.toLocaleDateString('en-CA'));
            if (searchData.adults) {
                newParams.set('guests', String(searchData.adults || 0));
            }
            navigate(`${window.location.pathname}?${newParams.toString()}`, { replace: true });
        }
    }, [searchData, navigate, id]);

    // Dynamic Data Transformation
    const displayImages = useMemo(() => {
        if (!hotel) return [];
        const baseImages = [hotel.image, ...(hotel.images || [])].filter(img => img && typeof img === 'string');
        return Array.from(new Set(baseImages));
    }, [hotel]);

    const roomsData = useMemo(() => {
        if (!rooms || !Array.isArray(rooms)) return [];
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
                MEAL_PLAN_LABELS[room.mealPlan] || 'بدون وجبات'
            ].filter(Boolean),
            images: (room.images && room.images.length > 0) ? room.images : [hotel?.image].filter(Boolean),
            pricingPeriods: room.pricingPeriods || [],
            inventory: room.availableStock || 0,
            allowExtraBed: room.allowExtraBed || false,
            extraBedPrice: room.extraBedPrice || 0,
            maxExtraBeds: room.maxExtraBeds || 1,
            isVisible: room.isVisible !== false,
            partialMetadata: room.partialMetadata,
            originalIdx: idx
        }));
    }, [rooms, hotel]);

    const groupedRooms = useMemo(() => {
        if (!roomsData.length) return [];
        const groups: Record<string, any> = {};

        roomsData.filter(room => room.isVisible !== false).forEach(room => {
            if (!groups[room.name]) {
                groups[room.name] = {
                    name: room.name,
                    images: room.images,
                    capacity: room.capacity,
                    size: room.size,
                    bed: room.bed,
                    view: room.view,
                    variants: []
                };
            }
            groups[room.name].variants.push(room);
        });

        Object.values(groups).forEach((group: any) => {
            // Smart Sort Variants: 
            // 1. Non-partial (Full Match) first
            // 2. Then by price (Ascending)
            group.variants.sort((a: any, b: any) => {
                const aIsPartial = a.partialMetadata?.isPartial ? 1 : 0;
                const bIsPartial = b.partialMetadata?.isPartial ? 1 : 0;
                if (aIsPartial !== bIsPartial) return aIsPartial - bIsPartial;
                return a.price - b.price;
            });
        });

        // Smart Sort Groups:
        // 1. Groups with at least one Full Match room first
        // 2. Then by lowest price in group
        return Object.values(groups).sort((a: any, b: any) => {
            const aHasFull = a.variants.some((v: any) => !v.partialMetadata?.isPartial) ? 0 : 1;
            const bHasFull = b.variants.some((v: any) => !v.partialMetadata?.isPartial) ? 0 : 1;
            if (aHasFull !== bHasFull) return aHasFull - bHasFull;

            const aMinPrice = Math.min(...a.variants.map((v: any) => v.price));
            const bMinPrice = Math.min(...b.variants.map((v: any) => v.price));
            return aMinPrice - bMinPrice;
        });
    }, [roomsData, searchData]);

    const handleSearchUpdate = (data: any) => {
        const newParams = new URLSearchParams(window.location.search);

        if (data.checkIn) {
            const ci = data.checkIn instanceof Date ? data.checkIn.toLocaleDateString('en-CA') : data.checkIn;
            newParams.set('checkIn', ci);
        }

        if (data.checkOut) {
            const co = data.checkOut instanceof Date ? data.checkOut.toLocaleDateString('en-CA') : data.checkOut;
            newParams.set('checkOut', co);
        }

        const adults = data.adults || data.guests?.adults || 0;
        const children = data.children || data.guests?.children || 0;
        // [MODIFIED] Only count adults for filtering per user request
        const totalGuests = adults;

        if (totalGuests) {
            newParams.set('guests', String(totalGuests));
        }

        navigate(`${window.location.pathname}?${newParams.toString()}`, { replace: true });
        // refetch() will be triggered automatically as queryParams depend on URL search
    };

    const handleQuantityChange = (roomId: string, delta: number, max: number) => {
        setRoomQuantities(prev => ({
            ...prev,
            [roomId]: Math.max(0, Math.min((prev[roomId] || 0) + delta, max))
        }));
    };

    const handleExtraBedChange = (roomId: string, delta: number, max: number) => {
        setExtraBedCounts(prev => ({
            ...prev,
            [roomId]: Math.max(0, Math.min((prev[roomId] || 0) + delta, max))
        }));
    };

    const [couponCode, setCouponCode] = useState(searchData.promoCode || '');
    const [couponError, setCouponError] = useState('');
    const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);
    const { updateSearch } = useSearch(); // Removed duplicate searchData

    const handleVerifyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponError('');
        setIsVerifyingCoupon(true);

        try {
            console.log('Verifying coupon:', couponCode, 'for hotel:', hotel?.id);
            const res = await fetch('http://localhost:3001/api/coupons/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: couponCode,
                    hotelId: hotel?.id
                })
            });
            const data = await res.json();
            console.log('Coupon verification response:', data);

            if (data.success) {
                console.log('Coupon valid, applying discount:', data.data.discount);
                updateSearch({
                    couponDiscount: data.data.discount,
                    promoCode: data.data.code || couponCode
                });
                console.log('Search context updated');

                // 🎉 Celebration Effect
                const end = Date.now() + 3 * 1000;
                const colors = ['#D4AF37', '#FFD700', '#F0E68C', '#ffffff'];

                (function frame() {
                    confetti({
                        particleCount: 4,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: colors,
                        zIndex: 2000
                    });
                    confetti({
                        particleCount: 4,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: colors,
                        zIndex: 2000
                    });

                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                }());

            } else {
                setCouponError(data.message || 'الكوبون غير صالح');
                updateSearch({ couponDiscount: 0, promoCode: '' });
            }
        } catch (err) {
            setCouponError('حدث خطأ أثناء التحقق');
        } finally {
            setIsVerifyingCoupon(false);
        }
    };

    const nights = searchData.checkOut && searchData.checkIn
        ? Math.max(1, Math.round((searchData.checkOut.getTime() - searchData.checkIn.getTime()) / (1000 * 60 * 60 * 24)))
        : 1;

    const selectedRoomsSummaryMemo = useMemo(() => {
        return roomsData.filter(room => (roomQuantities[room.id] || 0) > 0).map(room => ({
            id: room.id,
            name: room.name,
            count: roomQuantities[room.id],
            price: room.price,
            extraBeds: extraBedCounts[room.id] || 0,
            extraBedPrice: room.extraBedPrice
        }));
    }, [roomsData, roomQuantities, extraBedCounts]);

    // Calculate total price for mobile docker
    const mobileTotalPriceMemo = useMemo(() => {
        const total = selectedRoomsSummaryMemo.reduce((sum, room) => {
            const roomBase = room.price * room.count * nights;
            const extraLines = room.extraBedPrice * room.extraBeds * room.count * nights;
            return sum + roomBase + extraLines;
        }, 0);
        const discount = (total * (searchData.couponDiscount || 0)) / 100;
        const totalAfterDiscount = total - discount;
        return totalAfterDiscount;
    }, [selectedRoomsSummaryMemo, nights, searchData.couponDiscount]);

    const handleConfirmBooking = () => {
        if (selectedRoomsSummaryMemo.length === 0) return;

        // Pass all selected rooms to booking page
        const primaryRoom = selectedRoomsSummaryMemo[0];

        navigate(`/booking/${hotel?.id}`, {
            state: {
                // Primary room details for current BookingPage structure
                roomId: primaryRoom.id,
                price: primaryRoom.price,
                extraBedCount: primaryRoom.extraBeds,
                roomCount: primaryRoom.count,

                // Full selection for future use
                selectedRooms: selectedRoomsSummaryMemo,
                checkIn: searchData.checkIn?.toISOString(),
                checkOut: searchData.checkOut?.toISOString(),
                totalGuests: {
                    adults: searchData.adults,
                    children: searchData.children
                },
                // Coupon Data
                promoCode: searchData.promoCode,
                couponDiscount: searchData.couponDiscount
            }
        });
    };

    // Keep handleBookNow for direct "Book Now" buttons on cards if they exist (legacy support or quick action)
    const handleBookNow = (idx: number) => {
        const room = roomsData[idx];
        setRoomQuantities(prev => ({ ...prev, [room.id]: 1 }));
        // Just select it, let user confirm via summary
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] font-cairo text-text pb-20">

            {loading && !hotel ? (
                <div className="animate-pulse">
                    <div className="h-28" />
                    <div className="max-w-[1400px] mx-auto px-8 py-6">
                        <div className="w-full h-[500px] bg-slate-100 rounded-[3rem] mb-12" />
                        <div className="h-12 w-1/2 bg-slate-100 rounded-xl mb-6" />
                        <div className="h-40 w-full bg-slate-100 rounded-[2rem]" />
                    </div>
                </div>
            ) : error || (!loading && !hotel) ? (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                        <h2 className="text-2xl font-bold">عذراً، حدث خطأ</h2>
                        <p className="text-slate-500">{error || 'لم يتم العثور على الفندق'}</p>
                        <button onClick={() => refetch()} className="px-8 py-3 bg-gold text-white rounded-xl font-bold">إعادة المحاولة</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="h-24 md:h-28" />
                    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
                        <HotelGallery
                            hotelId={hotel.id}
                            hotelName={hotel.name}
                            mainImage={hotel.image}
                            images={hotel.images || []}
                            onShowAll={() => setShowGalleryModal(true)}
                            lat={hotel.lat || hotel.coords?.[0] || 0}
                            lng={hotel.lng || hotel.coords?.[1] || 0}
                            distanceFromHaram={hotel.distanceFromHaram}
                            city={hotel.city}
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                            <div className="lg:col-span-8 space-y-12">
                                <HotelHeader
                                    name={hotel.name}
                                    rating={hotel.rating}
                                    location={hotel.location}
                                    city={hotel.city}
                                    distanceFromHaram={hotel.distanceFromHaram}
                                />

                                <div className="md:hidden mt-2">
                                    <button
                                        onClick={() => setShowMobileSearch(true)}
                                        className="w-full bg-white/40 backdrop-blur-xl border border-white/60 p-4 rounded-[2rem] flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-all group"
                                    >
                                        <ChevronLeft size={16} className="text-slate-300 group-hover:-translate-x-1 transition-transform" />

                                        <div className="flex flex-col text-right flex-1 mr-4">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">تعديل البحث</p>
                                            <p className="text-sm font-black text-slate-800">
                                                {searchData.checkIn ? formatDateArabic(searchData.checkIn) : 'اختر التاريخ'} - {searchData.checkOut ? formatDateArabic(searchData.checkOut) : '---'}
                                            </p>
                                        </div>

                                        <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-gold transition-colors">
                                            <Search size={20} />
                                        </div>
                                    </button>
                                </div>

                                <div className="hidden md:block" id="hotel-booking-search-section">
                                    <HotelBookingSearch
                                        hotelId={hotel.id}
                                        hotelName={hotel.name}
                                        basePrice={hotel.basePrice}
                                        onSearch={handleSearchUpdate}
                                        isLoading={loading}
                                        autoSearch={true} // ✨ Enabled Instant Search
                                    />
                                </div>

                                {/* Trust Banner - Added for 2026 Premium Look */}
                                <div className="mb-12 animate-fade-in" style={{ animationDelay: '300ms' }}>
                                    <div className="bg-gradient-to-l from-emerald-50/40 via-white to-transparent border border-emerald-100/50 rounded-[2.5rem] p-6 md:p-8 flex items-center justify-between gap-6 shadow-sm group">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <h4 className="text-[18px] font-[1000] text-slate-900 tracking-tight">إقامة موثقة من ضيافة خلود</h4>
                                            </div>
                                            <p className="text-[13px] font-bold text-slate-500 leading-relaxed max-w-2xl">
                                                نضمن لك أعلى معايير الجودة والراحة بتفويض مباشر من منصتنا المعتمدة. كل عملية حجز تتم تحت إشراف فريقنا لضمان تجربة مثالية.
                                            </p>
                                        </div>
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-white text-emerald-500 flex items-center justify-center shadow-lg border border-emerald-50 group-hover:scale-110 transition-transform duration-500 shrink-0">
                                            <Award size={32} strokeWidth={2} />
                                        </div>
                                    </div>
                                </div>



                                <section id="about" className="space-y-4">
                                    <h2 className="text-[20px] font-[1000] text-[#0F172A] flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-[#D6B372] rounded-full" />
                                        عن الفندق
                                    </h2>
                                    <p className="text-[14px] font-bold text-slate-500 leading-relaxed max-w-4xl">{hotel.description}</p>
                                </section>

                                <HotelFacilities amenities={hotel.amenities || []} />

                                <section id="rooms">
                                    <div className="flex flex-col gap-1 mb-6">
                                        <h2 className="text-2xl font-black text-slate-900">خيارات الإقامة</h2>
                                        <p className="text-[12px] font-bold text-slate-400">اختر المساحة التي تناسب نمط حياتك</p>
                                    </div>
                                    <div className={`transition-all duration-500 ${loading ? 'opacity-40 grayscale-[0.5] pointer-events-none' : 'opacity-100'}`}>
                                        <HotelRooms
                                            groups={groupedRooms}
                                            selectedRoom={selectedRoom}
                                            roomQuantities={roomQuantities}
                                            extraBedCounts={extraBedCounts}
                                            onRoomSelect={setSelectedRoom}
                                            onQuantityChange={handleQuantityChange}
                                            onExtraBedChange={handleExtraBedChange}
                                            onBookNow={handleBookNow}
                                            hotelMainImage={hotel.image}
                                            hasDates={!!(searchData.checkIn && searchData.checkOut)}
                                            loading={loading}
                                            onOpenSearch={() => {
                                                if (window.innerWidth >= 1024) {
                                                    const el = document.getElementById('hotel-booking-search-section');
                                                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                }
                                                setSearchStep('dates');
                                                setShowMobileSearch(true);
                                            }}
                                        />
                                    </div>
                                </section>


                                <React.Suspense fallback={<div className="h-96 bg-slate-100 rounded-[2rem] animate-pulse" />}>
                                    <RelatedHotels currentHotelId={hotel.id} city={hotel.city} />
                                </React.Suspense>

                                <HotelPolicies />

                                <HotelFullDetails hotelName={hotel.name} />

                                <HotelNearbyPlaces landmarks={hotel.nearbyLandmarks || []} />
                            </div>

                            <div className="lg:col-span-4 space-y-8">
                                <div className="hidden lg:block bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden p-2">
                                    <div className="h-72 w-full">
                                        <React.Suspense fallback={<div className="h-full w-full bg-slate-100 animate-pulse" />}>
                                            <HotelViewMap
                                                lat={hotel.lat || hotel.coords?.[0] || 0}
                                                lng={hotel.lng || hotel.coords?.[1] || 0}
                                                hotelName={hotel.name}
                                                distanceFromHaram={hotel.distanceFromHaram}
                                            />
                                        </React.Suspense>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-4 text-slate-500 mb-6">
                                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                                <MapPin size={20} />
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase">الموقع الجغرافي</p>
                                                <p className="text-sm font-bold text-secondary">{hotel.location}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => window.open(`https://www.google.com/maps?q=${hotel.lat || hotel.coords?.[0]},${hotel.lng || hotel.coords?.[1]}`, '_blank')}
                                            className="w-full bg-slate-50 text-secondary py-4 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all border border-slate-100"
                                        >
                                            فتح في خرائط جوجل
                                        </button>
                                    </div>
                                </div>

                                <div className="hidden lg:block sticky top-28 transition-all duration-300">
                                    {/* Coupon Inputs - Added Back */}
                                    {/* Premium Coupon Section - Balanced Efficiency */}
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-6 mb-5 relative overflow-hidden group/coupon">
                                        <div className="flex items-center gap-3 mb-4 relative z-10">
                                            <div className="w-8 h-8 rounded-xl bg-[#D6B372]/10 flex items-center justify-center text-[#D6B372]">
                                                <Tag size={16} />
                                            </div>
                                            <div className="text-right">
                                                <h4 className="text-xs font-black text-slate-800 leading-none mb-1">هل لديك كود خصم؟</h4>
                                                <p className="text-[10px] font-bold text-slate-400">أدخل الرمز للحصول على تخفيض</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2.5 relative z-10">
                                            <div className="flex-1 relative">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                    placeholder="كود الخصم"
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-black text-slate-800 outline-none focus:border-[#D6B372] transition-all"
                                                />
                                            </div>
                                            <button
                                                onClick={handleVerifyCoupon}
                                                disabled={isVerifyingCoupon || !couponCode}
                                                className="bg-slate-900 text-white px-6 rounded-xl font-black text-xs disabled:opacity-30 hover:bg-[#D6B372] transition-all active:scale-95"
                                            >
                                                تطبيق
                                            </button>
                                        </div>

                                        {((searchData.couponDiscount ?? 0) > 0) && (
                                            <div className="mt-3 flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl p-3 animate-in fade-in zoom-in-95 duration-300">
                                                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                                                    <Check size={12} strokeWidth={3} />
                                                </div>
                                                <p className="text-emerald-900 text-[11px] font-black">تم تفعيل خصم الحصري بنسبة {searchData.couponDiscount}%</p>
                                            </div>
                                        )}
                                    </div>

                                    <BookingSummary
                                        checkIn={searchData.checkIn?.toISOString() || new Date().toISOString()}
                                        checkOut={searchData.checkOut?.toISOString() || new Date(Date.now() + 86400000).toISOString()}
                                        nights={nights}
                                        adults={searchData.adults || 2}
                                        children={searchData.children || 0}
                                        selectedRooms={selectedRoomsSummaryMemo}
                                        onConfirm={handleConfirmBooking}
                                        hotelRating={hotel.rating}
                                        couponDiscount={searchData.couponDiscount}
                                        hasDates={!!(searchData.checkIn && searchData.checkOut)}
                                        key={`${searchData.couponDiscount}-${!!searchData.checkIn}`} // Force re-render on discount or date change
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <MobileBookingDocker
                        checkIn={searchData.checkIn}
                        checkOut={searchData.checkOut}
                        adults={searchData.adults || 2}
                        children={searchData.children || 0}
                        totalPrice={mobileTotalPriceMemo}
                        hasSelection={selectedRoomsSummaryMemo.length > 0}
                        onBookNow={() => {
                            if (!(searchData.checkIn && searchData.checkOut)) {
                                setShowMobileSearch(true);
                            } else if (selectedRoomsSummaryMemo.length === 0) {
                                const el = document.getElementById('rooms');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                handleConfirmBooking();
                            }
                        }}
                        onEditSearch={() => {
                            setSearchStep('dates');
                            setShowMobileSearch(true);
                        }}
                    />

                    <MobileSearchOverlay
                        isOpen={showMobileSearch}
                        onClose={() => setShowMobileSearch(false)}
                        onSearch={handleSearchUpdate}
                        initialStep={searchStep}
                        hideDestination={true}
                    />

                    <HotelGalleryModal
                        isOpen={showGalleryModal}
                        onClose={() => setShowGalleryModal(false)}
                        images={displayImages}
                        hotelName={hotel.name}
                    />
                </>
            )}
        </div>
    );
};

export default HotelDetails;
