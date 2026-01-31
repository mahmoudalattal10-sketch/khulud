import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Check, ChevronRight, ChevronLeft, Calendar, User, Mail, Phone, Lock, UserPlus,
    Shield, MapPin, Hotel, Star, ArrowLeft, ShieldCheck, Loader2, ChevronDown, Globe, Search, Plus, Minus, BedDouble,
    Maximize, Eye, Users, Percent, CheckCircle2, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { COUNTRIES } from '../constants';
import { useSearch, formatDateArabic } from '../contexts/SearchContext';
import { useAuth } from '../contexts/AuthContext';
import { createPaymentPage } from '../services/paytabs';
import { HotelsAPI, BookingsAPI, AuthAPI, Hotel as HotelType, Room, TokenManager } from '../services/api';

const BookingPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { searchData, initializeForBooking } = useSearch();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [hotel, setHotel] = useState<HotelType | null>(null);
    const [isFetchingHotel, setIsFetchingHotel] = useState(true);
    const priceSummaryRef = useRef<HTMLDivElement>(null);

    // Ensure search dates are initialized if user lands here directly
    useEffect(() => {
        initializeForBooking();
    }, []);

    // Get initial extra bed count and room count from state
    const state = location.state as {
        roomId?: string;
        price?: number;
        roomIdx?: number;
        extraBedCount?: number;
        roomCount?: number;
        checkIn?: string;
        checkOut?: string;
    } | null;
    const [extraBedCount, setExtraBedCount] = useState(state?.extraBedCount || 0);
    const [roomCount, setRoomCount] = useState(state?.roomCount || 1);

    // Guest form data
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [password, setPassword] = useState(''); // For registration
    const { user: authUser, login: authLogin } = useAuth();
    const [isLoggedIn, setIsLoggedIn] = useState(!!authUser);

    // Sync local isLoggedIn with auth context
    useEffect(() => {
        setIsLoggedIn(!!authUser);
    }, [authUser]);

    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // Default SA
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');

    const filteredCountries = COUNTRIES.filter(c =>
        c.name.includes(countrySearch) || c.dial_code.includes(countrySearch) || c.code.toLowerCase().includes(countrySearch.toLowerCase())
    );

    // Coupon State
    const [couponCode, setCouponCode] = useState(searchData.promoCode || '');
    const [couponDiscount, setCouponDiscount] = useState(searchData.couponDiscount || 0); // Percentage
    const [isCouponApplied, setIsCouponApplied] = useState(!!searchData.couponDiscount && searchData.couponDiscount > 0);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState(!!searchData.couponDiscount ? `تم تطبيق خصم ${searchData.couponDiscount}% مسبقاً` : '');
    const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
    const [showCouponInput, setShowCouponInput] = useState(false);

    // Fetch Hotel & User Data
    useEffect(() => {
        const loadData = async () => {
            setIsFetchingHotel(true);
            try {
                // 1. Fetch Hotel
                if (id) {
                    const response = await HotelsAPI.getById(id);
                    if (response.success && response.data) {
                        setHotel(response.data);
                    } else {
                        setError('لم يتم العثور على الفندق');
                    }
                }

                // 2. Check Auth & Profile
                if (AuthAPI.isLoggedIn()) {
                    setIsLoggedIn(true);
                    const profile = await AuthAPI.profile();
                    if (profile.success && profile.data?.user) {
                        // User requested empty fields
                        // setGuestName(profile.data.user.name);
                        // setGuestEmail(profile.data.user.email);
                        // setGuestPhone(profile.data.user.phone || '');
                    }
                }
            } catch (err) {
                console.error('Failed to load data', err);
                setError('حدث خطأ في تحميل البيانات');
            } finally {
                setIsFetchingHotel(false);
            }
        };

        loadData();
    }, [id]);

    // Find the specific room
    const selectedRoom = hotel?.rooms?.find(r => r.id === state?.roomId) || hotel?.rooms?.[0];

    const roomType = selectedRoom?.name || 'غرفة ديلوكس';
    const basePricePerNight = state?.price || selectedRoom?.price || hotel?.basePrice || 0;
    const extraBedPriceTotal = (extraBedCount > 0 && selectedRoom?.allowExtraBed) ? ((selectedRoom.extraBedPrice || 0) * extraBedCount) : 0;

    const pricePerNight = (basePricePerNight * roomCount) + extraBedPriceTotal;

    // Check if dates are overridden in state (for partial matches)
    const effectiveCheckIn = state?.checkIn ? new Date(state.checkIn) : searchData.checkIn;
    const effectiveCheckOut = state?.checkOut ? new Date(state.checkOut) : searchData.checkOut;

    const nights = (effectiveCheckIn && effectiveCheckOut)
        ? Math.ceil((effectiveCheckOut.getTime() - effectiveCheckIn.getTime()) / (1000 * 60 * 60 * 24))
        : (searchData.nights || 1);

    const subtotal = pricePerNight * nights;

    // Calculate Discount
    const discountValue = isCouponApplied ? (subtotal * couponDiscount / 100) : 0;
    const totalPrice = subtotal - discountValue;

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    const handleNext = () => {
        if (step < 2) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else navigate(-1);
    };

    const validateForm = () => {
        if (!guestName.trim()) {
            setError('الرجاء إدخال الاسم');
            return false;
        }
        if (!guestEmail.trim() || !guestEmail.includes('@')) {
            setError('الرجاء إدخال بريد إلكتروني صحيح');
            return false;
        }
        if (!guestPhone.trim() || guestPhone.length < 9) {
            setError('الرجاء إدخال رقم هاتف صحيح');
            return false;
        }
        if (!isLoggedIn && !password.trim()) {
            setError('الرجاء إدخال كلمة مرور لإنشاء الحساب');
            return false;
        }
        setError('');
        return true;
    };

    const handleVerifyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsCheckingCoupon(true);
        setCouponError('');
        setCouponSuccess('');

        try {
            const res = await fetch('http://localhost:3001/api/coupons/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode })
            });
            const data = await res.json();

            if (data.valid) {
                setCouponDiscount(data.discount);
                setIsCouponApplied(true);
                setCouponSuccess(`تم تطبيق خصم ${data.discount}% بنجاح!`);
                setShowCouponInput(false);

                // 🎉 Celebration Effect
                const duration = 3 * 1000;
                const animationEnd = Date.now() + duration;
                const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
                const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

                const interval: any = setInterval(function () {
                    const timeLeft = animationEnd - Date.now();
                    if (timeLeft <= 0) return clearInterval(interval);
                    const particleCount = 50 * (timeLeft / duration);
                    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
                }, 250);

                // 📜 Smooth Scroll to Summary
                setTimeout(() => {
                    priceSummaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 500);

            } else {
                setCouponError(data.message || 'الكوبون غير صالح أو انتهت صلاحيته');
                setIsCouponApplied(false);
                setCouponDiscount(0);
            }
        } catch (err) {
            setCouponError('حدث خطأ أثناء التحقق من الكوبون');
        } finally {
            setIsCheckingCoupon(false);
        }
    };

    const handlePayment = async () => {
        if (!validateForm() || !hotel) return;

        setIsLoading(true);
        setError('');

        try {
            // 1. Register/Login if not logged in
            if (!isLoggedIn) {
                let currentToken = '';
                let currentUser = null;

                // Priority 1: Try Register
                const registerRes = await AuthAPI.register({
                    name: guestName.trim(),
                    email: guestEmail.trim(),
                    phone: `${selectedCountry.dial_code}${guestPhone}`,
                    password: password,
                    country: selectedCountry.name
                });

                if (registerRes.success && registerRes.data) {
                    currentToken = registerRes.data.token;
                    currentUser = registerRes.data.user;
                } else if (registerRes.error?.includes('Email already registered')) {
                    // Priority 2: Try Login if already registered
                    const loginRes = await AuthAPI.login(guestEmail.trim(), password);
                    if (loginRes.success && loginRes.data) {
                        currentToken = loginRes.data.token;
                        currentUser = loginRes.data.user;
                    } else {
                        throw new Error(loginRes.error || 'فشل تسجيل الدخول. يرجى التأكد من كلمة المرور.');
                    }
                } else {
                    // Clear stale token if any weird error happens
                    TokenManager.remove();
                    throw new Error(registerRes.error || 'فشل إنشاء الحساب');
                }

                // Sync with Global Auth Context
                if (currentToken && currentUser) {
                    TokenManager.set(currentToken); // Ensure storage is set FIRST
                    authLogin(currentToken, currentUser);
                } else {
                    throw new Error('فشل التحقق من الجلسة');
                }
            }

            // 2. Create Booking on Backend
            const roomId = selectedRoom?.id;

            if (!roomId) {
                throw new Error('لا توجد غرف متاحة للحجز حالياً');
            }

            const bookingRes = await BookingsAPI.create({
                roomId: roomId,
                checkIn: effectiveCheckIn ? effectiveCheckIn.toISOString() : new Date().toISOString(),
                checkOut: effectiveCheckOut ? effectiveCheckOut.toISOString() : new Date(Date.now() + 86400000).toISOString(),
                guestsCount: searchData.adults || 2,
                roomCount: roomCount,
                extraBedCount: extraBedCount,
                guestName: guestName,
                guestEmail: guestEmail.trim(),
                guestPhone: `${selectedCountry.dial_code}${guestPhone}`,
                specialRequests: '',
                promoCode: isCouponApplied ? couponCode : undefined // <--- Pass Promo Code
            });

            if (!bookingRes.success || !bookingRes.data) {
                throw new Error(bookingRes.error || 'فشل إنشاء الحجز');
            }

            const bookingId = bookingRes.data.id;

            // 3. Initiate Payment (PayTabs)
            const cartId = bookingId;
            const callbackUrl = `${window.location.origin}/#/payment/callback`;
            const returnUrl = `${window.location.origin}/#/payment/callback`;

            const redirectUrl = await createPaymentPage({
                cart_id: cartId,
                cart_description: `حجز ${hotel.name} - ${nights} ليالي`,
                cart_currency: 'SAR',
                cart_amount: totalPrice,
                customer_details: {
                    name: guestName,
                    email: guestEmail,
                    phone: `${selectedCountry.dial_code}${guestPhone}`,
                    street1: 'مكة المكرمة',
                    city: 'مكة',
                    state: 'مكة',
                    country: selectedCountry.code || 'SA',
                    ip: '1.1.1.1'
                },
                callback: callbackUrl,
                return: returnUrl,
            });

            // Redirect to PayTabs payment page
            window.location.href = redirectUrl;

        } catch (err: any) {
            console.error('Payment/Booking Error:', err);
            setError(err.message || 'حدث خطأ في عملية الحجز. يرجى المحاولة مرة أخرى.');
            setIsLoading(false);
        }
    };

    if (isFetchingHotel) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
        );
    }

    if (!hotel) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 flex-col gap-4">
                <p className="text-slate-500 font-bold">عذراً، لم يتم العثور على الفندق المطلوب</p>
                <button onClick={() => navigate('/')} className="text-text font-bold">العودة للرئيسية</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-cairo text-text pb-20 md:pt-32">
            {/* Header - Premium Refined Style */}
            <header className="fixed top-0 left-0 right-0 z-[1001] h-20 bg-white/90 backdrop-blur-2xl border-b border-slate-100/50 transition-all duration-500 shadow-sm">
                <div className="max-w-[1400px] mx-auto h-full px-6 flex items-center justify-between">
                    {/* Right Side: Brand & Back Action */}
                    <div className="flex items-center gap-4">
                        <Link to="/" className="transition-all active:scale-95 shrink-0">
                            <img src="/assets/images/ui/logo.png" alt="Logo" className="h-16 w-auto" />
                        </Link>

                        <div className="hidden sm:block h-8 w-px bg-slate-100 mx-2" />

                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2.5 bg-secondary text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-secondary/10 hover:bg-gold transition-all active:scale-95 group font-black text-sm"
                        >
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            <span>العودة</span>
                        </button>
                    </div>

                    {/* Center: Progress / Title */}
                    <div className="hidden md:flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                            <h1 className="font-black text-lg text-secondary tracking-tight whitespace-nowrap">إتمام الحجز الآمن</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield size={10} className="text-emerald-500" />
                            <span className="text-[10px] font-bold text-slate-400 truncate max-w-[200px]">
                                {hotel?.name}
                            </span>
                        </div>
                    </div>

                    {/* Left Side: Professional Support */}
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">دعم ضيافة خلود</span>
                            <span className="text-xs font-black text-secondary tracking-tighter" dir="ltr">055 388 2445</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-gold">
                            <Phone size={18} />
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Stepper - Modern Minimalist Progress */}
                <div className="flex flex-col gap-6 mb-12">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-1">الخطوة {step} من 2</span>
                            <h2 className="text-xl font-black text-secondary">{step === 1 ? 'تأكيد تفاصيل الإقامة' : 'بيانات الضيف والدفع'}</h2>
                        </div>
                        <div className="flex -space-x-1 rtl:space-x-reverse">
                            {[1, 2].map((s) => (
                                <div
                                    key={s}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-4 border-slate-50 transition-all duration-500 shadow-sm ${step >= s ? 'bg-secondary text-white scale-110 z-10' : 'bg-white text-slate-300'
                                        }`}
                                >
                                    {step > s ? <Check size={16} strokeWidth={3} /> : s}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-secondary rounded-full transition-all duration-700 ease-ios"
                            style={{ width: `${(step / 2) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">

                    {/* Step 1: Summary */}
                    {step === 1 && hotel && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Hotel Preview Card - High Contrast Premium */}
                            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 flex flex-col sm:flex-row gap-6 group hover:border-gold/30 transition-all duration-500 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 group-hover:bg-gold/10 transition-colors"></div>

                                <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden shrink-0 shadow-inner relative z-10">
                                    <img src={hotel.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="hotel" />
                                </div>
                                <div className="relative z-10 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                            <Star size={10} fill="currentColor" />
                                            <span>{hotel.rating} ممتاز</span>
                                        </div>
                                        <div className="w-px h-3 bg-slate-200" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">إقامة موثقة</span>
                                    </div>
                                    <h2 className="font-black text-secondary text-2xl mb-2 leading-tight tracking-tight">{hotel.name}</h2>
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold bg-slate-50 self-start px-3 py-1.5 rounded-lg border border-slate-100">
                                        <MapPin size={14} className="text-secondary" />
                                        <span>{hotel.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Details - Concierge Grid Style */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-black text-secondary text-lg flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-gold rounded-full" />
                                        تفاصيل الإقامة
                                    </h3>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                        رقم المرجع: #{Math.random().toString(36).substr(2, 6).toUpperCase()}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                                    {/* Room Info */}
                                    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-slate-50/50 border border-slate-100 group hover:border-gold/20 transition-all duration-300">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                                                <Hotel size={22} />
                                            </div>
                                            <div>
                                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">فئة الغرفة المختارة</span>
                                                <span className="block text-secondary font-black text-sm">{roomType}</span>
                                            </div>
                                        </div>

                                        {/* Room Specs Grid */}
                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/50">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-gold">
                                                    <Maximize size={14} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">مساحة الغرفة</span>
                                                    <span className="text-[11px] font-bold text-secondary">{selectedRoom?.area || '---'} م²</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-gold">
                                                    <Eye size={14} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">الإطلالة</span>
                                                    <span className="text-[11px] font-bold text-secondary">{selectedRoom?.view || 'إطلالة مدينة'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-gold">
                                                    <BedDouble size={14} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">توزيع الأسرة</span>
                                                    <span className="text-[11px] font-bold text-secondary">{selectedRoom?.beds || 'أسرة ملكية'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-gold">
                                                    <Users size={14} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">السعة القصوى</span>
                                                    <span className="text-[11px] font-bold text-secondary">{selectedRoom?.capacity || 2} أشخاص</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Guests Info */}
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 group hover:border-gold/20 transition-all duration-300">
                                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                                            <User size={22} />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">الضيوف والحجوزات</span>
                                            <span className="block text-secondary font-black text-sm">
                                                {searchData.adults || 2} بالغين · {roomCount} غرف
                                                {searchData.children > 0 && <span className="opacity-60 block text-[11px] font-bold mt-0.5">+ {searchData.children} أطفال</span>}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Dates Info */}
                                    <div className="sm:col-span-2 flex items-center gap-6 p-6 rounded-[1.5rem] bg-secondary text-white relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                                            <Calendar size={28} />
                                        </div>

                                        <div className="flex-1 grid grid-cols-2 items-center gap-8 relative z-10">
                                            <div>
                                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 opacity-70">تاريخ الوصول</span>
                                                <span className="block font-black text-lg leading-none">{formatDateArabic(searchData.checkIn)}</span>
                                            </div>
                                            <div className="border-r border-white/10 pr-8 relative">
                                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                                    <ArrowLeft size={12} className="text-gold" />
                                                </div>
                                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 opacity-70">تاريخ المغادرة</span>
                                                <span className="block font-black text-lg leading-none">{formatDateArabic(searchData.checkOut)}</span>
                                            </div>
                                        </div>

                                        <div className="bg-gold text-secondary px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-gold/20">
                                            {nights} ليالي
                                        </div>
                                    </div>
                                </div>

                                {/* Extra Bed Details if applicable */}
                                {(selectedRoom?.allowExtraBed && extraBedCount > 0) ? (
                                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5 mb-8 flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
                                                <BedDouble size={22} />
                                            </div>
                                            <div>
                                                <span className="block text-secondary font-black text-sm">سرير إضافي مضاف</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">تحسين الراحة والخصوصية</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-secondary font-black text-base">{extraBedCount} أسرة</span>
                                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">+{selectedRoom.extraBedPrice} ر.س / ليلة</span>
                                        </div>
                                    </div>
                                ) : null}

                                {/* Price Footer - Compact */}
                                <div className="border-t border-slate-100 pt-8 mt-4 flex flex-col gap-6">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex justify-between items-center text-slate-400 font-bold text-sm">
                                            <span>سعر الغرفة ({nights} ليالي)</span>
                                            <span className="text-secondary">{subtotal.toLocaleString()} ر.س</span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-400 font-bold text-sm">
                                            <span>الرسوم والضرائب</span>
                                            <span className="text-emerald-600">مشمولة</span>
                                        </div>
                                        <div className="h-px bg-slate-50 my-2" />
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <span className="block text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-1">الإجمالي الشامل</span>
                                                <span className="text-3xl font-black text-secondary tracking-tight">
                                                    {totalPrice.toLocaleString()} <span className="text-sm">ر.س</span>
                                                </span>
                                            </div>
                                            <button
                                                onClick={handleNext}
                                                className="bg-secondary text-white px-10 py-4 rounded-2xl font-black text-base shadow-2xl shadow-secondary/20 hover:scale-[1.02] active:scale-[0.96] transition-all flex items-center gap-3 group"
                                            >
                                                <span>متابعة للبيانات</span>
                                                <ArrowLeft size={20} className="group-hover:-translate-x-1.5 transition-transform" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <ShieldCheck size={18} className="text-emerald-600" />
                                        <span className="text-[10px] font-bold text-slate-500">نحن نضمن حماية بياناتك وأفضل الأسعار المتاحة للحجز المباشر.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Step 2: Customer Identity & Security Payment */}
                    {step === 2 && hotel && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Trust & Security Banner */}
                            <div className="bg-secondary text-white p-6 rounded-[2rem] shadow-2xl shadow-secondary/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/20 transition-colors"></div>
                                <div className="relative z-10 flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-gold">
                                        <Shield size={28} className="animate-pulse-slow" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg mb-1 tracking-tight">تأمين الحجز المتقدم</h4>
                                        <p className="text-slate-400 text-xs font-bold leading-relaxed">
                                            بياناتك محمية بتشفير عالي المستوى وتتم معالجتها عبر بوابة <span className="text-white">PayTabs</span> المعتمدة عالمياً.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Main Guest Form */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-1.5 h-6 bg-gold rounded-full" />
                                    <h3 className="font-black text-secondary text-lg">
                                        {isLoggedIn ? 'التحقق من بيانات المسافر' : 'تسجيل حساب ضيافة موثق'}
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">الاسم الكامل ثلاثي *</label>
                                        <div className="relative group/field">
                                            <input
                                                type="text"
                                                value={guestName}
                                                onChange={(e) => setGuestName(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-secondary font-black focus:outline-none focus:border-gold focus:bg-white transition-all duration-300 placeholder:text-slate-300"
                                                placeholder="مثال: محمد بن ناصر بن عبد العزيز"
                                            />
                                            <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-gold transition-colors" />
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">البريد الإلكتروني للإرسال التلقائي *</label>
                                        <div className="relative group/field">
                                            <input
                                                type="email"
                                                value={guestEmail}
                                                onChange={(e) => setGuestEmail(e.target.value)}
                                                autoComplete="off"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-secondary font-black focus:outline-none focus:border-gold focus:bg-white transition-all duration-300 placeholder:text-slate-300 text-left dir-ltr"
                                                placeholder="name@example.com"
                                            />
                                            <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-gold transition-colors" />
                                        </div>
                                    </div>

                                                                         {/* Password Field (only if NOT logged in) */}
                                     {!isLoggedIn ? (
                                         <div className="space-y-2 animate-fade-in">
                                             <label className="text-[10px] font-black text-secondary uppercase tracking-widest mr-1 flex items-center gap-2">
                                                 إنشاء كلمة مرور (سيتم إنشاء حساب لك تلقائياً عند الحجز) *
                                                 <span className="text-[9px] text-indigo-600 lowercase bg-indigo-50 px-2 py-0.5 rounded-full font-bold">حساب جديد</span>
                                             </label>
                                             <div className="relative group/field">
                                                 <input
                                                     type="password"
                                                     value={password}
                                                     onChange={(e) => setPassword(e.target.value)}
                                                     autoComplete="new-password"
                                                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-secondary font-black focus:outline-none focus:border-gold focus:bg-white transition-all duration-300 placeholder:text-slate-300"
                                                     placeholder="اختر كلمة مرور لحسابك"
                                                 />
                                                 <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-gold transition-colors" />
                                             </div>
                                         </div>
                                     ) : (
                                         <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 animate-fade-in">
                                             <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600">
                                                 <ShieldCheck size={20} />
                                             </div>
                                             <div>
                                                 <p className="text-[11px] font-black text-emerald-700">أنت مسجل دخولك بالفعل</p>
                                                 <p className="text-[10px] font-bold text-emerald-600/70">سيتم ربط هذا الحجز بحسابك: {authUser?.email}</p>
                                             </div>
                                         </div>
                                     )}

                                    {/* Phone Number Field */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">رقم الجوال للتواصل والدعم *</label>
                                        <div className="flex gap-3" dir="ltr">
                                            <div className="relative shrink-0">
                                                <button
                                                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                                    className="bg-slate-50 border border-slate-200 rounded-2xl px-4 h-full flex items-center gap-3 hover:bg-slate-100 transition-all duration-300 min-w-[120px] justify-between group/country active:scale-95"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <img src={selectedCountry.flag} alt={selectedCountry.code} className="w-6 rounded-sm shadow-sm" />
                                                        <span className="font-black text-secondary text-sm">{selectedCountry.dial_code}</span>
                                                    </div>
                                                    <ChevronDown size={14} className="text-slate-400 group-hover:text-gold transition-colors" />
                                                </button>

                                                {isCountryDropdownOpen && (
                                                    <>
                                                        <div className="fixed inset-0 z-[1050]" onClick={() => setIsCountryDropdownOpen(false)}></div>
                                                        <div className="absolute top-[calc(100%+8px)] left-0 w-72 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 z-[1051] overflow-hidden animate-fade-in">
                                                            <div className="p-4 border-b border-slate-50 bg-slate-50/50 relative">
                                                                <Search size={14} className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" />
                                                                <input
                                                                    type="text"
                                                                    placeholder="ابحث عن الدولة..."
                                                                    className="w-full bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs font-black focus:outline-none focus:ring-2 focus:ring-gold/20 text-right text-secondary"
                                                                    value={countrySearch}
                                                                    onChange={(e) => setCountrySearch(e.target.value)}
                                                                    autoFocus
                                                                />
                                                            </div>
                                                            <div className="max-h-64 overflow-y-auto custom-scrollbar p-2">
                                                                {filteredCountries.map((country) => (
                                                                    <button
                                                                        key={country.code}
                                                                        onClick={() => {
                                                                            setSelectedCountry(country);
                                                                            setIsCountryDropdownOpen(false);
                                                                            setCountrySearch('');
                                                                        }}
                                                                        className={`w-full flex items-center justify-between p-3 rounded-xl text-xs transition-all duration-200 group/item ${selectedCountry.code === country.code
                                                                            ? 'bg-secondary text-white'
                                                                            : 'text-slate-600 hover:bg-slate-50'
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <img src={country.flag} alt={country.code} className="w-5 rounded-sm shadow-sm" />
                                                                            <span className="font-black">{country.name}</span>
                                                                        </div>
                                                                        <span className={`font-black tracking-tight ${selectedCountry.code === country.code ? 'text-gold' : 'text-slate-400'}`}>
                                                                            {country.dial_code}
                                                                        </span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <div className="relative flex-1 group/field">
                                                <input
                                                    type="tel"
                                                    value={guestPhone}
                                                    onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, ''))}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-secondary font-black tracking-[0.1em] text-right focus:outline-none focus:border-gold focus:bg-white transition-all duration-300 placeholder:text-slate-300"
                                                    placeholder="5XXXXXXXX"
                                                />
                                                <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-gold transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Premium Coupon & Price Summary */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50">
                                <button
                                    onClick={() => setShowCouponInput(!showCouponInput)}
                                    className="flex items-center justify-between w-full group/coupon"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gold/5 text-gold flex items-center justify-center group-hover/coupon:scale-110 transition-transform">
                                            <Percent size={18} />
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-secondary font-black text-sm">هل تحمل رمز خصم خاص؟</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">اضغط هنا لتفعيل العرض</span>
                                        </div>
                                    </div>
                                    <ChevronDown size={18} className={`text-slate-300 group-hover/coupon:text-gold transition-all duration-500 ${showCouponInput ? 'rotate-180' : ''}`} />
                                </button>

                                {showCouponInput && (
                                    <div className="mt-6 flex flex-col sm:flex-row gap-3 animate-fade-in">
                                        <div className="relative flex-1 group/field">
                                            <input
                                                type="text"
                                                placeholder="أدخل مسمى الرمز الترويجي"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 text-sm font-black text-secondary focus:outline-none focus:border-gold transition-all uppercase tracking-widest"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                disabled={isCouponApplied}
                                            />
                                            <Plus size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-gold transition-colors" />
                                        </div>
                                        <button
                                            onClick={handleVerifyCoupon}
                                            disabled={isCheckingCoupon || isCouponApplied || !couponCode}
                                            className="bg-secondary text-white px-8 py-4 rounded-xl font-black text-sm hover:scale-[1.02] active:scale-[0.96] disabled:opacity-50 transition-all shadow-lg"
                                        >
                                            {isCheckingCoupon ? <Loader2 size={18} className="animate-spin" /> : 'تطبيق الرمز'}
                                        </button>
                                    </div>
                                )}

                                {/* Final Pricing Dashboard */}
                                <div className="mt-10 bg-slate-50/50 rounded-[1.5rem] p-6 border border-slate-100/80 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">إجمالي الحجز المبدئي</span>
                                        <span className="text-secondary font-black text-sm">{subtotal.toLocaleString()} ر.س</span>
                                    </div>

                                    {isCouponApplied && (
                                        <div className="flex justify-between items-center text-emerald-600 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">تم تطبيق الخصم ({couponDiscount}%)</span>
                                            </div>
                                            <span className="font-black text-sm">- {discountValue.toLocaleString()} ر.س</span>
                                        </div>
                                    )}

                                    <div className="h-px bg-slate-200/50" />

                                    <div className="flex justify-between items-center py-2">
                                        <div>
                                            <span className="block text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-1">صافي القيمة المستحقة</span>
                                            <span className="text-3xl font-black text-secondary tracking-tighter">
                                                {totalPrice.toLocaleString()} <span className="text-sm font-bold">ر.س</span>
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-3">
                                                {/* Official Visa Logo */}
                                                <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center h-[32px]">
                                                    <img
                                                        src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg"
                                                        alt="Visa"
                                                        className="h-3 w-auto object-contain"
                                                    />
                                                </div>
                                                {/* Official Mastercard Logo */}
                                                <div className="bg-white px-2 py-1.5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center h-[32px]">
                                                    <img
                                                        src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                                                        alt="Mastercard"
                                                        className="h-5 w-auto object-contain"
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase">الدفع عبر بوابة PayTabs الآمنة</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Final CTA Button */}
                                <div className="mt-8 flex flex-col gap-4">
                                    <button
                                        onClick={handlePayment}
                                        disabled={isLoading}
                                        className="w-full bg-secondary text-white py-5 rounded-2xl font-black text-lg transition-all shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin text-gold" />
                                                <span className="relative z-10">جاري توثيق العملية...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck size={22} className="text-gold" />
                                                <span className="relative z-10">
                                                    {isLoggedIn ? 'تأكيد الحجز والدفع النهائي' : 'توثيق البيانات وتأكيد الدفع'}
                                                </span>
                                                <ArrowLeft size={22} className="group-hover:-translate-x-2 transition-transform" />
                                            </>
                                        )}
                                    </button>

                                    <div className="flex items-center justify-center gap-2 text-slate-400">
                                        <Lock size={12} />
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">تشفير SSL 256-bit مفعل</span>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-5 rounded-2xl flex items-center gap-4 animate-shake">
                                    <AlertCircle size={20} className="shrink-0" />
                                    <p className="text-xs font-black">{error}</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
                
                .ease-ios {
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .dir-ltr { direction: ltr; }
            `}</style>
        </div >
    );
};

export default BookingPage;
