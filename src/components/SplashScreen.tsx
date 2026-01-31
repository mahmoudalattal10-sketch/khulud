import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC = () => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        // Optional: Ensure it shows for at least a split second to prevent flicker on fast connections
        // But for Suspense fallback, we let React handle the mounting/unmounting.
        // This component is purely visual.
        return () => {
            // Cleanup if needed
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fdfcfb] overflow-hidden">
            {/* Background Decor Elements */}
            <div className="absolute inset-0 z-0 opacity-30">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-light/20 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Logo Container with Pulse Effect */}
                <div className="relative mb-8">
                    {/* Outer Ring Animation */}
                    <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl animate-pulse"></div>

                    <img
                        src="/assets/images/ui/logo.png"
                        alt="Diafat Khulud"
                        className="w-32 h-32 md:w-40 md:h-40 object-contain relative z-10 drop-shadow-2xl animate-float"
                    />
                </div>

                {/* Text Content */}
                <div className="text-center space-y-3 animate-fade-in-up">
                    <h1 className="text-2xl md:text-3xl font-bold text-text tracking-wide font-['Cairo']">
                        ضيافة <span className="text-gold-dark">خلود</span>
                    </h1>
                    <p className="text-sm md:text-base text-slate-500 font-medium tracking-widest uppercase opacity-80">
                        Luxury Hospitality
                    </p>
                </div>

                {/* Loading Bar / Indicator */}
                <div className="mt-12 w-48 h-1 bg-slate-100 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-gold-dark to-transparent animate-[shimmer_1.5s_infinite] -translate-x-full"></div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
