import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';

export function Login() {
  const [searchParams] = useSearchParams();
  const [userType, setUserType] = useState<'driver' | 'rider'>(
    (searchParams.get('type') as 'driver' | 'rider') || 'rider'
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex justify-center">
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
      <AuthForm type="login" userType={userType} />
    </div>
  );
}