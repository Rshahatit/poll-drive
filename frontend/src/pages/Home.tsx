import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/home/Hero';
import { ActionCards } from '../components/home/ActionCards';
import { Features } from '../components/home/Features';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { CallToAction } from '../components/home/CallToAction';

export function Home() {
  const navigate = useNavigate();

  const handleNavigateToLogin = (type: 'driver' | 'rider') => {
    navigate(`/login?type=${type}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <Hero />
        <div className="mt-10">
          <ActionCards onSelectType={handleNavigateToLogin} />
        </div>
        <Features />
        <WhyChooseUs />
        <CallToAction onGetStarted={() => handleNavigateToLogin('driver')} />
      </div>
    </div>
  );
}