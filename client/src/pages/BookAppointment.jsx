import { useEffect, useState } from "react";
import { API } from "../api";
import heroImage from "../assets/therapy-hero2.jpg.jpg";

export default function BookAppointment() {
  const [userId, setUserId] = useState("");
  const [counselors, setCounselors] = useState([]);
  const [form, setForm] = useState({
    counselorId: "",
    sessionType: "Mental Health",
    date: "",
  });
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    try {
      const parsedUser = JSON.parse(rawUser);
      if (parsedUser && parsedUser._id) {
        setUserId(parsedUser._id);
      } else {
        setError("User not logged in");
      }
    } catch {
      setError("User not logged in");
    }
  }, []);

  useEffect(() => {
    API.get("/appointments/counselors")
      .then((res) => setCounselors(res.data))
      .catch(() => setError("Failed to load counselors"));
  }, []);

  const showNotification = (message, isSuccess) => {
    setNotification({ message, isSuccess });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = { ...form, clientId: userId };

    if (!payload.clientId || !payload.counselorId || !payload.sessionType || !payload.date) {
      showNotification("Please fill in all fields", false);
      setIsSubmitting(false);
      return;
    }

    try {
      await API.post("/appointments/book", payload);
      showNotification("Appointment booked successfully!", true);
      setForm({
        counselorId: "",
        sessionType: "Mental Health",
        date: ""
      });
    } catch {
      showNotification("Error booking appointment", false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().slice(0, 16);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${notification ? 'animate-fade-in' : 'animate-fade-out'}`}>
          <div className={`px-6 py-4 rounded-lg shadow-xl flex items-center space-x-3 ${notification.isSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className={`flex-shrink-0 h-6 w-6 ${notification.isSuccess ? 'text-green-500' : 'text-red-500'}`}>
              {notification.isSuccess ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <p className={`text-sm font-medium ${notification.isSuccess ? 'text-green-800' : 'text-red-800'}`}>
              {notification.message}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Left Hero Image */}
        <div className="hidden md:block relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          <img
            src={heroImage}
            alt="Therapy session"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-8 left-8 right-8">
            <h2 className="text-3xl font-bold text-white mb-2">Find Your Peace</h2>
            <p className="text-white/90">Schedule a session with our professional counselors today</p>
          </div>
        </div>

        {/* Right Form */}
        <div className="p-8 sm:p-10 md:p-12">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Book Your Appointment
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill in the details below</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 p-4 mb-6 rounded">
              <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Session Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Session Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Mental Health", "Relationship Advice", "Career Counseling"].map((type) => (
                  <label
                    key={type}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors ${form.sessionType === type 
                      ? "bg-blue-100 border border-blue-300 text-blue-700 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-200" 
                      : "bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"}`}
                  >
                    <input
                      type="radio"
                      name="sessionType"
                      value={type}
                      checked={form.sessionType === type}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Counselor Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Counselor
              </label>
              <div className="relative">
                <select
                  name="counselorId"
                  value={form.counselorId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a counselor</option>
                  {counselors.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* DateTime Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Date & Time
              </label>
              <input
                type="datetime-local"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={today}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-md transition-all duration-300 ${isSubmitting ? 'opacity-70' : 'hover:from-blue-700 hover:to-blue-600'}`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Book Appointment"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Add these animations to your global CSS */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px) translateX(-50%); }
          to { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
        @keyframes fade-out {
          from { opacity: 1; transform: translateY(0) translateX(-50%); }
          to { opacity: 0; transform: translateY(-20px) translateX(-50%); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-fade-out {
          animation: fade-out 0.3s ease-in forwards;
        }
      `}</style>
    </div>
  );
}