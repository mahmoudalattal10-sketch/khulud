/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./contexts/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // 🎨 STRICT USER PALETTE (2026)
                // 1. #D6B372 (Primary Gold)
                // 2. #0f172a (Secondary Dark)
                // 3. #94a3b8 (Text Light)
                // 4. #059669 (Accent Green)

                primary: '#D6B372',
                secondary: '#0f172a',

                text: '#0f172a',       // Dark Headings
                textLight: '#94a3b8',  // Light Paragraphs

                border: '#94a3b8',
                accent: '#059669',
                success: '#059669',

                // Minimal Aliases for Compatibility
                gold: { DEFAULT: '#D6B372', light: '#E5C992', dark: '#B59450' },
                slate: {
                    DEFAULT: '#0f172a',
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    400: '#94a3b8',
                    primary: '#0f172a',    // Structure (Dark)
                    secondary: '#D6B372',  // Accent (Gold)
                    action: '#059669',     // CTA (Emerald) - COMFORTABLE

                    text: '#0f172a',       // Headings
                    textLight: '#64748b',  // Body (Softer Grey)

                    border: '#cbd5e1',     // Soft Border
                    'luxury-gradient': 'linear-gradient(135deg, #f8fafc 0%, #dfc798 100%)',
                    'brand-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    'gold-shine': 'linear-gradient(135deg, #c5a059 0%, #dfc798 100%)', // Simplified
                    'hero-pattern': 'radial-gradient(ellipse at top right, rgba(15, 23, 42, 0.05) 0%, transparent 50%)',
                },
            },
            boxShadow: {
                'ios': '0 10px 30px -5px rgba(15, 23, 42, 0.05)',
                'brand': '0 10px 40px -10px rgba(15, 23, 42, 0.2)',
                'gold': '0 10px 40px -10px rgba(197, 160, 89, 0.2)',
            },
            fontFamily: {
                sans: ['Cairo', 'sans-serif'],
                cairo: ['Cairo', 'sans-serif'],
            },
            transitionTimingFunction: {
                'ios': 'cubic-bezier(0.32, 0.72, 0, 1)',
                'ios-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            },
        },
    },
    plugins: [],
};

