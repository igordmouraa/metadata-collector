import { AnalyticsQuery, AnalyticsSummary, DeviceData } from '@/lib/types/device';
import {
    collection,
    query,
    where,
    getDocs,
    getCountFromServer,
    Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/client';

export const fetchDeviceAnalytics = async (queryParams: AnalyticsQuery = {}) => {
    const q = buildQuery(queryParams);
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            timestamp: convertFirebaseTimestamp(data.timestamp)
        } as unknown as DeviceData;
    });
};

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
    const snapshot = await getCountFromServer(collection(db, 'deviceAnalytics'));
    const totalVisits = snapshot.data().count;

    // Implemente suas agregações aqui
    return {
        totalVisits,
        devices: {},
        browsers: {},
        os: {},
        locations: [],
        dailyVisits: []
    };
};

// Helper functions
const buildQuery = (queryParams: AnalyticsQuery) => {
    let q = query(collection(db, 'deviceAnalytics'));
    const filters = [];

    if (queryParams.dateFrom) {
        filters.push(where('timestamp', '>=', Timestamp.fromDate(queryParams.dateFrom)));
    }
    if (queryParams.dateTo) {
        filters.push(where('timestamp', '<=', Timestamp.fromDate(queryParams.dateTo)));
    }
    if (queryParams.deviceType) {
        filters.push(where('device.type', '==', queryParams.deviceType));
    }
    if (queryParams.os) {
        filters.push(where('os.name', '==', queryParams.os));
    }
    if (queryParams.browser) {
        filters.push(where('browser.name', '==', queryParams.browser));
    }

    if (filters.length > 0) {
        q = query(q, ...filters);
    }

    return q;
};

const convertFirebaseTimestamp = (timestamp: any) => {
    if (!timestamp) return null;
    if (typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toISOString();
    }
    if (timestamp.seconds && timestamp.nanoseconds) {
        return new Timestamp(timestamp.seconds, timestamp.nanoseconds)
            .toDate()
            .toISOString();
    }
    return new Date(timestamp).toISOString();
};