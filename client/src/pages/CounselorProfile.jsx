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
  
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);


  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('bg-gray-900');
    return () => {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-gray-900');
    };
  }, []);

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

  
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 0) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const showMessage = (text, type) => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    
    if (name === "newPassword") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
      
      
      if (showPasswordAlert && strength >= 4) {
        setShowPasswordAlert(false);
      }
    }
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
    
   
    if (passwordStrength < 4) {
      showMessage("Password is too weak. Please make it stronger.", "error");
      setShowPasswordAlert(true);
      return;
    }

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

  
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return "bg-gray-600";
      case 1: return "bg-red-500";
      case 2: return "bg-orange-500";
      case 3: return "bg-yellow-500";
      case 4: return "bg-green-500";
      case 5: return "bg-green-600";
      default: return "bg-gray-600";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return "Enter a password";
      case 1: return "Very weak (needs at least 8 characters)";
      case 2: return "Weak (add uppercase letters or numbers)";
      case 3: return "Moderate (add special characters)";
      case 4: return "Strong";
      case 5: return "Very strong";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-white">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 rounded-lg hover:bg-gray-700"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">My Profile</h1>
        <div className="w-10"></div>
      </header>

      {/* Navigation Sidebar - Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-gray-800 border-r border-gray-700 transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            Profile
          </div>

          <Link
            to="/dashboard/counselor"
            className="flex items-center gap-3 text-gray-300 hover:text-blue-400 p-2 rounded-lg transition-colors mb-4"
            onClick={() => setShowSidebar(false)}
          >
            <NotebookPen className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/appointments/counselor"
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

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Profile Settings
            </h2>
            <p className="text-gray-400">
              Manage your account information and security settings
            </p>
          </div>

          {msg.text && (
            <div
              className={`p-3 mb-6 rounded-lg flex items-center gap-2 justify-center ${
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
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
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
                    className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md"
                  >
                    Cancel
                  </button>
                )}
              </div>

               {isEditing ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TextField
                      label="Full Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                    <button
                      type="submit"
                      className="mt-6 bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-md text-md"
                    >
                      Save
                    </button>
                  </div>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    disabled
                    readOnly
                    tabIndex={-1}
                    style={{ pointerEvents: "none" }}
                  />
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
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
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
                    onClick={() => {
                      setIsPasswordEditing(false);
                    
                      setForm(prev => ({
                        ...prev,
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                      }));
                      setPasswordStrength(0);
                      setShowPasswordAlert(false);
                    }}
                    className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md"
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
                  
                  <div>
                    <PasswordField
                      label="New Password"
                      name="newPassword"
                      value={form.newPassword}
                      onChange={handleChange}
                      visible={showPassword.new}
                      toggle={() => togglePasswordVisibility("new")}
                    />
                    
                    {/* Password strength meter */}
                    {form.newPassword && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div 
                              key={i} 
                              className={`h-1.5 flex-1 rounded-full ${
                                i <= passwordStrength 
                                  ? getPasswordStrengthColor()
                                  : 'bg-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs mt-1 ${
                          passwordStrength < 4 ? "text-amber-400" : "text-gray-400"
                        }`}>
                          {getPasswordStrengthText()}
                        </p>
                        
                        {/* Password requirements alert */}
                        {showPasswordAlert && passwordStrength < 4 && (
                          <div className="mt-2 p-2 bg-red-900/30 border border-red-700 rounded text-xs text-amber-200">
                            ⚠️ Password must include:
                            <ul className="list-disc pl-5 mt-1">
                              <li>At least 8 characters</li>
                              <li>Uppercase letter</li>
                              <li>Number</li>
                              <li>Special character</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
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
                  <Lock size={40} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400">
                    Password management is disabled
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
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
    <div className="flex justify-between py-3 border-b border-gray-700">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

function TextField({ label, name, value, onChange, type = "text", ...rest }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm text-gray-400">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 ${
          rest.disabled ? "text-gray-400 cursor-not-allowed" : "text-white"
        }`}
        required
        {...rest}
      />
    </div>
  );
}

function PasswordField({ label, name, value, onChange, visible, toggle }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm text-gray-400">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 pr-10"
          required
          minLength="6"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}