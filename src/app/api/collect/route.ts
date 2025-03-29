import { NextResponse } from 'next/server';
import { sendDeviceDataToFirebase } from '@/lib/firebase/client';
import { getClientIp } from '@/lib/utils/network';
import { lookupIpInfo } from '@/lib/services/ip-service';

export async function POST(request: Request) {
    try {
        const clientData = await request.json();
        const ip = getClientIp(request);

        // Tratamento especial para IP local
        let ipInfo = {};
        let geoData = {
            city: null,
            region: null,
            country: null
        };

        if (ip !== '::1' && ip !== 'unknown') {
            try {
                ipInfo = await lookupIpInfo(ip);
                geoData = {
                    city: ipInfo.city || null,
                    region: ipInfo.region || null,
                    country: ipInfo.country_name || null
                };
            } catch (error) {
                console.error('Error looking up IP info:', error);
            }
        }

        const completeData = {
            ...clientData,
            ipData: ipInfo,
            geoData
        };

        console.log('Attempting to send to Firebase:', completeData);

        const success = await sendDeviceDataToFirebase(completeData);

        if (!success) {
            return NextResponse.json(
                { success: false, error: 'Firebase operation failed' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in collect route:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to collect data',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}