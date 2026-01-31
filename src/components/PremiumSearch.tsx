import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch, formatDateArabic } from '../contexts/SearchContext';
import { Star, MapPin, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, AlertCircle, X, Search, Sparkles, Wifi, Utensils, Car, Coffee, Shield, Globe, Compass, ChevronDown, ChevronUp, Building, Plus, Minus } from 'lucide-react';
import { DESTINATIONS, TOP_DESTINATIONS } from '../constants/destinations';
import { useFrontendHotels } from '../hooks/useFrontendHotels';

type SheetType = 'none' | 'destination' | 'dates' | 'guests';

interface PremiumSearchProps {
    onSearch?: (criteria: { city: string; checkIn: Date | null; checkOut: Date | null; guests: { adults: number; children: number; rooms: number } }) => void;
    className?: string;
    initialCity?: string;
    hideAiToggle?: boolean;
}

const PremiumSearch: React.FC<PremiumSearchProps> = ({ onSearch, className = "", initialCity = "", hideAiToggle = false }) => {
    const { searchData, updateSearch } = useSearch();

    // Map context state
    const adults = searchData.adults;
    const children = searchData.children;
    const rooms = searchData.rooms;
    const destination = searchData.destination;
    const checkIn = searchData.checkIn;
    const checkOut = searchData.checkOut;

    // Setters
    const setAdults = (v: number) => updateSearch({ adults: v });
    const setChildren = (v: number) => updateSearch({ children: v });
    const setRooms = (v: number) => updateSearch({ rooms: v });
    const setDestination = (v: string) => updateSearch({ destination: v });

    const [activeSheet, setActiveSheet] = useState<SheetType>('none');
    const [isAiMode, setIsAiMode] = useState(false);
    const [aiQuery, setAiQuery] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Calendar Navigation State
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const handleNextMonth = () => {
        // Safe month navigation: Always set date to 1 to avoid "Feb 30" issues
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handlePrevMonth = () => {
        // Safe month navigation
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const isDaySelected = (date: Date) => {
        if (checkIn && date.toDateString() === checkIn.toDateString()) return true;
        if (checkOut && date.toDateString() === checkOut.toDateString()) return true;
        return false;
    };

    const isDayInRange = (date: Date) => {
        if (!checkIn || !checkOut) return false;
        const d = new Date(date.setHours(0, 0, 0, 0));
        const start = new Date(new Date(checkIn).setHours(0, 0, 0, 0));
        const end = new Date(new Date(checkOut).setHours(0, 0, 0, 0));
        return d > start && d < end;
    };

    const handleDaySelect = (date: Date) => {
        const d = new Date(date.setHours(0, 0, 0, 0));
        if (!checkIn || (checkIn && checkOut)) {
            updateSearch({ checkIn: d, checkOut: null });
        } else if (d > checkIn) {
            updateSearch({ checkIn, checkOut: d });
        } else {
            updateSearch({ checkIn: d, checkOut: null });
        }
    };

    const containerRef = useRef<HTMLDivElement>(null);
    const searchBarRef = useRef<HTMLDivElement>(null);

    const handleFieldClick = (type: SheetType) => {
        setActiveSheet(type === activeSheet ? 'none' : type);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setActiveSheet('none');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const closeSheet = () => setActiveSheet('none');

    const handleSearch = () => {
        if (!destination) {
            setActiveSheet('destination');
            alert("يرجى اختيار الوجهة أولاً للبدء بالبحث");
            return;
        }

        if (onSearch) {
            onSearch({
                city: destination,
                checkIn,
                checkOut,
                guests: { adults, children, rooms }
            });
        }
        closeSheet();
    };

    const CalendarMonth = ({ date }: { date: Date }) => {
        const monthYear = date.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
        const daysCount = getDaysInMonth(date);
        const firstDay = getFirstDayOfMonth(date);
        const weekdays = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysCount; i++) days.push(new Date(date.getFullYear(), date.getMonth(), i));

        return (
            <div className="flex-1 min-w-[280px]">
                <h3 className="text-center font-black text-text mb-6 text-sm">{monthYear}</h3>
                <div className="grid grid-cols-7 mb-2">
                    {weekdays.map(d => <div key={d} className="text-center text-[10px] font-black text-slate-400 py-1">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-y-1">
                    {days.map((dayDate, idx) => {
                        if (!dayDate) return <div key={`p-${idx}`} />;
                        const selected = isDaySelected(dayDate);
                        const inRange = isDayInRange(dayDate);
                        const past = dayDate < new Date(new Date().setHours(0, 0, 0, 0));
                        return (
                            <div key={dayDate.getTime()} className={`relative py-1 ${inRange ? 'bg-gold/5' : ''}`}>
                                <button
                                    disabled={past}
                                    onClick={(e) => { e.stopPropagation(); handleDaySelect(dayDate); }}
                                    className={`relative z-10 w-full aspect-square flex items-center justify-center text-xs font-bold rounded-xl transition-all ${selected ? 'bg-gold text-white shadow-lg scale-110' : 'text-slate-700 hover:bg-slate-100'} ${inRange ? 'text-gold font-black' : ''} ${past ? 'opacity-20 cursor-not-allowed' : ''}`}
                                >
                                    {dayDate.getDate()}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const CalendarUI = () => {
        // Safe calculation for the second month view
        const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        return (
            <div className="relative">
                <div className="absolute top-0 left-0 right-0 flex justify-between z-20 pointer-events-none">
                    <button onClick={(e) => { e.stopPropagation(); handlePrevMonth(); }} className="p-2 bg-white rounded-full shadow-md border border-slate-100 text-slate-400 hover:text-gold transition-all pointer-events-auto active:scale-90"><ChevronRight size={16} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleNextMonth(); }} className="p-2 bg-white rounded-full shadow-md border border-slate-100 text-slate-400 hover:text-gold transition-all pointer-events-auto active:scale-90"><ChevronLeft size={16} /></button>
                </div>
                <div className="flex flex-col lg:flex-row gap-10 pt-4">
                    <CalendarMonth date={currentMonth} />
                    <div className="hidden lg:block w-px bg-slate-100 self-stretch my-10"></div>
                    <div className="hidden lg:block"><CalendarMonth date={nextMonth} /></div>
                </div>
            </div>
        );
    };

    const DestinationList = () => {
        const [search, setSearch] = useState('');
        const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
        const navigate = useNavigate();

        // Fetch all hotels for smart search
        const { hotels } = useFrontendHotels();

        const filteredTop = TOP_DESTINATIONS.filter(city => city.includes(search));

        const filteredHotels = search.trim().length >= 2
            ? hotels.filter(hotel =>
                hotel.name.includes(search) ||
                (hotel.nameEn && hotel.nameEn.toLowerCase().includes(search.toLowerCase()))
            ).slice(0, 5) // Limit to top 5 matches
            : [];

        const filteredDestinations = DESTINATIONS.map(country => ({
            ...country,
            cities: country.cities.filter(city =>
                city.includes(search) || country.name.includes(search)
            )
        })).filter(country => country.cities.length > 0);

        const hasResults = filteredTop.length > 0 || filteredDestinations.length > 0 || filteredHotels.length > 0;

        // Auto-expand if searching
        useEffect(() => {
            if (search.trim() !== '') {
                setExpandedCountry(null);
            }
        }, [search]);

        return (
            <div className="space-y-6">
                {/* Search Header */}
                <div className="sticky top-0 bg-white pb-4 z-10 border-b border-slate-50 mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="ابحث عن فندق، مدينة أو دولة..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                            className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-5 py-4 text-xs font-bold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-gold transition-all"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                            <Search size={16} />
                        </div>
                    </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto no-scrollbar scroll-smooth space-y-6">
                    {hasResults ? (
                        <>
                            {/* Matching Hotels (Smart Results) */}
                            {filteredHotels.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <Building size={12} className="text-gold" />
                                        الفنادق المقترحة
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {filteredHotels.map(hotel => (
                                            <button
                                                key={hotel.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    closeSheet();
                                                    navigate(`/hotel/${hotel.slug}`);
                                                }}
                                                className="w-full text-right p-4 rounded-[1.8rem] transition-all flex items-center justify-between group bg-white/50 hover:bg-white border border-transparent backdrop-blur-sm shadow-sm hover:shadow-md"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <span className="block font-black text-sm group-hover:text-gold transition-colors">{hotel.name}</span>
                                                        <span className="block text-[10px] font-bold text-slate-400">{hotel.city}</span>
                                                    </div>
                                                    <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-100 group-hover:border-gold/30 transition-all shrink-0">
                                                        {hotel.image ? (
                                                            <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gold">
                                                                <Building size={16} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-gold/10 text-slate-400 group-hover:text-gold transition-all">
                                                        <ChevronLeft size={14} />
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Top Destinations - Makkah & Madinah first (Always visible if match) */}
                            {filteredTop.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <Compass size={12} className="text-gold" />
                                        أغلب المدن حجزاً
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {filteredTop.map(city => (
                                            <button
                                                key={city}
                                                onClick={(e) => { e.stopPropagation(); setDestination(city); closeSheet(); }}
                                                className={`w-full text-right p-4 rounded-[1.8rem] transition-all flex items-center justify-between group ${destination === city ? 'bg-gold text-white shadow-lg' : 'bg-white/50 hover:bg-white border border-transparent backdrop-blur-sm'}`}
                                            >
                                                <div className={`p-2 rounded-xl ${destination === city ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-gold/10'}`}><MapPin size={14} className={destination === city ? 'text-white' : 'text-gold'} /></div>
                                                <span className="font-black text-sm">{city}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Countries List */}
                            <div className="space-y-2">
                                {filteredDestinations.map(country => {
                                    const isExpanded = expandedCountry === country.code || (search.trim() !== '' && !filteredHotels.length);
                                    return (
                                        <div key={country.code} className="space-y-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setExpandedCountry(expandedCountry === country.code ? null : country.code); }}
                                                className={`w-full flex items-center justify-between p-4 rounded-[1.5rem] transition-all border ${expandedCountry === country.code ? 'bg-slate-50 border-gold/20' : 'bg-white border-transparent hover:bg-slate-50'}`}
                                            >
                                                <div className="text-slate-400">
                                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-black text-sm text-secondary">{country.name}</span>
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <Globe size={14} className="text-gold" />
                                                    </div>
                                                </div>
                                            </button>

                                            {isExpanded && (
                                                <div className="grid grid-cols-1 gap-2 pr-4 border-r-2 border-slate-50 mr-4 animate-premium-popup">
                                                    {country.cities.map(city => (
                                                        <button
                                                            key={city}
                                                            onClick={(e) => { e.stopPropagation(); setDestination(city); closeSheet(); }}
                                                            className={`w-full text-right p-4 rounded-[1.8rem] transition-all flex items-center justify-between group ${destination === city ? 'bg-gold text-white shadow-lg' : 'bg-white/50 hover:bg-white border border-transparent backdrop-blur-sm'}`}
                                                        >
                                                            <div className={`p-2 rounded-xl ${destination === city ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-gold/10'}`}><MapPin size={14} className={destination === city ? 'text-white' : 'text-gold'} /></div>
                                                            <span className="font-black text-sm">{city}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <Search size={24} />
                            </div>
                            <p className="text-xs font-bold text-slate-400">عذراً، لم نجد ما تبحث عنه</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const Counter = ({ label, subLabel, value, setter, min = 0 }: { label: string, subLabel?: string, value: number, setter: (v: number) => void, min?: number }) => (
        <div className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-md rounded-[2rem] border border-white/20 mb-3 transition-all hover:bg-white hover:border-gold/30">
            <div className="flex items-center gap-4">
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setter(value + 1); }} className="w-10 h-10 rounded-full bg-primary shadow-lg flex items-center justify-center text-white hover:bg-emerald-700 active:scale-90 transition-all"><Plus size={16} /></button>
                <span className="font-black text-text text-xl w-6 text-center">{value}</span>
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setter(Math.max(min, value - 1)); }} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 border border-slate-200 hover:text-gold active:scale-90 transition-all"><Minus size={16} /></button>
            </div>
            <div className="flex flex-col text-right">
                <span className="font-black text-text text-sm">{label}</span>
                {subLabel && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{subLabel}</span>}
            </div>
        </div>
    );

    const PopupWrapper = ({ type, isOpen, children: content, width = "380px" }: { type: SheetType, isOpen: boolean, children: React.ReactNode, width?: string }) => {
        if (!isOpen) return null;
        return (
            <div className="hidden lg:block absolute z-[900] top-[110%] left-1/2 -translate-x-1/2" style={{ width }}>
                <div className="animate-premium-popup">
                    <div className="bg-white rounded-[2rem] p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100">
                        <div className="relative">{content}</div>
                        <div className="mt-6 flex justify-center"><button onClick={(e) => { e.stopPropagation(); closeSheet(); }} className="bg-primary text-white px-10 py-3 rounded-full font-black text-xs hover:bg-gold active:scale-90 transition-all shadow-lg">تأكيد</button></div>
                    </div>
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-white"></div>
                </div>
            </div>
        );
    };

    const BottomSheet = ({ type, isOpen, children: content }: { type: SheetType, isOpen: boolean, children: React.ReactNode }) => (
        <div className="lg:hidden">
            <div className={`fixed inset-0 bg-primary/40 z-[2000] transition-all duration-700 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={closeSheet} />
            <div className={`fixed bottom-0 left-0 right-0 z-[2100] bg-white rounded-t-[4rem] shadow-[0_-20px_80px_rgba(0,0,0,0.1)] transition-all transform px-6 pb-12 pt-4 ${isOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-full scale-[0.9] opacity-0'}`}>
                <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mb-10" onClick={closeSheet} />
                <div className="max-w-xl mx-auto">{content}<button onClick={closeSheet} className="w-full bg-primary text-gold font-black py-5 rounded-full text-lg mt-10 active:scale-95 transition-all">تأكيد والبدء</button></div>
            </div>
        </div>
    );

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-3 border border-white/60 shadow-xl">
                <div className="flex flex-col lg:flex-row gap-2">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {/* Destination */}
                        <div className="relative">
                            <div data-field="destination" onClick={() => handleFieldClick('destination')} className={`bg-white/60 p-3 rounded-[2rem] flex items-center gap-3 cursor-pointer hover:bg-white transition-all border border-white/40 ${activeSheet === 'destination' ? 'ring-2 ring-gold' : ''}`}>
                                <div className="p-2 bg-slate-50 text-gold rounded-xl"><MapPin size={18} /></div>
                                <div className="text-right flex-1 overflow-hidden">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">الوجهة</p>
                                    <p className="text-xs font-black text-text truncate">{destination || "إلى أين ستذهب؟"}</p>
                                </div>
                            </div>
                            <PopupWrapper type="destination" isOpen={activeSheet === 'destination'}><DestinationList /></PopupWrapper>
                        </div>

                        {/* Dates */}
                        <div className="relative">
                            <div data-field="dates" onClick={() => handleFieldClick('dates')} className={`bg-white/60 p-3 rounded-[2rem] flex items-center gap-3 cursor-pointer hover:bg-white transition-all border border-white/40 ${activeSheet === 'dates' ? 'ring-2 ring-gold' : ''}`}>
                                <div className="p-2 bg-slate-50 text-gold rounded-xl"><SlidersHorizontal size={18} /></div>
                                <div className="text-right flex-1 overflow-hidden">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">التاريخ</p>
                                    <p className="text-xs font-black text-text truncate">
                                        {checkIn ? `${checkIn.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })} - ${checkOut ? checkOut.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' }) : '...'}` : "اختر التاريخ"}
                                    </p>
                                </div>
                            </div>
                            <PopupWrapper type="dates" isOpen={activeSheet === 'dates'} width="720px"><CalendarUI /></PopupWrapper>
                        </div>

                        {/* Guests */}
                        <div className="relative">
                            <div data-field="guests" onClick={() => handleFieldClick('guests')} className={`bg-white/60 p-3 rounded-[2rem] flex items-center gap-3 cursor-pointer hover:bg-white transition-all border border-white/40 ${activeSheet === 'guests' ? 'ring-2 ring-gold' : ''}`}>
                                <div className="p-2 bg-slate-50 text-gold rounded-xl"><ArrowUpDown size={18} /></div>
                                <div className="text-right flex-1 overflow-hidden">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">الضيوف الغرف</p>
                                    <p className="text-xs font-black text-text truncate">{adults} بالغ، {children} طفل</p>
                                </div>
                            </div>
                            <PopupWrapper type="guests" isOpen={activeSheet === 'guests'}>
                                <div className="space-y-2">
                                    <Counter label="بالغين" value={adults} setter={setAdults} />
                                    <Counter label="أطفال" value={children} setter={setChildren} />
                                    <div className="pt-2 border-t border-slate-100"><Counter label="عدد الغرف" value={rooms} setter={setRooms} /></div>
                                </div>
                            </PopupWrapper>
                        </div>
                    </div>
                    <button onClick={handleSearch} className="bg-primary text-white font-black px-8 py-3 rounded-[2rem] hover:bg-gold transition-all shadow-lg text-sm">تطبيق البحث</button>
                </div>
            </div>

            <BottomSheet type="destination" isOpen={activeSheet === 'destination'}><DestinationList /></BottomSheet>
            <BottomSheet type="dates" isOpen={activeSheet === 'dates'}><CalendarUI /></BottomSheet>
            <BottomSheet type="guests" isOpen={activeSheet === 'guests'}>
                <Counter label="بالغين" value={adults} setter={setAdults} />
                <Counter label="أطفال" value={children} setter={setChildren} />
                <Counter label="عدد الغرف" value={rooms} setter={setRooms} />
            </BottomSheet>
        </div>
    );
};

export default PremiumSearch;
