import { useEffect, useState } from "react";
import { API } from "../api";
import { useNavigate, Link } from "react-router-dom";
import {
  Video,
  PhoneCall,
  Lock,
  Calendar,
  User,
  ArrowRight,
  Check,
  CreditCard,
  NotebookPen,
  CalendarDays,
  LogOut,
  Menu,
  ChevronLeft,
  X, 
} from "lucide-react";

export default function CallInterface() {
  const user = JSON.parse(localStorage.getItem("user"));
  const senderId = user?._id;
  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAppointments, setShowAppointments] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (selected && window.innerWidth < 768) {
      setShowSidebar(false);
      setShowAppointments(false);
    }
  }, [selected]);

  useEffect(() => {
    if (!senderId) return;
    API.get(`/appointments/my/${senderId}`)
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("❌ Failed to load appointments:", err));
  }, [senderId]);

  const joinCall = () => {
    if (
      selected?.isPaid &&
      selected?.status !== "completed" &&
      selected?.status !== "cancelled"
    ) {
      navigate(`/video-call/${selected._id}`);
    }
  };

  const handlePayment = () => {
    if (selected && selected.status !== "cancelled") {
      navigate(`/pay/${selected._id}`);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-900 text-gray-100">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 rounded-lg hover:bg-gray-700"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">
          {selected ? selected.counselorId?.name : "Video Sessions"}
        </h1>
        <button
          onClick={() => setShowAppointments(!showAppointments)}
          className="p-2 rounded-lg hover:bg-gray-700"
        >
          <Video className="w-5 h-5" />
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
            Video Sessions
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
            <Video className="text-indigo-400" />
            My Calls
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {appointments.length === 0 ? (
            <div className="text-center p-6 text-gray-400">
              No scheduled sessions
            </div>
          ) : (
            <div className="space-y-2">
              {appointments.map((appt) => (
                <div
                  key={appt._id}
                  onClick={() => setSelected(appt)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                    selected?._id === appt._id
                      ? "bg-gray-700"
                      : "hover:bg-gray-700/50"
                  }`}
                >
                  <div>
                    <p className="font-medium">{appt.counselorId?.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(appt.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {appt.status === "completed" && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/30 text-emerald-300 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Completed
                        </span>
                      )}
                    
                      {appt.status === "cancelled" && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-rose-900/30 text-rose-300 flex items-center gap-1">
                          <X className="w-3 h-3" />
                          Cancelled
                        </span>
                      )}
                      {!appt.isPaid && appt.status !== "cancelled" ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-900/30 text-amber-300 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Unpaid
                        </span>
                      ) : appt.isPaid &&
                        appt.status !== "cancelled" &&
                        appt.status !== "completed" ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/30 text-green-300 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Paid
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
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
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-900">
        {!selected ? (
          <div className="text-center max-w-md">
            <div className="mx-auto w-16 h-16 bg-indigo-900/20 rounded-full flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              Select a session
            </h3>
            <p className="text-gray-400">
              Choose a video session from the sidebar to view details
            </p>
          </div>
        ) : selected.status === "cancelled" ? ( 
          <div className="text-center max-w-md">
            <div className="mx-auto w-20 h-20 bg-rose-900/20 rounded-full flex items-center justify-center mb-6">
              <X className="w-8 h-8 text-rose-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              Session Cancelled
            </h3>
            <p className="text-gray-400 mb-6">
              This video session has been cancelled
            </p>
            <button
              disabled
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium flex items-center gap-2 mx-auto cursor-not-allowed"
            >
              <PhoneCall className="w-5 h-5" />
              Call Cancelled
            </button>
          </div>
        ) : selected.isPaid && selected.status !== "completed" ? (
          <div className="text-center max-w-md">
            <div className="mx-auto w-20 h-20 bg-green-900/20 rounded-full flex items-center justify-center mb-6">
              <Video className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              Ready to join
            </h3>
            <p className="text-gray-400 mb-6">
              Your session with {selected.counselorId?.name} is ready to start
            </p>
            <button
              onClick={joinCall}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors"
            >
              <PhoneCall className="w-5 h-5" />
              Join Video Call
            </button>
          </div>
        ) : selected.status === "completed" ? (
          <div className="text-center max-w-md">
            <div className="mx-auto w-20 h-20 bg-emerald-900/20 rounded-full flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              Session completed
            </h3>
            <p className="text-gray-400 mb-6">
              This session has already been marked as completed
            </p>
            <button
              disabled
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium flex items-center gap-2 mx-auto cursor-not-allowed"
            >
              <PhoneCall className="w-5 h-5" />
              Call Ended
            </button>
          </div>
        ) : (
          <div className="text-center max-w-md">
            <div className="mx-auto w-20 h-20 bg-amber-900/20 rounded-full flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              Session locked
            </h3>
            <p className="text-gray-400 mb-6">
              Complete payment to unlock your video session with{" "}
              {selected.counselorId?.name}
            </p>
            <button
              onClick={handlePayment}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              Complete Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
