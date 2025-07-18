import { useEffect, useState } from "react";
import { API } from "../api";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  FileText,
  Lock,
  CheckCircle,
  Clock,
  ChevronRight,
  Loader2,
  NotebookPen,
  CalendarDays,
  LogOut,
  Menu,
  ChevronLeft,
  User,
  X,
} from "lucide-react";

export default function SessionHistory() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAppointments, setShowAppointments] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedAppointment && window.innerWidth < 768) {
      setShowSidebar(false);
      setShowAppointments(false);
    }
  }, [selectedAppointment]);

  useEffect(() => {
    if (!user?._id) return;

    setLoading(true);
    API.get(`/appointments/client/${user._id}`)
      .then((res) => {
        const appts = res.data || [];
        setAppointments(appts);
        if (appts.length > 0) {
          setSelectedAppointment(appts[0]);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to load appointments", err);
      })
      .finally(() => setLoading(false));
  }, [user?._id]);

  useEffect(() => {
   
    if (
      !selectedAppointment?._id ||
      !selectedAppointment.isPaid ||
      selectedAppointment.status === "cancelled"
    ) {
      setNote(null);
      return;
    }

    setLoading(true);

    API.get(`/notes/${selectedAppointment._id}`)
      .then((res) => {
        setNote(res.data?.content || null);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setNote(null);
        } else {
          console.error("❌ Unexpected error loading note:", err);
        }
      })
      .finally(() => setLoading(false));
  }, [selectedAppointment]);

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
        <h1 className="text-xl font-bold">
          {selectedAppointment
            ? selectedAppointment.counselorId?.name
            : "Session History"}
        </h1>
        <button
          onClick={() => setShowAppointments(!showAppointments)}
          className="p-2 rounded-lg hover:bg-gray-700"
        >
          <Calendar className="w-5 h-5" />
        </button>
      </header>

      {/* Navigation Sidebar - Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-gray-800 border-r border-gray-700 transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="text-2xl font-bold text-white mb-8">
            Session Notes
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

      {/* Appointments Sidebar - Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-80 border-r border-gray-700 bg-gray-800 flex flex-col transform ${
          showAppointments ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="p-4 border-b border-gray-700 flex items-center gap-2">
          <button
            onClick={() => setShowAppointments(false)}
            className="md:hidden p-1 rounded-lg hover:bg-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <User className="text-indigo-400" />
            My Notes
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center p-6 text-gray-400">
              No sessions found
            </div>
          ) : (
            <div className="space-y-2">
              {appointments.map((appt) => (
                <div
                  key={appt._id}
                  onClick={() => {
                    setSelectedAppointment(appt);
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                    selectedAppointment?._id === appt._id
                      ? "bg-gray-700"
                      : "hover:bg-gray-700/50"
                  }`}
                >
                  <div>
                    <p className="font-medium">{appt.counselorId?.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(appt.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {appt.status === "completed" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/30 text-emerald-300 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                    {appt.status === "cancelled" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-rose-900/30 text-rose-300 flex items-center gap-1">
                        <X className="w-3 h-3" />
                        Cancelled
                      </span>
                    )}
                    {appt.status !== "cancelled" && !appt.isPaid && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-900/30 text-amber-300 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Unpaid
                      </span>
                    )}
                    {appt.status !== "cancelled" &&
                      appt.status !== "completed" &&
                      appt.isPaid && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/30 text-green-300 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Paid
                        </span>
                      )}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for mobile appointments */}
      {showAppointments && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setShowAppointments(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="text-indigo-400" />
            <h1 className="text-2xl font-bold">Session Notes</h1>
          </div>

          {!selectedAppointment ? (
            <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
              <FileText className="w-12 h-12 mx-auto text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Select a session
              </h3>
              <p className="text-gray-400">
                Choose a session from the sidebar to view its notes
              </p>
            </div>
          ) : !selectedAppointment.isPaid ||
            selectedAppointment.status === "cancelled" ? (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div
                className={`flex items-center gap-3 p-4 rounded-lg mb-4 ${
                  selectedAppointment.status === "cancelled"
                    ? "bg-rose-900/20 text-rose-300"
                    : "bg-amber-900/20 text-amber-300"
                }`}
              >
                <Lock className="w-5 h-5" />
                <div>
                  <h3 className="font-medium">
                    {selectedAppointment.status === "cancelled"
                      ? "Session Cancelled"
                      : "Session Locked"}
                  </h3>
                  <p className="text-sm">
                    {selectedAppointment.status === "cancelled"
                      ? "Notes are not available for cancelled sessions"
                      : "Complete payment to view session notes"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">
                  {selectedAppointment.counselorId?.name}
                </h4>
                <p className="text-sm text-gray-400">
                  {selectedAppointment.sessionType} •{" "}
                  {new Date(selectedAppointment.date).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedAppointment.status === "cancelled" && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-rose-900/30 text-rose-300 flex items-center gap-1">
                      <X className="w-3 h-3" />
                      Cancelled
                    </span>
                  )}
                  {selectedAppointment.status !== "cancelled" &&
                    !selectedAppointment.isPaid && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-900/30 text-amber-300 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Unpaid
                      </span>
                    )}
                </div>
              </div>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            </div>
          ) : !note ? (
            <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
              <FileText className="w-12 h-12 mx-auto text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No notes available
              </h3>
              <p className="text-gray-400">
                Your counselor hasn't added notes for this session yet
              </p>
              {selectedAppointment.status === "completed" && (
                <p className="text-sm text-gray-500 mt-2">
                  This session has been marked as completed
                </p>
              )}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="mb-4">
                <h3 className="font-medium">
                  {selectedAppointment.counselorId?.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {selectedAppointment.sessionType} •{" "}
                  {new Date(selectedAppointment.date).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
                {selectedAppointment.status === "completed" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/30 text-emerald-300 inline-flex items-center gap-1 mt-2">
                    <CheckCircle className="w-3 h-3" />
                    Session completed
                  </span>
                )}
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-300">
                  {note}
                </pre>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
