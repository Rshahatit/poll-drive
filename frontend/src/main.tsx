import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { SWRConfig } from 'swr';
import App from './App';
import './index.css';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

// Global SWR configuration
const swrConfig = {
  revalidateOnFocus: false,
  shouldRetryOnError: false
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={publishableKey}>
      <SWRConfig value={swrConfig}>
        <App />
      </SWRConfig>
    </ClerkProvider>
  </StrictMode>
);