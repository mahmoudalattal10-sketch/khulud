
export interface PricingPeriod {
    id: string;
    startDate: string;
    endDate: string;
    price: number;
}

export interface Room {
    id?: string;
    name: string;
    type: string;
    capacity: number;
    available: number;
    price: number;
    mealPlan: 'none' | 'breakfast' | 'half_board' | 'full_board' | 'all_inclusive';
    area: number;
    beds: string;
    view: string;
    images: string[];
    pricingPeriods: PricingPeriod[];
    amenities: string[];
    sofa?: boolean;
    allowExtraBed?: boolean;
    extraBedPrice?: number;
    maxExtraBeds?: number;
    isVisible?: boolean;
}

export interface Review {
    id: string;
    user: string;
    comment: string;
    rating: number;
    date: string;
}

export interface AdminHotel {
    id: string | number; // Support both string (API/UUID) and number (legacy)
    name: string;
    city: string;
    country?: string;
    distanceFromHaram?: string;
    location: string;
    description: string;
    rating: number;
    rooms: Room[];
    reviews: Review[];
    amenities: string[];
    gallery: string[];
    price: number;
    image: string;
    isVisible: boolean;
    lat?: string | number;
    lng?: string | number;
    mapQuery?: string;
    summary?: string;
    distance?: string;
    nearbyLandmarks?: {
        name: string;
        distance: string;
        icon: string;
        type?: string;
    }[];
    view?: string; // New: Primary view (e.g., Kaaba View)
    hasFreeTransport?: boolean; // New: Explicit Free Transport flag
    hasFreeBreakfast?: boolean; // New: Breakfast flag
    isFeatured?: boolean; // ✨ New: Featured/Elite hotel flag
    extraBedStock?: number; // 🛏️ Shared pool for extra beds
    isOffer?: boolean;
    discount?: string | null;
    reviewsCount?: number;
    _rawCoords?: any;
}

export interface Booking {
    id: string;
    customer: string;
    destination: string;
    date: string;
    amount: number;
    status: 'confirmed' | 'pending' | 'cancelled';
}

export interface Destination {
    id: string;
    name: string;
    country: string;
    price: number;
    rating: number;
    bookings: number;
    image: string;
}
