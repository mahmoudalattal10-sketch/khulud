import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
    "تجارب عالمية .. بمعايير استثنائية",
    "من أرقى الفنادق إلى سحر الوجهات",
    "ضيافة خلود .. حيث لا حدود للرفاهية"
];

const Preloader: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        // Rotate text every 1.2 seconds
        const textInterval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 1200);

        // Finish loading after enough time to see messages
        const timer = setTimeout(() => {
            setIsLoading(false);
            clearInterval(textInterval);
        }, 3800);

        return () => {
            clearTimeout(timer);
            clearInterval(textInterval);
        };
    }, []);

    // Animation Variants
    const containerVariants = {
        initial: { opacity: 1 },
        exit: {
            y: '-100%',
            transition: {
                duration: 1.2,
                ease: [0.76, 0, 0.24, 1] as any, // Custom "Cinematic" Ease
                delay: 0.2
            }
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
                    variants={containerVariants}
                    initial="initial"
                    exit="exit"
                >
                    <motion.img
                        src="/assets/images/ui/logo.png"
                        alt="Diafat Khulud"
                        className="w-32 md:w-40 h-auto object-contain mb-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1.15 }}
                        style={{ willChange: "transform, opacity" }}
                        transition={{
                            scale: { duration: 3.8, ease: "linear" },
                            opacity: { duration: 0.6, ease: "easeOut" }
                        }}
                    />

                    {/* Smooth Progress Bar */}
                    <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden mb-6">
                        <motion.div
                            className="h-full bg-gold"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3.5, ease: "easeInOut" }}
                        />
                    </div>

                    {/* Rotating Luxurious Text */}
                    <div className="h-8 flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={messageIndex}
                                className="text-sm md:text-base font-bold text-slate-700 tracking-wide font-cairo"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                {messages[messageIndex]}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
