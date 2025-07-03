import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  NotebookPen,
  CalendarDays,
  User,
  LogOut,
  Mail,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { API } from '../api';

export default function CounselorProfile() {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [form, setForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [msg, setMsg] = useState({ text: '', type: '' });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);

  useEffect(() => {
    API.get(`/users/${storedUser._id}`)
      .then((res) =>
        setForm((prev) => ({
          ...prev,
          name: res.data.name,
          email: res.data.email,
        }))
      )
      .catch(() => showMessage('Failed to fetch profile info', 'error'));
  }, [storedUser._id]);

  const showMessage = (text, type) => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 5000);
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
      await API.put(`/users/change-password/${storedUser._id}`, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      showMessage('Password changed successfully!', 'success');
      setIsPasswordEditing(false);
      setForm((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch {
      showMessage('Failed to change password', 'error');
    }
  };

  const SidebarLink = ({ to, icon, label, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 text-white hover:text-blue-400 transition mb-4"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col bg-zinc-800 border-r p-6 space-y-6">
        <div className="text-2xl font-bold text-white flex items-center gap-2 mb-8">
          <NotebookPen className="text-blue-400" />
          Counselor Hub
        </div>
        <SidebarLink icon={<NotebookPen />} label="Dashboard" to="/dashboard/counselor" />
        <SidebarLink icon={<LogOut />} label="Logout" to="/login" onClick={() => localStorage.clear()} />
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-8 text-blue-400">👤 Counselor Profile</h1>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Profile Section */}
          <div className="bg-zinc-800/70 rounded-xl border border-zinc-700/50 p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <User size={24} className="text-blue-400" />
                Profile Information
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md"
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

            {msg.text && msg.type === 'success' && !isPasswordEditing && (
              <Alert type="success" text={msg.text} />
            )}
            {msg.text && msg.type === 'error' && !isPasswordEditing && (
              <Alert type="error" text={msg.text} />
            )}

            {isEditing ? (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} />
                <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium">
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-sm">
                <InfoRow label="Full Name" value={form.name} />
                <InfoRow label="Email" value={form.email} />
                <InfoRow label="Role" value={storedUser.role} />
                <InfoRow
                  label="Member Since"
                  value={storedUser.createdAt ? new Date(storedUser.createdAt).toLocaleDateString() : 'N/A'}
                />
              </div>
            )}
          </div>

          {/* Password Section */}
          <div className="bg-zinc-800/70 rounded-xl border border-zinc-700/50 p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Lock size={24} className="text-purple-400" />
                Password Settings
              </h2>
              {!isPasswordEditing ? (
                <button
                  onClick={() => setIsPasswordEditing(true)}
                  className="text-sm bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-md"
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

            {msg.text && msg.type === 'success' && isPasswordEditing && <Alert type="success" text={msg.text} />}
            {msg.text && msg.type === 'error' && isPasswordEditing && <Alert type="error" text={msg.text} />}

            {isPasswordEditing ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <PasswordField
                  label="Current Password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  visible={showPassword.current}
                  toggle={() => togglePasswordVisibility('current')}
                />
                <PasswordField
                  label="New Password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  visible={showPassword.new}
                  toggle={() => togglePasswordVisibility('new')}
                />
                <PasswordField
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  visible={showPassword.confirm}
                  toggle={() => togglePasswordVisibility('confirm')}
                />
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium">
                  Change Password
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <Lock size={48} className="mx-auto text-zinc-600 mb-4" />
                <p className="text-zinc-400">Password management is disabled</p>
                <p className="text-sm text-zinc-500 mt-2">Click "Change" to update your password</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-zinc-700 py-3">
      <span className="text-zinc-400">{label}</span>
      <span className="text-white font-medium capitalize">{value}</span>
    </div>
  );
}

function Alert({ text, type }) {
  const Icon = type === 'success' ? CheckCircle : XCircle;
  const classes =
    type === 'success'
      ? 'bg-emerald-900/50 border border-emerald-800 text-emerald-200'
      : 'bg-red-900/50 border border-red-800 text-red-200';
  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${classes}`}>
      <Icon size={18} />
      {text}
    </div>
  );
}

function TextField({ label, name, value, onChange, type = 'text' }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm text-zinc-400">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 rounded-lg bg-zinc-700/80 border border-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
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
          type={visible ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 pr-10 rounded-lg bg-zinc-700/80 border border-zinc-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
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
