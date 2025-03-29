'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const DynamicMap = dynamic(
    () => import('react-leaflet').then((mod) => {
        // Fix leaflet markers
        const L = require('leaflet');
        delete L.Icon.Default.prototype._getIconUrl;

        L.Icon.Default.mergeOptions({
            iconRetinaUrl: '/marker-icon-2x.png',
            iconUrl: '/marker-icon.png',
            shadowUrl: '/marker-shadow.png',
        });

        return function Map({ locations }: { locations: any[] }) {
            const { MapContainer, TileLayer, Marker, Popup } = mod;

            const validLocations = locations.filter(loc =>
                loc?.location?.latitude && loc?.location?.longitude
            );

            if (validLocations.length === 0) {
                return (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        No valid location data
                    </div>
                );
            }

            const centerLat = validLocations.reduce((sum, loc) => sum + loc.location.latitude, 0) / validLocations.length;
            const centerLng = validLocations.reduce((sum, loc) => sum + loc.location.longitude, 0) / validLocations.length;

            return (
                <MapContainer
                    center={[centerLat, centerLng]}
                    zoom={3}
                    scrollWheelZoom={true}
                    className="h-full w-full rounded-md"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {validLocations.map((loc, index) => (
                        <Marker
                            key={index}
                            position={[loc.location.latitude, loc.location.longitude]}
                        >
                            <Popup>
                                <div className="space-y-1 text-sm">
                                    <p><strong>Device:</strong> {loc.device?.type || 'Unknown'}</p>
                                    <p><strong>Browser:</strong> {loc.browser?.name || 'Unknown'}</p>
                                    {loc.geoData?.city && (
                                        <p><strong>Location:</strong> {loc.geoData.city}, {loc.geoData.country}</p>
                                    )}
                                    <p><strong>Time:</strong> {new Date(loc.timestamp).toLocaleString()}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            );
        };
    }),
    {
        ssr: false,
        loading: () => (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }
);

export function LocationMap({ locations = [] }: { locations: any[] }) {
    return (
        <div className="h-full w-full">
            <DynamicMap locations={locations} />
        </div>
    );
}