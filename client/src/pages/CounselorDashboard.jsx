import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../api";
import {
  CalendarPlus,
  CalendarCheck,
  MessageSquare,
  Video,
  User,
  LogOut,
  BrainCircuit,
  FileText,
  Menu,
  X,
  CreditCard,
  HeartPulse,
  Shield,
  TrendingUp,
} from "lucide-react";
import heroImg from "../assets/dashboard-hero.jpg.jpg";

export default function CounselorDashboard({ userId }) {
  const [appointments, setAppointments] = useState([]);
  const [paidClients, setPaidClients] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const res = await API.get(`/appointments/my/${userId}`);
        const data = res.data || [];
        setAppointments(data);

        const paid = data.filter((a) => a.isPaid);
        setPaidClients(paid.length);

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load appointment stats");
        setIsLoading(false);
      }
    };

    if (userId) fetchStats();
  }, [userId]);

  const upcoming = appointments.filter((a) => new Date(a.date) > new Date());

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-lg"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-lg z-40 shadow-2xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-72 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full px-6 py-10">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Counselor Hub
              </h2>
            </div>

            <div className="space-y-3">
              <NavItem
                icon={<CalendarCheck size={20} className="text-purple-500" />}
                label="Appointments"
                to="/appointments/counselor"
              />
              <NavItem
                icon={<MessageSquare size={20} className="text-emerald-500" />}
                label="Messages"
                to="/chat/counselor"
              />
              <NavItem
                icon={<Video size={20} className="text-rose-500" />}
                label="Video Calls"
                to="/call/counselor"
              />
              <NavItem
                icon={<FileText size={20} className="text-amber-500" />}
                label="Session Notes"
                to="/notes/counselor"
              />
              <NavItem
                icon={<User size={20} className="text-blue-500" />}
                label="Profile"
                to="/profile/counselor"
              />
            </div>
          </div>

          <div className="mt-auto pt-10">
            <NavItem
              icon={<LogOut size={20} className="text-rose-500" />}
              label="Logout"
              to="/login"
              onClick={() => localStorage.clear()}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 md:px-8 py-8 overflow-y-auto">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-8 h-64 shadow-xl">
          <img
            src={heroImg}
            alt="Counseling Dashboard"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-zinc-800/80 flex flex-col justify-center items-start p-6 sm:p-8 md:p-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome, Counselor <span className="text-indigo-300">👋</span>
            </h1>
            <p className="text-zinc-200 text-sm sm:text-base max-w-xl">
              Manage your counseling sessions and track your professional
              activities.
            </p>
            <Link
              to="/appointments/counselor"
              className="mt-4 sm:mt-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium shadow-md transition-all"
            >
              View Appointments
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
          <OverviewCard
            label="Total Appointments"
            value={appointments.length}
            icon={<CalendarCheck className="w-5 h-5" />}
            color="bg-gradient-to-br from-indigo-600 to-indigo-700"
            loading={isLoading}
          />
          <OverviewCard
            label="Upcoming"
            value={upcoming.length}
            icon={<CalendarPlus className="w-5 h-5" />}
            color="bg-gradient-to-br from-emerald-600 to-emerald-700"
            loading={isLoading}
          />
          <OverviewCard
            label="Paid Sessions"
            value={paidClients}
            icon={<CreditCard className="w-5 h-5" />}
            color="bg-gradient-to-br from-amber-600 to-amber-700"
            loading={isLoading}
          />
        </section>

        {/* Mental Health Insights */}
        <div className="bg-white dark:bg-zinc-800/30 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-white/20 dark:border-zinc-700/30 mb-8">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-white mb-6">
            Mental Health Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 dark:bg-indigo-800/30 p-3 rounded-lg">
                <HeartPulse className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-800 dark:text-white mb-2">
                  Holistic Wellbeing
                </h3>
                <p className="text-zinc-600 dark:text-zinc-300">
                  Mental health is deeply connected to physical health, social
                  connections, and emotional resilience. Encourage clients to
                  consider all aspects of their wellbeing in their healing
                  journey.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 dark:bg-emerald-800/30 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-800 dark:text-white mb-2">
                  Resilience Building
                </h3>
                <p className="text-zinc-600 dark:text-zinc-300">
                  Developing coping strategies and emotional regulation skills
                  can significantly improve clients' ability to handle life's
                  challenges. Focus on strengths-based approaches in your
                  sessions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Counseling Trends */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl shadow-md p-6 border border-indigo-100 dark:border-indigo-800/30">
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 dark:bg-purple-800/30 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-800 dark:text-white mb-2">
                Emerging Trends in Counseling
              </h3>
              <ul className="mt-3 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 dark:text-purple-400">
                    •
                  </span>
                  <span>
                    Increased use of teletherapy and digital mental health tools
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 dark:text-purple-400">
                    •
                  </span>
                  <span>Growing emphasis on culturally competent care</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 dark:text-purple-400">
                    •
                  </span>
                  <span>Integration of mindfulness and somatic approaches</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 dark:text-purple-400">
                    •
                  </span>
                  <span>Focus on preventative mental health care</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, to, onClick, disabled }) {
  return (
    <Link
      to={disabled ? "#" : to}
      onClick={(e) => {
        if (disabled) e.preventDefault();
        else {
          onClick?.();
          if (window.innerWidth < 768) {
            document.querySelector("aside")?.classList.add("-translate-x-full");
          }
        }
      }}
      className={`flex items-center gap-4 py-4 px-4 rounded-xl text-base font-medium transition-all ${
        disabled
          ? "text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
          : "text-zinc-700 dark:text-zinc-200 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400"
      }`}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function OverviewCard({ label, value, icon, color, loading }) {
  return (
    <div
      className={`${color} p-4 sm:p-5 rounded-2xl shadow-md text-white relative overflow-hidden`}
    >
      <div className="absolute -right-4 -bottom-4 opacity-20 w-20 h-20 rounded-full bg-white"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium">{label}</h3>
          <div className="p-2 bg-white/20 rounded-lg">{icon}</div>
        </div>
        {loading ? (
          <div className="h-8 w-3/4 bg-white/20 rounded-lg animate-pulse mt-3"></div>
        ) : (
          <p className="text-2xl font-bold mt-3">{value}</p>
        )}
      </div>
    </div>
  );
}
