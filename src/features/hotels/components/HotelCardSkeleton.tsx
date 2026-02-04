import React from 'react';

interface HotelCardSkeletonProps {
    compact?: boolean;
    offerMode?: boolean;
}

const HotelCardSkeleton: React.FC<HotelCardSkeletonProps> = ({ compact, offerMode }) => {
    if (compact) {
        return (
            <div className="flex gap-4 p-4 glass-surface rounded-[2.2rem] border border-white/40 shadow-sm animate-pulse">
                <div className="w-16 h-16 rounded-2xl bg-slate-200 shrink-0 overflow-hidden relative">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                </div>
                <div className="flex flex-col justify-center flex-1 gap-2">
                    <div className="h-4 w-3/4 bg-slate-200 rounded-full relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <div className="h-3 w-1/3 bg-slate-100 rounded-full"></div>
                        <div className="h-3 w-1/4 bg-slate-100 rounded-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`mb-8 relative bg-white/40 backdrop-blur-xl rounded-[2.8rem] border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col ${offerMode ? 'h-full' : 'md:flex-row'} gap-0 md:gap-8 p-4`}>
            {/* Image Skeleton */}
            <div className={`w-full ${offerMode ? 'aspect-[4/3] h-[200px]' : 'md:w-[380px] lg:w-[440px] aspect-[4/3] md:aspect-auto md:h-[320px]'} rounded-[2.2rem] bg-slate-200 relative overflow-hidden shrink-0`}>
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            </div>

            {/* Content Skeleton */}
            <div className="flex-1 py-4 md:py-6 px-2 md:px-0 flex flex-col justify-between text-right">
                <div>
                    <div className="h-8 w-2/3 bg-slate-200 rounded-2xl mb-4 relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                    </div>
                    <div className="h-4 w-full bg-slate-100 rounded-full mb-2"></div>
                    <div className="h-4 w-5/6 bg-slate-100 rounded-full mb-6"></div>

                    <div className="flex gap-2 mb-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-8 w-16 bg-slate-100 rounded-xl"></div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100/50 pt-5 mt-auto gap-4">
                    <div className="flex-1 flex flex-col items-start gap-2">
                        <div className="h-3 w-12 bg-slate-100 rounded-full"></div>
                        <div className="h-8 w-32 bg-slate-200 rounded-xl relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                        </div>
                    </div>
                    <div className="w-32 h-14 bg-slate-200 rounded-[1.8rem] relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelCardSkeleton;
