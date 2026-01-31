import React from 'react';
import { ArrowRight, FileText, HelpCircle, Shield, Users, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StaticPageProps {
    title: string;
    subtitle?: string;
    icon?: any;
    content?: React.ReactNode;
}

const StaticPage: React.FC<StaticPageProps> = ({ title, subtitle, icon: Icon, content }) => {
    return (
        <div className="pt-32 pb-20 min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl shadow-slate-200 flex items-center justify-center mx-auto mb-6 transform rotate-3 hover:rotate-6 transition-transform duration-500">
                        {Icon ? <Icon size={32} className="text-gold" /> : <FileText size={32} className="text-gold" />}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-text mb-4">{title}</h1>
                    <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                        {subtitle || 'نسعى دائماً لتقديم وتطوير خدماتنا بما يتناسب مع تطلعاتكم.'}
                    </p>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
                    {content ? (
                        <div className="prose prose-lg prose-slate max-w-none font-medium">
                            {content}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-slate-200 border-t-gold rounded-full animate-spin"></div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-text mb-2">جاري إعداد المحتوى</h3>
                                <p className="text-slate-400">فريقنا يعمل حالياً على صياغة محتوى هذه الصفحة ليليق بكم.</p>
                            </div>
                            <Link to="/" className="inline-flex items-center gap-2 text-gold font-bold hover:gap-3 transition-all">
                                <span>العودة للرئيسية</span>
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default StaticPage;
