import React from 'react';
import { CheckCircle } from 'lucide-react';

export function WhyChooseUs() {
  const features = [
    { title: 'Free Service', description: 'No cost to riders - optional tipping available for drivers' },
    { title: 'Verified Drivers', description: 'All drivers undergo background checks and verification' },
    { title: 'Flexible Schedule', description: 'Choose pickup times that work best for you' },
    { title: 'Real-time Updates', description: 'Track your ride and get notifications about your trip' }
  ];

  return (
    <div className="mt-32 bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose VoteRide?</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {features.map((feature, index) => (
            <div key={index} className="relative pl-16">
              <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}