'use client';

import { useAnalytics } from '@/lib/utils/useAnalytics';
import { ConsentBanner } from '@/components/ui/consent-banner';

export function ClientAnalytics() {
    useAnalytics();

    const handleAccept = () => {
        localStorage.setItem('analyticsConsent', 'true');
        const event = new Event('visibilitychange');
        document.dispatchEvent(event);
    };

    const handleDecline = () => {
        localStorage.setItem('analyticsConsent', 'false');
    };

    return <ConsentBanner onAccept={handleAccept} onDecline={handleDecline} />;
}