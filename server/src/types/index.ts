
export interface HotelFilterOptions {
    city?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    adminView?: boolean;
}

export interface AvailabilityResult {
    available: boolean;
    totalPrice?: number;
    roomCount?: number;
    breakdown?: any[];
}
