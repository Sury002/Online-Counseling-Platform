import { useEffect, useState } from "react";
import { API } from "../api";
import {
  NotebookPen,
  UserCircle2,
  MessageCircle,
  Video,
  CreditCard,
  LogOut,
  CheckCircle,
  User,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function CounselorAppointments({ userId }) {
  const [appointments, setAppointments] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (!userId) return;
    API.get(`/appointments/my/${userId}`)
      .then((res) => setAppointments(res.data))
      .catch(() => console.error("Error loading appointments"));
  }, [userId]);

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-900/30 text-emerald-300";
      case "cancelled":
        return "bg-rose-900/30 text-rose-400";
      default:
        return "bg-amber-900/30 text-amber-300";
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      const res = await API.patch(`/appointments/mark-completed/${id}`);
      setAppointments((prev) => prev.map((a) => (a._id === id ? res.data : a)));
    } catch (err) {
      console.error("Error marking appointment as completed");
    }
  };

  const isInteractionAllowed = (app) => {
    return app.status?.toLowerCase() === "pending" && app.isPaid === true;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-gray-100">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 rounded-lg hover:bg-gray-700"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Appointments</h1>
        <div className="w-10"></div>
      </header>

      {/* Navigation Sidebar - Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-gray-800 border-r border-gray-700 transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="text-2xl font-bold text-white mb-8">Appointments</div>

          <Link
            to="/dashboard/counselor"
            className="flex items-center gap-3 text-gray-300 hover:text-blue-400 p-2 rounded-lg transition-colors mb-4"
            onClick={() => setShowSidebar(false)}
          >
            <NotebookPen className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/profile/counselor"
            className="flex items-center gap-3 text-gray-300 hover:text-blue-400 p-2 rounded-lg transition-colors mb-4"
            onClick={() => setShowSidebar(false)}
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
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
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              My Appointments
            </h2>
            <p className="text-gray-400">
              Manage your upcoming and past counseling sessions
            </p>
          </div>

          {appointments.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
              <p className="text-gray-400 text-lg">No appointments scheduled</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {appointments.map((app) => {
                const interactionAllowed = isInteractionAllowed(app);
                return (
                  <div
                    key={app._id}
                    className="bg-gray-800/70 hover:bg-gray-800/90 transition-all p-6 rounded-xl border border-gray-700/50 shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-4">
                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(
                          app.status
                        )}`}
                      >
                        {app.status?.charAt(0).toUpperCase() +
                          app.status?.slice(1)}
                      </span>

                      {/* Payment Badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          app.isPaid
                            ? "bg-green-900/30 text-green-300"
                            : "bg-red-900/30 text-red-400"
                        }`}
                      >
                        <CreditCard size={14} />
                        {app.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </div>

                    {/* Client Info */}
                    <div className="flex items-center gap-4 mb-4">
                      <UserCircle2 className="w-10 h-10 text-blue-400" />
                      <div>
                        <h3 className="font-bold">{app.clientId?.name}</h3>
                        <p className="text-sm text-gray-300">
                          {app.sessionType}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(app.date).toLocaleString("en-IN", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {/* Chat Button */}
                      <Link
                        to={
                          interactionAllowed
                            ? `/chat/counselor/${app._id}`
                            : "#"
                        }
                        onClick={(e) => {
                          if (!interactionAllowed) e.preventDefault();
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm ${
                          interactionAllowed
                            ? "bg-purple-600 hover:bg-purple-500 text-white"
                            : "bg-gray-700 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <MessageCircle size={16} /> Chat
                      </Link>

                      {/* Notes Button */}
                      <Link
                        to={interactionAllowed ? `/notes/${app._id}` : "#"}
                        onClick={(e) => {
                          if (!interactionAllowed) e.preventDefault();
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm ${
                          interactionAllowed
                            ? "bg-blue-600 hover:bg-blue-500 text-white"
                            : "bg-gray-700 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <NotebookPen size={16} /> Notes
                      </Link>

                      {/* Video Call Button */}
                      <Link
                        to={interactionAllowed ? `/video-call/${app._id}` : "#"}
                        onClick={(e) => {
                          if (!interactionAllowed) e.preventDefault();
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm ${
                          interactionAllowed
                            ? "bg-green-600 hover:bg-green-500 text-white"
                            : "bg-gray-700 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <Video size={16} /> Call
                      </Link>
                    </div>

                    {/* Complete Button */}
                    {interactionAllowed && (
                      <button
                        onClick={() => handleMarkCompleted(app._id)}
                        className="w-full mt-4 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        <CheckCircle size={16} /> Mark Completed
                      </button>
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