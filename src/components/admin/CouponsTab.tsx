
import React, { useState, useEffect } from 'react';
import {
    Plus,
    Ticket,
    Trash2,
    TrendingUp,
    Users,
    Clock,
    CheckCircle2,
    AlertCircle,
    X,
    Percent,
    Loader2,
    Calendar,
    Hotel,
    Hash,
    Pencil,
    ShieldAlert
} from 'lucide-react';

interface Coupon {
    id: string;
    code: string;
    discount: number;
    limit: number;
    usedCount: number;
    isActive: boolean;
    createdAt: string;
    bookings?: any[];
}

import api, { CouponsAPI } from '../../services/api';

const CouponsTab: React.FC = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

    // New/Edit Coupon Form
    const [formData, setFormData] = useState({
        code: '',
        discount: 10,
        limit: 100,
        isActive: true
    });

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const response = await api.Coupons.getAll();
            if (response.success && response.data?.coupons) {
                setCoupons(response.data.coupons);
            } else {
                console.error('Fetch coupons failed:', response.error);
            }
        } catch (err) {
            console.error('Fetch coupons error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSaveCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            let response;
            if (editingCoupon) {
                // UPDATE
                response = await api.Coupons.update(editingCoupon.id, formData);
            } else {
                // CREATE
                response = await api.Coupons.create(formData);
            }

            if (response.success && response.data?.coupon) {
                if (editingCoupon) {
                    setCoupons(coupons.map(c => c.id === editingCoupon.id ? response!.data!.coupon : c));
                } else {
                    setCoupons([response.data.coupon, ...coupons]);
                }
                closeModal();
            } else {
                setError(response.error || 'فشل حفظ الكوبون');
            }
        } catch (err) {
            setError('حدث خطأ أثناء الاتصال بالسيرفر');
        } finally {
            setIsSaving(false);
        }
    };

    const openCreateModal = () => {
        setEditingCoupon(null);
        setFormData({ code: '', discount: 10, limit: 100, isActive: true });
        setShowCreateModal(true);
    };

    const openEditModal = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            discount: coupon.discount,
            limit: coupon.limit,
            isActive: coupon.isActive
        });
        setShowCreateModal(true);
    };

    const closeModal = () => {
        setShowCreateModal(false);
        setEditingCoupon(null);
        setFormData({ code: '', discount: 10, limit: 100, isActive: true });
        setError(null);
    };

    const handleDeleteCoupon = async (id: string) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الكوبون؟')) return;

        try {
            const response = await api.Coupons.delete(id);
            if (response.success) {
                setCoupons(coupons.filter(c => c.id !== id));
            } else {
                console.error('Delete coupon failed:', response.error);
            }
        } catch (err) {
            console.error('Delete coupon error:', err);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">إدارة الكوبونات والعروض</h2>
                    <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">تنشيط المبيعات وجذب المعتمرين والزوار</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="bg-secondary text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-[0.96] transition-all flex items-center justify-center gap-3 group"
                >
                    <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
                        <Plus size={16} />
                    </div>
                    <span>إنشاء كود خصم جديد</span>
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <Ticket size={28} />
                    </div>
                    <div>
                        <span className="block text-2xl font-black text-slate-800">{coupons.length}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">إجمالي الكوبونات</span>
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                        <Users size={28} />
                    </div>
                    <div>
                        <span className="block text-2xl font-black text-slate-800">
                            {coupons.reduce((sum, c) => sum + c.usedCount, 0)}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">إجمالي مرات الاستخدام</span>
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <span className="block text-2xl font-black text-slate-800">
                            {coupons.filter(c => c.isActive).length}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">كوبونات نشطة حالياً</span>
                    </div>
                </div>
            </div>

            {/* Coupons List Container */}
            <div className="bg-white/40 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-white/60 shadow-xl shadow-slate-200/20">
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">الكوبونات النشطة والسابقة</h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">قائمة شاملة بجميع أكواد الخصم</p>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 text-gold animate-spin" />
                        <p className="text-slate-400 font-bold text-sm">جاري تحميل البيانات...</p>
                    </div>
                ) : coupons.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center gap-4 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                            <Ticket size={40} />
                        </div>
                        <div>
                            <p className="text-slate-500 font-black text-lg">لا توجد كوبونات بعد</p>
                            <p className="text-slate-400 text-xs font-bold">ابدأ بإنشاء أول كود خصم لعملائك</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {coupons.map((coupon) => (
                            <div
                                key={coupon.id}
                                className="group bg-white/60 p-6 rounded-[2.5rem] border border-slate-100/50 shadow-sm hover:shadow-xl hover:border-gold/20 transition-all duration-500 relative overflow-hidden"
                            >
                                {/* Ambient Background Glow */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-all"></div>

                                <div className="flex items-start justify-between relative z-10">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-secondary text-white flex flex-col items-center justify-center shadow-lg transform group-hover:rotate-3 transition-transform">
                                            <span className="text-lg font-black">{coupon.discount}%</span>
                                            <span className="text-[8px] font-bold uppercase tracking-tight">خصم</span>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-slate-800 uppercase tracking-wider group-hover:text-gold transition-colors">{coupon.code}</h4>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${coupon.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-500/10 text-slate-600'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${coupon.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
                                                    {coupon.isActive ? 'نشط' : 'غير نشط'}
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {new Date(coupon.createdAt).toLocaleDateString('ar-EG')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openEditModal(coupon)}
                                            className="w-10 h-10 rounded-xl bg-secondary/5 text-secondary flex items-center justify-center hover:bg-secondary hover:text-white transition-all active:scale-90"
                                            title="تعديل الكوبون"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCoupon(coupon.id)}
                                            className="w-10 h-10 rounded-xl bg-rose-500/5 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                                            title="حذف الكوبون"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
                                    <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                                        <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">الاستخدام الحالي</span>
                                        <div className="flex items-end justify-between">
                                            <span className="text-lg font-black text-slate-700">{coupon.usedCount} <span className="text-[10px] font-bold">مرة</span></span>
                                            <span className="text-[10px] font-bold text-slate-400">من {coupon.limit}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                                style={{ width: `${Math.min((coupon.usedCount / coupon.limit) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                                        <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">تاريخ الحجز</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar size={14} className="text-gold" />
                                            <span className="text-[11px] font-bold text-slate-600">
                                                {coupon.bookings && coupon.bookings.length > 0
                                                    ? `آخر استخدام: ${new Date(coupon.bookings[0].createdAt).toLocaleDateString('ar-EG')}`
                                                    : 'لم يستخدم بعد'
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Usage History Drawer/Collapse (Simplified for MVP) */}
                                {coupon.bookings && coupon.bookings.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-dashed border-slate-200">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <CheckCircle2 size={12} className="text-emerald-500" />
                                            سجل الاستخدام الأخير
                                        </p>
                                        <div className="space-y-2">
                                            {coupon.bookings.slice(0, 3).map((booking: any) => (
                                                <div key={booking.id} className="flex items-center justify-between text-[11px] bg-slate-50/50 p-2 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <Hotel size={10} className="text-gold" />
                                                        <span className="font-bold text-slate-600 truncate max-w-[150px]">{booking.room?.hotel?.name || 'فندق مجهول'}</span>
                                                    </div>
                                                    <span className="font-black text-secondary">#{booking.id.split('-')[0]}</span>
                                                </div>
                                            ))}
                                            {coupon.bookings.length > 3 && (
                                                <p className="text-[9px] text-center text-slate-400 font-bold mt-2">+{coupon.bookings.length - 3} استخدامات أخرى</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 sm:p-20">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={closeModal}></div>
                    <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl relative z-10 overflow-hidden animate-zoom-in">
                        <div className="bg-secondary p-8 text-white relative">
                            <h3 className="text-2xl font-black tracking-tight">
                                {editingCoupon ? 'تعديل كود الخصم' : 'إنشاء كود خصم جديد'}
                            </h3>
                            <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">
                                {editingCoupon ? 'تحديث إعدادات العرض الحالي' : 'خطوة نحو زيادة الولاء والمبيعات'}
                            </p>
                            <button
                                onClick={closeModal}
                                className="absolute top-8 left-8 text-white/50 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                        </div>

                        <form onSubmit={handleSaveCoupon} className="p-10 space-y-8">
                            {error && (
                                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-3 text-rose-600 text-xs font-bold animate-shake">
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* Code Input */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1 flex items-center gap-2">
                                        <Hash size={12} className="text-gold" />
                                        رمز الكوبون (انجليزي فقط)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="مثال: WELCOME2026"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-secondary font-black focus:outline-none focus:border-secondary transition-all uppercase tracking-[0.2em] placeholder:text-slate-300 placeholder:tracking-normal"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Discount Input */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1 flex items-center gap-2">
                                            <Percent size={12} className="text-gold" />
                                            نسبة الخصم
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-secondary font-black focus:outline-none focus:border-secondary transition-all"
                                            value={formData.discount}
                                            onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) })}
                                            required
                                        />
                                    </div>
                                    {/* Limit Input */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1 flex items-center gap-2">
                                            <Users size={12} className="text-gold" />
                                            الحد الأقصى
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-secondary font-black focus:outline-none focus:border-secondary transition-all"
                                            value={formData.limit}
                                            onChange={(e) => setFormData({ ...formData, limit: parseInt(e.target.value) })}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Status Toggle (Only for Edit) */}
                                {editingCoupon && (
                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">حالة الكوبون</label>
                                            <p className="text-[11px] font-bold text-slate-500">تحويل الكوبون بين نشط وغير نشط</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                            className={`w-14 h-8 rounded-full transition-all relative ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                        >
                                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.isActive ? 'left-7' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full bg-secondary text-white py-5 rounded-[1.5rem] font-black text-base shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-4 group"
                            >
                                {isSaving ? <Loader2 size={24} className="animate-spin" /> : (
                                    <>
                                        <span>{editingCoupon ? 'تحديث الكوبون' : 'تفعيل وإطلاق الكوبون'}</span>
                                        <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform text-gold" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouponsTab;
