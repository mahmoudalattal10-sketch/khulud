import React from 'react';
import {
    LayoutDashboard,
    CalendarDays,
    Users,
    Settings,
    PieChart,
    Compass,
    AlertTriangle,
    Clock,
    Sparkles,
    X,
    MessageCircle,
    Ticket
} from 'lucide-react';
import { User } from '../../services/api';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    adminUser?: User | null;
    hotels?: any[];
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, adminUser, hotels = [], isOpen, onClose }) => {
    const [now, setNow] = React.useState(new Date());

    // 🕒 TICKER EFFECT
    React.useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // 🛠️ FORMAT TIMER
    const formatCountdown = (expiryDate: Date) => {
        const diff = expiryDate.getTime() - now.getTime();
        if (diff <= 0) return "منتهي";

        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
        const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 30);
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

        if (months > 0) {
            return `${months} شهر و ${days} يوم`;
        }
        if (days > 0) {
            return `${days} يوم و ${hours} ساعة`;
        }

        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        const pad = (n: number) => n.toString().padStart(2, '0');

        // Format for less than a day: HH:MM:SS
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };

    // 🧠 SMART ALERT LOGIC
    const getSmartAlerts = () => {
        if (!hotels || hotels.length === 0) return [];
        const alerts: any[] = [];

        let criticalRoom: any = null;
        let criticalHotel: any = null;
        let lowestStock = Infinity;

        let endingSoonPeriod: any = null;
        let endingSoonRoom: any = null;
        let endingSoonHotel: any = null;
        let soonestEnd = Infinity;

        // Show alerts for offers ending in the next year (increased from 30 days)
        const ALERT_THRESHOLD_DAYS = 365;
        const ALERT_THRESHOLD_MS = ALERT_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;

        hotels.forEach(hotel => {
            (hotel.rooms || []).forEach((room: any) => {
                // 1. Stock check
                if (room.available !== undefined && room.available < lowestStock && room.available > 0) {
                    lowestStock = room.available;
                    criticalRoom = room;
                    criticalHotel = hotel;
                }

                // 2. Pricing period check
                let periods = [];
                try {
                    periods = Array.isArray(room.pricingPeriods) ? room.pricingPeriods : JSON.parse(room.pricingPeriods || '[]');
                } catch (e) { }

                periods.forEach((p: any) => {
                    const endDate = new Date(p.endDate);
                    const diff = endDate.getTime() - now.getTime();

                    // Check if ending soon AND within the threshold
                    if (diff > 0 && diff < soonestEnd && diff < ALERT_THRESHOLD_MS) {
                        soonestEnd = diff;
                        endingSoonPeriod = p;
                        endingSoonRoom = room;
                        endingSoonHotel = hotel;
                    }
                });
            });
        });

        // Add Ending Soon Alert
        if (endingSoonPeriod) {
            const expiryDate = new Date(endingSoonPeriod.endDate);

            alerts.push({
                id: `period-${endingSoonPeriod.id}`,
                type: 'period',
                title: `تحديث أسعار ${endingSoonHotel.name}`,
                message: `المخزون الحالي: ${endingSoonRoom.available || 0} غرف متوفرة بالسعر المخفض`,
                badge: 'تنبيه ذكي',
                color: 'text-[#0ca678]',
                icon: <Sparkles size={14} className="text-[#0ca678] animate-pulse" />,
                footer: `ينتهي خلال ${formatCountdown(expiryDate)}`,
                expiryDate
            });
        }

        // Add Critical Stock Alert
        if (criticalRoom && lowestStock <= 3) {
            alerts.push({
                id: `stock-${criticalRoom.id}`,
                type: 'stock',
                title: `تحديث مخزون ${criticalHotel.name}`,
                message: `فقط ${lowestStock} غرف متبقية من نوع ${criticalRoom.name}`,
                badge: 'مخزون حرج',
                color: 'text-red-500',
                icon: <Clock size={14} className="text-red-500 animate-pulse" />,
                footer: `يرجى مراجعة التوفر فوراً`
            });
        }

        return alerts;
    };

    const alerts = getSmartAlerts();

    const menuItems = [
        { id: 'dashboard', label: 'الرئيسية', icon: <LayoutDashboard size={20} /> },
        { id: 'destinations', label: 'الفنادق والغرف', icon: <Compass size={20} /> },
        { id: 'bookings', label: 'الحجوزات', icon: <CalendarDays size={20} /> },
        { id: 'coupons', label: 'الكوبونات والعروض', icon: <Ticket size={20} /> },
        { id: 'customers', label: 'المعتمرين والزوار', icon: <Users size={20} /> },
        { id: 'analytics', label: 'الإحصائيات', icon: <PieChart size={20} /> },
        { id: 'messages', label: 'الرسائل', icon: <MessageCircle size={20} /> },
        { id: 'account-settings', label: 'حسابي', icon: <Settings size={20} /> },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[45] lg:hidden transition-opacity duration-300"
                    onClick={onClose}
                ></div>
            )}

            <div className={`
                fixed lg:sticky top-0 right-0 h-screen lg:h-[calc(100vh-2rem)] lg:my-4 lg:mr-4
                w-72 bg-white rounded-none lg:rounded-[2rem] 
                flex flex-col z-50 border-l lg:border border-slate-200/60 shadow-xl
                transition-transform duration-500 ease-in-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0ca678] rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 items-center">
                            <Compass size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <span className="text-lg font-black text-[#1e293b] tracking-tighter block leading-tight">ضيافة خلود</span>
                            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">لخدمات مكة والمدينة</span>
                        </div>
                    </div>
                    {/* Mobile Close Button */}
                    <button onClick={onClose} className="lg:hidden p-2 text-slate-300 hover:text-red-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto no-scrollbar scrollbar-hide">
                    <style>{`
                        .scrollbar-hide::-webkit-scrollbar {
                            display: none;
                        }
                        .scrollbar-hide {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}</style>
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                if (onClose) onClose();
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[1.2rem] transition-all duration-300 group relative overflow-hidden ${activeTab === item.id
                                ? 'bg-[#e6fcf5] text-[#0ca678]'
                                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                                }`}
                        >
                            <span className={`${activeTab === item.id ? 'text-[#0ca678] scale-110' : 'text-slate-300 group-hover:text-[#0ca678] group-hover:scale-110'} transition-transform duration-300`}>
                                {item.icon}
                            </span>
                            <span className="text-xs font-black">{item.label}</span>
                            {activeTab === item.id && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#0ca678] rounded-l-full" />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-4 space-y-3">
                    {/* Professional Urgent Alert Section */}
                    {alerts.length > 0 && (
                        <div className="space-y-3">
                            {alerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className={`relative overflow-hidden rounded-[1.5rem] p-4 shadow-sm transition-all hover:shadow-md border ${alert.type === 'stock'
                                        ? 'bg-rose-50 border-rose-100'
                                        : 'bg-amber-50 border-amber-100'
                                        }`}
                                >
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${alert.type === 'stock' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                                                }`}>
                                                <AlertTriangle size={10} strokeWidth={3} />
                                                <span className="text-[9px] font-black uppercase tracking-wider">{alert.badge}</span>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm ${alert.type === 'stock' ? 'text-rose-500' : 'text-amber-500'
                                                }`}>
                                                {/* Scaled down icon */}
                                                {React.cloneElement(alert.icon as React.ReactElement, { size: 12 })}
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <p className="text-xs font-black text-[#1e293b] leading-tight">
                                                {alert.title}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-500 leading-relaxed">
                                                {alert.message}
                                            </p>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between">
                                            <div className={`flex items-center gap-1.5 text-[10px] font-black ${alert.type === 'stock' ? 'text-rose-500' : 'text-amber-500'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${alert.type === 'stock' ? 'bg-rose-500' : 'bg-amber-500'
                                                    }`}></div>
                                                <span>{alert.footer}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`absolute top-2 right-2 -rotate-12 translate-x-3 opacity-10 ${alert.type === 'stock' ? 'text-rose-500' : 'text-amber-500'
                                        }`}>
                                        <Sparkles size={48} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}


                    <div className="pt-3 border-t border-slate-100 flex flex-col items-center justify-center text-center gap-1">
                        <span className="text-[9px] text-slate-300 font-medium">Powering Hospitality by</span>
                        <div className="font-['Dancing_Script',cursive] text-slate-400 text-lg leading-none transform -rotate-2 hover:scale-110 transition-transform cursor-pointer" style={{ fontFamily: 'cursive' }}>
                            Elattal Co.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
