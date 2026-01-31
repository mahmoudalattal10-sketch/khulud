
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, MessageCircle, Phone, Copy, Check, Home, ArrowLeft, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

const PaymentCallback: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
    const [message, setMessage] = useState('');
    const [reference, setReference] = useState('');
    const [copied, setCopied] = useState(false);

    // WhatsApp number for support
    const whatsappMessage = encodeURIComponent(`مرحباً، لدي استفسار بخصوص الحجز رقم: ${reference}`);

    useEffect(() => {
        const verifyPayment = async () => {
            const searchParams = new URLSearchParams(location.search);
            const bookingId = searchParams.get('cartId') || searchParams.get('cart_id');
            const tranRef = searchParams.get('tranRef') || searchParams.get('tran_ref');

            if (!bookingId) {
                setStatus('failed');
                setMessage('رقم الحجز مفقود');
                return;
            }

            setReference(tranRef || `BK-${bookingId.substring(0, 8)}`);

            const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
                ? '/api'
                : 'http://localhost:3001/api';

            // 1. Try Instant Verification (Client-Triggered)
            if (tranRef) {
                try {
                    const verifyRes = await fetch(`${API_BASE_URL}/payment/verify`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ bookingId, tranRef })
                    });
                    const verifyData = await verifyRes.json();

                    if (verifyData.success && verifyData.status === 'PAID') {
                        setStatus('success');
                        setMessage('تمت عملية الدفع وتأكيد الحجز بنجاح!');
                        return; // Done!
                    }
                } catch (e) {
                    console.error("Verification endpoint failed, falling back to polling", e);
                }
            }

            // 2. Poll backend for CONFIRMED status (Fallback / Webhook Wait)
            let attempts = 0;
            const maxAttempts = 10;

            const checkStatus = async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/payment/status/${bookingId}`);
                    const booking = await res.json();

                    if (booking.paymentStatus === 'PAID' || booking.status === 'CONFIRMED') {
                        setStatus('success');
                        setMessage('تمت عملية الدفع وتأكيد الحجز بنجاح!');
                    } else if (booking.paymentStatus === 'REFUNDED') {
                        setStatus('failed');
                        setMessage('تم استرداد المبلغ.');
                    } else {
                        // Still UNPAID/PENDING? Retry or Show Error if max attempts reached
                        if (attempts < maxAttempts) {
                            attempts++;
                            setTimeout(checkStatus, 2000); // Retry every 2 seconds
                        } else {
                            setStatus('failed');
                            setMessage('لم يصل تأكيد الدفع من البنك بعد. يرجى التواصل معنا.');
                        }
                    }
                } catch (error) {
                    console.error('Check Status Error:', error);
                    setStatus('failed');
                    setMessage('حدث خطأ أثناء التحقق من الحالة.');
                }
            };

            checkStatus();
        };

        verifyPayment();
    }, [location]);

    const copyReference = () => {
        navigator.clipboard.writeText(reference);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

                <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
                    <div className="w-24 h-24 mb-8 relative">
                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-gold animate-pulse" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-text mb-2 text-center">جاري التحقق من طلبك</h2>
                    <p className="text-slate-400 font-bold text-sm text-center">لحظات ونوافيك بالتفاصيل...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdfcfb] pt-32 pb-20 px-6 relative overflow-hidden" dir="rtl">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>

            <div className="max-w-2xl mx-auto relative z-10">
                {status === 'success' ? (
                    <div className="animate-ios-slide space-y-8">
                        {/* Header & Icon */}
                        <div className="text-center space-y-4">
                            <div className="inline-flex relative mb-4">
                                <div className="absolute inset-0 bg-gold/20 rounded-full blur-2xl animate-pulse"></div>
                                <div className="relative w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(16,185,129,0.15)] border border-gold-50">
                                    <CheckCircle className="w-14 h-14 text-gold" strokeWidth={1.5} />
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-text tracking-tight">مبروك! حجزك مؤكد</h1>
                            <p className="text-lg text-slate-500 font-bold">كل شيء جاهز لاستقبالك في رحلتك القادمة</p>
                        </div>

                        {/* Main Glass Card */}
                        <div className="bg-white/70 backdrop-blur-3xl rounded-[3rem] border border-white p-8 md:p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)]">
                            {/* Booking Ref */}
                            <div className="flex flex-col items-center justify-center border-b border-slate-100 pb-8 mb-8">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">رقم التأكيد المرجعي</span>
                                <div className="flex items-center gap-4 bg-slate-50 px-8 py-5 rounded-2xl border border-slate-100 relative group overflow-hidden">
                                    <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-colors duration-500"></div>
                                    <span className="text-3xl font-mono font-black text-text tracking-widest">{reference}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={copyReference}
                                            className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 hover:scale-105 active:scale-95 transition-all text-slate-500 hover:text-gold"
                                            title="نسخ المرجع"
                                        >
                                            {copied ? <Check size={20} className="text-gold" /> : <Copy size={20} />}
                                        </button>
                                        <button
                                            onClick={() => window.print()}
                                            className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 hover:scale-105 active:scale-95 transition-all text-slate-500 hover:text-gold"
                                            title="حفظ التذكرة"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold hidden md:block">حفظ</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v8H6z" /></svg>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gold">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">حالة الحجز</p>
                                        <p className="text-sm font-black text-text">مؤكد تماماً</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gold">
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">خدمة العملاء</p>
                                        <p className="text-sm font-black text-text">متاحة 24/7</p>
                                    </div>
                                </div>
                            </div>

                            {/* Checklist */}
                            <div className="space-y-4 mb-10">
                                <h3 className="font-black text-text text-lg mb-6">ماذا سيحدث الآن؟</h3>
                                {[
                                    'ستصلك رسالة تأكيد إلكترونية تحتوي على فاتورة الحجز والتفاصيل.',
                                    'سيقوم منسق الرحلات بالتواصل معك خلال ساعة لتأكيد موعد الوصول.',
                                    'سنقوم بإرسال تفاصيل السائق أو موقع الفندق الدقيق عبر واتساب.'
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-6 h-6 rounded-full bg-gold-50 text-gold flex items-center justify-center shrink-0 mt-0.5 border border-gold-100">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        <p className="text-slate-600 text-sm font-bold leading-relaxed">{step}</p>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <Link
                                to="/"
                                className="w-full bg-primary text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 hover:bg-gold hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)]"
                            >
                                <Home size={20} />
                                العودة للرئيسية
                            </Link>
                        </div>

                        {/* Support Chic Card */}
                        <div className="bg-primary rounded-[3.5rem] p-4 flex flex-col md:flex-row items-center gap-4 shadow-2xl">
                            <div className="flex-1 px-8 py-2 text-center md:text-right">
                                <h4 className="text-white font-black text-lg">هل لديك أي استفسار؟</h4>
                                <p className="text-slate-400 text-xs font-bold">فريقنا جاهز لمساعدتك في أي وقت</p>
                            </div>
                            <div className="flex gap-3 pr-2">
                                <a
                                    href={`tel:${CONTACT_INFO.PHONE}`}
                                    className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                                >
                                    <Phone size={22} />
                                </a>
                                <a
                                    href={`https://wa.me/${CONTACT_INFO.WHATSAPP}?text=${whatsappMessage}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 bg-gold hover:bg-gold text-white rounded-full font-black text-sm flex items-center gap-2 transition-all active:scale-90"
                                >
                                    <MessageCircle size={20} />
                                    تحدث معنا
                                </a>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="animate-ios-slide space-y-8">
                        {/* Header & Icon */}
                        <div className="text-center space-y-4">
                            <div className="inline-flex relative mb-4">
                                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl"></div>
                                <div className="relative w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(239,68,68,0.15)] border border-red-50">
                                    <XCircle className="w-14 h-14 text-red-500" strokeWidth={1.5} />
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-text tracking-tight">نعتذر، حدثت مشكلة</h1>
                            <p className="text-lg text-slate-500 font-bold">لم تكتمل عملية الدفع.. حاول مرة أخرى أو تواصل معنا</p>
                        </div>

                        {/* Error Card */}
                        <div className="bg-white/70 backdrop-blur-3xl rounded-[3rem] border border-white p-8 md:p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)]">
                            <div className="bg-red-50 border border-red-100 rounded-3xl p-6 mb-10 text-center">
                                <p className="text-red-900 font-black mb-1">سبب الفشل:</p>
                                <p className="text-red-700 font-bold text-sm italic">{message}</p>
                            </div>

                            {/* Reasons grid */}
                            <div className="space-y-4 mb-10">
                                <h3 className="font-black text-text text-lg mb-6">أهم الأسباب الشائعة:</h3>
                                {[
                                    'رصيد غير كافٍ في البطاقة المستخدمة.',
                                    'بيانات البطاقة (الرقم أو تاريخ الانتهاء) غير صحيحة.',
                                    'تم إلغاء العملية أو استغرق الرد وقتاً طويلاً.',
                                    'رفض البنك المصدر للبطاقة إجراء العملية دولياً.'
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-6 h-6 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 border border-red-100 text-[10px] font-black">
                                            {i + 1}
                                        </div>
                                        <p className="text-slate-600 text-sm font-bold leading-relaxed">{step}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex-[2] bg-primary text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 hover:bg-gold transition-all shadow-lg active:scale-95"
                                >
                                    <ArrowRight size={20} />
                                    المحاولة مرة أخرى
                                </button>
                                <Link
                                    to="/"
                                    className="flex-1 bg-white border border-slate-200 text-slate-600 font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95"
                                >
                                    الرئيسية
                                </Link>
                            </div>
                        </div>

                        {/* WhatsApp CTA */}
                        <a
                            href={`https://wa.me/${CONTACT_INFO.WHATSAPP}?text=${encodeURIComponent('مرحباً، واجهت مشكلة في الدفع لأحد الفنادق وأحتاج مساعدة.')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gold hover:bg-gold text-white w-full py-5 rounded-[2.5rem] font-black flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                        >
                            <MessageCircle size={24} />
                            تواصل فوراً لحل المشكلة
                        </a>
                    </div>
                )}
            </div>

            {/* Minimal support footer */}
            <div className="mt-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                بواسطة ضيافة خلود النخبة &copy; 2026
            </div>
        </div>
    );
};

export default PaymentCallback;
