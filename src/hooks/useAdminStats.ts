/**
 * =========================================================
 * 📊 useAdminStats Hook
 * =========================================================
 * Fetches real-time statistics from the backend for the
 * Admin Dashboard.
 * =========================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { AdminAPI, AdminStats } from '../services/api';

export function useAdminStats() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await AdminAPI.getStats();

            if (response.success && response.data) {
                setStats(response.data);
            } else {
                throw new Error(response.error || 'Failed to fetch stats');
            }
        } catch (err) {
            console.error('Stats fetch error:', err);
            setError('فشل تحميل الإحصائيات');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, error, refetch: fetchStats };
}

export interface AnalyticsData {
    weekly: { name: string; visitors: number; revenue: number }[];
    hotels: { name: string; val: string; rawVal: number; color: string }[];
    visitorSources?: {
        ksa: number;
        gulf: number;
        intl: number;
        top: { name: string; pct: number };
    };
}

export function useAdminAnalytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await AdminAPI.getAnalytics();
                if (response.success && response.data) {
                    setData(response.data);
                }
            } catch (err) {
                console.error('Analytics fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    return { data, loading };
}
