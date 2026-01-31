import React, { useEffect, Suspense, lazy } from 'react';
import 'leaflet/dist/leaflet.css'; // 🗺️ Leaflet CSS (Fixes Empty Maps)
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { SearchProvider } from './contexts/SearchContext';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import { AuthProvider } from './contexts/AuthContext';
import { AlertCircle, RefreshCw, Home as HomeIcon, Users, Briefcase, HelpCircle, Shield, FileText } from 'lucide-react';
import StaticPage from './pages/StaticPage';
import { AboutContent, FAQContent, PrivacyContent, TermsContent } from './components/StaticContent';

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
            {/* Show error details for debugging */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left max-h-48 overflow-auto" dir="ltr">
              <p className="text-xs font-mono text-red-600 break-all whitespace-pre-wrap">
                {this.state.error?.message || 'Unknown error'}
                {'\n\n'}
                {this.state.error?.stack || ''}
              </p>
            </div>
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

// 📄 Secondary Pages
const BookingPage = lazy(() => import('./pages/BookingPage'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Auth = lazy(() => import('./pages/Auth'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const Profile = lazy(() => import('./pages/Profile'));
const PaymentCallback = lazy(() => import('./pages/PaymentCallback'));
const CompareHotels = lazy(() => import('./pages/CompareHotels'));
import ComparisonBar from './components/ComparisonBar';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

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
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
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

const App: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isBookingRoute = location.pathname.startsWith('/booking');
  const shouldHideNavbar = isAdminRoute || isBookingRoute;

  return (
    <div className="min-h-screen flex flex-col bg-luxury-bg selection:bg-gold/10 selection:text-gold-dark text-right" dir="rtl">
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-grow">
        <ErrorBoundary>
          <Suspense fallback={<div className="min-h-screen" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/compare" element={<CompareHotels />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotel/:id" element={<HotelDetails />} />
              <Route path="/booking/:id" element={<BookingPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/favorites" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/payment/callback" element={<PaymentCallback />} />

              {/* Static Pages */}
              <Route path="/about" element={<StaticPage title="من نحن" subtitle="قصة ضيافة خلود.. من مكة المكرمة إلى العالم." icon={Users} content={<AboutContent />} />} />
              <Route path="/team" element={<StaticPage title="فريق العمل" subtitle="نخبـة من الخبراء في مجال الضيافة وخدمة المعتمرين." icon={Users} content={<AboutContent />} />} />
              <Route path="/jobs" element={<StaticPage title="الوظائف" subtitle="انضم إلينا وكن جزءاً من قصة نجاحنا." icon={Briefcase} />} />
              <Route path="/partners" element={<StaticPage title="شركاء النجاح" subtitle="نفخر بشراكتنا مع كبرى الفنادق وشركات الخدمات." icon={Users} />} />

              <Route path="/help" element={<StaticPage title="مركز المساعدة" subtitle="كيف يمكننا مساعدتك اليوم؟" icon={HelpCircle} content={<FAQContent />} />} />
              <Route path="/faq" element={<StaticPage title="الأسئلة الشائعة" subtitle="إجابات لأكثر الاستفسارات شيوعاً." icon={HelpCircle} content={<FAQContent />} />} />
              <Route path="/privacy" element={<StaticPage title="سياسة الخصوصية" subtitle="نحن نلتزم بحماية بياناتك وخصوصيتك." icon={Shield} content={<PrivacyContent />} />} />
              <Route path="/terms" element={<StaticPage title="الشروط والأحكام" subtitle="القواعد والضوابط المنظمة لاستخدام الموقع وخدماتنا." icon={FileText} content={<TermsContent />} />} />
              <Route path="/sitemap" element={<StaticPage title="خريطة الموقع" icon={FileText} />} />

              <Route path="*" element={<Placeholder title="الصفحة غير موجودة" />} />
            </Routes>
          </Suspense>
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
