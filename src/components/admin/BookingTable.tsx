
import React, { useState, useEffect } from 'react';
import {
    MoreHorizontal, User, Calendar, DollarSign,
    MapPin, Printer, Edit, Trash2, CheckCircle2,
    FileSpreadsheet, Filter, ChevronDown, Loader2, AlertCircle, Clock, RefreshCw
} from 'lucide-react';
import { BookingsAPI } from '../../services/api';

// Booking interface from API
interface ApiBooking {
    id: string;
    userId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    guestsCount: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED';
    createdAt: string;
    guestName?: string; // <--- ADDED
    user?: {
        id: string;
        name: string;
        email: string;
        phone?: string;
    };
    room?: {
        id: string;
        name: string;
        hotel?: {
            name: string;
        };
    };
    coupon?: {
        code: string;
        discount: number;
    };
}

const BookingTable: React.FC = () => {
    const [bookings, setBookings] = useState<ApiBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Fetch bookings on mount
    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await BookingsAPI.getAll();
            if (response.success && response.data) {
                setBookings(response.data as ApiBooking[]);
            } else {
                setError(response.error || 'فشل جلب الحجوزات');
            }
        } catch (err) {
            setError('حدث خطأ في الاتصال');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm('هل أنت متأكد من إلغاء هذا الحجز؟')) return;

        setActionLoading(bookingId);
        try {
            const response = await BookingsAPI.cancel(bookingId);
            if (response.success) {
                // Update local state
                setBookings(prev => prev.map(b =>
                    b.id === bookingId ? { ...b, status: 'CANCELLED' as const } : b
                ));
                setActiveMenu(null);
            } else {
                alert(response.error || 'فشل إلغاء الحجز');
            }
        } catch (err) {
            alert('حدث خطأ في إلغاء الحجز');
        } finally {
            setActionLoading(null);
        }
    };

    const exportReport = () => {
        // Simple CSV export
        const headers = ['رقم الحجز', 'العميل', 'الفندق', 'تاريخ الوصول', 'المبلغ', 'الحالة'];
        const rows = bookings.map(b => [
            b.id.slice(0, 8),
            b.user?.name || 'غير معروف',
            b.room?.hotel?.name || 'غير محدد',
            new Date(b.checkIn).toLocaleDateString('ar-SA'),
            b.totalPrice.toString(),
            b.status
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `bookings_report_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const getStatusDisplay = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return { text: 'حجز مؤكد', class: 'bg-[#e6fcf5] text-[#0ca678] border-[#c3fae8]', dot: 'bg-[#0ca678] shadow-[0_0_8px_rgba(12,166,120,0.3)]' };
            case 'PENDING': return { text: 'قيد الانتظار', class: 'bg-[#fff9ef] text-[#f59e0b] border-[#ffe3b3]', dot: 'bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.3)]' };
            case 'CANCELLED': return { text: 'تم الإلغاء', class: 'bg-red-50 text-red-600 border-red-100', dot: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]' };
            case 'COMPLETED': return { text: 'مكتمل', class: 'bg-blue-50 text-blue-600 border-blue-100', dot: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]' };
            default: return { text: status, class: 'bg-slate-50 text-slate-500 border-slate-200', dot: 'bg-slate-400' };
        }
    };

    const getPaymentStatusDisplay = (status: string) => {
        switch (status) {
            case 'PAID': return { text: 'مدفوع - مؤكد', class: 'bg-[#0ca678] text-white shadow-emerald-100 border-[#0ca678]', icon: <CheckCircle2 size={12} className="text-white" /> };
            case 'REFUNDED': return { text: 'تم الاسترداد', class: 'bg-slate-50 text-slate-400 border-slate-200 shadow-sm', icon: <AlertCircle size={12} /> };
            default: return { text: 'غير مدفوع', class: 'bg-[#fff9ef] text-[#f59e0b] border-[#ffe3b3] shadow-sm', icon: <Clock size={12} /> };
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                    <Loader2 className="w-10 h-10 text-[#0ca678] animate-spin" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">جاري تحميل الحجوزات...</h3>
                <p className="text-slate-400 font-bold">يرجى الانتظار بينما نقوم بمزامنة البيانات</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-red-50/50 rounded-[2.5rem] border border-red-100">
                <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                <h3 className="text-xl font-black text-red-600 mb-2">فشل جلب الحجوزات</h3>
                <p className="text-red-400 font-bold mb-6">{error}</p>
                <button onClick={fetchBookings} className="bg-white text-red-600 border border-red-200 px-8 py-3 rounded-2xl font-black text-sm hover:bg-red-50 transition-all flex items-center gap-2">
                    <RefreshCw size={18} />
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight">سجل الحجوزات الكامل</h2>
                    <p className="text-slate-400 font-bold mt-2 flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-[#0ca678]"></span>
                        {bookings.length > 0 ? `${bookings.length} حجز مسجل في النظام` : 'لا توجد حجوزات حالياً'}
                    </p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button
                        onClick={fetchBookings}
                        className="flex items-center justify-center gap-2 text-slate-600 text-xs font-black hover:bg-slate-50 px-6 py-4 rounded-[1.25rem] transition-all border border-slate-200 shadow-sm"
                    >
                        <RefreshCw size={16} /> تحديث
                    </button>
                    <button
                        onClick={exportReport}
                        disabled={bookings.length === 0}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 text-[#1e293b] text-xs font-black hover:bg-slate-50 px-8 py-4 rounded-[1.25rem] transition-all border border-slate-200 shadow-sm disabled:opacity-50"
                    >
                        <FileSpreadsheet size={18} /> تصدير التقرير (CSV)
                    </button>
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <Calendar size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-400">لا توجد حجوزات لعرضها</h3>
                </div>
            ) : (
                <div className="overflow-x-auto pb-4 custom-scrollbar">
                    <table className="w-full border-separate border-spacing-y-4 text-right min-w-[1000px]">
                        <thead>
                            <tr className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] px-8">
                                <th className="px-8 pb-4 text-right">المعتمر / الزائر</th>
                                <th className="px-8 pb-4 text-right">الفندق / الغرفة</th>
                                <th className="px-8 pb-4 text-center">تاريخ الوصول</th>
                                <th className="px-8 pb-4 text-right">التكلفة الإجمالية</th>
                                <th className="px-8 pb-4 text-right">حالة الدفع</th>
                                <th className="px-8 pb-4 text-right">حالة الحجز</th>
                                <th className="px-8 pb-4 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => {
                                const statusDisplay = getStatusDisplay(booking.status);
                                return (
                                    <tr key={booking.id} className="bg-white rounded-[2.5rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative border-y border-transparent hover:border-emerald-100">
                                        <td className="px-8 py-8 rounded-r-[2.5rem]">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#e6fcf5] group-hover:text-[#0ca678] transition-all duration-500 shadow-inner">
                                                    <User size={28} strokeWidth={2} />
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-800 text-lg leading-tight">{booking.guestName || booking.user?.name || 'غير معروف'}</div>
                                                    <div className="text-[10px] text-slate-400 font-black mt-1 tracking-widest bg-slate-100 px-2 py-0.5 rounded-lg inline-block uppercase">#{booking.id.slice(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-[1.25rem] bg-emerald-50 flex items-center justify-center text-[#0ca678] shadow-sm border border-emerald-100 group-hover:bg-[#0ca678] group-hover:text-white transition-all duration-500">
                                                    <MapPin size={18} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-slate-700 leading-tight">{booking.room?.hotel?.name || 'فندق'}</div>
                                                    <div className="text-[11px] text-slate-400 font-bold mt-1">{booking.room?.name || 'غرفة مميزة'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col gap-1.5 items-center">
                                                <div className="flex items-center justify-center gap-3 text-xs font-black text-[#1e293b] bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 shadow-inner w-full">
                                                    <Calendar size={16} className="text-slate-300" />
                                                    {new Date(booking.checkIn).toLocaleDateString('ar-SA')}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <Clock size={12} />
                                                    {new Date(booking.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">السعر الإجمالي</span>
                                                <div className="font-black text-slate-800 text-xl flex items-baseline gap-1.5">
                                                    <span className="text-xs text-[#0ca678]">SAR</span> {booking.totalPrice.toLocaleString()}
                                                </div>
                                                {booking.coupon && (
                                                    <div className="flex items-center gap-2 mt-2 bg-[#fff9ef] text-[#f59e0b] px-3 py-1 rounded-xl border border-[#ffe3b3] shadow-sm animate-pulse">
                                                        <span className="text-[10px] font-black tracking-widest uppercase">{booking.coupon.code}</span>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></div>
                                                        <span className="text-[10px] font-black">خصم {booking.coupon.discount}%</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            {(() => {
                                                const pStatus = getPaymentStatusDisplay(booking.paymentStatus);
                                                return (
                                                    <span className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${pStatus.class}`}>
                                                        <div className="bg-white/20 p-1 rounded-lg">
                                                            {pStatus.icon}
                                                        </div>
                                                        {pStatus.text}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <span className={`inline-flex items-center gap-3 px-6 py-3.5 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest shadow-sm border ${statusDisplay.class}`}>
                                                <div className={`w-2.5 h-2.5 rounded-full ${statusDisplay.dot}`}></div>
                                                {statusDisplay.text}
                                            </span>
                                        </td>
                                        <td className="px-8 py-8 rounded-l-[2.5rem] text-center">
                                            <div className="relative inline-block">
                                                <button
                                                    onClick={() => setActiveMenu(activeMenu === booking.id ? null : booking.id)}
                                                    disabled={actionLoading === booking.id}
                                                    className={`p-4 rounded-2xl transition-all shadow-sm ${activeMenu === booking.id ? 'bg-[#1e293b] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:text-[#0ca678] hover:bg-[#e6fcf5]'}`}
                                                >
                                                    {actionLoading === booking.id ? (
                                                        <Loader2 size={24} className="animate-spin" />
                                                    ) : (
                                                        <MoreHorizontal size={24} />
                                                    )}
                                                </button>

                                                {activeMenu === booking.id && (
                                                    <div className="absolute left-0 top-full mt-3 w-64 bg-white rounded-[2rem] border border-slate-100 shadow-2xl z-50 p-3 animate-in fade-in zoom-in-95 origin-top-left">
                                                        <div className="p-2 border-b border-slate-50 mb-2">
                                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] text-center mb-1">إدارة الطلب</p>
                                                        </div>

                                                        {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                                                            <button
                                                                onClick={() => handleCancelBooking(booking.id)}
                                                                className="w-full flex items-center gap-4 px-5 py-4 text-right text-sm font-black text-red-500 hover:bg-red-50 rounded-2xl transition-all group/btn"
                                                            >
                                                                <Trash2 size={20} className="group-hover/btn:rotate-12 transition-transform" />
                                                                <span>إلغاء الحجز نهائياً</span>
                                                            </button>
                                                        )}

                                                        <button className="w-full flex items-center gap-4 px-5 py-4 text-right text-sm font-black text-slate-600 hover:bg-slate-50 rounded-2xl transition-all">
                                                            <Printer size={20} />
                                                            <span>طباعة الحجز</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BookingTable;

