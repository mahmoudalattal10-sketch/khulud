import React, { useEffect, useState } from 'react';
import { Bell, UserPlus, Calendar, Info, X } from 'lucide-react';

const formatArabicDate = (date: Date) => {
    return date.toLocaleString('ar-SA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    data: string | null;
    isRead: boolean;
    createdAt: string;
}

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    onMarkAsRead: (id: string) => Promise<void>;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose, notifications, onMarkAsRead }) => {
    // Internal state removed, using props

    if (!isOpen) return null;

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="absolute top-16 left-0 w-96 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-[50] animate-in slide-in-from-top-2 duration-300">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <h3 className="font-black text-text">التنبيهات</h3>
                    {unreadCount > 0 && (
                        <span className="bg-slate-800 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                            {unreadCount} جديد
                        </span>
                    )}
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <X size={16} className="text-slate-400" />
                </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-10 text-center">
                        <Bell className="mx-auto text-slate-200 mb-2" size={40} />
                        <p className="text-slate-400 font-bold">لا توجد تنبيهات حالياً</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`p-5 hover:bg-slate-50 transition-colors cursor-pointer group relative ${!notif.isRead ? 'bg-emerald-50/30' : ''}`}
                                onClick={() => onMarkAsRead(notif.id)}
                            >
                                <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.type === 'NEW_USER' ? 'bg-blue-50 text-blue-500' :
                                        notif.type === 'NEW_BOOKING' ? 'bg-emerald-50 text-slate-800' :
                                            'bg-slate-100 text-slate-400'
                                        }`}>
                                        {notif.type === 'NEW_USER' ? <UserPlus size={18} /> :
                                            notif.type === 'NEW_BOOKING' ? <Calendar size={18} /> :
                                                <Info size={18} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-text text-sm mb-1">{notif.title}</h4>
                                        <p className="text-xs text-slate-500 font-bold leading-relaxed truncate">{notif.message}</p>
                                        <span className="text-[10px] text-slate-400 font-bold mt-2 block uppercase tracking-wider">
                                            {formatArabicDate(new Date(notif.createdAt))}
                                        </span>
                                    </div>
                                    {!notif.isRead && (
                                        <div className="absolute top-5 left-5 w-2 h-2 bg-slate-800 rounded-full"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button className="w-full py-2.5 text-[10px] font-black text-primary uppercase tracking-widest hover:text-emerald-700 transition-colors">
                    مشاهدة جميع التنبيهات
                </button>
            </div>
        </div>
    );
};

export default NotificationDropdown;
