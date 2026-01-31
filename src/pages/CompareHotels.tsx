import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { HotelsAPI, Hotel } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Scale, ArrowRight, Star, MapPin, Eye, CheckCircle2, Shield, Wifi, Car, Waves, Dumbbell, Utensils, Plane, Sparkles, Bell, Gamepad2, Briefcase, Shirt, UserCheck, Coffee, Key, X } from 'lucide-react';

// Amenity mapping helper (sync with HotelCard)
const getAmenityData = (id: string) => {
    const mapping: Record<string, { label: string; icon: any }> = {
        'wifi': { label: 'واي فاي', icon: <Wifi size={14} /> },
        'parking': { label: 'مواقف', icon: <Car size={14} /> },
        'pool': { label: 'مسبح', icon: <Waves size={14} /> },
        'gym': { label: 'نادي رياضي', icon: <Dumbbell size={14} /> },
        'food': { label: 'مطعم', icon: <Utensils size={14} /> },
        'shuttle': { label: 'نقل للحرم', icon: <Plane size={14} /> },
        'spa': { label: 'سبا', icon: <Sparkles size={14} /> },
        'room_service': { label: 'خدمة غرف', icon: <Bell size={14} /> },
        'kids_club': { label: 'نادي أطفال', icon: <Gamepad2 size={14} /> },
        'business': { label: 'مركز أعمال', icon: <Briefcase size={14} /> },
        'laundry': { label: 'غسيل ملابس', icon: <Shirt size={14} /> },
        'concierge': { label: 'كونسيرج', icon: <UserCheck size={14} /> },
        'cafe': { label: 'مقهى', icon: <Coffee size={14} /> },
        'valet': { label: 'صف سيارات', icon: <Key size={14} /> }
    };
    return mapping[id.toLowerCase()] || { label: id, icon: <CheckCircle2 size={14} /> };
};

const CompareHotels: React.FC = () => {
    const { compareList, toggleCompare, clearCompare } = useUserPreferences();
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotels = async () => {
            if (compareList.length === 0) {
                setIsLoading(false);
                return;
            }

            try {
                const results = await Promise.all(
                    compareList.map(id => HotelsAPI.getById(id))
                );
                const successfulHotels = results
                    .filter(res => res.success && res.data)
                    .map(res => res.data as Hotel);
                setHotels(successfulHotels);
            } catch (error) {
                console.error('Failed to fetch hotels for comparison:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHotels();
    }, [compareList]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 pt-32 pb-20 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (hotels.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 text-center">
                <div className="max-w-md mx-auto space-y-6">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                        <Scale size={48} />
                    </div>
                    <h1 className="text-3xl font-black text-text">لا يوجد فنادق للمقارنة</h1>
                    <p className="text-slate-500 font-bold">قم بإضافة فنادق من القائمة لتبدأ المقارنة بينها.</p>
                    <button
                        onClick={() => navigate('/hotels')}
                        className="bg-gold text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-gold/20 hover:bg-gold-dark transition-all"
                    >
                        تصفح الفنادق
                    </button>
                </div>
            </div>
        );
    }

    const comparisonRows = [
        {
            label: 'السعر', key: 'price', render: (h: Hotel) => (
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-gold">{h.basePrice.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 font-bold">ر.س / ليلة</span>
                </div>
            )
        },
        {
            label: 'التقييم', key: 'rating', render: (h: Hotel) => (
                <div className="flex items-center gap-1 justify-center text-gold">
                    <span className="font-black text-lg">{h.rating}</span>
                    <Star size={16} fill="currentColor" />
                </div>
            )
        },
        {
            label: 'المسافة من الحرم', key: 'distance', render: (h: Hotel) => (
                <div className="flex items-center gap-1 justify-center text-slate-600 font-bold">
                    <MapPin size={16} className="text-gold" />
                    <span>{h.distanceFromHaram}</span>
                </div>
            )
        },
        {
            label: 'الإطلالة', key: 'view', render: (h: Hotel) => (
                <div className="flex items-center gap-1 justify-center text-slate-600 font-bold">
                    <Eye size={16} className="text-gold" />
                    <span>{h.view || 'غير محددة'}</span>
                </div>
            )
        },
        {
            label: 'المرافق', key: 'amenities', render: (h: Hotel) => (
                <div className="flex flex-wrap gap-2 justify-center max-w-[200px] mx-auto">
                    {h.amenities.slice(0, 6).map(id => {
                        const { label, icon } = getAmenityData(id);
                        return (
                            <div key={id} title={label} className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 hover:text-gold transition-colors">
                                {React.cloneElement(icon, { size: 16 })}
                            </div>
                        );
                    })}
                </div>
            )
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div className="text-right">
                        <h1 className="text-4xl font-black text-text mb-2 flex items-center gap-4">
                            مقارنة الفنادق
                            <Scale className="text-gold" size={32} />
                        </h1>
                        <p className="text-slate-500 font-bold">قارن بين أفضل الخيارات المتاحة لضمان إقامة مثالية.</p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-text font-black transition-colors"
                    >
                        <span>العودة</span>
                        <ArrowRight size={20} />
                    </button>
                </div>

                {/* Comparison Table */}
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-center border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="p-8 text-right font-black text-slate-400 text-sm uppercase tracking-widest bg-slate-50/50 w-48 sticky left-0 z-10 backdrop-blur-md">المعايير</th>
                                    {hotels.map(hotel => (
                                        <th key={hotel.id} className="p-8 min-w-[280px] relative group">
                                            <button
                                                onClick={() => toggleCompare(hotel.id)}
                                                className="absolute top-4 left-4 p-2 bg-slate-100 text-slate-400 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 hover:text-rose-500"
                                            >
                                                <X size={16} />
                                            </button>
                                            <div className="space-y-4">
                                                <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-lg mx-auto">
                                                    <img src={hotel.image} className="w-full h-full object-cover" alt={hotel.name} />
                                                </div>
                                                <h3 className="text-xl font-black text-text line-clamp-1">{hotel.name}</h3>
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className="px-3 py-1 bg-gold-50 text-gold rounded-full text-[10px] font-black">{hotel.city === 'makkah' ? 'مكة المكرمة' : 'المدينة المنورة'}</span>
                                                    <div className="flex items-center gap-1 text-gold">
                                                        <Shield size={12} fill="currentColor" />
                                                        <span className="text-[10px] font-black">موثوق</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </th>
                                    ))}
                                    {/* Empty Slots */}
                                    {Array.from({ length: Math.max(0, 2 - hotels.length) }).map((_, i) => (
                                        <th key={i} className="p-8 min-w-[280px] border-l border-slate-50">
                                            <div className="aspect-[4/3] rounded-3xl border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-300">
                                                <button
                                                    onClick={() => navigate('/hotels')}
                                                    className="flex flex-col items-center gap-2 hover:text-gold transition-colors"
                                                >
                                                    <Scale size={32} />
                                                    <span className="text-xs font-bold">أضف فندق آخر</span>
                                                </button>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonRows.map((row, idx) => (
                                    <tr key={row.key} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                                        <td className="p-8 text-right font-black text-text text-sm border-b border-slate-50 sticky left-0 z-10 bg-inherit backdrop-blur-md">{row.label}</td>
                                        {hotels.map(hotel => (
                                            <td key={hotel.id} className="p-8 border-b border-slate-50">
                                                {row.render(hotel)}
                                            </td>
                                        ))}
                                        {Array.from({ length: Math.max(0, 2 - hotels.length) }).map((_, i) => (
                                            <td key={i} className="p-8 border-b border-slate-50 border-l border-slate-50">
                                                <span className="text-slate-200">—</span>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <button
                            onClick={clearCompare}
                            className="bg-white border border-slate-200 text-slate-400 px-8 py-4 rounded-2xl font-black hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm"
                        >
                            تفريغ القائمة
                        </button>
                        <div className="flex items-center gap-4">
                            <span className="text-slate-400 font-bold text-sm">أفضل الخيارات المختارة لك في 2026.</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CompareHotels;
