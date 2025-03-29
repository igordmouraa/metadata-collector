import { UAParser } from 'ua-parser-js';
import { DeviceData } from '@/lib/types/device';

export const collectDeviceData = async (): Promise<DeviceData> => {
    if (typeof window === 'undefined') {
        throw new Error('This function can only run in the browser');
    }

    const parser = new UAParser(window.navigator.userAgent);
    const { browser, os, device, cpu } = parser.getResult();

    // Basic data - garantindo que nenhum campo fique undefined
    const basicData = {
        userAgent: navigator.userAgent || 'unknown',
        platform: navigator.platform || 'unknown',
        language: navigator.language || 'unknown',
        timestamp: new Date().toISOString(),
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
    };

    // Enhanced location
    const location = await getEnhancedLocation();

    // Network info - convertendo undefined para null
    const connection = (navigator as any).connection;
    const networkData = connection ? {
        effectiveType: connection.effectiveType || null,
        downlink: connection.downlink || null,
        rtt: connection.rtt || null,
        saveData: connection.saveData || null,
    } : null;

    // Hardware estimates - valores padrão
    const hardwareData = {
        cpuCores: navigator.hardwareConcurrency || 4,
        memory: (performance as any).memory?.jsHeapSizeLimit
            ? Math.round((performance as any).memory.jsHeapSizeLimit / (1024 * 1024 * 1024))
            : 8,
    };

    return {
        ...basicData,
        browser: {
            name: browser.name || 'Unknown',
            version: browser.version || 'Unknown',
            major: browser.major || 'Unknown'
        },
        os: {
            name: os.name || 'Unknown',
            version: os.version || 'Unknown',
        },
        device: {
            type: device.type || 'desktop',
            model: device.model || 'Unknown',
            vendor: device.vendor || 'Unknown',
            cpu: cpu.architecture || 'Unknown'
        },
        screen: {
            width: window.screen.width,
            height: window.screen.height,
            colorDepth: window.screen.colorDepth,
            orientation: window.screen.orientation?.type || null,
            pixelRatio: window.devicePixelRatio || 1
        },
        location: location || null,
        network: networkData,
        hardware: hardwareData,
        pageInfo: {
            url: window.location.href,
            referrer: document.referrer || '',
            origin: window.location.origin,
            pathname: window.location.pathname
        },
        ipData: {}, // Será preenchido pelo backend
        geoData: {} // Será preenchido pelo backend
    };
};

async function getEnhancedLocation() {
    try {
        if (!('geolocation' in navigator)) {
            return null;
        }

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        });

        return {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || null,
            altitudeAccuracy: position.coords.altitudeAccuracy || null,
            heading: position.coords.heading || null,
            speed: position.coords.speed || null
        };
    } catch (error) {
        console.warn('Error getting location:', error);
        return null;
    }
}