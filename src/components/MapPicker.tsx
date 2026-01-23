'use client';

import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, Circle, useLoadScript } from '@react-google-maps/api';
import { Loader2, MapPin } from 'lucide-react';

const libraries: ("places")[] = ["places"];

const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '12px',
};

// Default center (Berlin)
const defaultCenter = {
    lat: 52.5200,
    lng: 13.4050,
};

const options = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
};

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    initialLat?: number | null;
    initialLng?: number | null;
    radius?: number; // km
}

export function MapPicker({ onLocationSelect, initialLat, initialLng, radius = 10 }: MapPickerProps) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries,
    });

    const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);
    const [center, setCenter] = useState(defaultCenter);

    useEffect(() => {
        if (initialLat && initialLng) {
            const loc = { lat: initialLat, lng: initialLng };
            setMarker(loc);
            setCenter(loc);
        }
    }, [initialLat, initialLng]);

    const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setMarker({ lat, lng });
            onLocationSelect(lat, lng);
        }
    }, [onLocationSelect]);



    const [map, setMap] = useState<google.maps.Map | null>(null);

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const [circleInstance, setCircleInstance] = useState<google.maps.Circle | null>(null);

    // Manage Circle lifecycle manually to prevent ghosting
    useEffect(() => {
        if (!map || !center || !radius) return;

        // Cleanup previous circle
        if (circleInstance) {
            circleInstance.setMap(null);
        }

        const newCircle = new window.google.maps.Circle({
            map: map,
            center: center,
            radius: radius * 1000,
            fillColor: "#4285F4",
            fillOpacity: 0.2,
            strokeColor: "#4285F4",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false,
            zIndex: 100
        });

        // Fit bounds
        const bounds = new window.google.maps.LatLngBounds();
        bounds.union(newCircle.getBounds()!);
        map.fitBounds(bounds, 20);

        setCircleInstance(newCircle);

        return () => {
            newCircle.setMap(null);
        };
    }, [map, center, radius]);



    if (loadError) return <div className="text-red-500 text-sm">Error loading maps</div>;
    if (!isLoaded) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-gray-400" /></div>;

    return (
        <div className="relative">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                options={options}
                onClick={onMapClick}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                {marker && <Marker position={marker} />}
            </GoogleMap>
        </div>
    );
}
