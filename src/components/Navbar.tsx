

import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Shield } from 'lucide-react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { compareList } = useUserPreferences();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 40);
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsSearchActive(document.body.classList.contains('search-overlay-open'));
        }
      });
    });

    observer.observe(document.body, { attributes: true });

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // روابط الهيدر الرئيسية للكمبيوتر والتابلت
  const headerLinks: { name: string; path: string; label?: string }[] = [
    { name: 'الرئيسية', path: '/' },
    { name: 'الفنادق', path: '/hotels' },
    { name: 'من نحن', path: '/about' },
    { name: 'تواصل معنا', path: '/contact' },
  ];

  const dockLinks = [
    {
      name: 'الرئيسية', path: '/', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
      )
    },
    {
      name: 'الفنادق', path: '/hotels', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
      )
    },
    {
      name: 'المفضلة', path: '/favorites', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
      )
    },
    {
      name: 'حسابي', path: '/profile', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
      )
    },
  ];

  return (
    <>
      {/* Tablet & Desktop Navbar - Larger and more prominent elite design */}
      <nav className={`fixed top-4 left-0 right-0 z-[1000] transition-all duration-1000 cubic-bezier(0.19, 1, 0.22, 1) px-4 md:px-8 hidden md:block`}>
        <div className={`mx-auto transition-all duration-[900ms] cubic-bezier(0.23, 1, 0.32, 1) ${isScrolled ? 'max-w-4xl lg:max-w-5xl' : 'max-w-5xl lg:max-w-6xl'}`}>
          <div
            className={`flex items-center justify-between px-8 lg:px-10 transition-all duration-[900ms] rounded-full border ${isScrolled ? 'h-18 border-slate-200/50 shadow-2xl backdrop-blur-3xl bg-white/70' : 'h-22 border-slate-100/50 shadow-lg bg-white/40 backdrop-blur-md'}`}
          >

            {/* Right Side: Brand */}
            <div className="flex-1 flex items-center justify-start">
              <Link to="/" className={`transition-all duration-700 ${isScrolled ? 'scale-[0.85]' : 'scale-[1.0]'}`}>
                <img src="/assets/images/ui/logo.png" alt="Logo" className="h-16 lg:h-20 w-auto" />
              </Link>
            </div>

            {/* Center: Navigation Links */}
            <div className="flex items-center justify-center gap-6 lg:gap-10">
              {headerLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs lg:text-sm font-black transition-all duration-300 relative group ${currentPath === link.path ? 'text-gold' : 'text-slate-500 hover:text-text'}`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1.5 right-0 h-0.5 bg-gold transition-all duration-500 ${currentPath === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              ))}
            </div>

            {/* Left Side: Auth */}
            <div className="flex-1 flex items-center justify-end">
              {user ? (
                // Logged In State
                <div className="relative group/menu">
                  <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full hover:bg-white hover:shadow-md transition-all">
                    <span className="text-xs font-black text-slate-700 hidden lg:block">{user.name.split(' ')[0]}</span>
                    <div className="w-9 h-9 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center text-white shadow-sm">
                      <User size={18} strokeWidth={2.5} />
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute left-0 top-full mt-2 w-56 glass-card rounded-2xl border border-white shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 transform translate-y-2 group-hover/menu:translate-y-0 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-sm font-black text-text">{user.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 truncate">{user.email}</p>
                    </div>
                    <div className="p-1">
                      <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-gold rounded-xl transition-all">
                        <User size={14} /> الملف الشخصي
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link to="/admin" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-gold rounded-xl transition-all">
                          <Shield size={14} /> لوحة التحكم
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all text-right"
                      >
                        <LogOut size={14} /> تسجيل الخروج
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Guest State
                <Link to="/auth" className="group">
                  <div className={`flex items-center justify-center px-7 rounded-full bg-gold text-white font-black text-xs lg:text-sm transition-all duration-500 group-hover:bg-[#0f172a] group-hover:shadow-lg active:scale-95 shadow-md shadow-gold/10 ${isScrolled ? 'h-10' : 'h-12'}`}>
                    تسجيل الدخول
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Header - Floating Capsule */}
      <div className={`mobile-header-bar md:hidden fixed top-5 left-0 right-0 z-[1000] px-6 transition-all duration-600 cubic-bezier(0.32, 0.72, 0, 1) ${isMenuOpen ? '-translate-y-28 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div
          className={`max-w-2xl mx-auto border border-slate-200/50 h-16 rounded-full flex items-center justify-between px-5 transition-all duration-500 ${isScrolled ? 'shadow-xl' : 'shadow-lg'}`}
          style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        >

          {/* Logo Section - اللوجو فقط على اليمين */}
          <Link to="/" className="flex items-center transition-transform active:scale-95">
            <img src="/assets/images/ui/logo.png" alt="Logo" className="h-14 w-auto" />
          </Link>

          {/* Burger Menu Button - بدون دائرة خلفية */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-end justify-center gap-1.5 active:scale-90 transition-all duration-300 p-2"
          >
            <span className="h-0.5 w-6 bg-primary rounded-full"></span>
            <span className="h-0.5 w-4 bg-gold rounded-full"></span>
            <span className="h-0.5 w-6 bg-primary rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div className={`fixed inset-0 z-[2000] md:hidden transition-all duration-600 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-white/20 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute top-4 right-4 bottom-4 w-[85%] max-w-sm bg-white/90 backdrop-blur-3xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] transition-transform duration-[800ms] cubic-bezier(0.32, 0.72, 0, 1) border border-white/60 ${isMenuOpen ? 'translate-y-0' : 'translate-y-[110%]'}`}>
          <div className="flex flex-col h-full p-10 pt-12 text-right">
            <div className="flex justify-between items-center mb-16">
              <div className="flex flex-col items-end">
                <span className="text-3xl font-black text-text tracking-tighter">اكتشف</span>
                <span className="text-[10px] font-bold text-gold uppercase tracking-[0.3em]">The Menu</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-text active:scale-90 transition-all shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
              {[...headerLinks, { name: 'حسابي', path: '/profile', label: 'إدارة الحجز والملف الشخصي' }].map((link) => (
                <Link key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)} className="group flex items-center justify-between p-6 rounded-full bg-white/50 border border-white/60 hover:bg-white hover:border-gold/30 transition-all duration-500 text-right">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-gold group-hover:text-white transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                  </div>
                  <div className="text-right flex-1 pr-4">
                    <span className="block text-xl font-black text-text group-hover:text-gold transition-colors tracking-tight">{link.name}</span>
                    {link.label && <span className="block text-[10px] font-bold text-slate-400 group-hover:text-gold/60 mt-0.5">{link.label}</span>}
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-auto pt-8 border-t border-slate-100">
              <div className="w-full bg-primary text-white font-black py-5 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex items-center justify-center gap-3">
                ضيافة خلود 2026
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Dock (Hidden on Desktop/LG+) */}
      <nav className={`lg:hidden fixed bottom-6 left-6 right-6 z-[1000] transition-all duration-700 cubic-bezier(0.32, 0.72, 0, 1) ${isSearchActive || compareList.length > 0 || currentPath.startsWith('/hotel/') ? 'translate-y-36 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="bg-white/50 backdrop-blur-3xl border border-white/60 p-2 rounded-full flex justify-around items-center shadow-[0_30px_70px_-15px_rgba(0,0,0,0.2)] relative">
          {dockLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <Link key={link.name} to={link.path} className="relative flex flex-col items-center justify-center py-2 w-full rounded-full active:scale-90 transition-all duration-300">
                {isActive && <div className="absolute inset-x-1 inset-y-1 bg-gold rounded-full -z-10 animate-ios-slide shadow-lg shadow-gold/20"></div>}
                <div className={`${isActive ? 'text-white' : 'text-slate-400'} transition-all duration-500 mb-0.5`}>{link.icon}</div>
                <span className={`text-[7px] font-black tracking-widest uppercase ${isActive ? 'text-white' : 'text-slate-400'}`}>{link.name}</span>
                {isActive && <div className="absolute -bottom-0.5 w-1 h-1 bg-white rounded-full"></div>}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
