import React, { useEffect, useState } from 'react';
import { API } from '../api';
import { Link } from 'react-router-dom';
import {
  UserCircle2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  NotebookPen,
  CalendarDays,
  LogOut,
  Menu,
  ChevronLeft
} from 'lucide-react';

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [form, setForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [showPassword, setShowPassword] = useState({
    current: false, new: false, confirm: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (!user?._id) return;
    API.get(`/users/${user._id}`)
      .then(res => setForm(prev => ({
        ...prev,
        name: res.data.name,
        email: res.data.email
      })))
      .catch(() => showMessage('Failed to fetch profile info', 'error'));
  }, [user?._id]);

  const showMessage = (text, type) => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 5000);
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/users/${user._id}`, {
        name: form.name,
        email: form.email
      });
      localStorage.setItem('user', JSON.stringify(res.data));
      showMessage('Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch {
      showMessage('Failed to update profile', 'error');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      showMessage('New passwords do not match', 'error');
      return;
    }

    try {
      await API.put(`/users/change-password/${user._id}`, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      showMessage('Password changed successfully!', 'success');
      setIsPasswordEditing(false);
      setForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch {
      showMessage('Failed to change password', 'error');
    }
  };

  if (!user?._id) return <div className="text-center mt-20 text-white">Invalid user</div>;

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
        <div className="w-10"></div> {/* Spacer for alignment */}
      </header>

      {/* Navigation Sidebar - Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-zinc-800 border-r border-zinc-700 transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="text-2xl font-bold text-white mb-8">
           My Profile
          </div>
          
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
              Profile Settings
            </h2>
            <p className="text-zinc-400">Manage your account information and security</p>
          </div>

          {msg.text && (
            <div className={`p-3 mb-6 rounded-lg flex items-center gap-2 justify-center animate-fade-in ${
              msg.type === 'success' 
                ? 'bg-emerald-600/80 text-white' 
                : 'bg-red-600/80 text-white'
            }`}>
              {msg.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
              <span>{msg.text}</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Profile Info Card */}
            <div className="bg-zinc-800/70 border border-zinc-700/50 rounded-xl p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <UserCircle2 className="text-blue-400 h-5 w-5" />
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
                  <div className="space-y-1">
                    <label className="block text-sm text-zinc-400">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg bg-zinc-700/80 border border-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm text-zinc-400">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg bg-zinc-700/80 border border-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium mt-4"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <InfoRow 
                    icon={<UserCircle2 size={18} className="text-blue-400" />}
                    label="Name"
                    value={form.name}
                  />
                  <InfoRow 
                    icon={<Mail size={18} className="text-purple-400" />}
                    label="Email"
                    value={form.email}
                  />
                </div>
              )}
            </div>

            {/* Password Card */}
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
                  <div className="space-y-1">
                    <label className="block text-sm text-zinc-400">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? 'text' : 'password'}
                        name="currentPassword"
                        value={form.currentPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-zinc-700/80 border border-zinc-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                      >
                        {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm text-zinc-400">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? 'text' : 'password'}
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-zinc-700/80 border border-zinc-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 pr-10"
                        required
                        minLength="6"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                      >
                        {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm text-zinc-400">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-zinc-700/80 border border-zinc-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 pr-10"
                        required
                        minLength="6"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                      >
                        {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg font-medium mt-4"
                  >
                    Change Password
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <Lock size={40} className="mx-auto text-zinc-600 mb-4" />
                  <p className="text-zinc-400">Password management is disabled</p>
                  <p className="text-sm text-zinc-500 mt-2">Click "Change" to update your password</p>
                </div>
              )}
            </div>
          </div>
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
        <div className="text-xs uppercase tracking-wider text-zinc-400">{label}</div>
        <div className="text-white">{value}</div>
      </div>
    </div>
  );
}