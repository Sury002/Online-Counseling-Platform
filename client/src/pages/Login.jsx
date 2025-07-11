import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../api"; 
import { useAuth } from "../context/AuthContext.jsx"; 

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setShowResend(false);

    try {
      const res = await API.post("/auth/login", form);
      const { token, user } = res.data;

     login(user, token);

      // Redirect based on user role
      navigate(user.role === "counselor" ? "/dashboard/counselor" : "/dashboard/client");
    } catch (err) {
      const errMsg = err.response?.data?.msg || "Login failed. Please check your credentials and try again.";
      setError(errMsg);

      // Show resend verification link if account isn't verified
      if (errMsg.toLowerCase().includes("not verified")) {
        setShowResend(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-8">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-indigo-900/30 mb-4">
            <div className="w-6 h-6 rounded-lg bg-indigo-400 flex items-center justify-center text-white font-bold">
              W
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-300 mt-2">Sign in to continue to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
            <p className="text-red-300 font-medium text-center">{error}</p>
            {showResend && (
              <div className="mt-2 text-center">
                <Link
                  to={`/resend-verification?email=${encodeURIComponent(form.email)}`}
                  className="text-indigo-400 hover:underline text-sm font-medium"
                >
                  Resend verification email
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-800 outline-none transition duration-200 bg-gray-700 text-white"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-300">
                Password <span className="text-red-500">*</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-800 outline-none transition duration-200 bg-gray-700 text-white pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {showPassword ? (
                    <>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </>
                  ) : (
                    <>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </>
                  )}
                </svg>
              </button>
            </div>
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
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-6">
          <p className="text-xs text-gray-400 text-center">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-indigo-400 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-indigo-400 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}