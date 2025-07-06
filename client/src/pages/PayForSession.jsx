import { useEffect, useState } from "react";
import { API } from "../api";
import { Link } from "react-router-dom"; // Correct import for Link
import { loadStripe } from "@stripe/stripe-js";
import {
  CalendarDays,
  UserCircle2,
  CreditCard,
  Clock,
  Loader2,
  XCircle,
  NotebookPen,
  LogOut,
  Menu,
} from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PayForSession() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [appointments, setAppointments] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (!user?._id) return;
    API.get(`/appointments/my/${user._id}`)
      .then((res) => {
        const unpaid = res.data.filter(
          (a) =>
            !a.isPaid &&
            a.clientId._id === user._id &&
            a.status?.toLowerCase() !== "cancelled"
        );
        setAppointments(unpaid);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load unpaid appointments");
      });
  }, [user?._id]);

  const handlePay = async (appointment) => {
    setLoadingId(appointment._id);
    setError(null);

    try {
      const stripe = await stripePromise;

      const res = await API.post("/payments/create-checkout-session", {
        amount: appointment.amount || 499,
        counselorName: appointment.counselorId.name,
        clientEmail: appointment.clientId.email,
        sessionType: appointment.sessionType,
        appointmentId: appointment._id,
      });

      window.location.href = res.data.url;
    } catch (err) {
      console.error("❌ Payment failed:", err);
      setError("Payment failed. Try again.");
    } finally {
      setLoadingId(null);
    }
  };

  if (!user?._id)
    return <div className="text-center mt-20 text-white">Invalid user</div>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-zinc-700 bg-zinc-800">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 rounded-lg hover:bg-zinc-700"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Unpaid Appointments</h1>
        <div className="w-10"></div>
      </header>

      {/* Navigation Sidebar - Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-zinc-800 border-r border-zinc-700 transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="text-2xl font-bold text-white mb-8">Payments</div>

          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-zinc-300 hover:text-purple-400 p-2 rounded-lg transition-colors mb-4"
            onClick={() => setShowSidebar(false)}
          >
            <NotebookPen className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/appointments"
            className="flex items-center gap-3 text-zinc-300 hover:text-purple-400 p-2 rounded-lg transition-colors mb-4"
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
            className="flex items-center gap-3 text-zinc-300 hover:text-red-400 p-2 rounded-lg transition-colors mt-auto"
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
              Unpaid Appointments
            </h2>
            <p className="text-zinc-400">
              Complete your payments to secure your sessions
            </p>
          </div>

          {error && (
            <div className="bg-red-600/80 text-white p-3 mb-6 rounded-lg flex items-center gap-2 justify-center animate-fade-in">
              <XCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {appointments.length === 0 ? (
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8 text-center">
              <p className="text-zinc-400 text-lg">
                You have no unpaid appointments
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {appointments.map((appt) => (
                <div
                  key={appt._id}
                  className="bg-zinc-800/70 hover:bg-zinc-800/90 transition-all p-5 rounded-xl border border-zinc-700/50 shadow-lg backdrop-blur-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <InfoRow
                      icon={
                        <CalendarDays size={18} className="text-purple-400" />
                      }
                      label="Session"
                      value={
                        <span className="font-medium">{appt.sessionType}</span>
                      }
                    />
                    <InfoRow
                      icon={<UserCircle2 size={18} className="text-blue-400" />}
                      label="Counselor"
                      value={
                        <span className="font-medium">
                          {appt.counselorId.name}
                        </span>
                      }
                    />
                    <InfoRow
                      icon={<Clock size={18} className="text-amber-400" />}
                      label="Date"
                      value={new Date(appt.date).toLocaleString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    />
                    <InfoRow
                      icon={
                        <CreditCard size={18} className="text-emerald-400" />
                      }
                      label="Amount"
                      value={
                        <span className="font-bold">₹{appt.amount || 499}</span>
                      }
                    />
                  </div>

                  <button
                    onClick={() => handlePay(appt)}
                    disabled={loadingId === appt._id}
                    className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-center transition-all ${
                      loadingId === appt._id
                        ? "bg-purple-600/70 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-500 shadow-md hover:shadow-purple-500/20"
                    }`}
                  >
                    {loadingId === appt._id ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        Processing Payment...
                      </>
                    ) : (
                      <>Pay ₹{appt.amount || 499}</>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <div className="text-xs uppercase tracking-wider text-zinc-400">
          {label}
        </div>
        <div className="text-white">{value}</div>
      </div>
    </div>
  );
}
