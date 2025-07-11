import { useState } from "react";
import { API } from "../api";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post("/auth/forgot-password", { email });
      setMsg(res.data.msg);
      setError("");
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-indigo-900/30 mb-4">
            <div className="w-6 h-6 rounded-lg bg-indigo-400 flex items-center justify-center text-white font-bold">
              W
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">Reset Password</h2>
          <p className="text-gray-300 mt-2">
            Enter your email to receive a reset link
          </p>
        </div>

        {msg && (
          <div className="mb-6 p-3 bg-green-900/30 text-green-300 text-sm rounded-lg text-center border border-green-700">
            {msg}
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-red-900/30 text-red-300 text-sm rounded-lg text-center border border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-800 outline-none transition duration-200 bg-gray-700 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 ${
              isLoading 
                ? "bg-indigo-500 cursor-not-allowed" 
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-6">
          <p className="text-xs text-gray-400 text-center">
            We'll send you a link to reset your password
          </p>
        </div>
      </div>
    </div>
  );
}