import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

interface ZipCodeInputProps {
  onZipCodeSubmit: (zipCode: string) => void;
  isLoading?: boolean;
}

export function ZipCodeInput({ onZipCodeSubmit, isLoading = false }: ZipCodeInputProps) {
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');

  const validateZipCode = (zip: string) => {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zip);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateZipCode(zipCode)) {
      setError('Please enter a valid 5-digit zip code');
      return;
    }

    onZipCodeSubmit(zipCode);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="Enter your ZIP code"
          maxLength={5}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <button
          type="submit"
          disabled={isLoading}
          className={`absolute right-2 top-1.5 px-4 py-1 bg-blue-600 text-white rounded-md ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Loading...' : 'Find'}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </form>
  );
}