
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Phone, Check, Shield, Star, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { AuthAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const [isForgotPassword, setIsForgotPassword] = useState(false);

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (location.state?.message) {
            setMessage(location.state.message);
        }
    }, [location]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsLoading(true);

        try {
            if (isForgotPassword) {
                // Mock Forgot Password
                setTimeout(() => {
                    setMessage('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني');
                    setIsForgotPassword(false);
                    setIsLogin(true);
                    setIsLoading(false);
                }, 1500);
                return;
            }

            if (isLogin) {
                const response = await AuthAPI.login(email, password);
                if (response.success && response.data?.token && response.data?.user) {
                    login(response.data.token, response.data.user);
                    navigate('/');
                } else {
                    setMessage(response.error || 'فشل تسجيل الدخول: البريد الإلكتروني أو كلمة المرور غير صحيحة');
                }
            } else {
                const response = await AuthAPI.register({
                    email,
                    password,
                    name: `${firstName} ${lastName}`.trim(),
                    phone
                });

                if (response.success && response.data?.token && response.data?.user) {
                    // Auto login after register
                    login(response.data.token, response.data.user);
                    navigate('/'); // Or navigate to profile? Usually home is fine.
                } else {
                    setMessage(response.error || 'فشل إنشاء الحساب');
                }
            }
        } catch (error) {
            console.error(error);
            setMessage('حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.');
        } finally {
            if (!isForgotPassword) setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 font-cairo bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Success/Error Message */}
            {message && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gold-50 text-gold px-6 py-3 rounded-full shadow-lg border border-gold-100 font-bold flex items-center gap-2">
                    <Check size={18} />
                    {message}
                </div>
            )}

            {/* Main Container */}
            <div className="w-full max-w-6xl bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[700px] border border-slate-100">

                {/* Form Side */}
                <div className="p-8 lg:p-16 flex flex-col justify-center order-2 lg:order-1 relative">
                    <div className="max-w-md mx-auto w-full">

                        {/* Back Button */}
                        <div className="flex items-center justify-between mb-8">
                            <button
                                onClick={() => {
                                    if (isForgotPassword) {
                                        setIsForgotPassword(false);
                                        setIsLogin(true);
                                    } else {
                                        navigate('/');
                                    }
                                }}
                                className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
                            >
                                <ArrowLeft size={14} />
                                {isForgotPassword ? 'العودة لتسجيل الدخول' : 'العودة للرئيسية'}
                            </button>
                        </div>

                        {/* Toggle Tabs (Hide if Forgot Password) */}
                        {!isForgotPassword && (
                            <div className="bg-slate-50 p-1.5 rounded-2xl flex mb-10 border border-slate-100">
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${isLogin ? 'bg-white text-text shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    تسجيل الدخول
                                </button>
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${!isLogin ? 'bg-white text-text shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    إنشاء حساب
                                </button>
                            </div>
                        )}

                        {/* Welcome Text */}
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black text-text mb-3 flex items-center justify-center gap-3">
                                {isForgotPassword ? 'استعادة كلمة المرور' : (isLogin ? 'أهلاً بعودتك!' : 'انضم إلينا!')}
                                <span className="text-3xl">
                                    {isForgotPassword ? '🔐' : '👋'}
                                </span>
                            </h2>
                            <p className="text-slate-400 font-bold text-sm">
                                {isForgotPassword ? 'أدخل بريدك الإلكتروني لاستعادة حسابك' : (isLogin ? 'سجل دخولك لمتابعة حجوزاتك' : 'أنشئ حسابك واستمتع بمزايا حصرية')}
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleAuth} className="space-y-5">
                            {/* Registration Fields */}
                            {!isLogin && !isForgotPassword && (
                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 block">الاسم الأول</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-4 pr-12 text-text font-bold placeholder:text-slate-300 focus:border-gold focus:bg-white transition-all duration-300"
                                                    placeholder="محمد"
                                                />
                                                <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 block">الاسم الأخير</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-4 pr-12 text-text font-bold placeholder:text-slate-300 focus:border-gold focus:bg-white transition-all duration-300"
                                                    placeholder="أحمد"
                                                />
                                                <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 block">رقم الجوال</label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-4 pr-12 text-text font-bold placeholder:text-slate-300 focus:border-gold focus:bg-white transition-all duration-300"
                                                placeholder="055 123 4567"
                                            />
                                            <Phone size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 block">البريد الإلكتروني</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-4 pr-12 text-text font-bold placeholder:text-slate-300 focus:border-gold focus:bg-white transition-all duration-300 text-left"
                                        placeholder="example@email.com"
                                        dir="ltr"
                                    />
                                    <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                </div>
                            </div>

                            {/* Password */}
                            {!isForgotPassword && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 block">كلمة المرور</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-4 pr-12 pl-12 text-text font-bold placeholder:text-slate-300 focus:border-gold focus:bg-white transition-all duration-300 text-left tracking-widest"
                                            placeholder="••••••••"
                                            dir="ltr"
                                        />
                                        <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-gold transition-colors p-2"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Remember Me / Forgot Password */}
                            {isLogin && !isForgotPassword && (
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <label className="flex items-center gap-2 cursor-pointer text-slate-500 hover:text-slate-700">
                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-gold focus:ring-gold" />
                                        تذكرني
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsForgotPassword(true);
                                            setMessage(null);
                                        }}
                                        className="text-gold hover:text-gold-dark transition-colors"
                                    >
                                        نسيت كلمة المرور؟
                                    </button>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gold text-white rounded-2xl py-4 font-black text-lg shadow-xl shadow-gold/30 hover:bg-gold-dark hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        جاري المعالجة...
                                    </span>
                                ) : (
                                    isForgotPassword ? 'إرسال رابط الاستعادة' : (isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب')
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Info Side (Gold Panel) */}
                <div className="p-8 lg:p-16 flex flex-col justify-center order-1 lg:order-2 bg-gradient-to-br from-gold to-gold-dark relative overflow-hidden min-h-[400px] lg:min-h-0">
                    {/* Background Effects */}
                    <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col h-full justify-center">
                        {/* Icon */}
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-10 border border-white/20">
                            <Shield className="text-white w-8 h-8" />
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight mb-4">
                            مرحباً بك في <br /> ضيافة خلود
                        </h2>
                        <p className="text-white/80 font-bold text-lg mb-12 max-w-sm">
                            اكتشف أفضل الفنادق والمنتجعات في المملكة العربية السعودية
                        </p>

                        {/* Features */}
                        <div className="space-y-5 mb-12">
                            {[
                                { text: 'أكثر من 500+ فندق فاخر', icon: Check },
                                { text: 'أفضل الأسعار المضمونة', icon: Star },
                                { text: 'حجز آمن ومضمون', icon: Shield },
                                { text: 'دعم عملاء على مدار الساعة', icon: Phone },
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-4 text-white font-bold">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                        <feature.icon size={18} />
                                    </div>
                                    <span className="text-sm lg:text-base">{feature.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 border-t border-white/20 pt-8 mt-auto">
                            <div className="text-center">
                                <div className="text-2xl lg:text-3xl font-black text-white mb-1">+500</div>
                                <div className="text-xs font-bold text-white/60">فندق</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl lg:text-3xl font-black text-white mb-1">+50K</div>
                                <div className="text-xs font-bold text-white/60">عميل</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl lg:text-3xl font-black text-white mb-1">4.9</div>
                                <div className="text-xs font-bold text-white/60">تقييم</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Auth;
