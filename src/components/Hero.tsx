
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../contexts/SearchContext';
import { ChevronLeft, ChevronRight, MapPin, Search, Globe, Compass, ChevronDown, ChevronUp, Building, Plus, Minus } from 'lucide-react';
import { DESTINATIONS, TOP_DESTINATIONS } from '../constants/destinations';
import { useFrontendHotels } from '../hooks/useFrontendHotels';

type SheetType = 'none' | 'destination' | 'dates' | 'guests' | 'rooms';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { searchData, updateSearch } = useSearch();

  // Map context state to local variable names for UI
  const adults = searchData.adults;
  const children = searchData.children;
  const rooms = searchData.rooms;
  const destination = searchData.destination;

  // Setter helpers that update context
  const setAdults = (v: number) => updateSearch({ adults: v });
  const setChildren = (v: number) => updateSearch({ children: v });
  const setRooms = (v: number) => updateSearch({ rooms: v });
  const setDestination = (v: string) => updateSearch({ destination: v });

  // Local UI state
  const [activeSheet, setActiveSheet] = useState<SheetType>('none');

  // Calendar Navigation State
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleNextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  const handlePrevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isSelected = (date: Date) => {
    if (searchData.checkIn && date.toDateString() === searchData.checkIn.toDateString()) return true;
    if (searchData.checkOut && date.toDateString() === searchData.checkOut.toDateString()) return true;
    return false;
  };

  const isInRange = (date: Date) => {
    if (!searchData.checkIn || !searchData.checkOut) return false;
    // Normalize to compare only dates
    const d = new Date(date.setHours(0, 0, 0, 0));
    const start = new Date(new Date(searchData.checkIn).setHours(0, 0, 0, 0));
    const end = new Date(new Date(searchData.checkOut).setHours(0, 0, 0, 0));
    return d > start && d < end;
  };

  const handleDaySelect = (date: Date) => {
    const d = new Date(date.setHours(0, 0, 0, 0));
    if (!searchData.checkIn || (searchData.checkIn && searchData.checkOut)) {
      updateSearch({ checkIn: d, checkOut: null });
    } else if (d > searchData.checkIn) {
      updateSearch({ checkIn: searchData.checkIn, checkOut: d });
    } else {
      updateSearch({ checkIn: d, checkOut: null });
    }
  };

  const handleSearch = () => {
    if (!destination) {
      setActiveSheet('destination');
      alert("يرجى اختيار الوجهة أولاً للبدء بالبحث");
      return;
    }

    const params = new URLSearchParams();

    // Map Arabic display names to API values
    let cityValue = destination;
    const MAKKAH_VARIANTS = ['مكة المكرمة', 'مكه المكرمه', 'مكة', 'مكه', 'makkah'];
    const MADINAH_VARIANTS = ['المدينة المنورة', 'المدينه المنوره', 'المدينة', 'المدينه', 'madinah'];
    const JEDDAH_VARIANTS = ['جدة', 'جده', 'jeddah'];
    const RIYADH_VARIANTS = ['الرياض', 'riyadh'];

    if (MAKKAH_VARIANTS.includes(destination)) cityValue = 'makkah';
    else if (MADINAH_VARIANTS.includes(destination)) cityValue = 'madinah';
    else if (JEDDAH_VARIANTS.includes(destination)) cityValue = 'jeddah';
    else if (RIYADH_VARIANTS.includes(destination)) cityValue = 'riyadh';
    else if (destination === 'دبي' || destination.toLowerCase() === 'dubai') cityValue = 'dubai';
    else if (destination === 'القاهرة' || destination.toLowerCase() === 'cairo') cityValue = 'cairo';
    else if (destination === 'الدوحة' || destination.toLowerCase() === 'doha') cityValue = 'doha';
    else if (destination === 'جميع الفنادق' || destination === 'الكل') cityValue = 'all';

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (cityValue) params.append('city', cityValue);
    if (searchData.checkIn) params.append('checkIn', formatDate(searchData.checkIn));
    if (searchData.checkOut) params.append('checkOut', formatDate(searchData.checkOut));
    const totalGuests = (adults || 0) + (children || 0);
    if (totalGuests > 0) params.append('guests', totalGuests.toString());

    navigate(`/hotels?${params.toString()}`);
  };

  const handleFieldClick = (type: SheetType) => {
    setActiveSheet(type === activeSheet ? 'none' : type);
  };

  const closeSheet = () => setActiveSheet('none');

  const containerRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveSheet('none');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeSheet !== 'none') {
      document.body.classList.add('search-overlay-open');
      if (searchBarRef.current) {
        const yOffset = -150;
        const element = searchBarRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      document.body.classList.remove('search-overlay-open');
    }
  }, [activeSheet]);

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

            const selected = isSelected(dayDate);
            const inRange = isInRange(dayDate);
            const past = dayDate < new Date(new Date().setHours(0, 0, 0, 0));

            return (
              <div key={dayDate.getTime()} className={`relative py-1 ${inRange ? 'bg-gold/20' : ''} ${selected && dayDate.getTime() === searchData.checkIn?.getTime() ? 'rounded-r-full' : ''} ${selected && dayDate.getTime() === searchData.checkOut?.getTime() ? 'rounded-l-full' : ''}`}>
                <button
                  disabled={past}
                  onClick={(e) => { e.stopPropagation(); handleDaySelect(dayDate); }}
                  className={`relative z-10 w-full aspect-square flex items-center justify-center text-xs font-bold rounded-xl transition-all ${selected ? 'bg-gold text-white shadow-lg scale-110' : 'text-slate-700 hover:bg-slate-100'} ${inRange ? 'text-secondary font-black' : ''} ${past ? 'opacity-20 cursor-not-allowed' : ''}`}
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
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const nights = searchData.checkIn && searchData.checkOut
      ? Math.ceil((searchData.checkOut.getTime() - searchData.checkIn.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return (
      <div className="relative">
        <div className="text-right mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-black text-secondary">اختر التاريخ</h3>
              <p className="text-xs font-bold text-slate-400 mt-1">حدد موعد وصولك ومغادرتك</p>
            </div>
            {nights > 0 && (
              <div className="bg-gold/10 px-4 py-2 rounded-2xl border border-gold/20 animate-ios-fade-in">
                <span className="text-gold font-black text-sm">{nights} ليالي</span>
              </div>
            )}
          </div>
        </div>

        <div className="absolute top-16 left-0 right-0 flex justify-between z-20 pointer-events-none">
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

  const Counter = ({ label, subLabel, value, setter, min = 0 }: { label: string, subLabel?: string, value: number, setter: (v: number) => void, min?: number }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50/50 backdrop-blur-md rounded-[2rem] border border-slate-100/50 mb-3 transition-all hover:bg-white hover:border-gold/30">
      <div className="flex items-center gap-4">
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setter(value + 1); }} className="w-10 h-10 rounded-full bg-gold shadow-lg flex items-center justify-center text-white hover:bg-gold-dark active:scale-90 transition-all"><Plus size={18} /></button>
        <span className="font-black text-secondary text-xl w-6 text-center">{value}</span>
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setter(Math.max(min, value - 1)); }} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-gold active:scale-90 transition-all border border-slate-200"><Minus size={18} /></button>
      </div>
      <div className="flex flex-col text-right">
        <span className="font-black text-secondary text-sm">{label}</span>
        {subLabel && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{subLabel}</span>}
      </div>
    </div>
  );

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
        <div className="text-right">
          <h3 className="text-xl font-black text-secondary">اختر وجهتك</h3>
          <p className="text-xs font-bold text-slate-400 mt-1">نغطي أغلب فنادق العالم</p>
        </div>

        {/* Search Header */}
        <div className="sticky top-0 bg-white pb-2 z-10 border-b border-slate-50 mb-2">
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

        <div className="max-h-[350px] overflow-y-auto no-scrollbar scroll-smooth space-y-6 text-right" dir="rtl">
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
                        className="w-full text-right p-3 rounded-[2rem] transition-all flex items-center justify-between group bg-white/50 hover:bg-white border border-transparent hover:border-gold/10 backdrop-blur-sm shadow-sm hover:shadow-md active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="block font-black text-sm group-hover:text-gold transition-colors">{hotel.name}</span>
                            <span className="block text-[10px] font-bold text-slate-400">{hotel.city}</span>
                          </div>
                          <div className="w-12 h-12 rounded-[1.2rem] bg-slate-100 overflow-hidden border border-slate-100 group-hover:border-gold/30 transition-all shrink-0">
                            {hotel.image ? (
                              <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gold">
                                <Building size={18} />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-gold/10 text-slate-400 group-hover:text-gold transition-all">
                          <ChevronLeft size={14} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Destinations */}
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
                        className={`w-full text-right p-4 rounded-[1.8rem] transition-all flex items-center justify-between group active:scale-[0.97] ${destination === city ? 'bg-secondary text-white shadow-lg' : 'bg-white/50 hover:bg-white border border-transparent backdrop-blur-sm'}`}
                      >
                        <div className={`p-2 rounded-xl ${destination === city ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-gold/10'}`}>
                          <MapPin size={14} className={destination === city ? 'text-white' : 'text-gold'} />
                        </div>
                        <span className="font-black text-sm">{city}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Countries */}
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
                              className={`w-full text-right p-4 rounded-[1.8rem] transition-all flex items-center justify-between group active:scale-[0.97] ${destination === city ? 'bg-secondary text-white shadow-lg' : 'bg-white/50 hover:bg-white border border-transparent backdrop-blur-sm'}`}
                            >
                              <div className={`p-2 rounded-xl ${destination === city ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-gold/10'}`}>
                                <MapPin size={14} className={destination === city ? 'text-white' : 'text-gold'} />
                              </div>
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

  const PopupWrapper = ({ type, isOpen, children: content, width = "380px" }: { type: SheetType, isOpen: boolean, children: React.ReactNode, width?: string }) => {
    const [position, setPosition] = useState({ top: 0, centerX: 0 });
    useEffect(() => {
      if (isOpen) {
        const field = document.querySelector(`[data-field="${type}"]`);
        const container = containerRef.current;
        if (field && container) {
          const rect = field.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          setPosition({ top: rect.bottom - containerRect.top + 10, centerX: (rect.left + rect.width / 2) - containerRect.left });
        }
      }
    }, [isOpen, type]);
    if (!isOpen) return null;
    return (
      <div className="hidden lg:block absolute z-[900]" style={{ width, top: position.top, left: position.centerX, transform: 'translateX(-50%)' }}>
        <div className="animate-premium-popup">
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100">
            <div className="relative">{content}</div>
            <div className="mt-6 flex justify-center"><button onClick={(e) => { e.stopPropagation(); closeSheet(); }} className="bg-secondary text-white px-10 py-3 rounded-full font-black text-xs hover:bg-slate-800 active:scale-90 transition-all shadow-lg">تأكيد</button></div>
          </div>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-white"></div>
        </div>
      </div>
    );
  };

  const BottomSheet = ({ type, isOpen, children: content }: { type: SheetType, isOpen: boolean, children: React.ReactNode }) => (
    <div className="lg:hidden">
      <div
        className={`fixed inset-0 bg-slate-900/60 z-[2000] backdrop-blur-md transition-all duration-[400ms] ease-ios ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeSheet}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 z-[2100] bg-white rounded-t-[3.5rem] shadow-[0_-20px_80px_rgba(0,0,0,0.2)] transition-all duration-[500ms] ease-ios transform px-6 pb-12 pt-4 ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-full scale-[0.98] opacity-0'}`}
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-10 opacity-50" onClick={closeSheet} />
        <div className={`max-w-xl mx-auto ${isOpen ? 'stagger-entry active' : 'stagger-entry'}`}>
          {content}
          <button onClick={closeSheet} className="w-full bg-secondary text-white font-black py-5 rounded-[2rem] text-lg mt-10 shadow-2xl active:scale-90 transition-transform duration-300 ease-ios-spring">تأكيد والبدء</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20" ref={containerRef} id="search-section">
      {/* Background with Mesh Gradient and Studio Lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mesh-gradient-bg">
        <div className="studio-glow -top-[10%] -left-[10%] opacity-40"></div>
        <div className="studio-glow bottom-[10%] right-[0%] opacity-30" style={{ transform: 'rotate(180deg)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/80"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
        <div className="space-y-8 md:space-y-12">
          {/* Minimalist Professional Badge */}
          <div className="inline-flex items-center gap-3 bg-white/40 backdrop-blur-xl px-6 py-3 rounded-full border border-slate-200/50 text-gold-dark text-[10px] md:text-xs font-black tracking-[0.3em] uppercase shadow-sm mx-auto transition-transform hover:scale-105 duration-500 text-reveal">
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse shadow-[0_0_15px_#d6b372]"></span>
            ضيافة خلود النخبة 2026
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-secondary leading-[1.2] md:leading-[1.15] tracking-tight max-w-5xl mx-auto text-reveal" style={{ animationDelay: '0.2s' }}>
              <span className="block md:inline mb-1 md:mb-0">أهلاً بك في رحاب الفخامة..</span>
              <span className="block md:inline">ضيافة استثنائية تجمع بين </span>
              <span className="block md:inline text-gold mt-1 md:mt-0">الرقي والسكينة</span>
            </h1>
            <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-bold text-reveal mt-4 md:mt-6" style={{ animationDelay: '0.4s' }}>
              مع ضيافة خلود، نهتم بك وبأدق تفاصيل رحلتك، <br className="hidden md:block" /> لتستمتع بطمأنينة الحرم ورفاهية تليق بك.
            </p>
          </div>

          {/* Minimalist Glass Search Bar */}
          <div ref={searchBarRef} className="relative z-[500] mt-12 glass-search-bar rounded-[3.5rem] p-3 md:p-4 max-w-6xl mx-auto transition-all duration-700 text-reveal" style={{ animationDelay: '0.6s' }}>
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="relative active:scale-95 transition-transform duration-200 ease-ios">
                  <div data-field="destination" onClick={(e) => { e.stopPropagation(); handleFieldClick('destination'); }} className={`bg-slate-50/50 p-4 rounded-[2.5rem] flex items-center gap-4 group hover:bg-white hover:ring-1 hover:ring-gold/20 transition-all duration-300 border border-slate-100/50 cursor-pointer ${activeSheet === 'destination' ? 'ring-2 ring-gold bg-white shadow-md' : ''}`}>
                    <div className={`p-3 rounded-2xl shadow-sm transition-all duration-300 ${activeSheet === 'destination' ? 'bg-gold text-white' : 'bg-white text-gold group-hover:bg-gold group-hover:text-white group-hover:rotate-12'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                    <div className="text-right flex-1 overflow-hidden">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">الوجهة</p>
                      <p className={`text-sm transition-colors truncate ${destination ? 'text-text font-black' : 'text-slate-400 font-medium'}`}>{destination || "إلى أين ستذهب؟"}</p>
                    </div>
                  </div>
                </div>

                <div className="relative active:scale-95 transition-transform duration-200 ease-ios">
                  <div data-field="dates" onClick={(e) => { e.stopPropagation(); handleFieldClick('dates'); }} className={`bg-slate-50/50 p-4 rounded-[2.5rem] flex items-center gap-4 group hover:bg-white hover:ring-1 hover:ring-gold/20 transition-all duration-300 border border-slate-100/50 cursor-pointer ${activeSheet === 'dates' ? 'ring-2 ring-gold bg-white shadow-md' : ''}`}>
                    <div className={`p-3 rounded-2xl shadow-sm transition-all duration-300 ${activeSheet === 'dates' ? 'bg-gold text-white' : 'bg-white text-gold group-hover:bg-gold group-hover:text-white group-hover:-rotate-12'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                    <div className="text-right flex-1 overflow-hidden">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">التاريخ</p>
                      <p className={`text-sm transition-colors truncate ${searchData.checkIn ? 'text-text font-black' : 'text-slate-400 font-medium'}`}>
                        {searchData.checkIn ? (
                          <>
                            {searchData.checkIn.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
                            {searchData.checkOut ? ` - ${searchData.checkOut.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}` : ' ...'}
                          </>
                        ) : 'اختر التاريخ'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative active:scale-95 transition-transform duration-200 ease-ios">
                  <div data-field="guests" onClick={(e) => { e.stopPropagation(); handleFieldClick('guests'); }} className={`bg-slate-50/50 p-4 rounded-[2.5rem] flex items-center gap-4 group hover:bg-white hover:ring-1 hover:ring-gold/20 transition-all duration-300 border border-slate-100/50 cursor-pointer ${activeSheet === 'guests' ? 'ring-2 ring-gold bg-white shadow-md' : ''}`}>
                    <div className={`p-3 rounded-2xl shadow-sm transition-all duration-300 ${activeSheet === 'guests' ? 'bg-gold text-white' : 'bg-white text-gold group-hover:bg-gold group-hover:text-white group-hover:scale-110'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div>
                    <div className="text-right flex-1 overflow-hidden">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">الضيوف والغرف</p>
                      <p className={`text-sm transition-colors truncate ${adults > 0 || rooms > 0 ? 'text-text font-black' : 'text-slate-400 font-medium'}`}>
                        {adults > 0 ? `${adults} بالغ` : ''}{children > 0 ? `، ${children} طفل` : ''}{rooms > 0 ? `، ${rooms} غرفة` : adults === 0 && children === 0 ? 'عدد الضيوف والغرف' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="bg-secondary text-white font-black px-12 py-5 lg:py-4 rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] hover:bg-[#1e293b] transition-all text-lg tracking-tight active:scale-95"
              >
                بحث ذكي
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomSheet type="destination" isOpen={activeSheet === 'destination'}><DestinationList /></BottomSheet>
      <BottomSheet type="dates" isOpen={activeSheet === 'dates'}><CalendarUI /></BottomSheet>
      <BottomSheet type="guests" isOpen={activeSheet === 'guests'}>
        <div className="text-right mb-6">
          <h3 className="text-xl font-black text-secondary">الضيوف والغرف</h3>
          <p className="text-xs font-bold text-slate-400 mt-1">حدد تفاصيل إقامتك بدقة</p>
        </div>
        <Counter label="البالغين" subLabel="أكبر من 11 سنة" value={adults} setter={setAdults} min={1} />
        <Counter label="الأطفال" subLabel="تحت سن 11 سنة" value={children} setter={setChildren} />
        <Counter label="الغرف" value={rooms} setter={setRooms} min={1} />
      </BottomSheet>

      <PopupWrapper type="destination" isOpen={activeSheet === 'destination'}><DestinationList /></PopupWrapper>
      <PopupWrapper type="dates" isOpen={activeSheet === 'dates'} width="720px"><CalendarUI /></PopupWrapper>
      <PopupWrapper type="guests" isOpen={activeSheet === 'guests'}>
        <div className="text-right mb-6">
          <h3 className="text-xl font-black text-secondary">الضيوف والغرف</h3>
          <p className="text-xs font-bold text-slate-400 mt-1">حدد تفاصيل إقامتك بدقة</p>
        </div>
        <Counter label="البالغين" subLabel="أكبر من 11 سنة" value={adults} setter={setAdults} min={1} />
        <Counter label="الأطفال" subLabel="تحت سن 11 سنة" value={children} setter={setChildren} />
        <Counter label="الغرف" value={rooms} setter={setRooms} min={1} />
      </PopupWrapper>
    </div>
  );
};

export default Hero;
