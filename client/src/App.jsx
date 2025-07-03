import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import ChatInterface from "./pages/ChatInterface";
import CounselorChatInterface from "./pages/CounselorChatInterface";
import CounselorDashboard from "./pages/CounselorDashboard";
import CounselorAppointments from "./pages/CounselorAppointments";
import CounselorProfile from "./pages/CounselorProfile";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CallInterface from "./pages/CallInterface";
import CounselorCallInterface from "./pages/CounselorCallInterface";
import VideoCall from "./pages/VideoCall";
import PayForSession from "./pages/PayForSession";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import PrivateRoute from "./pages/PrivateRoute";
import SessionHistory from "./pages/SessionHistory";
import CounselorNoteEditor from "./pages/CounselorNoteEditor";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const loggedInUserId = user?._id;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user?.role === "counselor" ? (
              <Navigate to="/dashboard/counselor" />
            ) : user?.role === "client" ? (
              <Navigate to="/dashboard/client" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Client */}
        <Route
          path="/dashboard/client"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <PrivateRoute>
              <MyAppointments userId={loggedInUserId} />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/call"
          element={
            <PrivateRoute>
              <CallInterface />
            </PrivateRoute>
          }
        />

        {/* Counselor */}
        <Route
          path="/dashboard/counselor"
          element={
            <PrivateRoute>
              <CounselorDashboard userId={loggedInUserId} />
            </PrivateRoute>
          }
        />
        <Route
          path="/appointments/counselor"
          element={
            <PrivateRoute>
              <CounselorAppointments userId={loggedInUserId} />
            </PrivateRoute>
          }
        />
        <Route
          path="/book"
          element={
            <PrivateRoute>
              <BookAppointment />
            </PrivateRoute>
          }
        />
        <Route
          path="/notes/:appointmentId"
          element={
            <PrivateRoute>
              <CounselorNoteEditor />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/counselor"
          element={
            <PrivateRoute>
              <CounselorProfile userId={loggedInUserId} />
            </PrivateRoute>
          }
        />
        <Route
          path="/call/counselor"
          element={
            <PrivateRoute>
              <CounselorCallInterface counselorId={loggedInUserId} />
            </PrivateRoute>
          }
        />

        {/* Chat (Base first, then dynamic to avoid redirect) */}
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatInterface senderId={loggedInUserId} />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/counselor"
          element={
            <PrivateRoute>
              <CounselorChatInterface counselorId={loggedInUserId} />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/counselor/:appointmentId"
          element={
            <PrivateRoute>
              <CounselorChatInterface counselorId={loggedInUserId} />
            </PrivateRoute>
          }
        />

        {/* Video Call */}
        <Route
          path="/video-call/:appointmentId"
          element={
            <PrivateRoute>
              <VideoCall />
            </PrivateRoute>
          }
        />

        {/* Payment */}
        <Route
          path="/pay/:appointmentId"
          element={
            <PrivateRoute>
              <PayForSession />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment-success"
          element={
            <PrivateRoute>
              <PaymentSuccess />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment-cancel"
          element={
            <PrivateRoute>
              <PaymentCancel />
            </PrivateRoute>
          }
        />

        {/* Session History */}
        <Route
          path="/session-history"
          element={
            <PrivateRoute>
              <SessionHistory />
            </PrivateRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
