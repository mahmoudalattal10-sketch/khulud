
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Layers, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';

interface HotelViewMapProps {
    lat: string | number;
    lng: string | number;
    hotelName: string;
    distanceFromHaram?: string;
}

const HotelViewMap: React.FC<HotelViewMapProps> = ({ lat, lng, hotelName, distanceFromHaram }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
    const [isFullscreen, setIsFullscreen] = useState(false);

    const latitude = typeof lat === 'string' ? parseFloat(lat) : Number(lat);
    const longitude = typeof lng === 'string' ? parseFloat(lng) : Number(lng);
    const isValidCoords = !isNaN(latitude) && !isNaN(longitude) && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180;

    // Initialize Map
    useEffect(() => {
        if (!isValidCoords || !mapContainerRef.current || mapInstanceRef.current) return;
        if (!L) return;

        mapInstanceRef.current = L.map(mapContainerRef.current, {
            center: [latitude, longitude],
            zoom: 16,
            zoomControl: false,
            scrollWheelZoom: false // Disable scroll zoom by default for better page browsing
        });

        // Add Default Layer (CartoDB Voyager)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO'
        }).addTo(mapInstanceRef.current);

        // Force resize to fix blank tiles
        setTimeout(() => {
            mapInstanceRef.current?.invalidateSize();
        }, 300);


        // Add Custom Marker
        const customIcon = L.divIcon({
            className: 'custom-pin',
            html: `
                <div class="relative flex items-center justify-center">
                    <div style="background-color: #10b981; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; border: 3px solid white; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; color: white;">
                        <div style="transform: rotate(45deg);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        </div>
                    </div>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });

        markerRef.current = L.marker([latitude, longitude], {
            icon: customIcon
        }).addTo(mapInstanceRef.current);

        // Add Popup
        markerRef.current.bindPopup(`
            <div style="font-family: 'Cairo', sans-serif; text-align: right; padding: 5px;">
                <div style="font-weight: 900; color: #0f172a; font-size: 14px; margin-bottom: 4px;">${hotelName}</div>
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">${distanceFromHaram && distanceFromHaram.includes('من') ? distanceFromHaram : (distanceFromHaram ? `${distanceFromHaram} من الحرم` : 'موقع الفندق')}</div>
            </div>
        `, { closeButton: false }).openPopup();

        // Enable scroll zoom on map click
        mapInstanceRef.current.on('mousedown', () => {
            mapInstanceRef.current.scrollWheelZoom.enable();
        });

    }, [latitude, longitude, hotelName, distanceFromHaram]);

    // Handle Map Type Change
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        mapInstanceRef.current.eachLayer((layer: any) => {
            if (layer instanceof L.TileLayer) {
                mapInstanceRef.current.removeLayer(layer);
            }
        });

        if (mapType === 'satellite') {
            // Google Hybrid (Satellite + Labels)
            L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
                attribution: '&copy; Google Maps'
            }).addTo(mapInstanceRef.current);
        } else {
            // CartoDB Voyager
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap &copy; CARTO'
            }).addTo(mapInstanceRef.current);
        }

    }, [mapType]);

    const openInGoogleMaps = () => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank');
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        // Map needs to invalidate size after container resize
        setTimeout(() => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize({ animate: true });
            }
        }, 300);
    };

    return (
        <div className={`relative bg-slate-100 rounded-3xl overflow-hidden shadow-inner group transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-[9999] rounded-none' : 'h-64 md:h-80'}`}>
            {!isValidCoords ? (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-sm bg-slate-50">
                    <MapPin size={24} className="mb-2 opacity-20" />
                    <span>موقع غير متاح</span>
                </div>
            ) : (
                <div ref={mapContainerRef} className="w-full h-full z-0" />
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 pointer-events-none border-[1px] border-white/20 rounded-3xl z-10"></div>

            {/* Controls */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-[500] pointer-events-none">
                <div className="flex gap-2 pointer-events-auto">
                    <button
                        onClick={() => setMapType(mapType === 'street' ? 'satellite' : 'street')}
                        className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl text-[10px] font-black text-slate-700 shadow-lg border border-white flex items-center gap-2 hover:bg-slate-800 hover:text-white transition-all active:scale-95"
                    >
                        <Layers size={14} />
                        {mapType === 'street' ? 'قمر صناعي' : 'عرض الشوارع'}
                    </button>
                    <button
                        onClick={toggleFullscreen}
                        className="bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-white flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-95"
                    >
                        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                </div>

                <div className="flex flex-col gap-2 items-end pointer-events-auto">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-700 shadow-md border border-white flex items-center gap-2">
                        <MapPin size={12} className="text-red-500" />
                        {distanceFromHaram && distanceFromHaram.includes('من') ? distanceFromHaram : (distanceFromHaram ? `${distanceFromHaram} من الحرم` : 'موقع دقيق')}
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="absolute bottom-4 right-4 z-[500]">
                <button
                    onClick={openInGoogleMaps}
                    className="bg-primary border border-primary text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-2xl flex items-center gap-2 hover:bg-primary transition-all active:scale-95 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300"
                >
                    <ExternalLink size={12} />
                    فتح في خرائط Google
                </button>
            </div>

            {/* Legend for Scroll */}
            {!isFullscreen && (
                <div className="absolute bottom-4 left-4 z-[500] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-primary/20 backdrop-blur-sm text-white px-2 py-1 rounded text-[8px] font-bold">
                        انقر للتفاعل والتكبير
                    </div>
                </div>
            )}
        </div>
    );
};

export default HotelViewMap;
