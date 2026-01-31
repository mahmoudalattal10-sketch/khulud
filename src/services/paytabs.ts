
import { AuthAPI } from './api';

export interface PaymentRequest {
    cart_id: string;
    cart_description: string;
    cart_currency: string;
    cart_amount: number;
    callback?: string;
    return?: string;
    customer_details: {
        name: string;
        email: string;
        phone: string;
        street1: string;
        city: string;
        state: string;
        country: string;
        ip: string;
    };
}

export const createPaymentPage = async (paymentData: PaymentRequest) => {
    // In a real scenario, this would call your backend to initiate PayTabs
    // For now, we'll simulate a successful payment redirection or call a proxy endpoint

    // We'll call the backend proxy which handles the PayTabs secret key securely
    const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(AuthAPI.isLoggedIn() ? { 'Authorization': `Bearer ${localStorage.getItem('diafat_auth_token')}` } : {})
        },
        body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
        throw new Error('Payment initialization failed');
    }

    return await response.json();
};
