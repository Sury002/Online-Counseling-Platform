import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { API } from "../api";

export default function ResendEmail() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const prefillEmail = searchParams.get("email");
    if (prefillEmail) setEmail(prefillEmail);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setIsLoading(true);

    try {
      const res = await API.post("/auth/resend-verification", { email });
      setMsg(res.data.msg || "Verification email sent successfully!");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to resend verification email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-8">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-indigo-900/30 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">Resend Verification</h2>
          <p className="text-gray-300 mt-2">
            Enter your email to receive a new verification link
          </p>
        </div>

        {msg && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
            <p className="text-green-300 font-medium text-center">{msg}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
            <p className="text-red-300 font-medium text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-800 outline-none transition duration-200 bg-gray-700 text-white"
              disabled={isLoading}
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
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
              "Resend Verification Email"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            Already verified?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div> 
      </div>
    </div>
  );
}