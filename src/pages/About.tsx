
import React from 'react';
import { Quote, Sparkles, Heart, Hotel, UserCheck } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-24 pb-20 font-cairo text-right bg-[#FDFDFD] min-h-screen">

      {/* 1. Hero Text (Minimalist) */}
      <div className="max-w-4xl mx-auto px-6 mb-20 text-center animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-black text-text mb-6 leading-tight">
          ليس مجرد حجز، <br />
          <span className="text-secondary relative inline-block">
            بل بداية ذكرى.
            <svg className="absolute w-full h-3 -bottom-1 right-0 text-gold/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" /></svg>
          </span>
        </h1>
        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
          في ضيافة خلود، نؤمن أن الفخامة لا تعني فقط فندقاً 5 نجوم، بل تعني الاهتمام بأدق التفاصيل التي تجعل رحلتك الروحانية أو الترفيهية تجربة لا تُنسى.
        </p>
      </div>

      {/* 2. Features Grid (Glassmorphism Cards) */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {[
          { icon: Sparkles, title: "فخامة عصرية", text: "ننتقي الفنادق بعناية فائقة لضمان مستوى لا يقبل المساومة." },
          { icon: Heart, title: "ضيافة من القلب", text: "طاقم عملنا مدرب لخدمتكم بشغف، لأن راحتكم هي أولويتنا القصوى." },
          { icon: Hotel, title: "مواقع استثنائية", text: "إطلالات مباشرة على الحرم وقرب من أهم المعالم." }
        ].map((item, idx) => (
          <div key={idx} className="group bg-white border border-slate-100 p-8 rounded-[2.5rem] hover:shadow-2xl hover:shadow-slate-900/5 transition-all duration-500 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mb-6 group-hover:bg-[#0f172a] group-hover:text-white transition-colors duration-500">
              <item.icon size={28} />
            </div>
            <h3 className="text-xl font-black text-text mb-3">{item.title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      {/* 4. Simple Stats */}
      <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-10">
        {[
          { num: "+5000", label: "نزيل سعيد" },
          { num: "+120", label: "فندق شريك" },
          { num: "24/7", label: "دعم متواصل" },
          { num: "100%", label: "حجز آمن" },
        ].map((stat, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="text-3xl font-black text-text">{stat.num}</h4>
            <p className="text-slate-500 text-xs font-bold">{stat.label}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default About;
