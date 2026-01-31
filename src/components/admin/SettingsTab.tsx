import React, { useState, useEffect } from 'react';
import { Settings, User, Bell, Shield, Database, Globe, Ticket, Plus, Trash2, Loader2 } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  discount: number;
  limit: number;
  usedCount: number;
  isActive: boolean;
  bookings?: {
    id: string;
    createdAt: string;
    room: {
      name: string;
      hotel: {
        name: string;
      }
    }
  }[];
}

const SettingsTab: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', limit: '' });
  const [addingCoupon, setAddingCoupon] = useState(false);

  // Profile State
  const [adminName, setAdminName] = useState('محمد نور');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    // Load saved name
    const savedName = localStorage.getItem('admin_name');
    if (savedName) setAdminName(savedName);
  }, []);

  const handleSaveProfile = () => {
    setSavingProfile(true);
    setTimeout(() => {
      localStorage.setItem('admin_name', adminName);
      setSavingProfile(false);
      // Dispatch event to update other components
      window.dispatchEvent(new Event('adminNameChanged'));
      alert('تم تحديث البيانات بنجاح!');
    }, 800);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoadingCoupons(true);
      const token = localStorage.getItem('diafat_auth_token');
      const res = await fetch('http://localhost:3001/api/coupons', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error('Failed to fetch coupons', error);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAddingCoupon(true);
      const token = localStorage.getItem('diafat_auth_token');
      const res = await fetch('http://localhost:3001/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCoupon)
      });
      const data = await res.json();
      if (data.success) {
        setCoupons([data.coupon, ...coupons]);
        setNewCoupon({ code: '', discount: '', limit: '' });
      } else {
        alert('فشل إضافة الكوبون: ' + (data.error || 'خطأ غير معروف'));
      }
    } catch (error) {
      alert('حدث خطأ أثناء الاتصال بالسيرفر');
    } finally {
      setAddingCoupon(false);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الكوبون؟')) return;
    try {
      const token = localStorage.getItem('diafat_auth_token');
      const res = await fetch(`http://localhost:3001/api/coupons/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCoupons(coupons.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete coupon', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom duration-500 pb-20">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-20 h-20 bg-[#0ca678] rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
          <Settings size={40} />
        </div>
        <div>
          <h2 className="text-4xl font-black text-text tracking-tight">الإعدادات العامة</h2>
          <p className="text-slate-400 font-bold mt-1 uppercase tracking-[0.2em] text-xs">نظام ضيافة خلود v2.6</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="glass-card p-8 rounded-[2.5rem] border border-white/80">
          <div className="flex items-center gap-3 mb-8">
            <User className="text-slate-800" size={24} />
            <h3 className="text-xl font-black text-text">الملف الشخصي</h3>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">الاسم الكامل</label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">البريد الإلكتروني</label>
              <input type="email" defaultValue="m.nour@kholoud.com" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 ring-emerald-500/20" />
            </div>
            <button
              onClick={handleSaveProfile}
              className="w-full py-4 bg-[#0ca678] text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:bg-[#087f5b] transition-all"
            >
              {savingProfile ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'تحديث البيانات'}
            </button>
          </div>
        </div>

        {/* Security & Access */}
        <div className="glass-card p-8 rounded-[2.5rem] border border-white/80">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="text-blue-500" size={24} />
            <h3 className="text-xl font-black text-text">الأمان والوصول</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-700">التحقق بخطوتين</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-1">تأمين حسابك عبر الهاتف</p>
              </div>
              <div className="w-12 h-6 bg-slate-800 rounded-full relative shadow-inner">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-700">تشفير البيانات</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-1">تشفير End-to-End مفعل</p>
              </div>
              <div className="w-12 h-6 bg-slate-800 rounded-full relative shadow-inner">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500">آخر تسجيل دخول</span>
              <span className="text-xs font-black text-primary">منذ 15 دقيقة</span>
            </div>
          </div>
        </div>

        {/* Coupon Management (NEW) */}
        <div className="glass-card p-8 rounded-[2.5rem] border border-white/80 md:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Ticket className="text-[#0ca678]" size={24} />
              <h3 className="text-xl font-black text-text">إدارة الكوبونات والخصومات</h3>
            </div>
            <div className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">PRO Feature</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Coupon Form */}
            <div className="lg:col-span-1 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 h-fit">
              <h4 className="font-black text-text mb-4 flex items-center gap-2">
                <Plus size={16} /> إضافة كوبون جديد
              </h4>
              <form onSubmit={handleAddCoupon} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">كود الخصم</label>
                  <input
                    type="text"
                    placeholder="مثال: SUMMER2026"
                    value={newCoupon.code}
                    onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#0ca678] uppercase"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">الخصم (%)</label>
                    <input
                      type="number"
                      placeholder="10"
                      value={newCoupon.discount}
                      onChange={e => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">عدد مرات الاستخدام</label>
                    <input
                      type="number"
                      placeholder="50"
                      value={newCoupon.limit}
                      onChange={e => setNewCoupon({ ...newCoupon, limit: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={addingCoupon}
                  className="w-full py-3 bg-[#0ca678] text-white rounded-xl font-black text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {addingCoupon ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  إضافة الكوبون
                </button>
              </form>
            </div>

            {/* Coupons List */}
            <div className="lg:col-span-2 space-y-4">
              {loadingCoupons ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="animate-spin text-slate-300" size={30} />
                </div>
              ) : coupons.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                  <Ticket size={48} strokeWidth={1} className="mb-2 opacity-50" />
                  <p className="font-bold text-sm">لا توجد كوبونات فعالة حالياً</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coupons.map(coupon => (
                    <div key={coupon.id} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-[#0ca678] transition-colors relative overflow-hidden">
                      <div className="absolute right-0 top-0 w-16 h-16 bg-gradient-to-bl from-[#0ca678]/10 to-transparent rounded-bl-[2rem]"></div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg font-black text-text tracking-wider">{coupon.code}</span>
                          <span className="text-[10px] font-black bg-emerald-50 text-[#0ca678] px-2 py-0.5 rounded-md">
                            {coupon.discount}% خصم
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-slate-400 flex flex-col gap-1">
                          <span>تم الاستخدام: <span className="text-slate-600">{coupon.usedCount}</span> / {coupon.limit}</span>

                          {coupon.bookings && coupon.bookings.length > 0 && (
                            <div className="mt-2 border-t border-slate-100 pt-2">
                              <p className="text-[9px] uppercase tracking-widest mb-1">آخر استخدام:</p>
                              {coupon.bookings.slice(0, 3).map(b => (
                                <p key={b.id} className="text-[10px] text-slate-600 truncate max-w-[150px]">
                                  • {b.room?.hotel?.name || 'فندق غير معرف'}
                                </p>
                              ))}
                              {coupon.bookings.length > 3 && <p className="text-[9px] text-slate-400">+ {coupon.bookings.length - 3} آخرين</p>}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Config */}
        <div className="glass-card p-8 rounded-[2.5rem] border border-white/80 md:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <Database className="text-purple-500" size={24} />
            <h3 className="text-xl font-black text-text">تفضيلات النظام</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <Bell size={18} className="text-purple-400" />
                <span className="text-sm font-black text-text">الإشعارات</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold">إشعارات الحجز عبر البريد والواتساب</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <Globe size={18} className="text-blue-400" />
                <span className="text-sm font-black text-text">اللغة الافتراضية</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold">العربية (الافتراضية)</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center">
              <button className="text-xs font-black text-red-500 hover:bg-red-50 px-6 py-2 rounded-xl transition-all">إعادة ضبط المصنع</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
