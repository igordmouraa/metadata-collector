import axios from 'axios';

export async function lookupIpInfo(ip: string) {
    try {
        if (ip === 'unknown' || ip === '127.0.0.1') {
            return getDefaultIpInfo();
        }

        const response = await axios.get(`https://ipapi.co/${ip}/json/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching IP info:', error);
        return getDefaultIpInfo();
    }
}

function getDefaultIpInfo() {
    return {
        ip: 'unknown',
        city: 'Unknown',
        region: 'Unknown',
        country: 'Unknown',
        country_name: 'Unknown',
        country_code: 'XX',
        continent_code: 'XX',
        latitude: 0,
        longitude: 0,
        asn: 'Unknown',
        org: 'Unknown'
    };
}