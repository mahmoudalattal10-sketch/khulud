
import React, { useEffect, useState } from 'react';
import { Mail, Search, CheckCircle, Clock } from 'lucide-react';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

const MessagesTab: React.FC = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/contact');
            const data = await response.json();
            if (data.success) {
                setMessages(data.data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch(`http://localhost:3001/api/contact/${id}/read`, { method: 'PATCH' });
            setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, isRead: true } : msg));
        } catch (error) {
            console.error('Error updating message:', error);
        }
    };

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-slate-400">جاري تحميل الرسائل...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-text">رسائل العملاء</h2>
                    <p className="text-slate-500 font-medium">إدارة استفسارات نموذج "تواصل معنا"</p>
                </div>

                <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="بحث في الرسائل..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm"
                    />
                </div>
            </div>

            {/* Messages Grid */}
            <div className="grid grid-cols-1 gap-4">
                {filteredMessages.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
                        <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-600">لا توجد رسائل</h3>
                        <p className="text-slate-400">لم يتم استلام أي رسائل من العملاء حتى الان</p>
                    </div>
                ) : (
                    filteredMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`bg-white rounded-2xl p-6 border transition-all hover:shadow-md ${!msg.isRead ? 'border-emerald-500/30 bg-emerald-50/10' : 'border-slate-100'
                                }`}
                        >
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        {!msg.isRead && (
                                            <span className="bg-slate-800 text-white text-[10px] font-black px-2 py-0.5 rounded-full">جديد</span>
                                        )}
                                        <h3 className="font-bold text-text text-lg">{msg.name}</h3>
                                        <span className="text-slate-400 text-xs font-mono">{new Date(msg.createdAt).toLocaleDateString('ar-SA')}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-4">
                                        <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                                            <Mail size={12} /> {msg.email}
                                        </span>
                                        {msg.phone && (
                                            <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                                                <Clock size={12} /> {msg.phone}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                                        {msg.message}
                                    </p>
                                </div>
                                <div className="flex flex-col justify-center items-end min-w-[150px]">
                                    {!msg.isRead ? (
                                        <button
                                            onClick={() => markAsRead(msg.id)}
                                            className="flex items-center gap-2 text-primary bg-emerald-50 px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors"
                                        >
                                            <CheckCircle size={16} />
                                            تعليم كمقروء
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2 text-slate-400 text-sm font-bold opacity-50">
                                            <CheckCircle size={16} />
                                            تمت القراءة
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MessagesTab;
