import React from 'react';

export function Hero() {
  return (
    <div className="text-center">
      <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
        <span className="block">Drive Democracy Forward</span>
        <span className="block text-blue-600">Give a Ride, Make a Difference</span>
      </h1>
      <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        Connect with voters in your community. Offer or request rides to polling locations.
        Every vote counts, and together we can make sure everyone's voice is heard.
      </p>
    </div>
  );
}