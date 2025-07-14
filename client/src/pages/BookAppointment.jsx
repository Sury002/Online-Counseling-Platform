import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../api";
import heroImage from "../assets/therapy-hero2.jpg.jpg";
import { NotebookPen, CalendarDays, LogOut, Menu } from "lucide-react";

export default function BookAppointment() {
  const [userId, setUserId] = useState("");
  const [counselors, setCounselors] = useState([]);
  const [form, setForm] = useState({
    counselorId: "",
    sessionType: "Mental Health",
    date: "",
    time: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isBooked, setIsBooked] = useState(false); 

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

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    

    const dateTime = form.date && form.time ? `${form.date}T${form.time}` : "";
    const payload = { 
      ...form, 
      clientId: userId,
      date: dateTime
    };

    if (
      !payload.clientId ||
      !payload.counselorId ||
      !payload.sessionType ||
      !payload.date
    ) {
      setError("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    try {
      await API.post("/appointments/book", payload);
      setIsBooked(true);
      setForm({
        counselorId: "",
        sessionType: "Mental Health",
        date: "",
        time: ""
      });
      
      
      setTimeout(() => {
        setIsBooked(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error booking appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 rounded-lg hover:bg-gray-700"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">
          Book Session
        </h1>
        <div className="w-10"></div>
      </header>

      {/* Navigation Sidebar - Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-gray-800 border-r border-gray-700 transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="text-2xl font-bold text-white mb-8">
            Book Session
          </div>

          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-gray-300 hover:text-blue-400 p-2 rounded-lg transition-colors mb-4"
            onClick={() => setShowSidebar(false)}
          >
            <NotebookPen className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/appointments"
            className="flex items-center gap-3 text-gray-300 hover:text-blue-400 p-2 rounded-lg transition-colors mb-4"
            onClick={() => setShowSidebar(false)}
          >
            <CalendarDays className="h-5 w-5" />
            <span>Appointments</span>
          </Link>

          <Link
            to="/login"
            onClick={() => {
              localStorage.clear();
              setShowSidebar(false);
            }}
            className="flex items-center gap-3 text-gray-300 hover:text-red-400 p-2 rounded-lg transition-colors mt-auto"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Link>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 md:py-0">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          {/* Hero Image */}
          <div className="hidden md:block relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            <img
              src={heroImage}
              alt="Therapy session"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Find Your Peace
              </h2>
              <p className="text-white/90">
                Schedule a session with our professional counselors today
              </p>
            </div>
          </div>

          {/* Right Form */}
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="flex flex-col items-center mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-900 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 md:h-6 md:w-6 text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Book Your Appointment
              </h2>
              <p className="text-xs md:text-sm text-gray-400 mt-1">
                Fill in the details below
              </p>
            </div>

            {error && (
              <div className="bg-red-900/30 border-l-4 border-red-400 p-3 md:p-4 mb-4 md:mb-6 rounded">
                <p className="text-red-300 text-xs md:text-sm font-medium">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Session Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 md:mb-3">
                  Session Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    "Mental Health",
                    "Relationship Advice",
                    "Career Counseling",
                  ].map((type) => (
                    <label
                      key={type}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors text-xs sm:text-sm ${
                        form.sessionType === type
                          ? "bg-blue-900/50 border border-blue-700 text-blue-200"
                          : "bg-gray-700 border border-gray-600 text-gray-200 hover:bg-gray-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="sessionType"
                        value={type}
                        checked={form.sessionType === type}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Counselor Select */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 md:mb-2">
                  Select Counselor
                </label>
                <div className="relative">
                  <select
                    name="counselorId"
                    value={form.counselorId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-gray-600 rounded-lg bg-gray-700 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                    required
                  >
                    <option value="">Select a counselor</option>
                    {counselors.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 md:mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    min={today}
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                    required
                  />
                </div>
                
                {/* Time Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 md:mb-2">
                    Select Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    min={form.date === today ? currentTime : undefined}
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                    required
                  />
                </div>
              </div>

              {/* Submit Button with Confirmation State */}
              <button
                type="submit"
                disabled={isSubmitting || isBooked}
                className={`w-full py-3 px-4 font-medium rounded-lg shadow-md transition-all duration-300 text-base ${
                  isBooked
                    ? "bg-green-600 text-white cursor-default"
                    : isSubmitting
                    ? "bg-blue-700 opacity-70"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
                }`}
              >
                {isBooked ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Booked Successfully!
                  </span>
                ) : isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                    Processing...
                  </span>
                ) : (
                  "Book Appointment"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}