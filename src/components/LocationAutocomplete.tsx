'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce'; // Assuming we have or will create this, otherwise I'll implement local debounce

// Simple local debounce hook implementation if not exists

interface LocationAutocompleteProps {
    onSelect: (address: string, lat: number | null, lng: number | null) => void;
    defaultValue?: string;
    className?: string;
    focusRef?: React.Ref<HTMLInputElement>;
}

interface NominatimResult {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: string[];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    icon?: string;
}

export function LocationAutocomplete({ onSelect, defaultValue = '', className, focusRef }: LocationAutocompleteProps) {
    const [value, setValue] = useState(defaultValue);
    const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const debouncedValue = useDebounce(value, 300);

    // Sync default value
    useEffect(() => {
        if (defaultValue) setValue(defaultValue);
    }, [defaultValue]);

    // Fetch suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!debouncedValue || debouncedValue.length < 2) {
                setSuggestions([]);
                return;
            }

            // prevent searching if we just selected an item (heuristic: exact match with top result? No, simpler to just let it search or block via a flag. 
            // For now, let's just search. Nominatim is free but we should be gentle.)

            setIsLoading(true);
            try {
                // Nominatim API: https://nominatim.org/release-docs/develop/api/Search/
                const params = new URLSearchParams({
                    q: debouncedValue,
                    format: 'json',
                    addressdetails: '1',
                    limit: '5',
                    countrycodes: 'de', // Limit to Germany as per previous context
                    'accept-language': 'ru' // Prefer Russian if possible, or de
                });

                const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data: NominatimResult[] = await response.json();
                setSuggestions(data);
            } catch (error) {
                console.error("Nominatim search error:", error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        };

        // Only search if user is actively typing (we can't easily distinguish "typing" vs "setting default", 
        // but checking difference from last selected might work. for now simple debounce.)
        if (isFocused) {
            fetchSuggestions();
        }

    }, [debouncedValue, isFocused]);

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleSelect = (item: NominatimResult) => {
        const address = item.display_name;
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);

        setValue(address);
        setSuggestions([]);
        setIsFocused(false);
        onSelect(address, lat, lng);
    };

    const handleGeolocation = () => {
        if (!navigator.geolocation) return;
        setIsLoading(true);

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                const { latitude, longitude } = coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                    const data = await response.json();

                    const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                    setValue(address);
                    onSelect(address, latitude, longitude);
                    setIsFocused(false);
                } catch (error) {
                    console.error("Reverse geocoding failed", error);
                    // Fallback
                    const fallback = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                    setValue(fallback);
                    onSelect(fallback, latitude, longitude);
                } finally {
                    setIsLoading(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                setIsLoading(false);
            }
        );
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative">
                <Input
                    ref={focusRef}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        // Clear selection if user edits text manually
                        // onSelect(e.target.value, null, null); 
                        // Actually, maybe don't clear immediately to avoid flashing, wait for validation or select?
                        // Previous logic: onSelect(e.target.value, null, null);
                        if (e.target.value) onSelect(e.target.value, null, null);
                    }}
                    onFocus={() => setIsFocused(true)}
                    className={cn("pr-10", className)}
                    placeholder="Адрес, город..."
                />

                <button
                    type="button"
                    onClick={handleGeolocation}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                    title="Мое местоположение"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <MapPin className="w-5 h-5" />
                    )}
                </button>
            </div>

            {isFocused && (suggestions.length > 0 || isLoading) && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 text-left animate-fade-in max-h-80 overflow-y-auto">

                    {!isLoading && suggestions.length > 0 && (
                        suggestions.map((item) => (
                            <div
                                key={item.place_id}
                                onClick={() => handleSelect(item)}
                                className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-3 text-sm text-gray-700"
                            >
                                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                                <span>{item.display_name}</span>
                            </div>
                        ))
                    )}

                    {!isLoading && value.length > 2 && suggestions.length === 0 && (
                        <div className="p-4 text-center text-xs text-gray-400">
                            Ничего не найдено
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
