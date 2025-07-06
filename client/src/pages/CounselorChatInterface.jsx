import { useEffect, useState, useRef } from "react";
import { API } from "../api";
import socket from "../socket";
import { format } from "date-fns";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MessageSquare,
  Lock,
  Send,
  Mail,
  User as UserIcon,
  Clock,
  Check,
  CheckCheck,
  Shield,
  NotebookPen,
  CalendarDays,
  LogOut,
  Menu,
  ChevronLeft,
} from "lucide-react";

export default function CounselorChatInterface({
  counselorId: propCounselorId,
}) {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const counselorId = propCounselorId || user._id;

  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [readMessages, setReadMessages] = useState({});
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAppointments, setShowAppointments] = useState(true);
  const bottomRef = useRef();

  useEffect(() => {
    if (selected && window.innerWidth < 768) {
      setShowSidebar(false);
      setShowAppointments(false);
    }
  }, [selected]);

  useEffect(() => {
    if (!counselorId) return;
    API.get(`/appointments/my/${counselorId}`)
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("❌ Failed to load appointments:", err));
  }, [counselorId]);

  useEffect(() => {
    if (!appointmentId) {
      setSelected(null);
      setMessages([]);
      return;
    }

    API.get(`/appointments/${appointmentId}`)
      .then((res) => setSelected(res.data))
      .catch((err) =>
        console.error("❌ Failed to load selected appointment:", err)
      );
  }, [appointmentId]);

  useEffect(() => {
    if (!selected || !counselorId) return;
    const receiverId = selected.clientId._id;
    const room = [counselorId, receiverId].sort().join("_");

    socket.connect();
    socket.emit("join", room);

    API.get(`/chat/appointment/${selected._id}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("❌ Failed to load chat:", err));

    API.patch(`/chat/read/${selected._id}/${counselorId}`).catch((err) =>
      console.error("❌ Failed to mark messages as read:", err)
    );

    socket.on("receive-message", (msg) => {
      if (msg.appointmentId === selected._id) {
        setMessages((prev) => [...prev, msg]);
        if (msg.receiver === counselorId) {
          socket.emit("message-read", {
            roomId: room,
            messageId: msg._id,
            readerId: counselorId,
          });
        }
      }
    });

    socket.on("user-typing", (userId) => {
      if (userId !== counselorId) {
        setTypingUser(userId);
        setTimeout(() => setTypingUser(null), 2000);
      }
    });

    socket.on("message-read", ({ messageId, readerId }) => {
      setReadMessages((prev) => ({ ...prev, [messageId]: readerId }));
    });

    return () => {
      socket.off("receive-message");
      socket.off("user-typing");
      socket.off("message-read");
      socket.disconnect();
    };
  }, [selected, counselorId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selected?.isPaid) return;

    const msg = {
      sender: counselorId,
      receiver: selected.clientId._id,
      message: text.trim(),
      appointmentId: selected._id,
    };

    socket.emit("send-message", {
      roomId: [counselorId, selected.clientId._id].sort().join("_"),
      message: msg,
    });

    try {
      await API.post("/chat", msg);
      setText("");
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  const handleTyping = () => {
    const room = [counselorId, selected.clientId._id].sort().join("_");
    socket.emit("typing", { roomId: room, userId: counselorId });
  };

  const sendEmail = async () => {
    const recipient = selected?.clientId?.email;
    const subject = `Regarding your session: ${selected?.sessionType}`;
    const body = emailBody || "Hello, following up regarding our session.";

    if (!recipient || !subject || !body) {
      alert("Missing required email fields");
      return;
    }

    try {
      await API.post("/send-email", { to: recipient, subject, body });
      alert("Email sent successfully!");
      setEmailBody("");
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      alert("Failed to send email. Please try again later.");
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      return format(new Date(timestamp), "MMM d, h:mm a");
    } catch {
      return "Just now";
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">
          {selected ? selected.clientId?.name : " Chat Sessions "}
        </h1>
        <button
          onClick={() => setShowAppointments(!showAppointments)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </header>

      {/* Navigation Sidebar - Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Chat Sessions
          </div>

          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg transition-colors mb-4"
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
            className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-lg transition-colors mt-auto"
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

      {/* Appointments Sidebar - Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col transform ${
          showAppointments ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <button
            onClick={() => setShowAppointments(false)}
            className="md:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="text-indigo-600 dark:text-indigo-400" />
            My chats
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {appointments.length === 0 ? (
            <div className="text-center p-8 text-gray-500 dark:text-gray-400">
              No client sessions found
            </div>
          ) : (
            appointments.map((appt) => (
              <div
                key={appt._id}
                onClick={() => {
                  navigate(`/chat/counselor/${appt._id}`);
                  setSelected(appt);
                }}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 flex items-center gap-3 ${
                  selected?._id === appt._id
                    ? "bg-indigo-50 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <UserIcon className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{appt.clientId?.name}</p>
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

      {/* Overlay for mobile appointments */}
      {showAppointments && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setShowAppointments(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <MessageSquare className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-lg">Select a client session to begin</p>
          </div>
        ) : (
          <>
            {/* Chat Header - Mobile */}
            <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelected(null)}
                  className="md:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <UserIcon className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{selected.clientId?.name}</h3>
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
              {!selected.isPaid && (
                <span className="text-sm px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  <span className="hidden md:inline">Chat Locked</span>
                  <span className="md:hidden">Locked</span>
                </span>
              )}
            </header>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/50">
              <div className="space-y-3">
                {messages.map((msg, i) => {
                  const isSender = msg.sender === counselorId;
                  return (
                    <div
                      key={msg._id || i}
                      className={`flex ${
                        isSender ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-3 ${
                          isSender
                            ? "bg-indigo-600 text-white rounded-tr-none"
                            : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-tl-none"
                        }`}
                      >
                        <div className="text-sm">{msg.message}</div>
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                            isSender
                              ? "text-indigo-200"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {formatTimestamp(msg.timestamp)}
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
              {selected.isPaid && selected.status === "pending" ? (
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Type your message..."
                    value={text}
                    onChange={(e) => {
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
                  <div
                    className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                      selected.status === "completed"
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                        : selected.status === "cancelled"
                        ? "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400"
                        : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    {selected.status === "completed"
                      ? "Chat disabled — appointment marked as completed"
                      : selected.status === "cancelled"
                      ? "Chat disabled — appointment was cancelled"
                      : "Chat locked until client completes payment"}
                  </div>

                  <textarea
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={3}
                    placeholder={`Write email to ${
                      selected.clientId?.name || "client"
                    }...`}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
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
