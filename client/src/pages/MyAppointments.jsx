import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../api";
import {
  CalendarDays,
  User,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  BadgeCheck,
  BadgeX,
  ChevronDown,
  Filter,
  NotebookPen,
  LogOut,
  Menu,
  CalendarPlus,
} from "lucide-react";

export default function MyAppointments({ userId }) {
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  // Force dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('bg-gray-900');
    return () => {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-gray-900');
    };
  }, []);

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    API.get(`/appointments/my/${userId}`)
      .then((res) => {
        setAppointments(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        console.error("Error loading appointments");
        setIsLoading(false);
      });
  }, [userId]);

  const handleCancel = async (id) => {
    try {
      await API.patch(`/appointments/${id}/cancel`);
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === id ? { ...appt, status: "Cancelled" } : appt
        )
      );
      setMsg("Appointment cancelled successfully");
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setMsg("Error cancelling appointment");
    }
  };

  const getStatusColor = (status) => {
    const normalized = status?.trim().toLowerCase();

    switch (normalized) {
      case "completed":
        return "bg-emerald-900/30 text-emerald-200";
      case "cancelled":
        return "bg-rose-900/30 text-rose-200";
      case "pending":
      default:
        return "bg-amber-900/30 text-amber-200";
    }
  };

  const getStatusIcon = (status) => {
    const normalized = status?.trim().toLowerCase();

    switch (normalized) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-rose-400" />;
      case "pending":
      default:
        return <Clock className="w-4 h-4 text-amber-400" />;
    }
  };

  const filteredAppointments =
    filterStatus === "All"
      ? appointments
      : appointments.filter(
          (appt) => appt.status?.toLowerCase() === filterStatus.toLowerCase()
        );

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
        <h1 className="text-xl font-bold text-white">My Appointments</h1>
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
            Appointments
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
            to="/book"
            className="flex items-center gap-3 text-gray-300 hover:text-blue-400 p-2 rounded-lg transition-colors mb-4"
            onClick={() => setShowSidebar(false)}
          >
            <CalendarPlus className="h-5 w-5" />
            <span>Book Appointments</span>
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
      <div className="flex-1 py-8 px-4 sm:px-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="hidden md:block">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                My Appointments
              </h2>
              <p className="text-gray-400 mt-1">
                View and manage your counseling sessions
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-sm hover:border-indigo-500 transition-colors focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
                <Filter className="w-4 h-4 text-indigo-400" />
                <select
                  className="appearance-none bg-gray-800 pr-8 py-1 text-sm focus:outline-none text-white w-full cursor-pointer"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option
                    value="All"
                    className="bg-gray-800 text-white"
                  >
                    All Appointments
                  </option>
                  <option
                    value="Pending"
                    className="bg-gray-800 text-white"
                  >
                    Pending
                  </option>
                  <option
                    value="Completed"
                    className="bg-gray-800 text-white"
                  >
                    Completed
                  </option>
                  <option
                    value="Cancelled"
                    className="bg-gray-800 text-white"
                  >
                    Cancelled
                  </option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {msg && (
            <div
              className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
                msg.includes("Error")
                  ? "bg-rose-900/30 text-rose-200"
                  : "bg-emerald-900/30 text-emerald-200"
              }`}
            >
              {msg}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="bg-gray-800 rounded-xl shadow-sm p-8 text-center border border-gray-700">
              <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <CalendarDays className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">
                No appointments found
              </h3>
              <p className="text-gray-400">
                {filterStatus === "All"
                  ? "You don't have any appointments yet."
                  : `You don't have any ${filterStatus.toLowerCase()} appointments.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAppointments.map((appt) => {
                const partner =
                  appt.clientId?._id === userId
                    ? appt.counselorId
                    : appt.clientId;
                const isClient = appt.clientId?._id === userId;

                return (
                  <div
                    key={appt._id}
                    className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-gray-600"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-indigo-900/20 flex items-center justify-center">
                            <User className="text-indigo-400 w-5 h-5" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white truncate">
                            {partner?.name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {isClient ? "Counselor" : "Client"} •{" "}
                            {appt.sessionType}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              appt.status
                            )}`}
                          >
                            {getStatusIcon(appt.status)}
                            <span className="ml-1.5">{appt.status}</span>
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-300">
                          <CalendarDays className="flex-shrink-0 w-4 h-4 mr-2 text-indigo-400" />
                          <span>
                            {new Date(appt.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <div className="flex items-center text-sm text-gray-300">
                          <Activity className="flex-shrink-0 w-4 h-4 mr-2 text-indigo-400" />
                          <span>{appt.sessionType} Session</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-300">
                          <IndianRupee className="flex-shrink-0 w-4 h-4 mr-2 text-indigo-400" />
                          <span
                            className={
                              appt.isPaid
                                ? "text-emerald-400"
                                : "text-rose-400"
                            }
                          >
                            {appt.isPaid ? (
                              <span className="flex items-center">
                                <BadgeCheck className="w-4 h-4 mr-1" /> Paid
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <BadgeX className="w-4 h-4 mr-1" /> Unpaid
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isClient && appt.status?.toLowerCase() === "pending" && (
                      <div className="bg-gray-700/20 px-6 py-3 border-t border-gray-700 flex justify-end">
                        <button
                          onClick={() => handleCancel(appt._id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
                        >
                          Cancel Appointment
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}