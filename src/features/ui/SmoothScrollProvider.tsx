import { ReactLenis } from '@studio-freight/react-lenis';

interface SmoothScrollProviderProps {
    children: React.ReactNode;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.1, // Smoothness (0-1). Lower is smoother/heavier.
                duration: 1.5, // Duration of the scroll animation
                smoothWheel: true,
                wheelMultiplier: 1, // Scroll speed
            }}
        >
            {children}
        </ReactLenis>
    );
};

export default SmoothScrollProvider;
