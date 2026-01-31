import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { HotelsAPI, Hotel } from '../services/api';
import { X, Scale, ArrowLeft, Trash2 } from 'lucide-react';

const ComparisonBar: React.FC = () => {
    const { compareList, toggleCompare, clearCompare } = useUserPreferences();
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotels = async () => {
            if (compareList.length === 0) {
                setHotels([]);
                return;
            }

            setIsLoading(true);
            try {
                // Fetch only missing hotels or all? 
                // For simplicity, let's fetch all currently in the list
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

    if (compareList.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 md:pb-8 pointer-events-none">
            <div className="max-w-4xl mx-auto pointer-events-auto">
                <div className="bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] p-4 md:p-6 flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-8 animate-in slide-in-from-bottom-10 duration-500">

                    {/* Header/Badge */}
                    <div className="hidden lg:flex flex-col gap-1 shrink-0">
                        <div className="flex items-center gap-2 text-gold font-black text-sm">
                            <Scale size={18} />
                            <span>مقارنة الفنادق</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">{compareList.length} من 4 فنادق مختارة</span>
                    </div>

                    {/* Selected Hotels List */}
                    <div className="flex flex-1 items-center gap-3 overflow-x-auto no-scrollbar py-1">
                        {isLoading && hotels.length === 0 ? (
                            <div className="flex gap-3">
                                {[1, 2].map(i => (
                                    <div key={i} className="w-16 h-16 rounded-2xl bg-slate-100 animate-pulse"></div>
                                ))}
                            </div>
                        ) : (
                            hotels.map(hotel => (
                                <div key={hotel.id} className="relative group shrink-0">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md transition-transform duration-300 group-hover:scale-105">
                                        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                                    </div>
                                    <button
                                        onClick={() => toggleCompare(hotel.id)}
                                        className="absolute -top-2 -left-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))
                        )}

                        {/* Empty Slots */}
                        {Array.from({ length: Math.max(0, 2 - compareList.length) }).map((_, i) => (
                            <div key={i} className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-200">
                                <Scale size={20} />
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={clearCompare}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-slate-400 font-bold text-sm hover:bg-slate-50 transition-colors"
                        >
                            <Trash2 size={18} />
                            <span className="md:hidden lg:inline">مسح الكل</span>
                        </button>

                        <button
                            onClick={() => navigate('/compare')}
                            disabled={compareList.length < 2}
                            className={`flex-[2] md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm shadow-xl transition-all duration-300 ${compareList.length >= 2
                                ? 'bg-gold text-white shadow-gold/20 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95'
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                }`}
                        >
                            <span>قارن بين {compareList.length} فنادق</span>
                            <ArrowLeft size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComparisonBar;
