'use client';

import { useEffect } from 'react';
import { collectDeviceData } from '@/lib/utils/device';

export const useAnalytics = () => {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const hasConsent = localStorage.getItem('analyticsConsent') === 'true';
        if (!hasConsent) return;

        const sendData = async () => {
            try {
                const data = await collectDeviceData();
                await fetch('/api/collect', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
            } catch (error) {
                console.error('Error collecting analytics:', error);
            }
        };

        sendData();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                sendData();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);
};