export interface PaymentRequest {
    cart_id: string;
    cart_description: string;
    cart_currency: string;
    cart_amount: number;
    customer_details: {
        name: string;
        email: string;
        phone: string;
        street1: string;
        city: string;
        state: string;
        country: string;
        zip: string;
    };
    callback: string;
    return: string;
}

const REGION = import.meta.env.VITE_PAYTABS_REGION || 'SAU';
const PROFILE_ID = import.meta.env.VITE_PAYTABS_PROFILE_ID;
const SERVER_KEY = import.meta.env.VITE_PAYTABS_SERVER_KEY;

// Base URLs based on region
const BASE_URLS: Record<string, string> = {
    SAU: 'https://secure.paytabs.sa/payment/request',
    ARE: 'https://secure.paytabs.com/payment/request',
    EGY: 'https://secure-egypt.paytabs.com/payment/request',
    GLOBAL: 'https://secure.paytabs.com/payment/request',
};

// Secure Backend Endpoint
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? '/api'
    : 'http://localhost:3001/api';

export const createPaymentPage = async (paymentDetails: PaymentRequest) => {
    try {
        // 🛡️ Secure Call to "The Fortress"
        const response = await fetch(`${API_BASE_URL}/payment/initiate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}` // In real app, pass token
            },
            body: JSON.stringify({
                bookingId: paymentDetails.cart_id,
                userDetails: paymentDetails.customer_details
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Payment initiation failed');
        }

        if (data.redirect_url) {
            return data.redirect_url;
        } else {
            throw new Error('No redirect URL received from secure server');
        }

    } catch (error) {
        console.error('Secure Payment Error:', error);
        throw error;
    }
};
