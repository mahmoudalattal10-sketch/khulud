import React, { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface RevealOnScrollProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    className?: string;
    direction?: "up" | "down" | "left" | "right";
}

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
    children,
    width = "100%",
    delay = 0,
    className = "",
    direction = "up"
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-75px" });
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
    }, [isInView, mainControls]);

    const getDirectionOffset = () => {
        switch (direction) {
            case "up": return { y: 75, x: 0 };
            case "down": return { y: -75, x: 0 };
            case "left": return { x: 75, y: 0 };
            case "right": return { x: -75, y: 0 };
            default: return { y: 75, x: 0 };
        }
    };

    return (
        <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }} className={`will-change-transform ${className}`}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, ...getDirectionOffset() },
                    visible: { opacity: 1, x: 0, y: 0 },
                }}
                initial="hidden"
                animate={mainControls}
                transition={{ duration: 0.8, delay: delay, ease: [0.17, 0.55, 0.55, 1] }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default RevealOnScroll;
