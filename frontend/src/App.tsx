import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { LoginPage } from './pages/auth/LoginPage';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { RideProvider } from './context/RideContext';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LocationProvider>
        <RideProvider>
          {children}
        </RideProvider>
      </LocationProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <Router>
      <Providers>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Providers>
    </Router>
  );
}

export default App;