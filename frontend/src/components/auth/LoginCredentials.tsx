import React from 'react';
import { User, Mail, Key } from 'lucide-react';

interface LoginCredentialsProps {
  userType: 'driver' | 'rider';
}

export function LoginCredentials({ userType }: LoginCredentialsProps) {
  const credentials = {
    driver: {
      email: 'driver@example.com',
      password: 'driverpass'
    },
    rider: {
      email: 'rider@example.com',
      password: 'riderpass'
    }
  };

  const currentCreds = credentials[userType];

  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-6">
      <div className="flex items-center gap-2 mb-2">
        <User className="h-5 w-5 text-blue-600" />
        <h3 className="font-medium text-blue-900">Test Account Credentials</h3>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-blue-600" />
          <span className="text-gray-600">Email:</span>
          <code className="bg-white px-2 py-1 rounded">{currentCreds.email}</code>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Key className="h-4 w-4 text-blue-600" />
          <span className="text-gray-600">Password:</span>
          <code className="bg-white px-2 py-1 rounded">{currentCreds.password}</code>
        </div>
      </div>
    </div>
  );
}