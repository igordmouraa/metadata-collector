'use client';

import { useState, useEffect } from 'react';
import { Button } from './button';
import { Card } from './card';

interface ConsentBannerProps {
    onAccept: () => void;
    onDecline: () => void;
}

export function ConsentBanner({ onAccept, onDecline }: ConsentBannerProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Verifica se estamos no client-side
        if (typeof window === 'undefined') return;

        const hasConsent = localStorage.getItem('analyticsConsent');
        if (hasConsent === null) {
            setVisible(true);
        }
    }, []);

    if (!visible) return null;

    return (
        <Card className="fixed bottom-4 left-4 right-4 z-50 p-4 shadow-lg max-w-2xl mx-auto">
            <div className="flex flex-col space-y-4">
                <h3 className="text-lg font-semibold">Privacy Preference</h3>
                <p className="text-sm text-muted-foreground">
                    We use analytics to improve your experience. Do you consent to the collection of anonymous usage data?
                </p>
                <div className="flex space-x-2 justify-end">
                    <Button variant="outline" onClick={() => {
                        onDecline();
                        setVisible(false);
                    }}>
                        Decline
                    </Button>
                    <Button onClick={() => {
                        onAccept();
                        setVisible(false);
                    }}>
                        Accept
                    </Button>
                </div>
            </div>
        </Card>
    );
}