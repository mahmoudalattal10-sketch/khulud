import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Hotel as ApiHotel } from '../services/api';
import { Hotel as LegacyHotel } from '../types';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { getImageUrl } from '../utils/imageHelper';
import { Star, MapPin, Heart, Scale, Shield, CheckCircle2, ChevronLeft, Wifi, Car, Waves, Dumbbell, Utensils, Plane, Sparkles, Bell, Gamepad2, Briefcase, Shirt, UserCheck, Coffee, Key, Eye, Bus, Info, Building, Store, MessageCircle } from 'lucide-react';

type MasterHotel = (ApiHotel | LegacyHotel) & {
  slug?: string;
  displayPrice?: string | number;
  basePrice?: number;
  type?: string;
};

// Amenity mapping helper matching admin dashboard
const getAmenityData = (id: string) => {
  const mapping: Record<string, { label: string; icon: any }> = {
    'wifi': { label: 'واي فاي مجاني', icon: <Wifi size={14} /> },
    'parking': { label: 'مواقف سيارات', icon: <Car size={14} /> },
    'pool': { label: 'مسبح فندقي', icon: <Waves size={14} /> },
    'gym': { label: 'نادي رياضي', icon: <Dumbbell size={14} /> },
    'food': { label: 'مطعم فاخر', icon: <Utensils size={14} /> },
    'shuttle': { label: 'نقل للحرم 24/7', icon: <Plane size={14} /> },
    'spa': { label: 'مركز سبا وعافية', icon: <Sparkles size={14} /> },
    'room_service': { label: 'خدمة غرف 24/7', icon: <Bell size={14} /> },
    'kids_club': { label: 'نادي أطفال', icon: <Gamepad2 size={14} /> },
    'business': { label: 'مركز أعمال', icon: <Briefcase size={14} /> },
    'laundry': { label: 'خدمة غسيل', icon: <Shirt size={14} /> },
    'concierge': { label: 'كونسيرج', icon: <UserCheck size={14} /> },
    'cafe': { label: 'مقهى', icon: <Coffee size={14} /> },
    'valet': { label: 'صف سيارات', icon: <Key size={14} /> }
  };
  return mapping[id.toLowerCase()] || { label: id, icon: <CheckCircle2 size={14} /> };
};

interface HotelCardProps {
  hotel: MasterHotel;
  compact?: boolean;
  offerMode?: boolean;
  index?: number;
}

const HotelCard: React.FC<HotelCardProps> = React.memo(({ hotel, compact = false, offerMode = false, index = 0 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toggleFavorite, isFavorite, toggleCompare, isInCompare } = useUserPreferences();

  // Debug logs removed

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  // Helper for cross-version price access
  const getPrice = () => {
    return hotel.displayPrice || (hotel as ApiHotel).basePrice || (hotel as LegacyHotel).price || 0;
  };

  // Helper to format date in Arabic
  const formatDateArabic = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' });
  };

  if (compact) {
    return (
      <div
        ref={cardRef}
        className={`flex gap-4 p-4 glass-surface rounded-[2.2rem] active:scale-[0.98] transition-all duration-500 cursor-pointer hover:border-gold/30 hover:shadow-xl group ${isVisible ? 'animate-ios-slide' : 'opacity-0'}`}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-inner">
          <img
            src={getImageUrl(hotel.image)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt={hotel.name}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/images/ui/logo.png'; // Verified Local Fallback
            }}
          />
        </div>
        <div className="flex flex-col justify-center text-right overflow-hidden flex-1">
          <h4 className="font-black text-text text-sm truncate group-hover:text-gold transition-colors duration-300">{hotel.name}</h4>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              <span className="text-gold font-black text-sm">{getPrice()}</span>
              <span className="text-[8px] font-black text-slate-300">ريال سعودي</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-400 text-[9px] font-bold">{hotel.distanceFromHaram}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/hotel/${hotel.slug || hotel.id}`} className={`block group ${offerMode ? 'h-full' : 'mb-8'}`}>
      <div
        ref={cardRef}
        className={`relative bg-white/40 backdrop-blur-xl rounded-[2.8rem] border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-700 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] hover:-translate-y-2 flex flex-col ${offerMode ? 'h-full' : 'md:flex-row'} gap-0 ${offerMode ? '' : 'md:gap-8'} p-4 ${isVisible ? 'animate-ios-slide' : 'opacity-0'}`}
        style={{ animationDelay: `${(index % 3) * 150}ms` }}
      >
        {/* 1. IMAGE SECTION (Adaptive) */}
        <div className={`w-full ${offerMode ? 'aspect-[4/3] h-[200px]' : 'md:w-[380px] lg:w-[440px] aspect-[4/3] md:aspect-auto md:h-[320px]'} rounded-[2.2rem] overflow-hidden relative shrink-0 shadow-2xl`}>
          <img
            src={getImageUrl(hotel.image)}
            alt={hotel.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/images/ui/logo.png'; // Verified Local Fallback
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>


          <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
            <button
              onClick={(e) => handleAction(e, () => toggleFavorite(hotel.id))}
              className={`w-9 h-9 rounded-full backdrop-blur-md border shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${isFavorite(hotel.id) ? 'bg-rose-500 border-rose-400 text-white' : 'bg-white/30 border-white/40 text-white hover:bg-white hover:text-rose-500'}`}
            >
              <Heart size={18} className={isFavorite(hotel.id) ? 'fill-current' : ''} />
            </button>
            <button
              onClick={(e) => handleAction(e, () => toggleCompare(hotel.id))}
              className={`w-9 h-9 rounded-full backdrop-blur-md border shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${isInCompare(hotel.id) ? 'bg-gold border-gold text-white' : 'bg-white/30 border-white/40 text-white hover:bg-white hover:text-gold'}`}
            >
              <Scale size={18} />
            </button>
          </div>
        </div>

        {/* 2. CONTENT SECTION */}
        <div className="flex-1 py-4 md:py-6 px-2 md:px-0 flex flex-col justify-between text-right">
          <div>
            {/* TITLE & DESCRIPTION */}
            <div className="mb-6">
              <h3 className="text-2xl md:text-3xl lg:text-3xl font-black text-text leading-tight mb-3 group-hover:text-gold transition-colors duration-300 tracking-tight line-clamp-2">
                {hotel.name}
              </h3>
              <p className="text-slate-500 text-xs md:text-sm font-medium line-clamp-2 md:line-clamp-3 leading-relaxed opacity-80">
                {hotel.description || 'استمتع بإقامة استثنائية مع إطلالات ساحرة وخدمات فندقية متكاملة تلبي كافة احتياجاتك في قلب العاصمة المقدسة.'}
              </p>
            </div>

            {/* UNIFIED FEATURES & AMENITIES */}
            <div className="flex flex-wrap justify-start gap-2 mb-6">


              {/* Partial Availability Banner (Rich Design) */}
              {hotel.partialMatch && (() => {
                const meta = (hotel as any).rooms?.find((r: any) => r.partialMetadata)?.partialMetadata;
                if (meta) {
                  return (
                    <div className="w-full mb-4 bg-amber-50/80 border border-amber-100/50 p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-amber-500 shrink-0">
                          <Info size={20} />
                        </div>
                        <div>
                          <h5 className="text-[13px] font-black text-amber-900 leading-tight mb-0.5">متاح لفترة جزئية فقط</h5>
                          <p className="text-[11px] font-bold text-amber-700/80 mb-1">
                            المواعيد المتاحة: من {formatDateArabic(meta.availableFrom)} إلى {formatDateArabic(meta.availableTo)}
                          </p>
                          <p className="text-[10px] font-bold text-amber-600 hidden sm:block">
                            هل التاريخ لا يناسبك؟ تواصل معنا وسنوفر لك الغرفة المطلوبة.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(`https://wa.me/966553882445?text=${encodeURIComponent(`السلام عليكم، لم أجد التواريخ المناسبة في فندق ${hotel.name}، وأرغب في المساعدة لتوفير فترة أخرى.`)}`, '_blank');
                        }}
                        className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-2xl text-[11px] font-black hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 active:scale-95 whitespace-nowrap"
                      >
                        <MessageCircle size={16} />
                        اطلب فترتك الآن
                      </button>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Features / Badges Row */}
              <div className="flex flex-wrap items-center gap-2">
                {/* 1. Rating Badge (Moved Inside) */}
                <div className="flex items-center gap-1 px-3 py-2 bg-slate-50/40 border border-slate-100/50 rounded-xl transition-all duration-300 group-hover:bg-white group-hover:border-gold/20 hover:scale-105">
                  {[...Array(Math.round(Number(hotel.rating || 5)))].map((_, i) => (
                    <span key={i} className="text-gold">
                      <Star size={12} fill="currentColor" />
                    </span>
                  ))}
                </div>


                {/* 2. View Badge */}
                {hotel.view && hotel.view !== 'بدون إطلالة محددة' && (
                  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-50/40 border border-slate-100/50 rounded-xl text-[10px] md:text-[11px] font-black text-slate-500 transition-all duration-300 group-hover:bg-white group-hover:border-gold/20 hover:scale-105">
                    <span className="text-gold">
                      <Eye size={13} />
                    </span>
                    {hotel.view === 'Prophet Mosque View' ? 'إطلالة على المسجد النبوي' :
                      hotel.view === 'Kaaba View' ? 'إطلالة على الكعبة' :
                        hotel.view === 'Haram View' ? 'إطلالة على الحرم' : hotel.view}
                  </div>
                )}

                {/* 3. Distance Badge */}
                <div className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-50/40 border border-slate-100/50 rounded-xl text-[10px] md:text-[11px] font-black text-slate-500 transition-all duration-300 group-hover:bg-white group-hover:border-gold/20 hover:scale-105">
                  <span className="text-gold">
                    <MapPin size={13} />
                  </span>
                  {hotel.distanceFromHaram}
                </div>

                {/* 3.5. Free Transport Badge */}
                {hotel.hasFreeTransport && (
                  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-50/40 border border-slate-100/50 rounded-xl text-[10px] md:text-[11px] font-black text-slate-500 transition-all duration-300 group-hover:bg-white group-hover:border-gold/20 hover:scale-105">
                    <span className="text-gold">
                      <Bus size={13} />
                    </span>
                    توصيل مجاني للحرم
                  </div>
                )}

                {/* 4. Dynamic Amenities */}
                {React.useMemo(() => {
                  return [...(hotel.amenities || [])].sort(() => Math.random() - 0.5);
                }, [hotel.id]).slice(0, 3).map((amenityId, i) => {
                  const { label, icon } = getAmenityData(amenityId);
                  return (
                    <div key={i} className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-50/40 border border-slate-100/50 rounded-xl text-[10px] md:text-[11px] font-black text-slate-500 transition-all duration-300 group-hover:bg-white group-hover:border-gold/20 hover:scale-105">
                      <span className="text-gold">
                        {React.cloneElement(icon, { size: 13 })}
                      </span>
                      {label}
                    </div>
                  );
                })}

                {/* More Indicator */}
                {(hotel.amenities?.length || 0) > 3 && (
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400">
                    <span>+{(hotel.amenities?.length || 0) - 3}</span>
                    <span>مزيد</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100/50 pt-5 mt-auto gap-4">
            {/* REDESIGNED PRICE SECTION */}
            <div className="flex-1 flex flex-col items-start gap-1">
              <span className="text-[10px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest">تبدأ من</span>
              <div className="flex items-baseline gap-1 flex-wrap">
                <span className="text-3xl md:text-4xl font-black text-gold tracking-tighter tabular-nums">
                  {getPrice().toLocaleString()}
                </span>
                <span className="text-[10px] md:text-xs font-black text-slate-400 whitespace-nowrap">ر.س / ليلة</span>
              </div>
            </div>

            {/* CTA */}
            <button className="w-auto flex items-center justify-center gap-2 bg-slate-700 text-white px-5 md:pl-8 md:pr-12 py-3 md:py-4 rounded-[1.2rem] md:rounded-[1.8rem] font-black text-[11px] md:text-sm shadow-xl transition-all duration-500 hover:bg-slate-800 hover:shadow-slate-700/30 hover:scale-[1.03] active:scale-95 group/btn relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              <span>{offerMode ? 'تفاصيل' : 'عرض التفاصيل'}</span>
              <ChevronLeft size={14} className="translate-x-0 group-hover/btn:-translate-x-2 transition-transform duration-300 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link >
  );
});

export default HotelCard;
