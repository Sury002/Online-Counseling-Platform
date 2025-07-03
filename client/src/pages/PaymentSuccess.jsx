import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white px-4">
      <div className="bg-zinc-800 border border-green-600 rounded-xl shadow-xl p-10 text-center max-w-md w-full">
        <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
        <h1 className="text-3xl font-bold text-green-400 mb-2">Payment Successful!</h1>
        <p className="text-zinc-300 mb-6">
          Thank you! Your session has been confirmed. We look forward to seeing you.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            to="/appointments"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition"
          >
            View Appointments
          </Link>
          <Link
            to="/dashboard/client"
            className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-2 rounded-md transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
