import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { CLERK_CONFIG } from '../../config/clerk';

export function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
        appearance={CLERK_CONFIG.appearance}
      />
    </div>
  );
}