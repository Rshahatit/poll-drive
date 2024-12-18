import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { MOCK_POLLING_LOCATIONS } from '../data/mockPollingLocations';
import type { VotingLocation } from '../types';

interface LocationSearchProps {
  onLocationSelect: (location: VotingLocation) => void;
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<VotingLocation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.length > 2) {
      const filtered = MOCK_POLLING_LOCATIONS.filter(
        location =>
          location.name.toLowerCase().includes(value.toLowerCase()) ||
          location.address.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (location: VotingLocation) => {
    setSearchTerm(location.address);
    setIsOpen(false);
    onLocationSelect(location);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Enter your address or polling location"
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={() => handleSearch(searchTerm)}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Search
        </button>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
          <ul className="py-1">
            {suggestions.map((location) => (
              <li
                key={location.id}
                onClick={() => handleSelect(location)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="font-medium">{location.name}</div>
                <div className="text-sm text-gray-600">{location.address}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}