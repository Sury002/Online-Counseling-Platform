import { useEffect, useState } from 'react';
import { API } from '../api';
import { useNavigate } from 'react-router-dom';
import { 
  Video,
  PhoneCall,
  Lock,
  Calendar,
  User,
  ArrowRight,
  Check,
  CreditCard
} from 'lucide-react';

export default function CallInterface() {
  const user = JSON.parse(localStorage.getItem('user'));
  const senderId = user?._id;
  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!senderId) return;
    API.get(`/appointments/my/${senderId}`)
      .then(res => setAppointments(res.data))
      .catch(err => console.error('❌ Failed to load appointments:', err));
  }, [senderId]);

  const joinCall = () => {
    if (selected?.isPaid && selected?.status !== "completed") {
      navigate(`/video-call/${selected._id}`);
    }
  };

  const handlePayment = () => {
    if (selected) {
      navigate(`/pay/${selected._id}`);
    }
  };

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <Video className="text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold">Video Sessions</h2>
        </div>
        
        {appointments.length === 0 ? (
          <div className="text-center p-6 text-gray-500 dark:text-gray-400">
            No scheduled sessions
          </div>
        ) : (
          <div className="space-y-2">
            {appointments.map(appt => (
              <div
                key={appt._id}
                onClick={() => setSelected(appt)}
                className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                  selected?._id === appt._id
                    ? 'bg-indigo-50 dark:bg-gray-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <div>
                  <p className="font-medium">{appt.counselorId?.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(appt.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {appt.status === 'completed' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                    {!appt.isPaid ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Unpaid
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Paid
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        {!selected ? (
          <div className="text-center max-w-md">
            <div className="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Select a session
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Choose a video session from the sidebar to view details
            </p>
          </div>
        ) : selected.isPaid && selected.status !== "completed" ? (
          <div className="text-center max-w-md">
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
              <Video className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Ready to join
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
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
            <div className="mx-auto w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Session completed
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              This session has already been marked as completed
            </p>
            <button
              disabled
              className="px-6 py-3 bg-gray-400 text-white rounded-lg font-medium flex items-center gap-2 mx-auto cursor-not-allowed"
            >
              <PhoneCall className="w-5 h-5" />
              Call Ended
            </button>
          </div>
        ) : (
          <div className="text-center max-w-md">
            <div className="mx-auto w-20 h-20 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Session locked
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Complete payment to unlock your video session with {selected.counselorId?.name}
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