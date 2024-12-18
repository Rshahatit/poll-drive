import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CallToActionProps {
  onGetStarted: () => void;
}

export function CallToAction({ onGetStarted }: CallToActionProps) {
  return (
    <div className="mt-20 mb-20">
      <div className="relative isolate overflow-hidden bg-blue-600 px-6 py-12 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Make a Difference?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
            Join our community of volunteers and voters making democracy accessible to everyone.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={onGetStarted}
              className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 inline-block" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}