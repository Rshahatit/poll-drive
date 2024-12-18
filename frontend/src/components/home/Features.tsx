import React from 'react';
import { Clock, Shield, Users } from 'lucide-react';

export function Features() {
  return (
    <div className="mt-32">
      <div className="relative">
        <div className="absolute inset-0 h-1/2 bg-gray-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3">
              <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                <Clock className="mx-auto h-12 w-12 text-blue-600" />
                <div className="mt-3 text-lg font-medium text-gray-900">Quick Setup</div>
                <p className="mt-2 text-sm text-gray-500">Sign up in minutes and connect with drivers or riders in your area</p>
              </div>
              <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                <Shield className="mx-auto h-12 w-12 text-blue-600" />
                <div className="mt-3 text-lg font-medium text-gray-900">Verified Users</div>
                <p className="mt-2 text-sm text-gray-500">All drivers undergo background checks and verification</p>
              </div>
              <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                <Users className="mx-auto h-12 w-12 text-blue-600" />
                <div className="mt-3 text-lg font-medium text-gray-900">Community Driven</div>
                <p className="mt-2 text-sm text-gray-500">Join a network of civic-minded individuals making democracy accessible</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}