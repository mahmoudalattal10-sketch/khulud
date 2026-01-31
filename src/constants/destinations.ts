export interface Country {
    name: string;
    code: string;
    cities: string[];
}

export const TOP_DESTINATIONS = ["مكة المكرمة", "المدينة المنورة"];

export const DESTINATIONS: Country[] = [
    {
        name: "المملكة العربية السعودية",
        code: "SA",
        cities: ["جدة", "الرياض", "الدمام", "الخبر"]
    },
    {
        name: "الإمارات العربية المتحدة",
        code: "AE",
        cities: ["دبي", "أبوظبي", "الشارقة", "رأس الخيمة"]
    },
    {
        name: "قطر",
        code: "QA",
        cities: ["الدوحة", "الوكرة", "الخور"]
    },
    {
        name: "الكويت",
        code: "KW",
        cities: ["الكويت العاصمة", "السالمية", "الجهراء"]
    },
    {
        name: "البحرين",
        code: "BH",
        cities: ["المنامة", "المحرق", "الرفاع"]
    },
    {
        name: "عمان",
        code: "OM",
        cities: ["مسقط", "صلالة", "صحار"]
    },
    {
        name: "مصر",
        code: "EG",
        cities: ["القاهرة", "الغردقة", "شرم الشيخ", "الإسكندرية", "مرسى علم"]
    },
    {
        name: "الأردن",
        code: "JO",
        cities: ["عمان", "العقبة", "البحر الميت"]
    }
];
