import React from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

export const FAQContent = () => (
    <div className="space-y-6">
        {[
            { q: "كيف يمكنني حجز فندق من خلال ضيافة خلود؟", a: "يمكنك البحث عن الفندق المناسب لك عبر محرك البحث في الصفحة الرئيسية، ثم اختيار الغرفة المناسبة وإتمام عملية الدفع الإلكتروني بأمان." },
            { q: "هل الأسعار المعروضة شاملة للضريبة؟", a: "نعم، جميع الأسعار المعروضة تشمل ضريبة القيمة المضافة ورسوم الخدمة، ولا توجد أي رسوم خفية." },
            { q: "ما هي سياسة الإلغاء؟", a: "تختلف سياسة الإلغاء حسب الفندق ونوع الحجز. يمكنك الاطلاع على تفاصيل الإلغاء الخاصة بكل غرفة قبل إتمام الحجز." },
            { q: "هل يمكنني تعديل الحجز بعد الدفع؟", a: "نعم، يمكنك تعديل الحجز من خلال التواصل مع خدمة العملاء أو عبر صفحة 'حسابي' (تطبق الشروط والأحكام الخاصة بالتعديل)." },
        ].map((item, i) => (
            <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="font-bold text-lg text-text mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs">?</span>
                    {item.q}
                </h3>
                <p className="text-slate-600 leading-relaxed pr-8">{item.a}</p>
            </div>
        ))}
    </div>
);

export const AboutContent = () => (
    <div className="space-y-8 text-right">
        <div>
            <h3 className="text-2xl font-bold text-text mb-4">قصتنا</h3>
            <p className="text-slate-600 leading-loose">
                تأسست "ضيافة خلود" برؤية طموحة لتقديم تجربة ضيافة استثنائية لضيوف الرحمن. نحن نؤمن بأن الرحلة الإيمانية تستحق أعلى مستويات الراحة والسكينة. نعمل بشغف لتوفير خيارات إقامة متنوعة في مكة المكرمة والمدينة المنورة، مع التركيز على الجودة والمصداقية والاهتمام بأدق التفاصيل.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <h4 className="font-bold text-xl text-text mb-3 text-gold">رؤيتنا</h4>
                <p className="text-slate-600">أن نكون الخيار الأول والموثوق لكل من يقصد البيت الحرام ومسجد المصطفى، من خلال تقديم خدمات عصرية تجمع بين الأصالة والرفاهية.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <h4 className="font-bold text-xl text-text mb-3 text-gold">رسالتنا</h4>
                <p className="text-slate-600">تيسير رحلة الحاج والمعتمر من خلال توفير حلول حجز ذكية، ودعم متواصل، وشراكات استراتيجية مع أفضل فنادق المملكة.</p>
            </div>
        </div>
    </div>
);

export const PrivacyContent = () => (
    <div className="space-y-6 text-slate-600 leading-loose">
        <p>نحرص في "ضيافة خلود" على حماية خصوصية بياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك.</p>

        <div className="space-y-2">
            <h4 className="font-bold text-text text-lg">1. المعلومات التي نجمعها</h4>
            <p>نقوم بجمع المعلومات الضرورية لإتمام الحجز، مثل الاسم، رقم الهاتف، والبريد الإلكتروني. لا نقوم بتخزين تفاصيل بطاقات الائتمان على خوادمنا.</p>
        </div>

        <div className="space-y-2">
            <h4 className="font-bold text-text text-lg">2. استخدام المعلومات</h4>
            <p>نستخدم معلوماتك لتأكيد الحجوزات، إرسال تذاكر الحجز، والتواصل معك بخصوص رحلتك. قد نستخدم بريدك الإلكتروني لإرسال عروض خاصة (يمكنك إلغاء الاشتراك في أي وقت).</p>
        </div>

        <div className="space-y-2">
            <h4 className="font-bold text-text text-lg">3. مشاركة البيانات</h4>
            <p>لا نقوم ببيع أو تأجير بياناتك لأي طرف ثالث. تتم مشاركة تفاصيل الحجز فقط مع الفندق المعني لضمان تقديم الخدمة.</p>
        </div>
    </div>
);

export const TermsContent = () => (
    <div className="space-y-6 text-slate-600 leading-loose">
        <p>أهلاً بك في موقع ضيافة خلود. باستخادمك لهذا الموقع، فإنك توافق على الالتزام بالشروط والأحكام التالية:</p>

        <ul className="space-y-4">
            {[
                "يجب أن يكون المستخدم بالغاً للسن القانوني لإجراء حجز.",
                "جميع الحجوزات تخضع لتوفر الغرف وقبول الدفع.",
                "يتحمل المستخدم مسؤولية صحة البيانات المدخلة أثناء الحجز.",
                "أي تعديل أو إلغاء للحجز يخضع لسياسات الفندق المختار.",
                "تحتفظ ضيافة خلود بالحق في تعديل الأسعار والعروض في أي وقت دون إشعار مسبق (لا يؤثر على الحجوزات المؤكدة)."
            ].map((term, i) => (
                <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-slate-800 shrink-0 mt-1" />
                    <span>{term}</span>
                </li>
            ))}
        </ul>
    </div>
);
