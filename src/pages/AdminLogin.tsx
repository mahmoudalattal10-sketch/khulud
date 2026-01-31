import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, ShieldCheck, AlertCircle, CheckCircle2, ArrowLeft, Loader2, Sparkles, Fingerprint } from 'lucide-react';
import { AuthAPI } from '../services/api';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 🔐 Check if already logged in as admin
    useEffect(() => {
        const checkExistingAuth = async () => {
            try {
                const response = await AuthAPI.verify();
                if (response.success && response.data?.user) {
                    const role = response.data.user.role;
                    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
                        setTimeout(() => navigate('/admin'), 100);
                    }
                }
            } catch (err) { }
        };
        checkExistingAuth();
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await AuthAPI.login(email, password);

            if (response.success && response.data?.user) {
                const { user } = response.data;
                if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
                    try {
                        localStorage.setItem('adminUser', JSON.stringify(user));
                    } catch (e) {
                        console.error("Failed to save admin info to localStorage", e);
                    }
                    navigate('/admin');
                } else {
                    setError('ليس لديك صلاحيات للوصول إلى لوحة التحكم. هذه الصفحة مخصصة للمسؤولين فقط.');
                    AuthAPI.logout();
                }
            } else {
                setError(response.error || 'بيانات الدخول غير صحيحة. يرجى التحقق وإعادة المحاولة.');
            }
        } catch (err) {
            setError('حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 font-sans overflow-hidden py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
            {/* 🌌 Professional Background */}
            <div className="absolute inset-0 z-0">
                {/* Gradient Orbs */}
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-500/15 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '8s' }}></div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]"></div>
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
            </div>

            {/* ✨ Professional Glass Card */}
            <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
                <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-2xl shadow-emerald-950/50 overflow-hidden relative group">

                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-1000"></div>

                    <div className="p-8 sm:p-10 relative">
                        {/* Header Branding */}
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-emerald-700 border border-emerald-400/20 shadow-2xl shadow-emerald-500/30 mb-6 relative group/icon">
                                <div className="absolute inset-0 bg-emerald-400/30 blur-2xl rounded-full opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500"></div>
                                <ShieldCheck className="w-12 h-12 text-white relative z-10" strokeWidth={2} />
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tight mb-2 drop-shadow-lg">
                                لوحة التحكم <span className="text-emerald-400">الإدارية</span>
                            </h2>
                            <p className="text-emerald-300/60 text-xs font-bold tracking-widest uppercase">
                                Secure Administrative Portal
                            </p>
                        </div>

                        {/* Login Form */}
                        <form className="space-y-6" onSubmit={handleLogin}>
                            {error && (
                                <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-4 flex items-start gap-4 animate-in slide-in-from-top-2 backdrop-blur-xl">
                                    <div className="p-2 bg-red-500/30 rounded-full shrink-0">
                                        <AlertCircle className="w-4 h-4 text-red-300" />
                                    </div>
                                    <p className="text-red-100 text-sm font-semibold leading-relaxed pt-1">{error}</p>
                                </div>
                            )}

                            <div className="space-y-5">
                                <div className="group relative">
                                    <label className="text-[11px] font-black text-emerald-300/80 uppercase tracking-wider mb-2 block mr-1 transition-colors group-focus-within:text-emerald-400">البريد الإلكتروني</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
                                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors duration-300" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pr-12 pl-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 sm:text-sm rounded-2xl transition-all duration-300 font-medium hover:bg-white/15"
                                            placeholder="admin@example.com"
                                            dir="ltr"
                                        />
                                    </div>
                                </div>

                                <div className="group relative">
                                    <label className="text-[11px] font-black text-emerald-300/80 uppercase tracking-wider mb-2 block mr-1 transition-colors group-focus-within:text-emerald-400">كلمة المرور</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
                                            <Fingerprint className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors duration-300" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pr-12 pl-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 sm:text-sm rounded-2xl transition-all duration-300 font-medium hover:bg-white/15 tracking-widest"
                                            placeholder="••••••••••••"
                                            dir="ltr"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full relative group overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black py-4 px-4 rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.6)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-8 shadow-lg shadow-emerald-500/30"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                                <div className="relative flex items-center justify-center gap-2">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>جاري التحقق...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>تسجيل الدخول</span>
                                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>
                    </div>

                    {/* Footer Info */}
                    <div className="px-8 py-6 bg-slate-950/40 backdrop-blur-xl border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <div className="flex items-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mt-1 shadow-lg shadow-emerald-400/50"></span>
                            <span>
                                النظام يعمل<br />
                                v4.0.0
                            </span>
                        </div>
                        <div className="text-left opacity-70">
                            للمسؤولين<br />فقط
                        </div>
                    </div>
                </div>

                {/* Bottom Branding */}
                <div className="mt-8 text-center text-emerald-300/40 text-xs font-medium">
                    &copy; 2026 ضيافات خلود. جميع الحقوق محفوظة.
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
