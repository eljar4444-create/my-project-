'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

// Dynamically import React-Leaflet components to avoid SSR issues with Leaflet
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false, loading: () => <MapLoading /> }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Circle = dynamic(
    () => import('react-leaflet').then((mod) => mod.Circle),
    { ssr: false }
);
const useMapEvents = dynamic(
    () => import('react-leaflet').then((mod) => mod.useMapEvents),
    { ssr: false }
);
const useMap = dynamic(
    () => import('react-leaflet').then((mod) => mod.useMap),
    { ssr: false }
);

function MapLoading() {
    return (
        <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
    );
}

// Component to handle map clicks
function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

// Component to re-center map when props change
function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    initialLat?: number | null;
    initialLng?: number | null;
    radius?: number; // km
}

export function MapPicker({ onLocationSelect, initialLat, initialLng, radius = 10 }: MapPickerProps) {
    const [position, setPosition] = useState<[number, number] | null>(null);
    // Default to Berlin if no position
    const defaultCenter: [number, number] = [52.5200, 13.4050];

    useEffect(() => {
        if (initialLat && initialLng) {
            setPosition([initialLat, initialLng]);
        }
    }, [initialLat, initialLng]);

    const handleMapClick = (lat: number, lng: number) => {
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
    };

    const mapCenter = position || defaultCenter;

    return (
        <div className="w-full h-[400px] rounded-xl overflow-hidden relative z-0">
            <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ width: '100%', height: '100%' }}
                className="z-0"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {position && (
                    <Marker position={position} />
                )}

                {position && radius && (
                    <Circle
                        center={position}
                        pathOptions={{ fillColor: '#4285F4', fillOpacity: 0.2, color: '#4285F4' }}
                        radius={radius * 1000}
                    />
                )}

                <MapEvents onLocationSelect={handleMapClick} />
                <ChangeView center={mapCenter} />
            </MapContainer>
        </div>
    );
}
