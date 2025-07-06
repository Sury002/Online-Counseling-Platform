import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { API } from "../api";

const socket = io("http://localhost:5000", { autoConnect: false });

export default function Chat({ senderId }) {
  const { appointmentId } = useParams();
  const [receiverId, setReceiverId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [error, setError] = useState("");
  const [appointmentInfo, setAppointmentInfo] = useState(null);
  const bottomRef = useRef();

  useEffect(() => {
    const initChat = async () => {
      try {
        const res = await API.get(`/appointments/${appointmentId}`);
        const appointment = res.data;
        setAppointmentInfo(appointment);

        const isClient = senderId === appointment.clientId._id;
        const receiver = isClient
          ? appointment.counselorId._id
          : appointment.clientId._id;
        setReceiverId(receiver);

        const room = [senderId, receiver].sort().join("_");
        setRoomId(room);

        socket.connect();
        socket.emit("join", room);

        const chatRes = await API.get(`/chat/appointment/${appointmentId}`);
        setMessages(chatRes.data);

        socket.off("receive-message");
        socket.on("receive-message", (msg) => {
          if (msg.appointmentId === appointmentId) {
            setMessages((prev) => [...prev, msg]);
          }
        });
      } catch (err) {
        setError("❌ Failed to load chat. Please check appointment.");
        console.error(err);
      }
    };

    initChat();

    return () => {
      socket.off("receive-message");
      socket.disconnect();
    };
  }, [appointmentId, senderId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !receiverId || !roomId) return;

    const msg = {
      sender: senderId,
      receiver: receiverId,
      message: text.trim(),
      appointmentId,
    };

    socket.emit("send-message", { roomId, message: msg });

    try {
      await API.post("/chat", msg);
      setText("");
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white px-4 py-10">
      <div className="w-full max-w-2xl h-[600px] flex flex-col bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 overflow-hidden">
        {/* Header */}
        <div className="bg-zinc-700 px-6 py-4 border-b border-zinc-600">
          <h2 className="text-lg font-semibold">
            💬 Chat with{" "}
            {appointmentInfo?.clientId?.name ||
              appointmentInfo?.counselorId?.name}
          </h2>
          <p className="text-sm text-zinc-400">
            Session: {appointmentInfo?.sessionType} | Date:{" "}
            {new Date(appointmentInfo?.date).toLocaleString()}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-zinc-900">
          {messages.length === 0 ? (
            <p className="text-center text-zinc-500 mt-10">No messages yet.</p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[75%] p-3 rounded-lg text-sm ${
                  msg.sender === senderId
                    ? "bg-blue-600 text-white self-end ml-auto"
                    : "bg-zinc-700 text-white self-start"
                }`}
              >
                {msg.message}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={sendMessage}
          className="flex gap-2 px-4 py-3 border-t border-zinc-600 bg-zinc-800"
        >
          <input
            type="text"
            className="flex-1 bg-zinc-700 text-white border border-zinc-600 rounded px-4 py-2 outline-none"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold"
          >
            Send
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-700 text-white p-2 text-center text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
