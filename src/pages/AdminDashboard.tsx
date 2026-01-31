
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import StatCard from '../components/admin/StatCard';
import BookingTable from '../components/admin/BookingTable';
import DestinationsTab from '../components/admin/DestinationsTab';
import CustomersTab from '../components/admin/CustomersTab';
import AnalyticsTab from '../components/admin/AnalyticsTab';
import SettingsTab from '../components/admin/SettingsTab';
import MessagesTab from '../components/admin/MessagesTab'; // [NEW]
import CouponsTab from '../components/admin/CouponsTab'; // [NEW]
import AdminSettings from '../components/admin/AdminSettings';
import NotificationDropdown, { Notification } from '../components/admin/NotificationDropdown';
import { useAdminHotels } from '../hooks/useAdminHotels';
import { AuthAPI, User } from '../services/api';
import { useAdminStats } from '../hooks/useAdminStats'; // [NEW]
import {
  Users,
  Wallet,
  MapPin,
  TrendingUp,
  Search,
  Bell,
  ChevronDown,
  Globe,
  Plus,
  CalendarDays,
  Sparkles,
  CheckCircle2,
  Info,
  AlertCircle,
  Clock,
  X,
  CreditCard,
  Building2,
  Loader2,
  RefreshCw,
  Menu,
  ShieldCheck,
  Bot
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const chartData = [
  { name: 'يناير', value: 4200, users: 2400 },
  { name: 'فبراير', value: 3800, users: 1398 },
  { name: 'مارس', value: 5400, users: 9800 },
  { name: 'أبريل', value: 4780, users: 3908 },
  { name: 'مايو', value: 6890, users: 4800 },
  { name: 'يونيو', value: 5390, users: 3800 },
  { name: 'يوليو', value: 7490, users: 4300 },
];

// ⌨️ Typewriter Effect Component
const Typewriter = ({ sentences, delay = 50, typingDelay = 1500 }: { sentences: string[], delay?: number, typingDelay?: number }) => {
  const [text, setText] = useState('');
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const handleTyping = () => {
      const currentSentence = sentences[currentSentenceIndex];

      if (isDeleting) {
        if (charIndex > 0) {
          setText(currentSentence.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setCurrentSentenceIndex((prev) => (prev + 1) % sentences.length);
        }
      } else {
        if (charIndex < currentSentence.length) {
          setText(currentSentence.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), typingDelay);
        }
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? delay / 2 : delay);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, sentences, currentSentenceIndex, delay, typingDelay]);

  return (
    <span>
      {text}
      <span className="animate-pulse border-r-2 border-slate-800 ml-1 h-4 inline-block align-middle"></span>
    </span>
  );
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Admin Name State
  const [adminDisplayName, setAdminDisplayName] = useState('محمد نور');

  useEffect(() => {
    const loadName = () => {
      const saved = localStorage.getItem('admin_name');
      if (saved) setAdminDisplayName(saved);
    };
    loadName();

    window.addEventListener('adminNameChanged', loadName);
    return () => window.removeEventListener('adminNameChanged', loadName);
  }, []);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // 🚀 DYNAMIC DATA: Using useAdminHotels hook instead of static data
  const {
    hotels,
    loading: hotelsLoading,
    error: hotelsError,
    saving,
    refetch,
    saveHotel,
    deleteHotel,
    createHotel,
    createReview,
    deleteReview,
    toggleVisibility,
    toggleFeatured,
    updateRoom // ✨ Exposed for specific room updates
  } = useAdminHotels();

  // 📊 REAL STATS HOOK
  const { stats, loading: statsLoading } = useAdminStats();

  // 🔐 Verify admin access on page load
  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        const response = await AuthAPI.verify();
        if (response.success && response.data?.user) {
          const { role } = response.data.user;
          if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
            // Safe access to stored admin user info
            try {
              const storedUser = localStorage.getItem('adminUser');
              if (storedUser) {
                setAdminUser(JSON.parse(storedUser));
              } else {
                setAdminUser(response.data.user as any); // Cast to match User type
              }
            } catch (e) {
              setAdminUser(response.data.user as any); // Cast to match User type
            }
          } else {
            // Not an admin
            navigate('/admin/login');
          }
        } else {
          // Token invalid or expired
          navigate('/admin/login');
        }
      } catch (err) {
        navigate('/admin/login');
      } finally {
        setIsVerifying(false);
      }
    };
    verifyAdminAccess();
  }, [navigate]);

  const handleToggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/hotels/${id}/featured`, { method: 'PATCH' });
      const updatedHotel = await response.json();
      return updatedHotel;
    } catch (error) {
      console.error('Error toggling featured status:', error);
      return null;
    }
  };

  const handleCreateReview = async (review: any) => {
    // This function was incomplete in the instruction, assuming it's a placeholder or needs implementation.
    // For now, it's an empty async function as per the provided structure.
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🔔 NOTIFICATIONS LOGIC
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('diafat_auth_token');
      if (!token) return;

      const response = await fetch('http://localhost:3001/api/admin/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (adminUser) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
      return () => clearInterval(interval);
    }
  }, [adminUser]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('diafat_auth_token');
      await fetch(`http://localhost:3001/api/admin/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'صباح الخير' : hour < 18 ? 'طاب يومك' : 'مساء الخير';

        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {/* 2026 Welcome Hero Section - AI Style (Light/Transparent) */}
            <div className="relative overflow-hidden rounded-[3rem] p-10 group">

              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="text-center md:text-right w-full">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                    {/* Badges Removed by Request */}
                  </div>


                  {/* Chat Bubble Interface */}
                  <div className="relative max-w-2xl w-full">
                    {/* AI Sender Name */}
                    <div className="absolute -top-8 right-2 flex items-center gap-2">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Elattal Co. v4</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>

                    {/* Chat Triangle */}
                    <div className="absolute -top-2 right-8 w-4 h-4 bg-white border-t border-l border-slate-100 transform rotate-45 z-20"></div>

                    <div className="bg-white/80 backdrop-blur-md border border-slate-100 p-8 rounded-[2rem] rounded-tr-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(214,179,114,0.15)] transition-all duration-500 group/chat relative z-10">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 min-w-[24px]">
                          <Bot className="w-6 h-6 text-emerald-500" />
                        </div>
                        <p className="text-slate-700 text-sm md:text-base font-bold leading-relaxed w-full font-mono">
                          {/* Typewriter Effect - System Status */}
                          <Typewriter
                            sentences={(() => {
                              const time = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                              const criticalRooms: string[] = [];
                              hotels?.forEach(h => {
                                h.rooms?.forEach(r => {
                                  if ((r.available || 0) < 5) {
                                    criticalRooms.push(`غرفة ${r.name} في ${h.name} (متبقي ${r.available || 0})`);
                                  }
                                });
                              });

                              const normalize = (str: string) => str?.toLowerCase().trim() || '';

                              const makkahHotels = hotels?.filter(h => {
                                const c = normalize(h.city || '');
                                return c.includes('makkah') || c.includes('mecca') || c.includes('مكة') || c.includes('مكه');
                              }).length || 0;

                              const madinahHotels = hotels?.filter(h => {
                                const c = normalize(h.city || '');
                                return c.includes('madinah') || c.includes('medina') || c.includes('المدينة') || c.includes('المدينه');
                              }).length || 0;

                              const totalHotels = hotels?.length || 0;

                              // Debugging log
                              // console.log('Hotels:', hotels?.map(h => h.city));

                              const baseSentences = [
                                `Elattal Co. v4 | آخر تحديث للبيانات: ${time}`,
                                `🏨 التوسع الفندقي: ${totalHotels} فندق في النظام (${makkahHotels} في مكة، ${madinahHotels} في المدينة).`,
                                `💰 الأداء المالي: إجمالي المبيعات ${stats?.sales?.toLocaleString() || 0} ر.س | صافي الأرباح ${stats?.profit?.toLocaleString() || 0} ر.س`,
                              ];

                              if (criticalRooms.length > 0) {
                                baseSentences.push(`⚠️ تحليل المخزون: يوجد ${criticalRooms.length} غرف وصلت للحد الحرج.`);
                                // Show details of up to 3 critical rooms
                                criticalRooms.slice(0, 3).forEach(detail => baseSentences.push(`🔴 تنبيه حرج: ${detail}`));
                              } else {
                                baseSentences.push(`✅ تحليل المخزون: جميع الغرف متوفرة بكميات آمنة ولا توجد نواقص.`);
                              }

                              return baseSentences;
                            })()}
                            delay={40}
                            typingDelay={8000} // Significant pause (8s) to allow reading
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stat Cards - Grid Separated from Hero */}
            <div className="grid grid-cols-4 gap-6">
              <StatCard
                label="إجمالي المبيعات"
                value={stats ? `${stats.sales.toLocaleString()} SAR` : '...'}
                icon={<Wallet size={24} strokeWidth={2.5} />}
                gradient="bg-gradient-to-br from-emerald-600 to-emerald-800"
                color="text-emerald-700"
              />
              <StatCard
                label="صافي الأرباح (15%)"
                value={stats ? `${stats.profit.toLocaleString()} SAR` : '...'}
                icon={<TrendingUp size={24} strokeWidth={2.5} />}
                gradient="bg-gradient-to-br from-gold to-amber-600"
                color="text-gold-dark"
              />
              <StatCard
                label="حجوزات مؤكدة"
                value={stats ? `${stats.confirmedCount || 0}` : '...'}
                icon={<ShieldCheck size={24} strokeWidth={2.5} />}
                gradient="bg-gradient-to-br from-indigo-500 to-indigo-700"
                color="text-indigo-600"
              />
              <StatCard
                label="حجوزات نشطة"
                value={stats ? `${stats.activeBookings}` : '...'}
                icon={<CalendarDays size={24} strokeWidth={2.5} />}
                gradient="bg-gradient-to-br from-slate-700 to-slate-900"
                color="text-primary"
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 bg-white/40 backdrop-blur-2xl p-10 rounded-[4rem] border border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">إحصائيات التدفق الزمني المستقبلي</h3>
                    <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">توقعات وتحليلات النمو لعام 2026</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  </div>
                </div>
                <div className="h-[380px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.monthlyStats || []}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ca678" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#0ca678" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#e2e8f0" opacity={0.4} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800 }} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800 }} dx={-10} />
                      <Tooltip
                        contentStyle={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}
                        itemStyle={{ color: '#0ca678', fontWeight: 900 }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#0ca678" strokeWidth={6} fillOpacity={1} fill="url(#colorValue)" animationDuration={2000} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/40 backdrop-blur-2xl p-10 rounded-[4rem] border border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col">
                <div className="mb-12">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">توزيع الوجهات</h3>
                  <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">تحليل جغرافي للحجوزات</p>
                </div>
                <div className="space-y-10 flex-1 flex flex-col justify-center">
                  {(stats?.destinations || []).map((dest, i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-3xl transition-transform group-hover:scale-110 duration-500">
                            {dest.icon}
                          </div>
                          <div>
                            <span className="text-lg font-black text-slate-700 group-hover:text-emerald-600 transition-colors block">{dest.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dest.percentage}% من الإجمالي</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(12,166,120,0.2)]`}
                          style={{ width: `${dest.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
              <div className="lg:col-span-2">
                <BookingTable />
              </div>
              <div className="space-y-8">
                {/* 2026 Intelligence Feed */}
                <div className="bg-white/40 backdrop-blur-2xl p-8 rounded-[3.5rem] border border-white/60 shadow-xl shadow-slate-200/20">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">آخر النشاطات</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">تحديثات النظام الحية</p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center animate-pulse">
                      <RefreshCw size={18} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {notifications.slice(0, 4).map((notif) => {
                      // Determine color based on notification type
                      let color = "bg-blue-500";
                      if (notif.type === 'BOOKING') color = "bg-emerald-500";
                      else if (notif.type === 'PAYMENT') color = "bg-green-500";
                      else if (notif.type === 'ALERT') color = "bg-amber-500";
                      else if (notif.type === 'WARNING') color = "bg-red-500";

                      // Calculate time ago
                      const timeAgo = (() => {
                        const now = new Date();
                        const created = new Date(notif.createdAt);
                        const diff = Math.floor((now.getTime() - created.getTime()) / 1000 / 60);
                        if (diff < 1) return 'منذ لحظات';
                        if (diff < 60) return `منذ ${diff} دقيقة`;
                        const hours = Math.floor(diff / 60);
                        if (hours < 24) return `منذ ${hours} ساعة`;
                        const days = Math.floor(hours / 24);
                        return `منذ ${days} يوم`;
                      })();

                      return (
                        <div key={notif.id} className="flex items-center gap-4 group cursor-pointer p-2 rounded-2xl hover:bg-white/40 transition-all">
                          <div className={`w-3 h-3 rounded-full ${color} shadow-[0_0_10px_rgba(0,0,0,0.1)] group-hover:scale-125 transition-transform`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-slate-700 truncate">{notif.title}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">{notif.message}</p>
                          </div>
                          <span className="text-[9px] font-black text-slate-300 uppercase whitespace-nowrap">{timeAgo}</span>
                        </div>
                      );
                    })}
                    {notifications.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-sm text-slate-400 font-bold">لا توجد نشاطات حديثة</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveTab('messages')}
                    className="w-full py-4 mt-8 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 hover:bg-white hover:text-emerald-500 transition-all uppercase tracking-widest"
                  >
                    مشاهدة السجل الكامل
                  </button>
                </div>

              </div>
            </div>
          </div>
        );
      case 'destinations': {
        if (hotelsLoading) {
          return (
            <div className="flex items-center justify-center h-96">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 text-[#0f172a] animate-spin mx-auto" />
                <p className="text-slate-500 font-bold">جاري تحميل الفنادق من السيرفر...</p>
              </div>
            </div>
          );
        }
        if (hotelsError) {
          return (
            <div className="flex items-center justify-center h-96">
              <div className="text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                <p className="text-red-500 font-bold">{hotelsError}</p>
                <button
                  onClick={refetch}
                  className="px-6 py-3 bg-[#0f172a] text-white rounded-xl font-bold flex items-center gap-2 mx-auto"
                >
                  <RefreshCw size={18} /> إعادة المحاولة
                </button>
              </div>
            </div>
          );
        }
        return (
          <DestinationsTab
            hotels={hotels as any}
            setHotels={() => { }}
            onSave={saveHotel}
            onDelete={deleteHotel}
            onCreate={createHotel}
            onRefresh={refetch}
            saving={saving}
            onCreateReview={createReview}
            onDeleteReview={deleteReview}
            onToggleFeatured={toggleFeatured}
            onToggleVisibility={toggleVisibility}
            onUpdateRoom={updateRoom}
          />
        );
      }
      case 'bookings':
        return (
          <div className="animate-in slide-in-from-left duration-500 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <h2 className="text-4xl font-black text-text tracking-tight">سجل الحجوزات الكامل</h2>
                <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">نظام الإدارة الشامل - خلود 2026</p>
              </div>
              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#0f172a] text-white px-10 py-5 rounded-[2rem] font-black text-base hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-slate-900/20"
              >
                <Plus size={22} strokeWidth={3} /> حجز يدوي جديد
              </button>
            </div >
            <BookingTable />
          </div >
        );
      case 'customers':
        return <CustomersTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'settings':
        return <SettingsTab />;
      case 'messages': // [NEW]
        return <MessagesTab />;
      case 'coupons': // [NEW]
        return <CouponsTab />;
      case 'account-settings':
        return <AdminSettings />;
      default:
        console.log('Unknown tab:', activeTab);
        return <div className="p-10 text-center">Unknown Tab: {activeTab}</div>;
    }
  };

  // 🔄 Show loading while verifying authentication
  if (isVerifying) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 grid grid-cols-1 lg:grid-cols-[280px_1fr] selection:bg-slate-200 selection:text-primary">
      {/* Sidebar - Fixed Width via Grid */}
      <div className="hidden lg:block relative z-50">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          adminUser={adminUser}
          hotels={hotels as any[]}
          isOpen={true} // Always open on desktop in this grid cell
          onClose={() => { }}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          adminUser={adminUser}
          hotels={hotels as any[]}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      <main className="w-full min-w-0 transition-all duration-500 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-6 bg-white border-b border-slate-100 sticky top-0 z-[40]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center text-white">
              <MapPin size={20} />
            </div>
            <span className="font-black text-text">ضيافة خلود</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 hover:text-[#0f172a] transition-all shadow-sm"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="p-4 md:p-8 lg:p-10 space-y-12">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div className="relative">
              <h1 className="text-4xl font-black text-text tracking-tight mb-2 flex items-center gap-3">
                أهلاً بك <span className="text-3xl animate-bounce">👋</span>
              </h1>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 bg-white/60 px-4 py-1.5 rounded-full border border-white shadow-sm uppercase tracking-widest">
                  <Globe size={12} className="text-[#0f172a]" /> نظام ضيافة خلود الموحد
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 w-full md:w-auto">
              <div className="glass-card flex items-center px-5 py-3 rounded-2xl group transition-all focus-within:ring-4 ring-slate-900/10 border-white/60 shadow-sm w-full md:w-auto">
                <Search className="text-slate-400 group-focus-within:text-[#0f172a] transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="بحث برقم الحجز أو الاسم..."
                  className="bg-transparent border-none outline-none pr-3 text-xs font-black flex-1 md:w-48 transition-all md:focus:w-64 placeholder:text-slate-300"
                />
              </div>

              <div className="flex items-center gap-3 border-r-0 md:border-r border-slate-200 md:pr-6 md:mr-2 w-full md:w-auto justify-between md:justify-start">
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      if (!showNotifications) fetchNotifications(); // Fetch when opening
                    }}
                    className={`w-14 h-14 glass-card flex items-center justify-center transition-all rounded-2xl relative group ${showNotifications ? 'bg-[#0f172a] text-white shadow-xl shadow-slate-900/20' : 'text-slate-500 hover:bg-slate-50 hover:text-[#0f172a]'}`}
                  >
                    <Bell size={24} strokeWidth={2.2} />
                    {notifications.some(n => !n.isRead) && (
                      <span className="absolute top-4 left-4 w-3 h-3 bg-[#0f172a] rounded-full border-2 border-white animate-pulse"></span>
                    )}
                  </button>

                  <NotificationDropdown
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                    notifications={notifications}
                    onMarkAsRead={handleMarkAsRead}
                  />
                </div>

                <button className="flex items-center gap-4 px-4 py-2.5 glass-card rounded-[1.75rem] border-white/60 hover:border-slate-200 transition-all group shadow-sm active:scale-95">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white flex items-center justify-center border-2 border-slate-700 shadow-lg shadow-slate-200/50 group-hover:border-slate-500/50 group-hover:shadow-slate-500/20 transition-all">
                      <ShieldCheck size={24} strokeWidth={1.5} className="text-gold" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gold border-2 border-white rounded-full"></div>
                  </div>
                  <div className="text-right hidden xl:block ml-1">
                    <p className="text-sm font-black text-text group-hover:text-slate-700 transition-colors">Super Admin</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">المدير التنفيذي</p>
                  </div>
                  <ChevronDown size={14} className="text-slate-400 mr-1 group-hover:text-[#0f172a] transition-all group-hover:rotate-180" />
                </button>
              </div>
            </div>
          </header>

          {renderContent()}

          {/* Modal: New Booking */}
          {showBookingModal && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
              <div className="absolute inset-0 bg-primary/40 backdrop-blur-md" onClick={() => setShowBookingModal(false)}></div>
              <div className="relative glass-card w-full max-w-2xl rounded-[3rem] border border-white p-12 animate-in slide-in-from-bottom-10 duration-500 shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-[#0f172a] text-white rounded-2xl shadow-xl shadow-slate-900/20 flex items-center justify-center">
                      <CreditCard size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-text">حجز يدوي جديد</h3>
                      <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">نموذج التسجيل المباشر للحجوزات</p>
                    </div>
                  </div>
                  <button onClick={() => setShowBookingModal(false)} className="p-3 bg-slate-100 text-slate-400 hover:text-red-500 rounded-2xl transition-all shadow-sm">
                    <X size={20} />
                  </button>
                </div>

                <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setShowBookingModal(false); alert('تم تسجيل الحجز الجديد بنجاح!'); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase mb-3 mr-2 tracking-widest">المعتمر / الزائر</label>
                        <input type="text" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4.5 text-sm font-bold outline-none focus:ring-4 ring-slate-900/10 transition-all" placeholder="الاسم الرباعي" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase mb-3 mr-2 tracking-widest">الفندق المختص</label>
                        <div className="relative">
                          <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4.5 text-sm font-bold outline-none focus:ring-4 ring-slate-900/10 appearance-none">
                            <option>فندق جبل عمر كونراد</option>
                            <option>برج الساعة الملكي</option>
                            <option>فندق دار التقوى</option>
                            <option>فندق الشيراتون المدينة</option>
                          </select>
                          <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase mb-3 mr-2 tracking-widest">تاريخ الوصول</label>
                        <input type="date" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4.5 text-sm font-bold outline-none focus:ring-4 ring-slate-900/10" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase mb-3 mr-2 tracking-widest">مبلغ الحجز الإجمالي (SAR)</label>
                        <div className="relative">
                          <input type="number" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4.5 text-sm font-black text-primary outline-none focus:ring-4 ring-slate-900/20" placeholder="0.00" />
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">SAR</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex gap-4">
                    <button type="button" onClick={() => setShowBookingModal(false)} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-3xl font-black text-base hover:bg-slate-200 transition-all">إلغاء</button>
                    <button type="submit" className="flex-[2] py-5 bg-[#0f172a] text-white rounded-3xl font-black text-base shadow-xl shadow-slate-900/30 hover:scale-[1.02] active:scale-95 transition-all">تأكيد الحجز والإرسال للنظام</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
