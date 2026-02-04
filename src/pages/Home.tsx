
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../features/search/components/Hero';
import MapSection from '../features/hotels/components/MapSection';
import HotelCard from '../features/hotels/components/HotelCard';
import { HotelsAPI, Hotel } from '../services/api';
import RevealOnScroll from '../features/ui/RevealOnScroll';
import HotelCardSkeleton from '../features/hotels/components/HotelCardSkeleton';

const Home: React.FC = () => {
  const [activeHotel, setActiveHotel] = useState<Hotel | undefined>(undefined);
  const [hoveredHotel, setHoveredHotel] = useState<Hotel | undefined>(undefined);
  const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([]);
  const [mapHotels, setMapHotels] = useState<Hotel[]>([]); // [NEW] State for map hotels
  const [activeCityTab, setActiveCityTab] = useState<'all' | 'makkah' | 'madinah'>('all'); // [NEW] City Tab State
  const [isLoading, setIsLoading] = useState(true); // [NEW] Loading State
  const scrollRef = useRef<HTMLDivElement>(null);
  const testimonialsScrollRef = useRef<HTMLDivElement>(null); // [NEW] Ref for testimonials carousel
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // Fetch All Hotels for Map
    const fetchAllHotels = async () => {
      try {
        const response = await HotelsAPI.getAll();
        if (response.success && response.data) {
          // Filter visible hotels
          const visibleHotels = response.data
            .filter((h: any) => h.isVisible !== false)
            .map((h: any) => ({
              ...h,
              price: h.price || h.basePrice || 0,
              coords: typeof h.coords === 'string'
                ? h.coords.split(',').map(Number)
                : (Array.isArray(h.coords) ? h.coords : [21.4225, 39.8262])
            }));
          console.log("DEBUG: Visible Hotels for Map:", visibleHotels);
          setMapHotels(visibleHotels);
        }
      } catch (error) {
        console.error("Failed to fetch hotels", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch Featured Hotels
    const fetchFeaturedHotels = async () => {
      const response = await HotelsAPI.getFeatured();
      if (response.success && response.data) {
        setFeaturedHotels(response.data);
      }
    };

    fetchAllHotels();
    fetchFeaturedHotels();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    revealRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // 🎯 Scroll Trigger for Destination Cards (Mobile/Tablet Experience)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active-card');
          } else {
            entry.target.classList.remove('active-card');
          }
        });
      },
      { threshold: 0.6 } // Trigger when 60% of the card is visible
    );

    const cards = document.querySelectorAll('.destination-card');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const scrollManual = (direction: 'left' | 'right', target: 'hotels' | 'testimonials' = 'hotels') => {
    const ref = target === 'hotels' ? scrollRef : testimonialsScrollRef;
    if (ref.current) {
      const cardElement = ref.current.querySelector('.snap-center');
      if (cardElement) {
        const cardWidth = cardElement.clientWidth;
        const gap = window.innerWidth < 768 ? 16 : 32;
        const scrollAmount = cardWidth + gap;
        ref.current.scrollBy({
          left: direction === 'right' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  const addToRevealRefs = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  // Calculate counts dynamically
  const makkahCount = mapHotels.filter(h => h.city === 'makkah' || h.city === 'مكة المكرمة').length;
  const madinahCount = mapHotels.filter(h => h.city === 'madinah' || h.city === 'المدينة المنورة').length;

  // [FIX] Move useMemo to top level to avoid "Rendered more hooks" error
  const visibleHotels = useMemo(() => {
    return mapHotels
      .filter(h =>
        h.isFeatured === true && // [STRICT] Only featured hotels
        (activeCityTab === 'all' ||
          (activeCityTab === 'makkah' && (h.city === 'makkah' || h.city === 'مكة المكرمة')) ||
          (activeCityTab === 'madinah' && (h.city === 'madinah' || h.city === 'المدينة المنورة')))
      )
      .sort((a, b) => b.rating - a.rating) // Sort by rating since all are featured
      .slice(0, 10); // Limit to top 10 relevant
  }, [mapHotels, activeCityTab]);

  return (
    <div className="space-y-0 pb-32 overflow-x-hidden text-right bg-transparent" dir="rtl">
      <Hero />

      {/* سكشن الوجهات الاحترافي 2026 */}
      <section className="relative z-20 pt-16 md:pt-40 pb-10 overflow-hidden">
        <RevealOnScroll>
          <div className="max-w-[1440px] mx-auto px-6">
            {/* العنوان الاحترافي - Matches Reference Image */}
            <div className="mb-16 md:mb-24 space-y-6 max-w-5xl ml-auto text-right">
              <div className="flex items-center justify-start gap-4 mb-2">
                <span className="text-gold font-black text-xs md:text-sm uppercase tracking-[0.5em]">Prestigious Destinations</span>
                <div className="w-16 h-[2px] bg-gold/50"></div>
              </div>
              <h2 className="text-4xl md:text-7xl font-black text-secondary tracking-tighter leading-tight">
                اكتشف آفاق الفخامة في <br />
                <span className="text-gold">أفضل الوجهات المختارة بعناية</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-2xl font-bold max-w-4xl leading-relaxed mt-8">
                ارتقِ بتجربتك إلى آفاق غير مسبوقة، حيث نجمع بين عبق التاريخ وأعلى معايير الرفاهية العالمية. ضيافة خلود.. بوابتكم لعالم متميز من الراحة والروحانية.
              </p>
            </div>

            {/* نظام الـ Split Expand الاحترافي */}
            <div className="flex flex-col md:flex-row gap-6 h-[600px] md:h-[700px] group/container">
              {/* مكة المكرمة */}
              <div
                id="card-makkah"
                className="destination-card relative flex-1 md:flex-[1.5] group overflow-hidden rounded-[3rem] md:rounded-[4rem] transition-all duration-[1.2s] cubic-bezier(0.16, 1, 0.3, 1) hover:md:flex-[3] shadow-2xl"
              >
                <img
                  src="/assets/images/destinations/makkah.png"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
                  alt="مكة المكرمة"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

                {/* تفاصيل الوجهة (تظهر عند السكرول أو الهوفر) */}
                <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end text-right">
                  <div className="flex items-center gap-3 mb-4 opacity-0 translate-y-4 group-[.active-card]:opacity-100 group-[.active-card]:translate-y-0 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-700">
                    <div className="w-2 h-2 bg-gold rounded-full animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.8)]"></div>
                    <span className="text-white font-bold text-xs md:text-sm tracking-widest uppercase">{makkahCount}+ فندق متاح الآن</span>
                  </div>

                  <h3 className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tighter transition-all duration-700">مكة <br /><span className="text-gold">المكرمة</span></h3>

                  <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center opacity-0 translate-y-8 group-[.active-card]:opacity-100 group-[.active-card]:translate-y-0 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-1000 delay-300">
                    <p className="text-slate-200 text-sm md:text-lg max-w-md font-medium leading-relaxed">
                      تجربة إقامة روحانية بالقرب من الحرم المكي مع أرقى خدمات الضيافة السعودية.
                    </p>
                    <Link to="/hotels?city=makkah" className="group/btn relative px-8 py-4 bg-white text-text rounded-2xl font-black text-sm transition-all hover:bg-gold hover:text-white shadow-xl flex items-center gap-2 overflow-hidden">
                      <span className="relative z-10">استكشف الوجهة</span>
                      <svg className="w-4 h-4 relative z-10 transition-transform group-hover/btn:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              {/* المدينة المنورة */}
              <div
                id="card-madinah"
                className="destination-card relative flex-1 group overflow-hidden rounded-[3rem] md:rounded-[4rem] transition-all duration-[1.2s] cubic-bezier(0.16, 1, 0.3, 1) hover:md:flex-[3] shadow-2xl"
              >
                <img
                  src="/assets/images/destinations/madina.png"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
                  alt="المدينة المنورة"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

                {/* تفاصيل الوجهة */}
                <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end text-right">
                  <div className="flex items-center gap-3 mb-4 opacity-0 translate-y-4 group-[.active-card]:opacity-100 group-[.active-card]:translate-y-0 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-700">
                    <div className="w-2 h-2 bg-[#059669] rounded-full animate-pulse shadow-[0_0_15px_rgba(5,150,105,0.8)]"></div>
                    <span className="text-white font-bold text-xs md:text-sm tracking-widest uppercase">{madinahCount}+ فندق متاح الآن</span>
                  </div>

                  <h3 className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tighter transition-all duration-700">المدينة <br /><span className="text-[#059669]">المنورة</span></h3>

                  <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center opacity-0 translate-y-8 group-[.active-card]:opacity-100 group-[.active-card]:translate-y-0 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-1000 delay-300">
                    <p className="text-slate-200 text-sm md:text-lg max-w-md font-medium leading-relaxed">
                      استمتع بالسكينة والطمأنينة في جوار المسجد النبوي الشريف بأعلى معايير الرفاهية.
                    </p>
                    <Link to="/hotels?city=madinah" className="group/btn relative px-8 py-4 bg-white text-text rounded-2xl font-black text-sm transition-all hover:bg-gold hover:text-white shadow-xl flex items-center gap-2 overflow-hidden">
                      <span className="relative z-10">استكشف الوجهة</span>
                      <svg className="w-4 h-4 relative z-10 transition-transform group-hover/btn:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* Discovery Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 md:pt-32">
        <RevealOnScroll>
          <div className="flex flex-row justify-start items-center mb-10 text-right">
            <div className="space-y-2">
              <div className="flex items-center justify-start gap-2">
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse"></div>
                <span className="text-gold font-black text-[10px] uppercase tracking-[0.3em]">Immersive Hospitality Atlas</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-text tracking-tighter leading-tight">استكشف فنادقنا.. <span className="text-gold">بوابتك لعالم من التميز</span></h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2 rounded-[3rem] overflow-hidden shadow-xl border-[1px] border-slate-100 relative group aspect-video lg:aspect-auto lg:h-[550px] bg-white transform transition-transform duration-700 hover:scale-[1.005]">
              <MapSection hotels={mapHotels} activeHotel={activeHotel} hoveredHotel={hoveredHotel} onHotelSelect={setActiveHotel} />
            </div>

            <div className="space-y-6 relative h-full">
              <div className="flex justify-between items-center px-4">
                <h3 className="font-bold text-text text-lg">بالقرب منك الآن</h3>
              </div>
              <div className="space-y-4 max-h-[480px] overflow-y-auto no-scrollbar px-2 pb-16">
                {mapHotels.map((hotel, idx) => (
                  <div
                    key={hotel.id}
                    onClick={() => setActiveHotel(hotel)}
                    onMouseEnter={() => setHoveredHotel(hotel)}
                    onMouseLeave={() => setHoveredHotel(undefined)}
                    className="cursor-pointer transition-all duration-500 hover:-translate-y-1 active:scale-95"
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  >
                    <HotelCard hotel={hotel} compact />
                  </div>
                ))}
              </div>

              {/* مؤشر السكرول المتحرك */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center gap-1 opacity-80">
                <span className="text-[10px] font-black text-gold uppercase tracking-widest">اسحب لرؤية المزيد</span>
                <div className="animate-scroll-bounce bg-white/50 backdrop-blur-md rounded-full p-2 border border-gold/20 shadow-lg">
                  <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* Smart City Spotlight Section (Replaces Exclusive Offers) */}
      <section className="relative overflow-hidden pt-24 md:pt-32">
        <RevealOnScroll>

          <div className="max-w-7xl mx-auto px-6 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 text-right" dir="rtl">
            <div className="flex-1 text-right">
              <div className="flex items-center justify-start gap-3 mb-2">
                <div className={`w-8 h-px ${activeCityTab === 'madinah' ? 'bg-slate-700' : 'bg-gold'} transition-colors duration-500`}></div>
                <span className={`${activeCityTab === 'madinah' ? 'text-slate-700' : 'text-gold'} font-black text-[9px] uppercase tracking-[0.4em] transition-colors duration-500`}>
                  {activeCityTab === 'all' ? 'Exclusive Offers' : activeCityTab === 'makkah' ? 'Elite Makkah' : 'Elite Madinah'}
                </span>
              </div>
              <h2 className="text-2xl md:text-5xl font-black text-primary tracking-tighter mb-1 md:mb-3">
                {activeCityTab === 'all' && <>روائع <span className="text-secondary">النخبة المختارة</span> وعروضنا الحصرية</>}
                {activeCityTab === 'makkah' && <>إقامات <span className="text-secondary">تسحر الروح</span> في قلب مكة</>}
                {activeCityTab === 'madinah' && <>فخامة <span className="text-secondary">تفيض بالسكينة</span> في مدينة الرسول</>}
              </h2>
            </div>

            {/* Smart Tabs Switcher */}
            <div className="flex bg-slate-100/80 p-1.5 rounded-2xl md:rounded-[1.2rem] backdrop-blur-sm self-start md:self-auto">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'makkah', label: 'مكة المكرمة' },
                { id: 'madinah', label: 'المدينة المنورة' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCityTab(tab.id as any)}
                  className={`relative px-5 md:px-7 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-black transition-all duration-500 ${activeCityTab === tab.id
                    ? 'bg-white text-text shadow-lg scale-100'
                    : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  {activeCityTab === tab.id && (
                    <div className={`absolute inset-0 rounded-xl md:rounded-2xl opacity-10 ${tab.id === 'madinah' ? 'bg-slate-700' : tab.id === 'makkah' ? 'bg-gold' : 'bg-primary'
                      }`}></div>
                  )}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex gap-3 hidden md:flex">
              <button onClick={() => scrollManual('right')} className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center bg-white/50 backdrop-blur-md hover:bg-primary hover:text-white transition-all duration-500 active:scale-90 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={() => scrollManual('left')} className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center bg-white/50 backdrop-blur-md hover:bg-primary hover:text-white transition-all duration-500 active:scale-90 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto overflow-hidden px-6 relative min-h-[400px]">
            {/* Gradient fade */}
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#fdfcfb] to-transparent z-10 pointer-events-none"></div>

            <div
              ref={scrollRef}
              className="flex gap-6 pb-16 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth"
            >
              {/* Filter Logic */}
              {isLoading ? (
                // SKELETON LOADING
                [...Array(3)].map((_, i) => (
                  <div key={i} className="w-[280px] md:w-[300px] shrink-0 snap-center">
                    <HotelCardSkeleton offerMode />
                  </div>
                ))
              ) : (
                visibleHotels.map((hotel: any, index: number) => (
                  <div key={`${hotel.id}-${index}-${activeCityTab}`} className="w-[280px] md:w-[300px] shrink-0 snap-center animate-in fade-in slide-in-from-right-4 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="transform transition-all duration-500 hover:scale-[1.02] h-full">
                      <HotelCard hotel={hotel} offerMode index={index} />
                    </div>
                  </div>
                ))
              )}

              {/* Empty State */}
              {!isLoading && visibleHotels.length === 0 && (
                <div className="w-full h-64 flex items-center justify-center text-slate-400 font-bold">
                  جاري تحميل الفنادق...
                </div>
              )}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* Testimonials Section - NEW */}
      {/* 5. Reviews Section (Horizontal Scroll) */}
      <section className="bg-[#F8F9FA] relative pt-20 pb-8 px-4 md:px-8 overflow-hidden bg-slate-50/50">
        <RevealOnScroll>
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-700/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-right">
            <div className="flex flex-row justify-start items-center gap-8 mb-16 md:mb-24 text-right" dir="rtl">
              <div className="flex-1 text-right">
                <div className="flex items-center justify-start gap-3 mb-2">
                  <div className="w-8 h-px bg-gold/50"></div>
                  <span className="text-gold font-bold text-xs uppercase tracking-[0.4em]">Voices of Excellence</span>
                </div>
                <h2 className="text-3xl md:text-6xl font-black text-text tracking-tighter">شهادات <span className="text-gold">اعتزاز وفخر</span></h2>
                <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed mt-4">
                  قصص من الثقة والتميز، صاغها ضيوفنا بعد تجربة كرم الضيافة السعودية الأصيلة بلمسات من الرفاهية التي تليق بكم.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => scrollManual('right', 'testimonials')}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-slate-200 flex items-center justify-center bg-white/50 backdrop-blur-md hover:bg-primary hover:text-white transition-all duration-500 active:scale-90 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => scrollManual('left', 'testimonials')}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-slate-200 flex items-center justify-center bg-white/50 backdrop-blur-md hover:bg-primary hover:text-white transition-all duration-500 active:scale-90 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div
              ref={testimonialsScrollRef}
              className="flex gap-8 pb-16 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth px-2"
            >
              {[
                {
                  name: "محمد العتيبي",
                  location: "الرياض، السعودية",
                  text: "بصراحة تعامل راقي جداً وفنادقهم في مكة دايم تكون الأفضل من ناحية القرب والنظافة. ضيافة خلود دايم اختياري الأول من سنوات وما قد خذلوني.",
                  rating: 5,
                  date: "قبل أسبوع"
                },
                {
                  name: "سارة القحطاني",
                  location: "جدة، السعودية",
                  text: "خدمة احترافية بكل معنى الكلمة. حجزنا كان سهل وسريع والمتابعة منهم كانت مستمرة حتى وصلنا الفندق بالمدينة. التكنولوجيا عندهم فعلاً سهلت علينا الرحلة.",
                  rating: 5,
                  date: "قبل شهر"
                },
                {
                  name: "فهد بن سلمان",
                  location: "الدمام، السعودية",
                  text: "تجربة الحجز مع خلود كانت مختلفة، المصداقية هي أهم شي عندهم. الفندق كان أجمل من الصور والتنسيق كان ممتاز جداً. أنصح بهم وبقوة.",
                  rating: 5,
                  date: "قبل أسبوعين"
                },
                {
                  name: "ليلى العامري",
                  location: "دبي، الإمارات",
                  text: "المستوى الرفيع في اختيار الفنادق مذهل. اهتمامهم بأدق التفاصيل يخليك ترتاح وتستمتع برحلتك. فعلاً براند سعودي بمقاييس عالمية.",
                  rating: 5,
                  date: "قبل 3 أيام"
                },
                {
                  name: "عبدالعزيز الماجد",
                  location: "الكويت",
                  text: "تعاونت مع شركات كثيرة لكن مثل سرعة ودقة خلود ما شفت. سهولة الدفع ووضوح الخيارات على الموقع تفرق كثير عن باقي المواقع.",
                  rating: 5,
                  date: "قبل شهرين"
                },
                {
                  name: "نورة السديري",
                  location: "القصيم، السعودية",
                  text: "فريق العمل متعاون جداً وجاهزين لأي استفسار في أي وقت. رحلاتنا للعمرة والزيارة صارت أسهل وأكثر راحة بفضل خدماتكم.",
                  rating: 5,
                  date: "قبل 10 أيام"
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="w-[320px] md:w-[420px] shrink-0 snap-center"
                >
                  <div className="group relative bg-white/70 backdrop-blur-xl border border-white/40 p-8 md:p-12 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-700 hover:-translate-y-2 flex flex-col justify-between text-right h-full min-h-[400px]"
                  >
                    <div className="absolute top-0 right-12 w-12 h-12 bg-gold/10 rounded-b-2xl flex items-center justify-center -translate-y-1">
                      <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H14.017C13.4647 8 13.017 8.44772 13.017 9V15C13.017 17.1147 11.2317 19.349 9.017 21C8.74086 21.2154 8.35174 21.1594 8.14023 20.8833C7.94726 20.6272 7.9723 20.2678 8.196 20.038C9.55454 18.6657 10.017 17.5 10.017 16H7.017C6.46472 16 6.017 15.5523 6.017 15V9C6.017 8.44772 6.46472 8 7.017 8H12.017C12.5693 8 13.017 8.44772 13.017 9V15C13.017 17.2091 14.8079 19 17.017 19V21H14.017Z" />
                      </svg>
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-end gap-1">
                        {[...Array(item.rating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      <p className="text-slate-700 text-xl font-bold leading-relaxed tracking-tight">
                        "{item.text}"
                      </p>
                    </div>

                    <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 border-4 border-white shadow-sm overflow-hidden">
                          <span className="text-lg">{item.name[0]}</span>
                        </div>
                        <div className="text-right">
                          <h4 className="font-black text-text text-base">{item.name}</h4>
                          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{item.location}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-300">{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </section>


    </div>
  );
};

export default Home;
