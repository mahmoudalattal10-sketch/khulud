import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Star, ChevronRight, Image as ImageIcon, Map as MapIcon, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import HotelViewMap from './HotelViewMap';

interface HotelGalleryProps {
    hotelId?: number | string;
    hotelName: string;
    mainImage: string;
    images: string[];
    onShowAll: () => void;
    lat?: string | number;
    lng?: string | number;
    distanceFromHaram?: string;
    city?: string;
}

const HotelGallery: React.FC<HotelGalleryProps> = ({
    hotelId,
    hotelName,
    mainImage,
    images,
    onShowAll,
    lat,
    lng,
    distanceFromHaram,
    city
}) => {
    const [viewMode, setViewMode] = useState<'photos' | 'map'>('photos');
    const [activeMobileImage, setActiveMobileImage] = useState(1);
    const [showMobileHint, setShowMobileHint] = useState(true);
    const mobileScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMobileHint(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    const displayImages = useMemo(() => {
        const baseImages = [mainImage, ...images].filter(img => img && typeof img === 'string');
        return Array.from(new Set(baseImages));
    }, [mainImage, images]);

    const handleMobileScroll = () => {
        if (mobileScrollRef.current) {
            const scrollLeft = mobileScrollRef.current.scrollLeft;
            const width = mobileScrollRef.current.clientWidth;
            const index = Math.round(scrollLeft / width) + 1;
            setActiveMobileImage(index);
        }
    };

    return (
        <div className="relative group/gallery mb-12 overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-xl bg-slate-100 aspect-[4/3] md:aspect-[21/10]">
            {/* 🖥️ Creative View Toggle (Desktop & Mobile) */}
            <div className="absolute top-6 left-6 z-30 flex gap-2 pointer-events-auto">
                <div className="bg-white/90 backdrop-blur-xl p-1.5 rounded-2xl border border-white/50 shadow-2xl flex gap-1">
                    <button
                        onClick={() => setViewMode('photos')}
                        className={`px-5 py-2.5 rounded-xl text-[11px] font-black flex items-center gap-2 transition-all duration-300 ${viewMode === 'photos' ? 'bg-slate-900 text-white shadow-lg scale-105' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                    >
                        <ImageIcon size={14} />
                        <span>الصور</span>
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`px-5 py-2.5 rounded-xl text-[11px] font-black flex items-center gap-2 transition-all duration-300 ${viewMode === 'map' ? 'bg-emerald-600 text-white shadow-lg scale-105' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                    >
                        <MapIcon size={14} />
                        <span>الخريطة</span>
                    </button>
                </div>
            </div>

            {viewMode === 'photos' ? (
                <>
                    {/* 🖥️ Desktop View: Mosaic */}
                    <div className="hidden md:grid md:grid-cols-4 gap-2 md:gap-3 w-full h-full animate-in fade-in duration-700" dir="ltr">
                        <div className="md:col-span-2 md:row-span-2 relative overflow-hidden group/main cursor-pointer h-full">
                            <motion.img
                                layoutId={hotelId ? `hotel-image-${hotelId}` : undefined}
                                transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
                                src={displayImages[0]}
                                alt={hotelName}
                                className="w-full h-full object-cover transition-all duration-1000 group-hover/main:scale-105"
                            />
                            <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover/main:opacity-100 transition-opacity duration-500" />
                        </div>

                        {displayImages.slice(1, 5).map((img, idx) => (
                            <div key={idx} className="relative overflow-hidden group/tile cursor-pointer h-full">
                                <img src={img} alt={`Gallery ${idx + 2}`} className="w-full h-full object-cover transition-all duration-1000 group-hover/tile:scale-110" />
                                <div className="absolute inset-0 bg-secondary/20 opacity-0 group-hover/tile:opacity-100 transition-opacity duration-500" />
                                {idx === 3 && (
                                    <button
                                        onClick={onShowAll}
                                        className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md border border-slate-200 px-5 py-3 rounded-2xl text-secondary font-black text-xs shadow-2xl flex items-center gap-3 hover:bg-white transition-all active:scale-95 z-20 group/btn"
                                    >
                                        <div className="grid grid-cols-2 gap-1 group-hover/btn:rotate-12 transition-transform duration-500">
                                            {[...Array(4)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-gold rounded-full" />)}
                                        </div>
                                        <span>عرض كافة الصور</span>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 📱 Mobile View: Carousel */}
                    <div className="md:hidden relative w-full h-full animate-in fade-in duration-700" dir="ltr">
                        <div
                            ref={mobileScrollRef}
                            onScroll={handleMobileScroll}
                            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full w-full scroll-smooth"
                        >
                            {displayImages.map((img, idx) => (
                                <div key={idx} className="min-w-full h-full snap-center shrink-0 relative overflow-hidden">
                                    <img
                                        src={img}
                                        alt={`${hotelName} ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                                </div>
                            ))}
                        </div>

                        {/* Floating Navigation Hint */}
                        <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-1000 ${showMobileHint && activeMobileImage === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            <div className="bg-black/20 backdrop-blur-md p-6 rounded-full border border-white/20 animate-bounce-horizontal">
                                <div className="flex gap-4">
                                    <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse" />
                                    <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse delay-75" />
                                    <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse delay-150" />
                                </div>
                            </div>
                            <p className="mt-4 text-white font-black text-[12px] bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 shadow-2xl">
                                اسحب لمشاهدة كافة الصور
                            </p>
                        </div>

                        {/* Visual indicator (Arrow) */}
                        <div className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 transition-all duration-1000 pointer-events-none ${!showMobileHint && activeMobileImage === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                            <div className="bg-white/40 backdrop-blur-xl p-3 rounded-full border border-white/40 shadow-2xl animate-bounce-horizontal">
                                <ChevronRight size={24} className="text-white drop-shadow-lg" />
                            </div>
                        </div>

                        {/* Counter Overlay */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
                            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-secondary text-[11px] font-black border border-slate-200 shadow-xl flex items-center gap-2">
                                <span className="text-gold">{activeMobileImage}</span>
                                <span className="opacity-20">/</span>
                                <span>{displayImages.length}</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                /* 🗺️ Map View Mode (Seamlessly integrated) */
                <div className="w-full h-full absolute inset-0 animate-in zoom-in-95 duration-700 overflow-hidden">
                    <HotelViewMap
                        lat={lat || 0}
                        lng={lng || 0}
                        hotelName={hotelName}
                        distanceFromHaram={distanceFromHaram}
                        city={city}
                    />
                </div>
            )}

            <style>{`
                @keyframes bounce-horizontal {
                    0%, 100% { transform: translateX(-15%); }
                    50% { transform: translateX(15%); }
                }
                .animate-bounce-horizontal {
                    animation: bounce-horizontal 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default HotelGallery;
