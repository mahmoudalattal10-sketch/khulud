
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { useAdminAnalytics } from '../../hooks/useAdminStats';

// Unused hardcoded data removed

const COLORS = ['#0ca678', '#3b82f6', '#8b5cf6', '#059669'];

const AnalyticsTab: React.FC = () => {
  const { data, loading } = useAdminAnalytics();

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ca678]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in zoom-in-95 duration-500">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-[3rem] border border-white/80">
          <h3 className="text-xl font-black text-text mb-8">نمو الزوار الأسبوعي</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weekly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="visitors" fill="#0ca678" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[3rem] border border-white/80">
          <h3 className="text-xl font-black text-text mb-8">تطور المبيعات (SAR)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.weekly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none' }} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 pb-12">
        <div className="glass-card p-8 rounded-[3rem] border border-white/80">
          <h3 className="text-xl font-black text-text mb-4">التحليلات التفصيلية</h3>
          <p className="text-slate-400 font-bold mb-6">مقارنة أداء الفنادق (نسبة الإشغال)</p>
          <div className="space-y-4">
            {data.hotels.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs font-black text-slate-600 mb-2">
                  <span>{item.name}</span>
                  <span>{item.val} إشغال</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: item.val }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
