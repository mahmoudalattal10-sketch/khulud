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
                // 🎨 DYNAMIC PALETTE (Linked to design-system.css)
                primary: 'var(--primary)',      // Gold
                secondary: 'var(--secondary)',  // Dark

                text: 'var(--text)',
                textLight: 'var(--text-light)',

                border: 'var(--border)',
                accent: 'var(--accent)',
                success: 'var(--success)',

                // Minimal Aliases
                gold: {
                    DEFAULT: 'var(--gold)',
                    light: 'var(--gold-light)',
                    dark: 'var(--gold-dark)',
                    '50': 'var(--gold-50)',
                    '100': 'var(--gold-100)',
                    '200': 'var(--gold-200)',
                    '300': 'var(--gold-300)',
                    '400': 'var(--gold-400)',
                    '500': 'var(--gold-500)',
                    '600': 'var(--gold-600)',
                    '700': 'var(--gold-700)',
                    '800': 'var(--gold-800)',
                    '900': 'var(--gold-900)',
                },
                slate: {
                    DEFAULT: 'var(--secondary)',
                    50: 'var(--slate-50)',
                    100: 'var(--slate-100)',
                    200: 'var(--slate-200)',
                    300: 'var(--slate-300)',
                    400: 'var(--slate-400)',
                    500: 'var(--slate-500)',
                    600: 'var(--slate-600)',
                    700: 'var(--slate-700)',
                    800: 'var(--slate-800)',
                    900: 'var(--slate-900)',
                    primary: 'var(--secondary)', // Map slate-primary to dark
                    secondary: 'var(--gold)',    // Map slate-secondary to gold
                    action: 'var(--accent)',
                    text: 'var(--text)',
                    textLight: 'var(--text-light)',
                    border: 'var(--border)',
                    'luxury-gradient': 'linear-gradient(135deg, var(--slate-50) 0%, var(--gold-light) 100%)',
                    'brand-gradient': 'linear-gradient(135deg, var(--secondary) 0%, var(--slate-800) 100%)',
                    'gold-shine': 'linear-gradient(135deg, var(--gold-500) 0%, var(--gold-light) 100%)',
                    'hero-pattern': 'radial-gradient(ellipse at top right, rgba(15, 23, 42, 0.05) 0%, transparent 50%)',
                },
            },
            boxShadow: {
                'ios': '0 10px 30px -5px rgba(15, 23, 42, 0.05)',
                'brand': '0 10px 40px -10px rgba(15, 23, 42, 0.2)',
                'gold': '0 10px 40px -10px rgba(197, 160, 89, 0.2)',
                'luxury': '0 20px 50px -12px rgba(15, 23, 42, 0.12)',
                'inner-gold': 'inset 0 2px 4px 0 rgba(214, 179, 114, 0.06)',
            },
            fontFamily: {
                sans: ['Cairo', 'sans-serif'],
                cairo: ['Cairo', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            transitionTimingFunction: {
                'ios': 'cubic-bezier(0.32, 0.72, 0, 1)',
                'ios-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                'reveal': 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
            animation: {
                'shimmer': 'shimmer 2s infinite linear',
                'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                },
                fadeInUp: {
                    'from': { opacity: '0', transform: 'translateY(20px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
};
