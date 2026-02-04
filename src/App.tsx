import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './features/ui/Navbar';
import Footer from './features/ui/Footer';
import { SearchProvider } from './contexts/SearchContext';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAntiTamper } from './hooks/useAntiTamper';
import { AlertCircle, RefreshCw, Home as HomeIcon, Users, Briefcase, HelpCircle, Shield, FileText } from 'lucide-react';
import StaticPage from './pages/StaticPage';
import { AboutContent, FAQContent, PrivacyContent, TermsContent } from './features/ui/StaticContent';
import SmoothScrollProvider from './features/ui/SmoothScrollProvider';
import Preloader from './features/ui/Preloader';
import PageTransition from './features/ui/PageTransition';

// 🛡️ Global Error Boundary to prevent blank pages
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Log error to console for debugging
      console.error("🔴 ERROR BOUNDARY CAUGHT:", this.state.error);

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-right" dir="rtl">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-red-100 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-4">عذراً، حدث خطأ غير متوقع</h1>
            <p className="text-slate-500 font-bold mb-4 leading-relaxed">
              واجه النظام مشكلة تقنية أثناء تحميل هذه الصفحة.
            </p>
            {/* Show error details only in development */}
            {(import.meta.env.DEV || true) ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left max-h-48 overflow-auto" dir="ltr">
                <p className="text-xs font-mono text-red-600 break-all whitespace-pre-wrap">
                  {this.state.error?.message || 'Unknown error'}
                  {'\n\n'}
                  {this.state.error?.stack || ''}
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-center">
                <p className="text-sm font-bold text-slate-500">كود الخطأ: ERR_SYSTEM_FAILURE</p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black shadow-lg shadow-slate-700/20 hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                تحديث الصفحة
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <HomeIcon size={18} />
                العودة للرئيسية
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 📦 Core Pages (Lazy Loaded)
const Home = lazy(() => import('./pages/Home'));
const Hotels = lazy(() => import('./pages/Hotels'));
const HotelDetails = lazy(() => import('./pages/HotelDetails'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const VoucherPage = lazy(() => import('./pages/VoucherPage'));

// 📄 Secondary Pages
const BookingPage = lazy(() => import('./pages/BookingPage'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Auth = lazy(() => import('./pages/Auth'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const Profile = lazy(() => import('./pages/Profile'));
const PaymentCallback = lazy(() => import('./pages/PaymentCallback'));
const CompareHotels = lazy(() => import('./pages/CompareHotels'));
import ComparisonBar from './features/ui/ComparisonBar';

import { useLenis } from '@studio-freight/react-lenis';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const lenis = useLenis();

  // 🔄 Smart Hash Redirect Fix
  useEffect(() => {
    if (window.location.hash) {
      const hashPath = window.location.hash.replace(/^#/, '');
      if (hashPath.startsWith('/') && hashPath !== '/') {
        console.log('Detected hash path, redirecting to:', hashPath);
        navigate(hashPath, { replace: true });
      }
    }
  }, [navigate]);

  useEffect(() => {
    // 1. Native Scroll Reset
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
    } catch (e) {
      window.scrollTo(0, 0);
    }

    // 2. Lenis Scroll Reset (Critical for smooth scroll)
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return null;
};

// Placeholder pages for new routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="pt-40 pb-20 text-right max-w-7xl mx-auto px-6 space-y-4">
    <h1 className="text-4xl font-black text-slate-900">{title}</h1>
    <p className="text-slate-500 font-bold">هذه الصفحة ستكون متاحة قريباً بتصميم 2026 المذهل.</p>
    <div className="h-64 flex items-center justify-end">
      <div className="w-16 h-16 border-4 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);

// 🌀 Animation Wrapper
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <PageTransition>{children}</PageTransition>
);

const App: React.FC = () => {
  const location = useLocation();
  useAntiTamper(); // 🛡️ Activate Site-wide Security Shield
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isBookingRoute = location.pathname.startsWith('/booking');
  const shouldHideNavbar = isAdminRoute || isBookingRoute;

  return (
    <div className="min-h-screen flex flex-col bg-luxury-bg selection:bg-gold/10 selection:text-gold-dark text-right" dir="rtl">
      <Preloader />
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-grow">
        <ErrorBoundary>
          <SmoothScrollProvider>
            <Suspense fallback={<div className="min-h-screen" />}>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                  <Route path="/compare" element={<PageWrapper><CompareHotels /></PageWrapper>} />
                  <Route path="/hotels" element={<PageWrapper><Hotels /></PageWrapper>} />
                  <Route path="/hotel/:id" element={<PageWrapper><HotelDetails /></PageWrapper>} />
                  <Route path="/booking/:id" element={<PageWrapper><BookingPage /></PageWrapper>} />
                  <Route path="/booking/:id/voucher" element={<PageWrapper><VoucherPage /></PageWrapper>} />
                  <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
                  <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
                  <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
                  <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
                  <Route path="/favorites" element={<PageWrapper><Profile /></PageWrapper>} />
                  <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
                  <Route path="/admin/login" element={<PageWrapper><AdminLogin /></PageWrapper>} />
                  <Route path="/payment/callback" element={<PageWrapper><PaymentCallback /></PageWrapper>} />

                  {/* Static Pages */}
                  <Route path="/about" element={<PageWrapper><StaticPage title="من نحن" subtitle="قصة ضيافة خلود.. رحلة من التميز في الضيافة إلى العالم." icon={Users} content={<AboutContent />} /></PageWrapper>} />
                  <Route path="/team" element={<PageWrapper><StaticPage title="فريق العمل" subtitle="نخبـة من الخبراء في مجال الضيافة والخدمات الفاخرة." icon={Users} content={<AboutContent />} /></PageWrapper>} />
                  <Route path="/jobs" element={<PageWrapper><StaticPage title="الوظائف" subtitle="انضم إلينا وكن جزءاً من قصة نجاحنا." icon={Briefcase} /></PageWrapper>} />
                  <Route path="/partners" element={<PageWrapper><StaticPage title="شركاء النجاح" subtitle="نفخر بشراكتنا مع كبرى الفنادق وشركات الخدمات." icon={Users} /></PageWrapper>} />

                  <Route path="/help" element={<PageWrapper><StaticPage title="مركز المساعدة" subtitle="كيف يمكننا مساعدتك اليوم؟" icon={HelpCircle} content={<FAQContent />} /></PageWrapper>} />
                  <Route path="/faq" element={<PageWrapper><StaticPage title="الأسئلة الشائعة" subtitle="إجابات لأكثر الاستفسارات شيوعاً." icon={HelpCircle} content={<FAQContent />} /></PageWrapper>} />
                  <Route path="/privacy" element={<PageWrapper><StaticPage title="سياسة الخصوصية" subtitle="نحن نلتزم بحماية بياناتك وخصوصيتك." icon={Shield} content={<PrivacyContent />} /></PageWrapper>} />
                  <Route path="/terms" element={<PageWrapper><StaticPage title="الشروط والأحكام" subtitle="القواعد والضوابط المنظمة لاستخدام الموقع وخدماتنا." icon={FileText} content={<TermsContent />} /></PageWrapper>} />
                  <Route path="/sitemap" element={<PageWrapper><StaticPage title="خريطة الموقع" icon={FileText} /></PageWrapper>} />

                  <Route path="*" element={<PageWrapper><Placeholder title="الصفحة غير موجودة" /></PageWrapper>} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </SmoothScrollProvider>
        </ErrorBoundary>
      </main>
      <ComparisonBar />
      {!isAdminRoute && <Footer />}
    </div>
  );
};

const AppWrapper: React.FC = () => (
  <BrowserRouter>
    <SearchProvider>
      <UserPreferencesProvider>
        <AuthProvider>
          <ScrollToTop />
          <App />
        </AuthProvider>
      </UserPreferencesProvider>
    </SearchProvider>
  </BrowserRouter>
);

export default AppWrapper;
