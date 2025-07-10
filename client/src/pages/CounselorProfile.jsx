import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  NotebookPen,
  User,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  CalendarDays,
  XCircle,
  Menu,
} from "lucide-react";
import { API } from "../api";

export default function CounselorProfile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    API.get(`/users/${storedUser._id}`)
      .then((res) =>
        setForm((prev) => ({
          ...prev,
          name: res.data.name,
          email: res.data.email,
        }))
      )
      .catch(() => showMessage("Failed to fetch profile info", "error"));
  }, [storedUser._id]);

  const showMessage = (text, type) => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 5000);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/users/${storedUser._id}`, {
        name: form.name,
        email: form.email,
      });
      localStorage.setItem("user", JSON.stringify(res.data));
      showMessage("Profile updated successfully!", "success");
      setIsEditing(false);
    } catch {
      showMessage("Failed to update profile", "error");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      showMessage("New passwords do not match", "error");
      return;
    }

    try {
      await API.put(`/users/change-password/${storedUser._id}`, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      showMessage(
        "Password changed successfully! Please login again.",
        "success"
      );

      // Clear user session and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (error) {
      console.error("Password change error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to change password. Please try again.";
      showMessage(errorMessage, "error");
    }
  };

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
        <h1 className="text-xl font-bold">My Profile</h1>
        <div className="w-10"></div>
      </header>

      {/* Navigation Sidebar - Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-zinc-800 border-r border-zinc-700 transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            Profile
          </div>

          <Link
            to="/dashboard/counselor"
            className="flex items-center gap-3 text-zinc-300 hover:text-blue-400 p-2 rounded-lg transition-colors mb-4"
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
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Profile Settings
            </h2>
            <p className="text-zinc-400">
              Manage your account information and security settings
            </p>
          </div>

          {msg.text && (
            <div
              className={`p-3 mb-6 rounded-lg flex items-center gap-2 justify-center animate-fade-in ${
                msg.type === "success"
                  ? "bg-emerald-600/80 text-white"
                  : "bg-red-600/80 text-white"
              }`}
            >
              {msg.type === "success" ? (
                <CheckCircle size={18} />
              ) : (
                <XCircle size={18} />
              )}
              <span>{msg.text}</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Profile Information Card */}
            <div className="bg-zinc-800/70 border border-zinc-700/50 rounded-xl p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <User className="text-blue-400 h-5 w-5" />
                  Profile Information
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-md"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-sm bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded-md"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <TextField
                    label="Full Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <InfoRow label="Full Name" value={form.name} />
                  <InfoRow label="Email" value={form.email} />
                  <InfoRow label="Role" value={storedUser.role} />
                  <InfoRow
                    label="Member Since"
                    value={
                      storedUser.createdAt
                        ? new Date(storedUser.createdAt).toLocaleDateString()
                        : "N/A"
                    }
                  />
                </div>
              )}
            </div>

            {/* Password Settings Card */}
            <div className="bg-zinc-800/70 border border-zinc-700/50 rounded-xl p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Lock className="text-purple-400 h-5 w-5" />
                  Password Settings
                </h3>
                {!isPasswordEditing ? (
                  <button
                    onClick={() => setIsPasswordEditing(true)}
                    className="text-sm bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded-md"
                  >
                    Change
                  </button>
                ) : (
                  <button
                    onClick={() => setIsPasswordEditing(false)}
                    className="text-sm bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded-md"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {isPasswordEditing ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <PasswordField
                    label="Current Password"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    visible={showPassword.current}
                    toggle={() => togglePasswordVisibility("current")}
                  />
                  <PasswordField
                    label="New Password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    visible={showPassword.new}
                    toggle={() => togglePasswordVisibility("new")}
                  />
                  <PasswordField
                    label="Confirm Password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    visible={showPassword.confirm}
                    toggle={() => togglePasswordVisibility("confirm")}
                  />
                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg font-medium"
                  >
                    Change Password
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <Lock size={40} className="mx-auto text-zinc-600 mb-4" />
                  <p className="text-zinc-400">
                    Password management is disabled
                  </p>
                  <p className="text-sm text-zinc-500 mt-2">
                    Click "Change" to update your password
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between py-3 border-b border-zinc-700">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

function TextField({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm text-zinc-400">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 rounded-lg bg-zinc-700/80 border border-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
        required
      />
    </div>
  );
}

function PasswordField({ label, name, value, onChange, visible, toggle }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm text-zinc-400">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 rounded-lg bg-zinc-700/80 border border-zinc-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 pr-10"
          required
          minLength="6"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
