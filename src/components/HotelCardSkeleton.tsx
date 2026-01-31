import React from 'react';
import Skeleton from './Skeleton';

const HotelCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-[2rem] p-4 border border-slate-100 flex flex-col md:flex-row gap-6 w-full">
            {/* Image Skeleton */}
            <Skeleton className="w-full md:w-[320px] aspect-[3/2] rounded-[1.5rem] shrink-0" />

            <div className="flex-1 py-2 flex flex-col justify-between w-full">
                <div className="w-full">
                    <div className="flex justify-between items-start mb-4 w-full">
                        <div className="space-y-3 w-3/4">
                            <Skeleton className="h-8 w-2/3 rounded-xl" />
                            <Skeleton className="h-4 w-1/2 rounded-lg" />
                        </div>
                        <div className="flex gap-1 shrink-0">
                            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} width={20} height={20} variant="circular" />)}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                        <Skeleton width={100} height={28} className="rounded-lg" />
                        <Skeleton width={120} height={28} className="rounded-lg" />
                        <Skeleton width={110} height={28} className="rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Price & Action Skeleton */}
            <div className="w-full md:w-[180px] flex flex-row md:flex-col justify-between items-center md:justify-center gap-4 border-r-0 md:border-r border-slate-100 md:pr-6 shrink-0">
                <div className="flex flex-col items-end md:items-center gap-2 w-1/2 md:w-full">
                    <Skeleton width={60} height={16} className="rounded" />
                    <Skeleton width={120} height={40} className="rounded-xl" />
                    <Skeleton width={90} height={14} className="rounded" />
                </div>
                <Skeleton className="h-12 w-full md:w-full rounded-xl" />
            </div>
        </div>
    );
};

export default HotelCardSkeleton;
