import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthFormProps {
  type: 'login' | 'register';
  userType: 'driver' | 'rider';
}

export function AuthForm({ type, userType }: AuthFormProps) {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (type === 'login') {
        // Use mock credentials based on user type
        const email = userType === 'driver' ? 'driver@example.com' : 'rider@example.com';
        const password = userType === 'driver' ? 'driverpass' : 'riderpass';
        
        await signIn(email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {type === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-600 mt-2">
          {type === 'login'
            ? `Sign in as a ${userType}`
            : `Register as a ${userType}`}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {type === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}