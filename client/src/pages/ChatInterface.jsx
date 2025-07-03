import { useEffect, useState, useRef } from 'react';
import { API } from '../api';
import socket from '../socket';
import { format } from 'date-fns';
import { 
  MessageSquare, 
  Lock, 
  Send, 
  Mail, 
  CreditCard,
  User as UserIcon,
  Clock,
  Check,
  CheckCheck,
  Shield,
  BadgeCheck
} from 'lucide-react';

export default function ChatInterface() {
  const user = JSON.parse(localStorage.getItem('user'));
  const senderId = user?._id;

  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [typingUser, setTypingUser] = useState(null);
  const [readMessages, setReadMessages] = useState({});
  const bottomRef = useRef();

  useEffect(() => {
    if (!senderId) return;
    API.get(`/appointments/my/${senderId}`)
      .then(res => setAppointments(res.data))
      .catch(err => console.error('❌ Failed to load appointments:', err));
  }, [senderId]);

  useEffect(() => {
    if (!selected) return;

    const receiverId = selected.counselorId._id;
    const room = [senderId, receiverId].sort().join('_');

    socket.connect();
    socket.emit('join', room);

    API.get(`/chat/appointment/${selected._id}`)
      .then(r => setMessages(r.data))
      .catch(err => console.error('❌ Failed to load chat:', err));

    API.patch(`/chat/read/${selected._id}/${senderId}`).catch(err =>
      console.error('❌ Failed to mark existing messages as read:', err)
    );

    socket.on('receive-message', msg => {
      if (msg.appointmentId === selected._id) {
        setMessages(prev => [...prev, msg]);
        if (msg.receiver === senderId) {
          socket.emit('message-read', {
            roomId: room,
            messageId: msg._id,
            readerId: senderId,
          });
        }
      }
    });

    socket.on('user-typing', userId => {
      if (userId !== senderId) {
        setTypingUser(userId);
        setTimeout(() => setTypingUser(null), 2000);
      }
    });

    socket.on('message-read', ({ messageId, readerId }) => {
      setReadMessages(prev => ({ ...prev, [messageId]: readerId }));
    });

    return () => {
      socket.off('receive-message');
      socket.off('user-typing');
      socket.off('message-read');
      socket.disconnect();
    };
  }, [selected, senderId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selected?.isPaid || selected.status === 'completed') return;

    const msg = {
      sender: senderId,
      receiver: selected.counselorId._id,
      message: text.trim(),
      appointmentId: selected._id,
    };

    socket.emit('send-message', {
      roomId: [senderId, selected.counselorId._id].sort().join('_'),
      message: msg,
    });

    try {
      await API.post('/chat', msg);
      setText('');
    } catch (err) {
      console.error('❌ Failed to send message:', err);
    }
  };

  const handleTyping = () => {
    const room = [senderId, selected.counselorId._id].sort().join('_');
    socket.emit('typing', { roomId: room, userId: senderId });
  };

  const startPayment = () => {
    window.location.href = `/pay/${selected._id}`;
  };

  const sendEmail = () => {
    const recipient = selected.counselorId?.email;
    const subject = `Regarding session ${selected.sessionType}`;
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp || isNaN(Date.parse(timestamp))) return 'Just now';
    return format(new Date(timestamp), 'MMM d, h:mm a');
  };

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="text-indigo-600 dark:text-indigo-400" />
            Counseling Sessions
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {appointments.length === 0 ? (
            <div className="text-center p-8 text-gray-500 dark:text-gray-400">
              No appointments found
            </div>
          ) : (
            appointments.map(appt => (
              <div
                key={appt._id}
                onClick={() => setSelected(appt)}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 flex items-center gap-3 ${
                  selected?._id === appt._id 
                    ? 'bg-indigo-50 dark:bg-gray-700' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <UserIcon className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{appt.counselorId.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {appt.sessionType}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    {appt.status === "completed" && (
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
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <MessageSquare className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-lg">Select a session to begin chatting</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <UserIcon className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {selected.counselorId.name}
                    {selected.isPaid && (
                      <BadgeCheck className="text-blue-400" size={18} />
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{selected.sessionType}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(selected.date)}
                    </span>
                  </div>
                </div>
              </div>
              {!selected.isPaid ? (
                <button 
                  onClick={startPayment}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay Now
                </button>
              ) : selected.status === 'completed' ? (
                <span className="text-sm px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <Check className="w-3 h-3" />
                  Session Completed
                </span>
              ) : null}
            </header>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/50">
              <div className="space-y-3">
                {messages.map((msg, i) => {
                  const isSender = msg.sender === senderId;
                  return (
                    <div
                      key={msg._id || i}
                      className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl p-3 ${
                          isSender
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-tl-none'
                        }`}
                      >
                        <div className="text-sm">{msg.message}</div>
                        <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                          isSender ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {formatTimestamp(msg.createdAt || msg.timestamp)}
                          {isSender && (
                            <span className="ml-1">
                              {readMessages[msg._id] ? (
                                <CheckCheck className="w-3 h-3 text-indigo-200" />
                              ) : (
                                <Check className="w-3 h-3 text-indigo-200 opacity-70" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {typingUser && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl rounded-tl-none px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                      Typing...
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              {selected.isPaid && selected.status !== 'completed' ? (
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Type your message..."
                    value={text}
                    onChange={e => {
                      setText(e.target.value);
                      handleTyping();
                    }}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!text.trim()}
                    className="p-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                    selected.status === 'completed'
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                  }`}>
                    <Lock className="w-4 h-4" />
                    {selected.status === 'completed'
                      ? 'Chat disabled — session marked as completed'
                      : 'Please complete payment to unlock chat'}
                  </div>
                  <textarea
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={3}
                    placeholder={`Write email to ${selected.counselorId.name}...`}
                    value={emailBody}
                    onChange={e => setEmailBody(e.target.value)}
                  />
                  <button
                    onClick={sendEmail}
                    disabled={!emailBody.trim()}
                    className="w-full py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Send Email
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}