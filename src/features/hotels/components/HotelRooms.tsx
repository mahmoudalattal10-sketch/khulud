import React from 'react';
import HotelRoomCard from './HotelRoomCard';
import { Search, CalendarDays } from 'lucide-react';

interface Room {
    id: string;
    name: string;
    price: number;
    capacity: number;
    size: string;
    bed: string;
    view: string;
    mealPlan: string;
    tags: string[];
    images: string[];
    inventory: number;
    allowExtraBed: boolean;
    extraBedPrice: number;
    maxExtraBeds: number;
    isVisible: boolean;
    partialMetadata?: any;
    originalIdx: number;
}

interface RoomGroup {
    name: string;
    images: string[];
    capacity: number;
    size: string;
    bed: string;
    view: string;
    variants: Room[];
}

interface HotelRoomsProps {
    groups: RoomGroup[];
    selectedRoom: number | null;
    roomQuantities: Record<string, number>;
    extraBedCounts: Record<string, number>;
    onRoomSelect: (idx: number) => void;
    onQuantityChange: (roomId: string, delta: number, max: number) => void;
    onExtraBedChange: (roomId: string, delta: number, max: number) => void;
    onBookNow: (idx: number) => void;
    hotelMainImage?: string;
    hasDates?: boolean;
    onOpenSearch?: () => void;
    loading?: boolean;
}

const RoomSkeleton = () => (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100/80 overflow-hidden animate-pulse">
        <div className="flex flex-col lg:flex-row items-stretch min-h-[320px]">
            <div className="lg:w-[32%] bg-slate-100 min-h-[250px] lg:min-h-full"></div>
            <div className="lg:w-[68%] p-6 md:p-8 flex flex-col justify-between">
                <div>
                    <div className="h-8 bg-slate-100 rounded-full w-2/3 mb-4"></div>
                    <div className="flex gap-4 mb-8">
                        <div className="h-4 bg-slate-100 rounded-full w-20"></div>
                        <div className="h-4 bg-slate-100 rounded-full w-20"></div>
                        <div className="h-4 bg-slate-100 rounded-full w-20"></div>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-auto pt-8 border-t border-slate-50">
                    <div className="h-12 bg-slate-100 rounded-full w-32"></div>
                    <div className="h-10 bg-slate-100 rounded-full w-40"></div>
                </div>
            </div>
        </div>
    </div>
);

const HotelRooms: React.FC<HotelRoomsProps> = ({
    groups,
    selectedRoom,
    roomQuantities,
    extraBedCounts,
    onRoomSelect,
    onQuantityChange,
    onExtraBedChange,
    onBookNow,
    hotelMainImage,
    hasDates,
    onOpenSearch,
    loading
}) => {
    if (loading) {
        return (
            <div className="space-y-12">
                {[1, 2].map((i) => (
                    <RoomSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fade-in" style={{ animationDelay: '450ms' }}>
            {groups.length > 0 ? (
                groups.map((group, idx) => (
                    <HotelRoomCard
                        key={idx}
                        group={group}
                        selectedRoom={selectedRoom}
                        roomQuantities={roomQuantities}
                        extraBedCounts={extraBedCounts}
                        onRoomSelect={onRoomSelect}
                        onQuantityChange={onQuantityChange}
                        onExtraBedChange={onExtraBedChange}
                        onBookNow={onBookNow}
                        hotelMainImage={hotelMainImage}
                        hasDates={hasDates}
                        onOpenSearch={onOpenSearch}
                    />
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-center px-6">
                    <div className="w-16 h-16 bg-gold/5 rounded-full flex items-center justify-center mb-6 text-gold animate-pulse">
                        <CalendarDays size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">لا توجد غرف متاحة في هذه التواريخ</h3>
                    <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto leading-relaxed">
                        لضمان أفضل تجربة إقامة، يرجى تعديل التاريخ أو عدد الضيوف لعرض الغرف والعروض الحصرية المتاحة.
                    </p>
                    {onOpenSearch && (
                        <button
                            onClick={onOpenSearch}
                            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-gold transition-colors flex items-center gap-3 shadow-xl active:scale-95"
                        >
                            <Search size={18} />
                            تغيير خيارات البحث
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default HotelRooms;
