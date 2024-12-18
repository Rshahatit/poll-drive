import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { CLERK_CONFIG } from '../../config/clerk';

export function SignUpPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        afterSignUpUrl="/dashboard"
        appearance={CLERK_CONFIG.appearance}
      />
    </div>
  );
}