import React, { useEffect, useState } from "react";
import { API } from "../api";
import {
  Calendar,
  FileText,
  Lock,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Loader2
} from "lucide-react";

export default function SessionHistory() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?._id) return;

    setLoading(true);
    API.get(`/appointments/client/${user._id}`)
      .then((res) => {
        const appts = res.data || [];
        console.log("✅ Client Appointments:", appts);
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
    if (!selectedAppointment?._id || !selectedAppointment.isPaid) {
      setNote(null);
      return;
    }

    setLoading(true);
    console.log("🔄 Fetching note for:", selectedAppointment._id);

    API.get(`/notes/${selectedAppointment._id}`)
      .then((res) => {
        console.log("📝 Note fetched:", res.data);
        setNote(res.data?.content || null);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          console.log("⚠️ No note exists yet for this session.");
          setNote(null);
        } else {
          console.error("❌ Unexpected error loading note:", err);
        }
      })
      .finally(() => setLoading(false));
  }, [selectedAppointment]);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold">My Sessions</h2>
        </div>
        
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
                  console.log("🔘 Selected appointment:", appt._id);
                  setSelectedAppointment(appt);
                }}
                className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                  selectedAppointment?._id === appt._id
                    ? "bg-indigo-50 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
              >
                <div>
                  <p className="font-medium">{appt.counselorId?.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(appt.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold">Session Notes</h1>
          </div>

          {!selectedAppointment ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
              <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select a session
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose a session from the sidebar to view its notes
              </p>
            </div>
          ) : !selectedAppointment.isPaid ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 p-4 rounded-lg mb-4">
                <Lock className="w-5 h-5" />
                <div>
                  <h3 className="font-medium">Session Locked</h3>
                  <p className="text-sm">Complete payment to view session notes</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">{selectedAppointment.counselorId?.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedAppointment.sessionType} • {new Date(selectedAppointment.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            </div>
          ) : !note ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
              <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No notes available
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Your counselor hasn't added notes for this session yet
              </p>
              {selectedAppointment.status === "completed" && (
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  This session has been marked as completed
                </p>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="mb-4">
                <h3 className="font-medium">{selectedAppointment.counselorId?.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedAppointment.sessionType} • {new Date(selectedAppointment.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                {selectedAppointment.status === "completed" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-1 mt-2">
                    <CheckCircle className="w-3 h-3" />
                    Session completed
                  </span>
                )}
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300">
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