import React, { useEffect, useState } from "react";
import { API } from "../api";
import {
  NotebookPen,
  CalendarDays,
  UserCircle2,
  MessageCircle,
  Video,
  CreditCard,
  LogOut,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function CounselorAppointments({ userId }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!userId) return;
    API.get(`/appointments/my/${userId}`)
      .then((res) => setAppointments(res.data))
      .catch(() => console.error("Error loading appointments"));
  }, [userId]);

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      const res = await API.patch(`/appointments/mark-completed/${id}`);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? res.data : a))
      );
    } catch (err) {
      console.error("Error marking appointment as completed");
    }
  };

  function SidebarLink({ to, icon, label }) {
    return (
      <Link
        to={to}
        className="flex items-center gap-3 text-white hover:text-blue-400 transition mb-4"
      >
        {icon}
        <span>{label}</span>
      </Link>
    );
  }

  const isInteractionAllowed = (app) => {
    return (
      app.status?.toLowerCase() === "pending" &&
      app.isPaid === true
    );
  };

  return (
    <div className="min-h-screen flex bg-zinc-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-800 border-r p-6 hidden md:flex flex-col">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-8">
          <NotebookPen className="text-blue-400" /> Counselor
        </h2>
        <SidebarLink
          icon={<NotebookPen />}
          label="Dashboad"
          to="/dashboard/counselor"
        />
       <SidebarLink icon={<LogOut />} label="Logout" to="/login" />
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">📅 Your Appointments</h1>
        {appointments.length === 0 ? (
          <p className="text-gray-400">No appointments to show.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {appointments.map((app) => {
              const interactionAllowed = isInteractionAllowed(app);
              return (
                <div
                  key={app._id}
                  className="bg-zinc-800 p-6 rounded-xl shadow-md space-y-4"
                >
                  {/* Status Badge */}
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                      app.status
                    )}`}
                  >
                    {app.status?.charAt(0).toUpperCase() +
                      app.status?.slice(1)}
                  </div>

                  {/* Payment Badge */}
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      app.isPaid
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    } flex items-center gap-1`}
                  >
                    <CreditCard size={14} />
                    {app.isPaid ? "Paid" : "Unpaid"}
                  </div>

                  {/* Client Info */}
                  <div className="flex items-center gap-3">
                    <UserCircle2 className="w-10 h-10 text-blue-400" />
                    <div>
                      <p className="font-bold">{app.clientId?.name}</p>
                      <p className="text-sm text-gray-300">
                        {app.sessionType}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(app.date).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Chat, Notes, Call Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {/* Chat */}
                    <Link
                      to={
                        interactionAllowed
                          ? `/chat/counselor/${app._id}`
                          : "#"
                      }
                      onClick={(e) => {
                        if (!interactionAllowed) e.preventDefault();
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                        interactionAllowed
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-gray-600 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <MessageCircle size={18} /> Chat
                    </Link>

                    {/* Notes */}
                    <Link
                      to={interactionAllowed ? `/notes/${app._id}` : "#"}
                      onClick={(e) => {
                        if (!interactionAllowed) e.preventDefault();
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                        interactionAllowed
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-600 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <NotebookPen size={18} />
                      Notes
                    </Link>

                    {/* Video Call */}
                    <Link
                      to={interactionAllowed ? `/video-call/${app._id}` : "#"}
                      onClick={(e) => {
                        if (!interactionAllowed) e.preventDefault();
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                        interactionAllowed
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-600 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Video size={18} /> Join Call
                    </Link>
                  </div>

                  {/* ✅ Mark as Completed */}
                  {interactionAllowed && (
                    <button
                      onClick={() => handleMarkCompleted(app._id)}
                      className="w-full mt-3 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded transition"
                    >
                      <CheckCircle size={18} /> Mark as Completed
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
