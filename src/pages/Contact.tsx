

import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.type === 'email' ? 'email' : e.target.localName === 'textarea' ? 'message' : 'name']: e.target.value }));
  };

  // Helper to map generic name/email/message from the specific inputs in code
  // Since the original inputs didn't have names, let's fix that first in the form below.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.error || 'حدث خطأ أثناء الإرسال');
      }
    } catch (err) {
      setError('فشل الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
      <div className="bg-white rounded-[3.5rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl border border-slate-100/50">
        {/* Information Panel - Premium Navy */}
        <div className="lg:w-1/2 bg-secondary p-12 lg:p-20 text-right flex flex-col justify-between order-2 lg:order-1 relative overflow-hidden">
          {/* Subtle Decorative Gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-end gap-3 mb-8">
              <span className="text-gold font-black text-[10px] tracking-[0.4em] uppercase">ارتقِ بتجربتك</span>
              <div className="w-10 h-px bg-gold/30"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter leading-tight">تواصل معنا</h1>
            <p className="text-slate-400 font-bold mb-14 leading-relaxed max-w-xs ml-auto">
              فريق دعم <span className="text-gold">ضيافة خلود</span> متاح على مدار الساعة لتقديم الدعم الفني وتسهيل رحلتكم، مدعوماً بأحدث أنظمة الذكاء الاصطناعي.
            </p>

            <div className="space-y-12">


              <div className="flex items-center gap-6 justify-end group cursor-pointer">
                <div className="text-right">
                  <h4 className="text-white font-black text-lg group-hover:text-gold transition-colors">البريد الإلكتروني</h4>
                  <p className="text-slate-400 text-sm font-bold mt-1">Diyafaat.khulood@outlook.sa</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 group-hover:bg-gold group-hover:border-gold transition-all duration-300 shadow-lg">
                  <svg className="w-6 h-6 text-gold group-hover:text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-6 justify-end group cursor-pointer">
                <div className="text-right">
                  <h4 className="text-white font-black text-lg group-hover:text-gold transition-colors">الدعم المباشر</h4>
                  <p className="text-slate-400 text-sm font-bold mt-1">055 388 2445</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 group-hover:bg-gold group-hover:border-gold transition-all duration-300 shadow-lg">
                  <svg className="w-6 h-6 text-gold group-hover:text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-end mt-16 pt-10 border-t border-white/5 relative z-10">
            {['Twitter', 'Instagram', 'WhatsApp'].map((social) => (
              <div key={social} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-300 cursor-pointer group shadow-sm">
                <span className="text-[10px] font-black text-white group-hover:text-secondary">{social[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Panel - Clean White */}
        <div className="lg:w-1/2 p-12 lg:p-20 text-right bg-white order-1 lg:order-2">
          {success ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-8 border border-emerald-100 shadow-sm">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-3xl font-black text-secondary mb-4 tracking-tight">تم الإرسال بنجاح</h3>
              <p className="text-slate-400 font-bold max-w-[250px]">شكراً لتواصلك معنا. سيتواصل معك فريق النخبة في أقرب وقت.</p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-10 px-8 py-3 bg-secondary text-white font-black rounded-full hover:bg-gold transition-all duration-300 active:scale-95 shadow-lg shadow-secondary/10"
              >
                إرسال رسالة أخرى
              </button>
            </div>
          ) : (
            <form className="space-y-10" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mr-2">الاسم بالكامل</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-2 focus:ring-gold focus:bg-white focus:border-gold/20 transition-all font-bold text-right text-secondary placeholder:text-slate-300"
                  placeholder="أدخل اسمك الكريم"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-3xl px-8 py-5 outline-none focus:ring-2 focus:ring-gold focus:bg-white focus:border-gold/20 transition-all font-bold text-right text-secondary placeholder:text-slate-300"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mr-2">نص الرسالة أو الاستفسار</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-[2.5rem] px-8 py-6 outline-none focus:ring-2 focus:ring-gold focus:bg-white focus:border-gold/20 transition-all font-bold text-right text-secondary placeholder:text-slate-300 resize-none"
                  placeholder="كيف يمكن لخدمة ضيافة خلود مساعدتكم اليوم؟"
                  required
                ></textarea>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-black border border-red-100 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                className="w-full bg-gold text-secondary font-black py-6 rounded-3xl shadow-[0_20px_40px_-15px_rgba(214,179,114,0.3)] hover:bg-gold-dark hover:shadow-gold/40 transition-all duration-500 transform hover:-translate-y-1 active:scale-95 text-lg flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
                    <span>جاري الإرسال...</span>
                  </div>
                ) : (
                  <>
                    <span>إرسال الطلب الآن</span>
                    <div className="w-8 h-8 rounded-full bg-secondary/5 flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                      <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
