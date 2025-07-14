import { useState } from "react";
import { API } from "../api";
import { Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 0) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
      
    
      if (showPasswordAlert && strength >= 4) {
        setShowPasswordAlert(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordStrength < 4) {
      setShowPasswordAlert(true);
      setError("Password is too weak. Please make it stronger.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setMsg("");
    setShowPasswordAlert(false);

    try {
      const res = await API.post("/auth/register", form);
      setMsg("Registration successful! Please check your email to verify your account.");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return "bg-gray-600";
      case 1: return "bg-red-500";
      case 2: return "bg-orange-500";
      case 3: return "bg-yellow-500";
      case 4: return "bg-green-500";
      case 5: return "bg-green-600";
      default: return "bg-gray-600";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return "Enter a password";
      case 1: return "Very weak (needs at least 8 characters)";
      case 2: return "Weak (add uppercase letters or numbers)";
      case 3: return "Moderate (add special characters)";
      case 4: return "Strong";
      case 5: return "Very strong";
      default: return "";
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
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-gray-300 mt-2">Join our community today</p>
        </div>

        {msg && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
            <p className="text-green-300 font-medium text-center">{msg}</p>
            <Link
              to="/resend-verification"
              className="text-indigo-400 hover:underline text-sm block mt-2 text-center"
            >
              Didn't receive email? Resend verification
            </Link>
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
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-800 outline-none transition duration-200 bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-800 outline-none transition duration-200 bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
              minLength="8"
              className="w-full px-4 py-3 rounded-lg border border-gray-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-800 outline-none transition duration-200 bg-gray-700 text-white"
            />
            <div className="mt-2">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 flex-1 rounded-full ${
                      i <= passwordStrength 
                        ? getPasswordStrengthColor() 
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs mt-1 ${
                passwordStrength < 4 ? "text-amber-400" : "text-gray-400"
              }`}>
                {getPasswordStrengthText()}
              </p>
              
              {showPasswordAlert && (
                <div className="mt-2 p-2 bg-red-900/30 border border-red-700 rounded text-xs text-amber-200">
                  ⚠️ Password is too weak. Must include:
                  <ul className="list-disc pl-5 mt-1">
                    <li>At least 8 characters</li>
                    <li>Uppercase letter</li>
                    <li>Number</li>
                    <li>Special character</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Account Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="role"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-800 outline-none transition duration-200 appearance-none bg-gray-700 text-white pr-8"
              >
                <option value="client">Client</option>
                <option value="counselor">Counselor</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
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
                Creating Account...
              </span>
            ) : (
              "Register Now"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-6">
          <p className="text-xs text-gray-400 text-center">
            By registering, you agree to our{" "}
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