
import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Users, Tag, Search, ChevronDown, ChevronLeft, ChevronRight, Minus, Plus, X, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSearch, SearchData } from '../contexts/SearchContext';

export interface BookingSearchData {
    checkIn: Date;
    checkOut: Date;
    nights: number;
    rooms: number;
    adults: number;
    children: number;
    promoCode: string;
}

interface HotelBookingSearchProps {
    hotelId: string;
    hotelName: string;
    basePrice: number;
    onSearch?: (data: BookingSearchData) => void;
    onChange?: (data: BookingSearchData) => void;
}

const HotelBookingSearch: React.FC<HotelBookingSearchProps> = ({ hotelId, hotelName, basePrice, onSearch, onChange }) => {
    // Use shared search context
    const { searchData, updateSearch, initializeForBooking } = useSearch();

    const today = new Date();

    // Do not initialize dates automatically; let the user pick or see "Select Date"
    useEffect(() => {
        // initializeForBooking(); // Removed to fix "hardcoded dates" issue
    }, []);

    // Map context to local names (with defaults for null)
    // DEEP SAFETY: Provide hard fallbacks for dates AND normalize to midnight
    const normalizeDate = (d: Date | null | undefined): Date => {
        const date = d instanceof Date && !isNaN(d.getTime()) ? new Date(d) : new Date(today);
        date.setHours(0, 0, 0, 0);
        return date;
    };

    const checkIn = normalizeDate(searchData.checkIn);
    const checkOut = searchData.checkOut ? normalizeDate(searchData.checkOut) : null;
    const rooms = searchData.rooms || 1;
    const adults = searchData.adults || 2;
    const children = searchData.children;
    const promoCode = searchData.promoCode;
    const nights = searchData.nights || 1;

    // Setter helpers that update context
    const setCheckIn = (date: Date) => updateSearch({ checkIn: date });
    const setCheckOut = (date: Date | null) => updateSearch({ checkOut: date });
    const setRooms = (v: number) => updateSearch({ rooms: v });
    const setAdults = (v: number) => updateSearch({ adults: v });
    const setChildren = (v: number) => updateSearch({ children: v });
    const setPromoCode = (v: string) => updateSearch({ promoCode: v });

    // UI state only
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectingCheckOut, setSelectingCheckOut] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showGuestPicker, setShowGuestPicker] = useState(false);
    const [showPromoInput, setShowPromoInput] = useState(false);
    const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
    const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleVerifyCoupon = async () => {
        if (!promoCode.trim()) return;
        setIsCheckingCoupon(true);
        setCouponMsg(null);

        try {
            const res = await fetch('http://localhost:3001/api/coupons/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: promoCode })
            });
            const data = await res.json();

            if (data.valid) {
                setCouponMsg({ type: 'success', text: `تم تطبيق خصم ${data.discount}% بنجاح!` });
                updateSearch({ couponDiscount: data.discount }); // <--- Update Context

                // 🎉 Celebration Effect
                const duration = 2 * 1000;
                const animationEnd = Date.now() + duration;
                const defaults = { startVelocity: 20, spread: 360, ticks: 60, zIndex: 1000 };
                const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

                const interval: any = setInterval(function () {
                    const timeLeft = animationEnd - Date.now();
                    if (timeLeft <= 0) return clearInterval(interval);
                    const particleCount = 20 * (timeLeft / duration);
                    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
                }, 250);

            } else {
                setCouponMsg({ type: 'error', text: data.error || data.message || 'الكوبون غير صالح' });
                updateSearch({ couponDiscount: 0 }); // <--- Reset Context
            }
        } catch (err) {
            setCouponMsg({ type: 'error', text: 'حدث خطأ أثناء التحقق' });
            updateSearch({ couponDiscount: 0 }); // <--- Reset Context
        } finally {
            setIsCheckingCoupon(false);
        }
    };

    const datePickerRef = useRef<HTMLDivElement>(null);
    const guestPickerRef = useRef<HTMLDivElement>(null);

    // Arabic month names
    const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const arabicDays = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

    // Format date for display
    const formatDateArabic = (date: Date | null) => {
        if (!date) return 'اختر التاريخ';
        return `${date.getDate()} ${arabicMonths[date.getMonth()]}`;
    };

    // Close pickers when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Check if click is outside Date Picker
            if (datePickerRef.current && !datePickerRef.current.contains(target)) {
                // IMPORTANT: If the target element was just unmounted (common in React lists/grids),
                // it won't be in the document body. We should NOT close in this case as it indicates
                // the click were likely on a calendar day that was replaced by a re-render.
                if (target instanceof Element && !document.body.contains(target)) return;

                setShowDatePicker(false);
            }

            // Check if click is outside Guest Picker
            if (guestPickerRef.current && !guestPickerRef.current.contains(target)) {
                if (target instanceof Element && !document.body.contains(target)) return;
                setShowGuestPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Notify parent of state changes
    useEffect(() => {
        if (onChange) {
            onChange({
                checkIn,
                checkOut: checkOut || new Date(checkIn.getTime() + 86400000), // Ensure parent gets a valid range even if one side is null during selection
                nights,
                rooms,
                adults,
                children,
                promoCode
            });
        }
    }, [checkIn, checkOut, rooms, adults, children, promoCode]);

    // Generate calendar days for a specific month
    const generateCalendarDays = (monthDate: Date) => {
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        const days: (number | null)[] = [];

        // Add empty slots for days before the first day of month
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let i = 1; i <= totalDays; i++) {
            days.push(i);
        }

        return days;
    };

    const handleDateSelect = (day: number, monthDate: Date) => {
        const selectedDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        selectedDate.setHours(0, 0, 0, 0);

        if (!selectingCheckOut) {
            // First click: Selection of Check-In
            // We set checkout to null to indicate a new range is being picked
            updateSearch({
                checkIn: selectedDate,
                checkOut: null
            });
            setSelectingCheckOut(true);
        } else {
            // Second click: Selection of Check-Out
            if (selectedDate > checkIn) {
                setCheckOut(selectedDate);
                setSelectingCheckOut(false);
            } else if (selectedDate.getTime() === checkIn.getTime()) {
                // If they click the same day, we treat it as a new check-in start
                updateSearch({ checkIn: selectedDate, checkOut: null });
                setSelectingCheckOut(true);
            } else {
                // If user selects a date before check-in, treat it as a new check-in
                updateSearch({
                    checkIn: selectedDate,
                    checkOut: null
                });
                setSelectingCheckOut(true);
            }
        }
    };

    const isDateDisabled = (day: number, monthDate: Date) => {
        const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        date.setHours(0, 0, 0, 0);
        const todayNormalized = new Date(today);
        todayNormalized.setHours(0, 0, 0, 0);

        return date < todayNormalized;
    };

    const isDateSelected = (day: number, monthDate: Date) => {
        const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        date.setHours(0, 0, 0, 0);
        return date.getTime() === checkIn.getTime() || (checkOut && date.getTime() === checkOut.getTime());
    };

    const isDateInRange = (day: number, monthDate: Date) => {
        if (!checkOut) return false;
        const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        date.setHours(0, 0, 0, 0);
        return date > checkIn && date < checkOut;
    };

    const handleSearch = () => {
        if (onSearch) {
            onSearch({
                checkIn,
                checkOut: checkOut || new Date(checkIn.getTime() + 86400000),
                nights,
                rooms,
                adults,
                children,
                promoCode
            });
        }
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    // Second month date
    const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

    return (
        <div className="w-full mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-text">ابدأ حجزك الآن</h3>
                {nights > 0 && (
                    <span className="bg-slate-100/50 text-[#0f172a] px-3 py-1 rounded-full text-sm font-bold">
                        {nights} {nights === 1 ? 'ليلة' : nights === 2 ? 'ليلتين' : nights <= 10 ? 'ليالي' : 'ليلة'}
                    </span>
                )}
            </div>

            {/* Search Bar Container */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm relative">
                <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100">

                    {/* Dates Section */}
                    <div className="md:col-span-2" ref={datePickerRef}>
                        <button
                            type="button"
                            onClick={() => { setShowDatePicker(!showDatePicker); setSelectingCheckOut(false); }}
                            className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-right"
                        >
                            <div className="w-12 h-12 bg-[#0f172a]/10 rounded-xl flex items-center justify-center shrink-0">
                                <Calendar size={22} className="text-[#0f172a]" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs text-slate-400 font-bold mb-1">تواريخ الإقامة</div>
                                <div className="flex items-center gap-3">
                                    <div>
                                        <span className="text-base font-black text-text">{formatDateArabic(checkIn)}</span>
                                    </div>
                                    <span className="text-slate-300">←</span>
                                    <div>
                                        <span className="text-base font-black text-text">{formatDateArabic(checkOut)}</span>
                                    </div>
                                </div>
                            </div>
                            <ChevronDown size={18} className={`text-slate-400 transition-transform ${showDatePicker ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Custom Date Picker - Premium Dual Month */}
                        {showDatePicker && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white rounded-[3rem] border border-slate-100 shadow-[0_30px_100px_-10px_rgba(0,0,0,0.15)] p-10 z-[1000] w-[95vw] md:w-[850px] md:max-w-[calc(100vw-40px)] animate-in fade-in zoom-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">

                                    {/* Month Navigation */}
                                    <button
                                        type="button"
                                        onClick={prevMonth}
                                        className="absolute -right-4 top-0 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-50 flex items-center justify-center text-slate-400 hover:text-gold transition-all active:scale-90"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextMonth}
                                        className="absolute -left-4 top-0 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-50 flex items-center justify-center text-slate-400 hover:text-gold transition-all active:scale-90"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>

                                    {[currentMonth, nextMonthDate].map((monthDate, mIdx) => (
                                        <div key={mIdx} className="space-y-6">
                                            {/* Month Title */}
                                            <div className="text-center">
                                                <span className="text-xl font-black text-text">
                                                    {arabicMonths[monthDate.getMonth()]} {monthDate.getFullYear()}
                                                </span>
                                            </div>

                                            {/* Days Header */}
                                            <div className="grid grid-cols-7 gap-1">
                                                {arabicDays.map(day => (
                                                    <div key={day} className="text-center text-[10px] font-black text-slate-400/60 py-1 uppercase tracking-widest">
                                                        {day.charAt(0)}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Calendar Grid */}
                                            <div className="grid grid-cols-7 gap-y-1">
                                                {generateCalendarDays(monthDate).map((day, idx) => {
                                                    const date = day ? new Date(monthDate.getFullYear(), monthDate.getMonth(), day) : null;
                                                    const isSelected = day ? isDateSelected(day, monthDate) : false;
                                                    const inRange = day ? isDateInRange(day, monthDate) : false;
                                                    const disabled = day ? isDateDisabled(day, monthDate) : true;

                                                    return (
                                                        <div key={idx} className="relative py-0.5">
                                                            {day !== null && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDateSelect(day, monthDate)}
                                                                    disabled={disabled}
                                                                    className={`w-full aspect-square flex items-center justify-center rounded-full text-[13px] font-black transition-all relative z-10
                                                                        ${isSelected
                                                                            ? 'bg-[#0f172a] text-white shadow-lg shadow-slate-900/30'
                                                                            : inRange
                                                                                ? 'text-[#0f172a] hover:bg-slate-50 font-black'
                                                                                : disabled
                                                                                    ? 'text-slate-100 cursor-not-allowed'
                                                                                    : 'text-text hover:bg-slate-50'
                                                                        }`}
                                                                >
                                                                    {day}
                                                                </button>
                                                            )}
                                                            {/* Range Background Overlay */}
                                                            {inRange && day !== null && (
                                                                <div className="absolute inset-y-0 inset-x-0 bg-[#0f172a]/5 z-0" />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Middle Divider Line */}
                                    <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-px bg-slate-50 -translate-x-1/2" />
                                </div>

                                {/* Confirm Button & Selection Hint */}
                                <div className="mt-12 flex flex-col items-center gap-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (selectingCheckOut && !searchData.checkOut) {
                                                const nextDay = new Date(checkIn);
                                                nextDay.setDate(nextDay.getDate() + 1);
                                                updateSearch({ checkOut: nextDay });
                                            }
                                            setShowDatePicker(false);
                                            setSelectingCheckOut(false);
                                        }}
                                        className="bg-[#0f172a] text-white px-12 py-4 rounded-full font-black text-sm shadow-xl shadow-slate-900/10 hover:bg-primary active:scale-95 transition-all w-full md:w-auto"
                                    >
                                        تأكيد الإقامة
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full animate-pulse ${selectingCheckOut ? 'bg-amber-500' : 'bg-slate-800'}`}></div>
                                        <span className="text-[10px] text-slate-400 font-bold">
                                            {selectingCheckOut ? 'يرجى تحديد تاريخ المغادرة الآن' : 'تم تحديد تواريخ الإقامة بنجاح'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Guests Section */}
                    <div className="relative" ref={guestPickerRef}>
                        <button
                            type="button"
                            onClick={() => setShowGuestPicker(!showGuestPicker)}
                            className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-right"
                        >
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                <Users size={22} className="text-[#0f172a]" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs text-slate-400 font-bold mb-1">الغرف والنزلاء</div>
                                <div className="text-base font-black text-text whitespace-nowrap">
                                    {rooms} غرفة · {adults + children} ضيف
                                </div>
                            </div>
                            <ChevronDown size={18} className={`text-slate-400 transition-transform ${showGuestPicker ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Guest Picker Dropdown */}
                        {showGuestPicker && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 z-[1000]">
                                {/* Rooms */}
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <span className="font-bold text-text">الغرف</span>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setRooms(Math.max(1, rooms - 1))}
                                            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-black text-text w-8 text-center text-lg">{rooms}</span>
                                        <button
                                            type="button"
                                            onClick={() => setRooms(rooms + 1)}
                                            className="w-9 h-9 rounded-full bg-[#0f172a]/10 flex items-center justify-center text-[#0f172a] hover:bg-[#0f172a]/20 transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                                {/* Adults */}
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <div>
                                        <span className="font-bold text-text">البالغين</span>
                                        <span className="text-xs text-slate-400 block">+12 سنة</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setAdults(Math.max(1, adults - 1))}
                                            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-black text-text w-8 text-center text-lg">{adults}</span>
                                        <button
                                            type="button"
                                            onClick={() => setAdults(adults + 1)}
                                            className="w-9 h-9 rounded-full bg-[#0f172a]/10 flex items-center justify-center text-[#0f172a] hover:bg-[#0f172a]/20 transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                                {/* Children */}
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <span className="font-bold text-text">الأطفال</span>
                                        <span className="text-xs text-slate-400 block">0-12 سنة</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setChildren(Math.max(0, children - 1))}
                                            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-black text-text w-8 text-center text-lg">{children}</span>
                                        <button
                                            type="button"
                                            onClick={() => setChildren(children + 1)}
                                            className="w-9 h-9 rounded-full bg-[#0f172a]/10 flex items-center justify-center text-[#0f172a] hover:bg-[#0f172a]/20 transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowGuestPicker(false)}
                                    className="w-full bg-primary text-white py-3 rounded-xl font-bold mt-4 hover:bg-primary transition-colors"
                                >
                                    تأكيد
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Search Button */}
                    <div className="flex items-center p-3">
                        <button
                            onClick={handleSearch}
                            className="w-full bg-[#059669] text-white py-4 rounded-xl font-black text-base hover:bg-[#047857] transition-all shadow-lg shadow-[#059669]/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Search size={20} />
                            <span>بحث عن الغرف</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Promo Code - Collapsible */}
            <div className="mt-3">
                {!showPromoInput ? (
                    <button
                        onClick={() => setShowPromoInput(true)}
                        className="text-sm text-gold font-bold flex items-center gap-1 hover:underline"
                    >
                        <Tag size={14} />
                        هل لديك كود خصم؟
                    </button>
                ) : (
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-2">
                        <Tag size={16} className="text-gold mr-2" />
                        <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="أدخل كود الخصم"
                            className="flex-1 bg-transparent text-sm font-bold text-text outline-none placeholder:text-slate-400 uppercase"
                        />
                        <button
                            onClick={() => { setShowPromoInput(false); setPromoCode(''); setCouponMsg(null); }}
                            className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-300"
                        >
                            <X size={14} />
                        </button>
                        <button
                            onClick={handleVerifyCoupon}
                            disabled={isCheckingCoupon || !promoCode}
                            className="bg-[#0f172a] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isCheckingCoupon ? <Loader2 size={14} className="animate-spin" /> : 'تطبيق'}
                        </button>
                    </div>
                )}
                {couponMsg && (
                    <div className={`mt-2 text-xs font-bold ${couponMsg.type === 'success' ? 'text-primary' : 'text-red-500'}`}>
                        {couponMsg.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HotelBookingSearch;
