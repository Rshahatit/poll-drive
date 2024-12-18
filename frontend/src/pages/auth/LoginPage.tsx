import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoginForm } from '../../components/auth/LoginForm';

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const [userType, setUserType] = useState<'driver' | 'rider'>('rider');

  useEffect(() => {
    const typeFromUrl = searchParams.get('type') as 'driver' | 'rider';
    if (typeFromUrl && (typeFromUrl === 'driver' || typeFromUrl === 'rider')) {
      setUserType(typeFromUrl);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto mb-8">
        <div className="flex justify-center">
          <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white">
            <button
              onClick={() => setUserType('rider')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                userType === 'rider'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login as Rider
            </button>
            <button
              onClick={() => setUserType('driver')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                userType === 'driver'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login as Driver
            </button>
          </div>
        </div>
      </div>

      <LoginForm userType={userType} />
    </div>
  );
}