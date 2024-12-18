// Configuration for Clerk Authentication
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const CLERK_CONFIG = {
  publishableKey,
  appearance: {
    elements: {
      rootBox: "mx-auto",
      card: "bg-white shadow-md rounded-lg",
      headerTitle: "text-2xl font-bold text-gray-800",
      headerSubtitle: "text-gray-600",
      formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
    }
  }
};