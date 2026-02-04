import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface PageTransitionProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode;
}

const PageTransition = forwardRef<HTMLDivElement, PageTransitionProps>(
    ({ children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -10 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} // Heavy cinematic ease
                className="w-full h-full"
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

PageTransition.displayName = 'PageTransition';

export default PageTransition;
