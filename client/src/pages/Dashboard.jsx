import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../api";
import {
  CalendarPlus,
  CalendarCheck,
  MessageSquare,
  Video,
  CreditCard,
  User,
  LogOut,
  BrainCircuit,
  HeartPulse,
  Smile,
  Users,
  BookOpen,
  Leaf,
  Briefcase,
  Menu,
  X
} from "lucide-react";
import heroImg from "../assets/therapy-hero.jpg.jpg";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [appointments, setAppointments] = useState([]);
  const [latestAppointmentId, setLatestAppointmentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const res = await API.get(`/appointments/my/${user._id}`);
        setAppointments(res.data);
        if (res.data.length > 0) {
          const latest = res.data[res.data.length - 1];
          setLatestAppointmentId(latest._id);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load appointments");
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [user._id]);

  const upcoming = appointments.filter(a => new Date(a.date) > new Date());
  const paid = appointments.filter(a => a.isPaid);

  const wellnessDimensions = [
    { title: "Physical", icon: <HeartPulse className="w-5 h-5 text-rose-500" /> },
    { title: "Emotional", icon: <Smile className="w-5 h-5 text-amber-500" /> },
    { title: "Social", icon: <Users className="w-5 h-5 text-emerald-500" /> },
    { title: "Intellectual", icon: <BookOpen className="w-5 h-5 text-blue-500" /> },
    { title: "Spiritual", icon: <Leaf className="w-5 h-5 text-green-500" /> },
    { title: "Occupational", icon: <Briefcase className="w-5 h-5 text-violet-500" /> },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-lg"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Enhanced Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 w-72 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-lg z-40 shadow-2xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-72 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full px-6 py-10">
          <div>
            {/* Updated Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                WellMind
              </h2>
            </div>
            
            {/* Navigation with larger spacing */}
            <div className="space-y-3">
              <NavItem 
                icon={<CalendarPlus size={20} className="text-indigo-500" />} 
                label="Book Session" 
                to="/book" 
              />
              <NavItem 
                icon={<CalendarCheck size={20} className="text-purple-500" />} 
                label="My Appointments" 
                to="/appointments" 
              />
              <NavItem 
                icon={<MessageSquare size={20} className="text-cyan-500" />} 
                label="Messages" 
                to="/chat" 
              />
              <NavItem 
                icon={<BrainCircuit size={20} className="text-emerald-500" />} 
                label="Session History" 
                to="/session-history" 
              />
              <NavItem 
                icon={<Video size={20} className="text-rose-500" />} 
                label="Video Calls" 
                to="/call" 
              />
              <NavItem
                icon={<CreditCard size={20} className="text-amber-500" />}
                label="Payments"
                to={latestAppointmentId ? `/pay/${latestAppointmentId}` : "#"}
                disabled={!latestAppointmentId}
              />
              <NavItem 
                icon={<User size={20} className="text-blue-500" />} 
                label="My Profile" 
                to="/profile" 
              />
            </div>
          </div>
          
          {/* Logout button at bottom */}
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
            alt="Counseling"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-zinc-800/80 flex flex-col justify-center items-start p-6 sm:p-8 md:p-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome, {user.name || "User"} <span className="text-indigo-300">👋</span>
            </h1>
            <p className="text-zinc-200 text-sm sm:text-base max-w-xl">
              Your journey to mental wellness starts here. Connect with professionals and access resources.
            </p>
            <Link
              to="/book"
              className="mt-4 sm:mt-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium shadow-md transition-all"
            >
              Book a Session
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
          <OverviewCard 
            label="Total Bookings" 
            value={appointments.length} 
            icon={<BookOpen className="w-5 h-5" />}
            color="bg-gradient-to-br from-indigo-600 to-indigo-700"
            loading={isLoading}
          />
          <OverviewCard 
            label="Upcoming" 
            value={upcoming.length} 
            icon={<CalendarCheck className="w-5 h-5" />}
            color="bg-gradient-to-br from-emerald-600 to-emerald-700"
            loading={isLoading}
          />
          <OverviewCard 
            label="Paid Sessions" 
            value={paid.length} 
            icon={<CreditCard className="w-5 h-5" />}
            color="bg-gradient-to-br from-amber-600 to-amber-700"
            loading={isLoading}
          />
        </section>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-8">
          <FeatureCard
            title="Book Appointments"
            description="Choose licensed counselors and book sessions."
            icon={<CalendarPlus className="text-indigo-500 w-5 h-5" />}
            color="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/20"
          />
          <FeatureCard
            title="Live Chat & Video"
            description="Secure and confidential communication."
            icon={<MessageSquare className="text-purple-500 w-5 h-5" />}
            color="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20"
          />
          <FeatureCard
            title="Session History"
            description="Access notes from previous sessions."
            icon={<BrainCircuit className="text-emerald-500 w-5 h-5" />}
            color="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20"
          />
        </section>

        {/* Wellness Dimensions */}
        <div className="bg-white dark:bg-zinc-800/30 backdrop-blur-sm rounded-2xl shadow-md p-5 sm:p-6 border border-white/20 dark:border-zinc-700/30">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-xl font-bold text-zinc-800 dark:text-white">Wellness Dimensions</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              Key areas for holistic mental health
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {wellnessDimensions.map((dimension, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center justify-center p-3 bg-white dark:bg-zinc-800/50 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700/30"
              >
                <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-sm mb-2">
                  {dimension.icon}
                </div>
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 text-center">
                  {dimension.title}
                </h4>
              </div>
            ))}
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
          // Close mobile sidebar after navigation
          if (window.innerWidth < 768) {
            document.querySelector('aside')?.classList.add('-translate-x-full');
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

function FeatureCard({ title, description, icon, color }) {
  return (
    <div className={`${color} p-5 rounded-2xl shadow-md flex flex-col gap-3 border border-zinc-200 dark:border-zinc-700 transition-all hover:-translate-y-1 hover:shadow-lg`}>
      <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <h4 className="text-md font-bold text-zinc-900 dark:text-white">
        {title}
      </h4>
      <p className="text-xs text-zinc-600 dark:text-zinc-300">{description}</p>
    </div>
  );
}

function OverviewCard({ label, value, icon, color, loading }) {
  return (
    <div className={`${color} p-4 sm:p-5 rounded-2xl shadow-md text-white relative overflow-hidden`}>
      <div className="absolute -right-4 -bottom-4 opacity-20 w-20 h-20 rounded-full bg-white"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium">{label}</h3>
          <div className="p-2 bg-white/20 rounded-lg">
            {icon}
          </div>
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