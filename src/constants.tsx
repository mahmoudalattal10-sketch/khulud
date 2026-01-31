
import { Hotel } from './types';

export const CONTACT_INFO = {
  WHATSAPP: '966553882445', // رقم الواتساب المعتمد
  PHONE: '0553882445',      // رقم الهاتف الموحد/الجوال
  EMAIL: 'Diyafaat.khulood@outlook.sa'
};

export const COUNTRIES = [
  // Arab Countries
  { code: 'SA', name: 'السعودية', dial_code: '+966', flag: 'https://flagcdn.com/sa.svg' },
  { code: 'EG', name: 'مصر', dial_code: '+20', flag: 'https://flagcdn.com/eg.svg' },
  { code: 'AE', name: 'الإمارات', dial_code: '+971', flag: 'https://flagcdn.com/ae.svg' },
  { code: 'KW', name: 'الكويت', dial_code: '+965', flag: 'https://flagcdn.com/kw.svg' },
  { code: 'QA', name: 'قطر', dial_code: '+974', flag: 'https://flagcdn.com/qa.svg' },
  { code: 'BH', name: 'البحرين', dial_code: '+973', flag: 'https://flagcdn.com/bh.svg' },
  { code: 'OM', name: 'عمان', dial_code: '+968', flag: 'https://flagcdn.com/om.svg' },
  { code: 'JO', name: 'الأردن', dial_code: '+962', flag: 'https://flagcdn.com/jo.svg' },
  { code: 'LB', name: 'لبنان', dial_code: '+961', flag: 'https://flagcdn.com/lb.svg' },
  { code: 'IQ', name: 'العراق', dial_code: '+964', flag: 'https://flagcdn.com/iq.svg' },
  { code: 'YE', name: 'اليمن', dial_code: '+967', flag: 'https://flagcdn.com/ye.svg' },
  { code: 'SY', name: 'سوريا', dial_code: '+963', flag: 'https://flagcdn.com/sy.svg' },
  { code: 'PS', name: 'فلسطين', dial_code: '+970', flag: 'https://flagcdn.com/ps.svg' },
  { code: 'SD', name: 'السودان', dial_code: '+249', flag: 'https://flagcdn.com/sd.svg' },
  { code: 'LY', name: 'ليبيا', dial_code: '+218', flag: 'https://flagcdn.com/ly.svg' },
  { code: 'MA', name: 'المغرب', dial_code: '+212', flag: 'https://flagcdn.com/ma.svg' },
  { code: 'TN', name: 'تونس', dial_code: '+216', flag: 'https://flagcdn.com/tn.svg' },
  { code: 'DZ', name: 'الجزائر', dial_code: '+213', flag: 'https://flagcdn.com/dz.svg' },
  { code: 'MR', name: 'موريتانيا', dial_code: '+222', flag: 'https://flagcdn.com/mr.svg' },
  { code: 'SO', name: 'الصومال', dial_code: '+252', flag: 'https://flagcdn.com/so.svg' },
  { code: 'DJ', name: 'جيبوتي', dial_code: '+253', flag: 'https://flagcdn.com/dj.svg' },
  { code: 'KM', name: 'جزر القمر', dial_code: '+269', flag: 'https://flagcdn.com/km.svg' },

  // North America
  { code: 'US', name: 'الولايات المتحدة', dial_code: '+1', flag: 'https://flagcdn.com/us.svg' },
  { code: 'CA', name: 'كندا', dial_code: '+1', flag: 'https://flagcdn.com/ca.svg' },
  { code: 'MX', name: 'المكسيك', dial_code: '+52', flag: 'https://flagcdn.com/mx.svg' },

  // Europe
  { code: 'GB', name: 'المملكة المتحدة', dial_code: '+44', flag: 'https://flagcdn.com/gb.svg' },
  { code: 'FR', name: 'فرنسا', dial_code: '+33', flag: 'https://flagcdn.com/fr.svg' },
  { code: 'DE', name: 'ألمانيا', dial_code: '+49', flag: 'https://flagcdn.com/de.svg' },
  { code: 'IT', name: 'إيطاليا', dial_code: '+39', flag: 'https://flagcdn.com/it.svg' },
  { code: 'ES', name: 'إسبانيا', dial_code: '+34', flag: 'https://flagcdn.com/es.svg' },
  { code: 'RU', name: 'روسيا', dial_code: '+7', flag: 'https://flagcdn.com/ru.svg' },
  { code: 'NL', name: 'هولندا', dial_code: '+31', flag: 'https://flagcdn.com/nl.svg' },
  { code: 'BE', name: 'بلجيكا', dial_code: '+32', flag: 'https://flagcdn.com/be.svg' },
  { code: 'SE', name: 'السويد', dial_code: '+46', flag: 'https://flagcdn.com/se.svg' },
  { code: 'CH', name: 'سويسرا', dial_code: '+41', flag: 'https://flagcdn.com/ch.svg' },
  { code: 'AT', name: 'النمسا', dial_code: '+43', flag: 'https://flagcdn.com/at.svg' },
  { code: 'GR', name: 'اليونان', dial_code: '+30', flag: 'https://flagcdn.com/gr.svg' },
  { code: 'PT', name: 'البرتغال', dial_code: '+351', flag: 'https://flagcdn.com/pt.svg' },
  { code: 'TR', name: 'تركيا', dial_code: '+90', flag: 'https://flagcdn.com/tr.svg' },

  // Asia
  { code: 'IN', name: 'الهند', dial_code: '+91', flag: 'https://flagcdn.com/in.svg' },
  { code: 'PK', name: 'باكستان', dial_code: '+92', flag: 'https://flagcdn.com/pk.svg' },
  { code: 'BD', name: 'بنغلاديش', dial_code: '+880', flag: 'https://flagcdn.com/bd.svg' },
  { code: 'ID', name: 'إندونيسيا', dial_code: '+62', flag: 'https://flagcdn.com/id.svg' },
  { code: 'MY', name: 'ماليزيا', dial_code: '+60', flag: 'https://flagcdn.com/my.svg' },
  { code: 'CN', name: 'الصين', dial_code: '+86', flag: 'https://flagcdn.com/cn.svg' },
  { code: 'JP', name: 'اليابان', dial_code: '+81', flag: 'https://flagcdn.com/jp.svg' },
  { code: 'KR', name: 'كوريا الجنوبية', dial_code: '+82', flag: 'https://flagcdn.com/kr.svg' },
  { code: 'PH', name: 'الفلبين', dial_code: '+63', flag: 'https://flagcdn.com/ph.svg' },
  { code: 'TH', name: 'تايلاند', dial_code: '+66', flag: 'https://flagcdn.com/th.svg' },
  { code: 'VN', name: 'فيتنام', dial_code: '+84', flag: 'https://flagcdn.com/vn.svg' },
  { code: 'SG', name: 'سنغافورة', dial_code: '+65', flag: 'https://flagcdn.com/sg.svg' },

  // Oceania
  { code: 'AU', name: 'أستراليا', dial_code: '+61', flag: 'https://flagcdn.com/au.svg' },
  { code: 'NZ', name: 'نيوزيلندا', dial_code: '+64', flag: 'https://flagcdn.com/nz.svg' },

  // South America
  { code: 'BR', name: 'البرازيل', dial_code: '+55', flag: 'https://flagcdn.com/br.svg' },
  { code: 'AR', name: 'الأرجنتين', dial_code: '+54', flag: 'https://flagcdn.com/ar.svg' },
  { code: 'CO', name: 'كولومبيا', dial_code: '+57', flag: 'https://flagcdn.com/co.svg' },

  // Africa (Non-Arab)
  { code: 'NG', name: 'نيجيريا', dial_code: '+234', flag: 'https://flagcdn.com/ng.svg' },
  { code: 'ZA', name: 'جنوب أفريقيا', dial_code: '+27', flag: 'https://flagcdn.com/za.svg' },
  { code: 'ET', name: 'إثيوبيا', dial_code: '+251', flag: 'https://flagcdn.com/et.svg' },
  { code: 'KE', name: 'كينيا', dial_code: '+254', flag: 'https://flagcdn.com/ke.svg' },
];

// ========== فنادق مكة المكرمة (4) ==========
export const HOTELS: Hotel[] = [
  {
    id: 'makkah-1',
    name: 'فندق ساعة مكة فيرمونت',
    nameEn: 'Makkah Clock Royal Tower - Fairmont',
    location: 'مكة المكرمة',
    locationEn: 'Makkah',
    price: 2500,
    rating: 4.9,
    reviews: 8500,
    image: '/assets/images/hotels/makkah-1/main.jpg',
    images: [
      '/assets/images/hotels/makkah-1/gallery-1.jpg',
      '/assets/images/hotels/makkah-1/gallery-2.jpg',
      '/assets/images/hotels/makkah-1/gallery-3.jpg'
    ],
    coords: [21.4189, 39.8262],
    amenities: ['إطلالة على الحرم', 'سبا فاخر', 'مطاعم عالمية', 'خدمة الغرف 24/7'],
    description: 'أيقونة مكة المكرمة، يقع في قلب أبراج البيت مع إطلالة مباشرة على الكعبة المشرفة.',
    isOffer: true,
    discount: 'خصم 20%',
    distanceFromHaram: '50 متر',
    hasFreeBreakfast: true,
    hasFreeTransport: false
  },
  {
    id: 'makkah-2',
    name: 'فندق رفاء مكة',
    nameEn: 'Raffles Makkah Palace',
    location: 'مكة المكرمة',
    locationEn: 'Makkah',
    price: 1800,
    rating: 4.8,
    reviews: 4200,
    image: '/assets/images/hotels/makkah-2/main.jpg',
    images: [
      '/assets/images/hotels/makkah-2/gallery-1.jpg',
      '/assets/images/hotels/makkah-2/gallery-2.jpg',
      '/assets/images/hotels/makkah-2/gallery-3.jpg'
    ],
    coords: [21.4195, 39.8255],
    amenities: ['جناح ملكي', 'خدمة بتلر', 'مسبح خاص', 'صالة VIP'],
    description: 'فخامة لا مثيل لها في قلب مكة المكرمة مع خدمة شخصية استثنائية.',
    isOffer: true,
    discount: 'ليلة مجانية',
    distanceFromHaram: '100 متر',
    hasFreeBreakfast: true,
    hasFreeTransport: true
  },
  {
    id: 'makkah-3',
    name: 'فندق سويس أوتيل المقام',
    nameEn: 'Swissotel Al Maqam Makkah',
    location: 'مكة المكرمة',
    locationEn: 'Makkah',
    price: 1200,
    rating: 4.7,
    reviews: 3100,
    image: '/assets/images/hotels/makkah-3/main.jpg',
    images: [
      '/assets/images/hotels/makkah-3/gallery-1.jpg',
      '/assets/images/hotels/makkah-3/gallery-2.jpg',
      '/assets/images/hotels/makkah-3/gallery-3.jpg'
    ],
    coords: [21.4178, 39.8268],
    amenities: ['غرف عائلية', 'مطعم سويسري', 'نادي صحي', 'واي فاي مجاني'],
    description: 'ضيافة سويسرية راقية في أبراج البيت مع إطلالات بانورامية.',
    isOffer: false,
    discount: '',
    distanceFromHaram: '150 متر',
    hasFreeBreakfast: true,
    hasFreeTransport: false
  },
  {
    id: 'makkah-4',
    name: 'فندق هيلتون مكة للمؤتمرات',
    nameEn: 'Hilton Makkah Convention Hotel',
    location: 'مكة المكرمة',
    locationEn: 'Makkah',
    price: 850,
    rating: 4.5,
    reviews: 2800,
    image: '/assets/images/hotels/makkah-4/main.jpg',
    images: [
      '/assets/images/hotels/makkah-4/gallery-1.jpg',
      '/assets/images/hotels/makkah-4/gallery-2.jpg',
      '/assets/images/hotels/makkah-4/gallery-3.jpg'
    ],
    coords: [21.4150, 39.8230],
    amenities: ['قاعات مؤتمرات', 'مواقف سيارات', 'مطاعم متنوعة', 'خدمة نقل'],
    description: 'الخيار المثالي للمجموعات والعائلات مع خدمات متكاملة.',
    isOffer: true,
    discount: 'أفضل سعر مضمون',
    distanceFromHaram: '800 متر',
    hasFreeBreakfast: true,
    hasFreeTransport: true
  },

  // ========== فنادق المدينة المنورة (4) ==========
  {
    id: 'madinah-1',
    name: 'فندق دار الإيمان إنتركونتيننتال',
    nameEn: 'Dar Al Iman InterContinental',
    location: 'المدينة المنورة',
    locationEn: 'Madinah',
    price: 1600,
    rating: 4.8,
    reviews: 5200,
    image: '/assets/images/hotels/madinah-1/main.jpg',
    images: [
      '/assets/images/hotels/madinah-1/gallery-1.jpg',
      '/assets/images/hotels/madinah-1/gallery-2.jpg',
      '/assets/images/hotels/madinah-1/gallery-3.jpg'
    ],
    coords: [24.4672, 39.6111],
    amenities: ['إطلالة على الحرم النبوي', 'مطاعم فاخرة', 'سبا', 'صالة تنفيذية'],
    description: 'فندق فاخر يطل مباشرة على المسجد النبوي الشريف.',
    isOffer: true,
    discount: 'خصم 25%',
    distanceFromHaram: '100 متر',
    hasFreeBreakfast: true,
    hasFreeTransport: false
  },
  {
    id: 'madinah-2',
    name: 'فندق أنوار المدينة موڤنبيك',
    nameEn: 'Anwar Al Madinah Movenpick',
    location: 'المدينة المنورة',
    locationEn: 'Madinah',
    price: 1100,
    rating: 4.7,
    reviews: 3800,
    image: '/assets/images/hotels/madinah-2/main.jpg',
    images: [
      '/assets/images/hotels/madinah-2/gallery-1.jpg',
      '/assets/images/hotels/madinah-2/gallery-2.jpg',
      '/assets/images/hotels/madinah-2/gallery-3.jpg'
    ],
    coords: [24.4680, 39.6105],
    amenities: ['شوكولاتة موڤنبيك', 'غرف واسعة', 'مركز أعمال', 'خدمة كونسيرج'],
    description: 'ضيافة سويسرية مميزة على بعد خطوات من الروضة الشريفة.',
    isOffer: false,
    discount: '',
    distanceFromHaram: '200 متر',
    hasFreeBreakfast: true,
    hasFreeTransport: true
  },
  {
    id: 'madinah-3',
    name: 'فندق شذا المدينة',
    nameEn: 'Shaza Al Madinah',
    location: 'المدينة المنورة',
    locationEn: 'Madinah',
    price: 950,
    rating: 4.6,
    reviews: 2100,
    image: '/assets/images/hotels/madinah-3/main.jpg',
    images: [
      '/assets/images/hotels/madinah-3/gallery-1.jpg',
      '/assets/images/hotels/madinah-3/gallery-2.jpg',
      '/assets/images/hotels/madinah-3/gallery-3.jpg'
    ],
    coords: [24.4665, 39.6120],
    amenities: ['تصميم إسلامي', 'مطعم عربي', 'صالة استقبال VIP', 'خدمة غرف'],
    description: 'تجربة ضيافة عربية أصيلة بتصميم إسلامي فاخر.',
    isOffer: true,
    discount: 'عرض رمضان',
    distanceFromHaram: '300 متر',
    hasFreeBreakfast: true,
    hasFreeTransport: false
  },
  {
    id: 'madinah-4',
    name: 'فندق المدينة هيلتون',
    nameEn: 'Madinah Hilton',
    location: 'المدينة المنورة',
    locationEn: 'Madinah',
    price: 700,
    rating: 4.4,
    reviews: 1900,
    image: '/assets/images/hotels/madinah-4/main.jpg',
    images: [
      '/assets/images/hotels/madinah-4/gallery-1.jpg',
      '/assets/images/hotels/madinah-4/gallery-2.jpg',
      '/assets/images/hotels/madinah-4/gallery-3.jpg'
    ],
    coords: [24.4658, 39.6130],
    amenities: ['حمام سباحة', 'نادي رياضي', 'مواقف مجانية', 'خدمة نقل للحرم'],
    description: 'فندق عصري مع جميع الخدمات الأساسية وخدمة نقل مستمرة.',
    isOffer: true,
    discount: 'احجز 3 ليالي واحصل على الرابعة',
    distanceFromHaram: '500 متر',
    hasFreeBreakfast: false,
    hasFreeTransport: true
  }
];

// Helper functions for filtering
export const getMakkahHotels = () => HOTELS.filter(h => h.locationEn === 'Makkah');
export const getMadinahHotels = () => HOTELS.filter(h => h.locationEn === 'Madinah');
export const getFeaturedHotels = () => HOTELS.filter(h => h.isOffer);
