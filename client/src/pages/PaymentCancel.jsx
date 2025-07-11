import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function PaymentCancel() {
  // Force dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('bg-gray-900');
    return () => {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-gray-900');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/30 mb-4">
          <svg
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-red-400 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-300 mb-6">
          Your payment was not completed. You can try again from your dashboard.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}