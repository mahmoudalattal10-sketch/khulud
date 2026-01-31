/**
 * =========================================================
 * 🔥 AvailabilityBadge - Dynamic Room Availability Badge
 * =========================================================
 * Shows real-time availability status with engaging animations
 * =========================================================
 */

import React, { useEffect, useState } from 'react';
import { Users, Clock, Flame, AlertTriangle, CheckCircle } from 'lucide-react';

interface AvailabilityBadgeProps {
    inventory: number;
    roomName?: string;
    className?: string;
}

const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({
    inventory,
    roomName = 'غرفة',
    className = '',
}) => {
    const [viewerCount, setViewerCount] = useState(0);

    // Simulate real-time viewers (in production, this would come from websocket)
    useEffect(() => {
        const randomViewers = Math.floor(Math.random() * 8) + 2;
        setViewerCount(randomViewers);

        const interval = setInterval(() => {
            setViewerCount(prev => {
                const change = Math.random() > 0.5 ? 1 : -1;
                const newCount = prev + change;
                return Math.max(1, Math.min(15, newCount));
            });
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, []);

    // Critical: 3 or less rooms
    if (inventory <= 3 && inventory > 0) {
        return (
            <div className={`flex flex-col gap-2 ${className}`}>
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl animate-pulse">
                    <Flame size={16} className="text-red-500" />
                    <span className="text-xs font-black">
                        🔥 باقي {inventory} {inventory === 1 ? 'غرفة فقط' : 'غرف فقط'}!
                    </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
                    <Users size={12} />
                    <span>{viewerCount} شخص يشاهد الآن</span>
                </div>
            </div>
        );
    }

    // Low: 4-7 rooms
    if (inventory <= 7) {
        return (
            <div className={`flex flex-col gap-2 ${className}`}>
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 rounded-xl">
                    <AlertTriangle size={16} className="text-amber-500" />
                    <span className="text-xs font-bold">
                        ⚡ {inventory} غرف متبقية - احجز الآن
                    </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
                    <Clock size={12} />
                    <span>تم حجز 5 غرف اليوم</span>
                </div>
            </div>
        );
    }

    // Available: 8+ rooms
    if (inventory > 7) {
        return (
            <div className={`flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-xl ${className}`}>
                <CheckCircle size={16} className="text-slate-800" />
                <span className="text-xs font-bold">
                    ✅ متاح - {inventory} غرفة
                </span>
            </div>
        );
    }

    // Sold out
    return (
        <div className={`flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-500 px-3 py-2 rounded-xl ${className}`}>
            <AlertTriangle size={16} className="text-slate-400" />
            <span className="text-xs font-bold">
                محجوز بالكامل
            </span>
        </div>
    );
};

export default AvailabilityBadge;
