import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  // Force dark mode on mount to match PaymentCancel
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
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-900/30 mb-4">
          <CheckCircle className="h-6 w-6 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-green-400 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-300 mb-6">
          Thank you! Your session has been confirmed. We look forward to seeing you.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/appointments"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            View Appointments
          </Link>
          <Link
            to="/dashboard/client"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}