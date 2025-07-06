import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api";
import AgoraRTC from "agora-rtc-sdk-ng";
import {
  VideoCameraIcon,
  VideoCameraSlashIcon,
  MicrophoneIcon,
  NoSymbolIcon,
  PhoneIcon,
  UserIcon,
  ClockIcon,
  CalendarIcon,
  Cog6ToothIcon,
  SignalIcon,
  SignalSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

export default function VideoCall() {
  const { appointmentId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState("good");
  const [networkStats, setNetworkStats] = useState(null);
  const [callStatus, setCallStatus] = useState("connecting");
  const [showHeaderInfo, setShowHeaderInfo] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const rtcClientRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const localVideoTrackRef = useRef(null);
  const timerRef = useRef(null);
  const remoteUserRef = useRef(null);
  const statsIntervalRef = useRef(null);

  const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
  const [token, setToken] = useState(null);

  // Participant states
  const [remoteUserState, setRemoteUserState] = useState({
    joined: false,
    videoPublished: false,
    audioPublished: false,
    videoMuted: false,
    audioMuted: false,
    uid: null,
    left: false,
  });

  // Format call duration
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Fetch appointment
  useEffect(() => {
    let isMounted = true;

    if (!appointmentId) return;

    API.get(`/appointments/${appointmentId}`)
      .then((res) => {
        if (isMounted) {
          setAppointment(res.data);
          setCallStatus("waiting");
          timerRef.current = setInterval(() => {
            setCallDuration((prev) => prev + 1);
          }, 1000);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch appointment:", err);
        navigate("/dashboard");
      });

    return () => {
      isMounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [appointmentId, navigate]);

  useEffect(() => {
    // Trigger browser permission prompt (safe fallback)
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop());
      })
      .catch((err) => {
        console.warn("Mic/Cam permission denied or missing:", err.message);
      });
  }, []);

  // Join Agora when appointment is ready
  useEffect(() => {
    if (!appointment || !user) return;

    let isMounted = true;
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    rtcClientRef.current = client;

    const isCounselor =
      user._id.toString() === appointment.counselorId._id.toString();

    // Simulate connection quality
    const qualityInterval = setInterval(() => {
      const qualities = ["good", "average", "poor"];
      setConnectionQuality(
        qualities[Math.floor(Math.random() * qualities.length)]
      );
    }, 10000);

    // Network stats monitoring
    const monitorNetworkStats = async () => {
      if (!client) return;
      try {
        const stats = await client.getRTCStats();
        setNetworkStats({
          uplink: stats.TxBitrate
            ? `${Math.round(stats.TxBitrate / 1024)} Mbps`
            : "N/A",
          downlink: stats.RxBitrate
            ? `${Math.round(stats.RxBitrate / 1024)} Mbps`
            : "N/A",
          packetLoss: stats.RxPacketLossRate
            ? `${Math.round(stats.RxPacketLossRate * 100)}%`
            : "0%",
        });
      } catch (err) {
        console.error("Failed to get network stats:", err);
      }
    };

    const joinChannel = async () => {
      try {
        const uid = String(user._id);
        const { data } = await API.get(
          `/agora/generate-token?channel=${appointmentId}&uid=${uid}`
        );
        const generatedToken = data.token;
        setToken(generatedToken);

        await client.join(APP_ID, appointmentId, generatedToken, uid);
        setCallStatus("connected");

        // Start monitoring network stats
        statsIntervalRef.current = setInterval(monitorNetworkStats, 5000);

        client.on("user-joined", (remoteUser) => {
          remoteUserRef.current = remoteUser;
          setRemoteUserState((prev) => ({
            ...prev,
            joined: true,
            uid: remoteUser.uid,
            left: false,
          }));
        });

        client.on("user-published", async (remoteUser, mediaType) => {
          await client.subscribe(remoteUser, mediaType);

          if (mediaType === "video") {
            remoteUser.videoTrack.play(remoteVideoRef.current);
            setRemoteUserState((prev) => ({
              ...prev,
              videoPublished: true,
              videoMuted: false,
            }));
          }

          if (mediaType === "audio") {
            remoteUser.audioTrack.play();
            setRemoteUserState((prev) => ({
              ...prev,
              audioPublished: true,
              audioMuted: false,
            }));
          }
        });

        client.on("user-unpublished", (remoteUser, mediaType) => {
          if (mediaType === "video") {
            setRemoteUserState((prev) => ({
              ...prev,
              videoPublished: false,
              videoMuted: true,
            }));
          }
          if (mediaType === "audio") {
            setRemoteUserState((prev) => ({
              ...prev,
              audioPublished: false,
              audioMuted: true,
            }));
          }
        });

        client.on("user-left", (remoteUser) => {
          setRemoteUserState((prev) => ({
            ...prev,
            joined: false,
            left: true,
            uid: remoteUser.uid,
          }));
        });

        // Only the counselor publishes media
        if (isCounselor) {
          const devices = await AgoraRTC.getDevices();
          const hasMic = devices.some((d) => d.kind === "audioinput");
          const hasCam = devices.some((d) => d.kind === "videoinput");

          if (!hasMic || !hasCam) {
            console.warn("⚠ No mic/cam detected");
            return;
          }

          const [micTrack, camTrack] =
            await AgoraRTC.createMicrophoneAndCameraTracks();
          localAudioTrackRef.current = micTrack;
          localVideoTrackRef.current = camTrack;

          await client.publish([micTrack, camTrack]);
          camTrack.play(localVideoRef.current);
        }
      } catch (err) {
        console.error("❌ Agora join error:", err);
        setCallStatus("failed");
      }
    };

    joinChannel();

    return () => {
      isMounted = false;
      clearInterval(qualityInterval);
      if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
      const leaveCall = async () => {
        if (localAudioTrackRef.current) localAudioTrackRef.current.close();
        if (localVideoTrackRef.current) localVideoTrackRef.current.close();
        await client.leave();
      };
      leaveCall();
    };
  }, [appointment]);

  // Toggle mic
  const toggleMic = () => {
    if (localAudioTrackRef.current) {
      const newState = !micEnabled;
      localAudioTrackRef.current.setEnabled(newState);
      setMicEnabled(newState);
    }
  };

  // Toggle cam
  const toggleCam = () => {
    if (localVideoTrackRef.current) {
      const newState = !camEnabled;
      localVideoTrackRef.current.setEnabled(newState);
      setCamEnabled(newState);
    }
  };

  // Leave call
  const leaveCall = async () => {
    try {
      if (rtcClientRef.current) {
        await rtcClientRef.current.leave();
      }
      // Update appointment status to completed
      await API.patch(`/appointments/${appointmentId}/complete`);
    } catch (err) {
      console.error("Error completing appointment:", err);
    } finally {
      navigate("/dashboard");
    }
  };

  if (!appointment) {
    return (
      <div className="flex justify-center items-center h-screen text-white bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Preparing your call session...</p>
          <p className="text-sm text-gray-400 mt-2">
            This should only take a moment
          </p>
        </div>
      </div>
    );
  }

  const otherParticipant =
    appointment.clientId._id === user._id
      ? appointment.counselorId
      : appointment.clientId;

  const renderRemoteUserStatus = () => {
    if (remoteUserState.left) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-6">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
              <UserIcon className="h-16 w-16 text-gray-400" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-red-600 rounded-full p-2">
              <XCircleIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-medium text-gray-200">
            {otherParticipant.name} has left the call
          </h3>
          <p className="text-gray-400 mt-2 max-w-md">
            The other participant has ended the call. You can safely leave now.
          </p>
        </div>
      );
    }

    if (!remoteUserState.joined) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-6">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
              <UserIcon className="h-16 w-16 text-gray-400" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2 animate-pulse">
              <ClockIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-medium text-gray-200">
            Waiting for {otherParticipant.name}
          </h3>
          <p className="text-gray-400 mt-2 max-w-md">
            {otherParticipant.name} hasn't joined yet. The call will start
            automatically when they arrive.
          </p>
        </div>
      );
    }

    if (remoteUserState.joined && !remoteUserState.videoPublished) {
      return (
        <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="inline-block bg-gray-800 p-4 rounded-full mb-3">
              <VideoCameraSlashIcon className="h-10 w-10 text-gray-500" />
            </div>
            <p className="text-gray-300">
              {otherParticipant.name}'s camera is off
            </p>
            {remoteUserState.audioPublished && (
              <p className="text-sm text-gray-400 mt-1">Audio is available</p>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="p-4 bg-gray-800/80 backdrop-blur-sm text-white flex flex-col border-b border-gray-700/50 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`p-2 rounded-lg shadow-lg ${
                callStatus === "connected"
                  ? "bg-green-600"
                  : callStatus === "failed"
                  ? "bg-red-600"
                  : "bg-blue-600"
              }`}
            >
              {callStatus === "connected" ? (
                <CheckCircleIcon className="h-6 w-6" />
              ) : callStatus === "failed" ? (
                <XCircleIcon className="h-6 w-6" />
              ) : (
                <VideoCameraIcon className="h-6 w-6" />
              )}
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold flex items-center">
                Call with {otherParticipant.name}
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-700 hidden sm:inline">
                  {connectionQuality === "good"
                    ? "✓ Good"
                    : connectionQuality === "average"
                    ? "⚠ Average"
                    : "✗ Poor"}
                </span>
              </h2>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {networkStats && (
              <div className="hidden md:flex items-center space-x-2 text-xs bg-gray-700/80 px-3 py-1.5 rounded-full">
                <SignalIcon className="h-3 w-3 text-green-400" />
                <span>↑ {networkStats.uplink}</span>
                <span>↓ {networkStats.downlink}</span>
                <span>Loss: {networkStats.packetLoss}</span>
              </div>
            )}
            <button
              onClick={() => setShowHeaderInfo(!showHeaderInfo)}
              className="md:hidden p-2 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Toggle info"
            >
              {showHeaderInfo ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Settings"
            >
              <Cog6ToothIcon className="h-5 w-5" />
            </button>
            <button
              onClick={leaveCall}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-white font-medium transition-all shadow-lg hover:shadow-red-600/20"
            >
              <PhoneIcon className="h-5 w-5 rotate-[135deg]" />
              <span className="hidden md:inline">End Call</span>
            </button>
          </div>
        </div>

        {/* Collapsible header info for mobile */}
        {(showHeaderInfo || window.innerWidth >= 768) && (
          <div className="flex items-center space-x-4 text-sm text-gray-300 mt-2">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              <span>{appointment.sessionType}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>{new Date(appointment.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>{formatTime(callDuration)}</span>
            </div>
          </div>
        )}
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute right-4 top-16 md:top-20 bg-gray-800 rounded-lg shadow-xl p-4 z-20 w-64 border border-gray-700">
          <h3 className="font-medium mb-3 flex items-center">
            <Cog6ToothIcon className="h-5 w-5 mr-2" />
            Call Settings
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Microphone
              </label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm">
                <option>Default Microphone</option>
                <option>Microphone 2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Camera</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm">
                <option>Default Camera</option>
                <option>Camera 2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Speaker
              </label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm">
                <option>Default Speaker</option>
                <option>Headphones</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Video Grid */}
      <div className="flex-1 relative">
        {/* Remote video (primary) */}
        <div
          ref={remoteVideoRef}
          className={`absolute inset-0 bg-gray-800 transition-opacity duration-300 ${
            remoteUserState.joined && remoteUserState.videoPublished
              ? "opacity-100"
              : "opacity-90"
          }`}
        >
          {renderRemoteUserStatus()}

          {/* Status overlay */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <span className="text-sm bg-gray-900/80 px-3 py-1.5 rounded-full text-white flex items-center shadow">
              <UserIcon className="h-3 w-3 mr-1" />
              <span>{otherParticipant.name}</span>
            </span>
            {remoteUserState.audioMuted && (
              <span className="text-sm bg-gray-900/80 px-3 py-1.5 rounded-full text-white flex items-center shadow">
                <NoSymbolIcon className="h-3 w-3 mr-1" />
                <span>Muted</span>
              </span>
            )}
          </div>
        </div>

        {/* Local video (pip) */}
        <div
          ref={localVideoRef}
          className="absolute bottom-20 md:bottom-4 right-4 w-32 h-48 md:w-64 md:h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600 shadow-xl transition-all hover:border-blue-500"
        >
          {!camEnabled && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <div className="text-center p-4">
                <VideoCameraSlashIcon className="h-6 w-6 text-gray-500 mx-auto mb-1 md:h-8 md:w-8 md:mb-2" />
                <p className="text-gray-400 text-xs md:text-sm">
                  Your camera is off
                </p>
              </div>
            </div>
          )}
          <span className="absolute top-2 left-2 text-xs bg-gray-900/80 px-2 py-1 rounded-full text-white flex items-center">
            <UserIcon className="h-2.5 w-2.5 mr-1" />
            <span>You</span>
            {!micEnabled && <NoSymbolIcon className="h-2.5 w-2.5 ml-1" />}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="p-2 md:p-4 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700/50 flex justify-center space-x-2 md:space-x-6">
        <button
          onClick={toggleMic}
          className={`flex flex-col items-center justify-center px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl text-white font-medium transition-all ${
            micEnabled
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-red-500/90 hover:bg-red-600/90"
          } shadow-lg hover:shadow-${micEnabled ? "gray" : "red"}-600/20`}
        >
          {micEnabled ? (
            <MicrophoneIcon className="h-5 w-5 md:h-6 md:w-6 mb-1" />
          ) : (
            <NoSymbolIcon className="h-5 w-5 md:h-6 md:w-6 mb-1" />
          )}
          <span className="text-xs">{micEnabled ? "Mute" : "Unmute"}</span>
        </button>

        <button
          onClick={toggleCam}
          className={`flex flex-col items-center justify-center px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl text-white font-medium transition-all ${
            camEnabled
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-red-500/90 hover:bg-red-600/90"
          } shadow-lg hover:shadow-${camEnabled ? "gray" : "red"}-600/20`}
        >
          {camEnabled ? (
            <VideoCameraIcon className="h-5 w-5 md:h-6 md:w-6 mb-1" />
          ) : (
            <VideoCameraSlashIcon className="h-5 w-5 md:h-6 md:w-6 mb-1" />
          )}
          <span className="text-xs">
            {camEnabled ? "Stop Video" : "Start Video"}
          </span>
        </button>

        <button
          onClick={leaveCall}
          className="flex flex-col items-center justify-center px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all shadow-lg hover:shadow-red-600/20"
        >
          <PhoneIcon className="h-5 w-5 md:h-6 md:w-6 mb-1 rotate-[135deg]" />
          <span className="text-xs">End Call</span>
        </button>
      </div>
    </div>
  );
}
