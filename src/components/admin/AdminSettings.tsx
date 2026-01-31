import React, { useState } from 'react';
import { Key, Mail, Save, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AuthAPI } from '../../services/api';

interface AdminSettingsProps {
    onClose?: () => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleUpdateCredentials = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        // Validations
        if (newPassword && newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'كلمتا المرور غير متطابقتين' });
            return;
        }

        if (!currentPassword) {
            setMessage({ type: 'error', text: 'يرجى إدخال كلمة المرور الحالية' });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/admin/update-credentials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('diafat_auth_token')}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newEmail: newEmail || undefined,
                    newPassword: newPassword || undefined
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'تم تحديث البيانات بنجاح! سيتم تسجيل خروجك خلال 3 ثوانٍ...' });
                setTimeout(() => {
                    AuthAPI.logout();
                    window.location.href = '/admin-login';
                }, 3000);
            } else {
                setMessage({ type: 'error', text: data.error || 'حدث خطأ أثناء التحديث' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'خطأ في الاتصال بالخادم' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8" dir="rtl">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-500 rounded-2xl">
                    <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900">إعدادات الحساب</h2>
                    <p className="text-sm text-slate-500 font-medium">تحديث بيانات الدخول الخاصة بك</p>
                </div>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 ${message.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200'
                    : 'bg-red-50 border border-red-200'
                    }`}>
                    {message.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <p className={`text-sm font-semibold ${message.type === 'success' ? 'text-emerald-800' : 'text-red-800'
                        }`}>
                        {message.text}
                    </p>
                </div>
            )}

            <form onSubmit={handleUpdateCredentials} className="space-y-6">
                {/* Current Password */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        <Key className="w-4 h-4 inline mr-2" />
                        كلمة المرور الحالية (مطلوبة)
                    </label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <div className="h-px bg-slate-200" />

                {/* New Email */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        البريد الإلكتروني الجديد (اختياري)
                    </label>
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        placeholder="admin@example.com"
                        dir="ltr"
                    />
                    <p className="text-xs text-slate-500 mt-2">اتركه فارغاً إذا كنت لا تريد تغييره</p>
                </div>

                {/* New Password */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        <Key className="w-4 h-4 inline mr-2" />
                        كلمة المرور الجديدة (اختياري)
                    </label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        placeholder="••••••••"
                    />
                </div>

                {/* Confirm Password */}
                {newPassword && (
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            تأكيد كلمة المرور الجديدة
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            جاري التحديث...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            حفظ التغييرات
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs text-amber-800 font-semibold flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>سيتم تسجيل خروجك تلقائياً بعد تحديث البيانات. قم بحفظ البيانات الجديدة قبل التأكيد.</span>
                </p>
            </div>
        </div>
    );
};

export default AdminSettings;
