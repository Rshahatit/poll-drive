import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';
import { VerificationUpload } from '../components/VerificationUpload';

export function Register() {
  const [searchParams] = useSearchParams();
  const userType = (searchParams.get('type') as 'driver' | 'rider') || 'rider';

  return (
    <div className="max-w-7xl mx-auto">
      <AuthForm type="register" userType={userType} />
      {userType === 'driver' && <VerificationUpload />}
    </div>
  );
}