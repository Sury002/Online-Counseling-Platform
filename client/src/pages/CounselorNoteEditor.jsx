import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { API } from "../api";
import {
  FileText,
  Lock,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Loader2,
  Save,
  NotebookPen,
  CalendarDays,
  LogOut,
  Menu,
  ChevronLeft,
  Shield,
} from "lucide-react";

export default function CounselorNoteEditor() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const counselorId = user?._id;

  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAppointments, setShowAppointments] = useState(true);

  // Close sidebars when a selection is made on mobile
  useEffect(() => {
    if (selectedAppointment && window.innerWidth < 768) {
      setShowSidebar(false);
      setShowAppointments(false);
    }
  }, [selectedAppointment]);

  useEffect(() => {
    if (!counselorId) return;

    setLoading(true);
    API.get(`/appointments/my/${counselorId}`)
      .then((res) => {
        setAppointments(res.data);
        if (!appointmentId && res.data.length > 0) {
          navigate(`/notes/${res.data[0]._id}`);
        }
      })
      .catch((err) => console.error("❌ Failed to load appointments:", err))
      .finally(() => setLoading(false));
  }, [counselorId]);

  useEffect(() => {
    if (!appointmentId || !counselorId) return;

    const appt = appointments.find((a) => a._id === appointmentId);
    setSelectedAppointment(appt || null);

    setLoading(true);
    API.get(`/notes/counselor/${appointmentId}/${counselorId}`)
      .then((res) => {
        setNote(res.data?.content || "");
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setNote("");
        } else {
          console.error("Error loading note:", err);
        }
      })
      .finally(() => setLoading(false));
  }, [appointmentId, counselorId, appointments]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await API.put(`/notes/${appointmentId}`, {
        content: note,
        counselorId,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Error saving note:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = selectedAppointment?.status === "completed";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">
          {selectedAppointment
            ? selectedAppointment.clientId?.name
            : " Session Notes "}
        </h1>
        <button
          onClick={() => setShowAppointments(!showAppointments)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FileText className="w-5 h-5" />
        </button>
      </header>

      {/* Navigation Sidebar - Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Session Notes
          </div>

          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg transition-colors mb-4"
            onClick={() => setShowSidebar(false)}
          >
            <NotebookPen className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/appointments/counselor"
            className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg transition-colors mb-4"
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
            className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-lg transition-colors mt-auto"
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
        className={`fixed inset-y-0 left-0 z-20 w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col transform ${
          showAppointments ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <button
            onClick={() => setShowAppointments(false)}
            className="md:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="text-indigo-600 dark:text-indigo-400" />
            My Notes
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center p-6 text-gray-500 dark:text-gray-400">
              No sessions found
            </div>
          ) : (
            <div className="space-y-2">
              {appointments.map((appt) => (
                <div
                  key={appt._id}
                  onClick={() => {
                    navigate(`/notes/${appt._id}`);
                    setSelectedAppointment(appt);
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                    selectedAppointment?._id === appt._id
                      ? "bg-indigo-50 dark:bg-gray-700"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <div>
                    <p className="font-medium">{appt.clientId?.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
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
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                    {!appt.isPaid ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Unpaid
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
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
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold">Notes</h1>
          </div>

          {!selectedAppointment ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
              <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select a session
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose a client session from the sidebar to view or edit notes
              </p>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            </div>
          ) : !selectedAppointment.isPaid ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 p-4 rounded-lg mb-4">
                <Lock className="w-5 h-5" />
                <div>
                  <h3 className="font-medium">Session Locked</h3>
                  <p className="text-sm">
                    Client must complete payment before notes can be added
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">
                  {selectedAppointment.clientId?.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
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
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="mb-4">
                  <h3 className="font-medium">
                    {selectedAppointment.clientId?.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
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
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full h-64 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded resize-none text-gray-900 dark:text-gray-100"
                  placeholder="Write your session notes here..."
                  readOnly={isReadOnly}
                />
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                {saved && (
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 mr-4 flex items-center">
                    Saved successfully!
                  </span>
                )}
                <button
                  onClick={handleSave}
                  disabled={loading || isReadOnly}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                    isReadOnly
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isReadOnly
                    ? "Notes are read-only (completed)"
                    : "Save Notes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
