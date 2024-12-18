import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Vote, LogOut, LogIn, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { user, signOut, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <Vote className="h-8 w-8" />
              <span className="text-xl font-bold">VoteRide</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoading ? (
                <div className="animate-pulse h-8 w-20 bg-blue-500 rounded"></div>
              ) : user ? (
                <>
                  <span className="text-sm">{user.name}</span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md hover:bg-blue-700"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-blue-500">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {isLoading ? (
                <div className="animate-pulse h-8 w-20 bg-blue-500 rounded"></div>
              ) : user ? (
                <>
                  <div className="px-3 py-2 text-sm">{user.name}</div>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-700"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-700"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}