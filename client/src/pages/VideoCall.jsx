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
  EllipsisHorizontalIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export default function VideoCall() {
  const { appointmentId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [remoteUserJoined, setRemoteUserJoined] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState("good");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const rtcClientRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const localVideoTrackRef = useRef(null);
  const timerRef = useRef(null);

  const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
 const [token, setToken] = useState(null);

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!appointmentId) return;

    API.get(`/appointments/${appointmentId}`)
      .then((res) => {
        setAppointment(res.data);
        // Start timer when appointment is loaded
        timerRef.current = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch appointment:", err);
        navigate("/dashboard");
      });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [appointmentId, navigate]);

  useEffect(() => {
    if (!appointment || !user) return;

    const isCounselor =
      user._id.toString() === appointment.counselorId._id.toString();

    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    rtcClientRef.current = client;

    // Simulate connection quality changes
    const qualityInterval = setInterval(() => {
      const qualities = ["good", "average", "poor"];
      setConnectionQuality(
        qualities[Math.floor(Math.random() * qualities.length)]
      );
    }, 10000);

    const joinChannel = async () => {
      try {
        const { data } = await API.get(
          `/agora/generate-token?channel=${appointmentId}&uid=${user._id}`
        );
        const generatedToken = data.token;
        setToken(generatedToken);

        await client.join(APP_ID, appointmentId, generatedToken, user._id);

        if (isCounselor) {
          const [audioTrack, videoTrack] =
            await AgoraRTC.createMicrophoneAndCameraTracks();
          localAudioTrackRef.current = audioTrack;
          localVideoTrackRef.current = videoTrack;

          await client.publish([audioTrack, videoTrack]);
          videoTrack.play(localVideoRef.current);
        }

        client.on("user-published", async (remoteUser, mediaType) => {
          await client.subscribe(remoteUser, mediaType);
          if (mediaType === "video") {
            remoteUser.videoTrack.play(remoteVideoRef.current);
            setRemoteUserJoined(true);
          }
        });

        client.on("user-unpublished", () => {
          setRemoteUserJoined(false);
        });
      } catch (err) {
        console.error("❌ Agora join error:", err);
      }
    };

    joinChannel();

    return () => {
      const leaveCall = async () => {
        if (localAudioTrackRef.current) localAudioTrackRef.current.close();
        if (localVideoTrackRef.current) localVideoTrackRef.current.close();
        await client.leave();
      };
      leaveCall();
      clearInterval(qualityInterval);
    };
  }, [appointment, user]);

  const toggleMic = () => {
    if (localAudioTrackRef.current) {
      const newState = !micEnabled;
      localAudioTrackRef.current.setEnabled(newState);
      setMicEnabled(newState);
    }
  };

  const toggleCam = () => {
    if (localVideoTrackRef.current) {
      const newState = !camEnabled;
      localVideoTrackRef.current.setEnabled(newState);
      setCamEnabled(newState);
    }
  };

  const leaveCall = async () => {
    if (rtcClientRef.current) {
      await rtcClientRef.current.leave();
    }
    navigate("/dashboard");
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

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="p-4 bg-gray-800/80 backdrop-blur-sm text-white flex justify-between items-center border-b border-gray-700/50 z-10">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg">
            <VideoCameraIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold flex items-center">
              Video Call with {otherParticipant.name}
              <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-700">
                {connectionQuality === "good"
                  ? "✓ Good connection"
                  : connectionQuality === "average"
                  ? "⚠ Average connection"
                  : "✗ Poor connection"}
              </span>
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
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
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Settings"
          >
            <Cog6ToothIcon className="h-5 w-5" />
          </button>
          <button
            onClick={leaveCall}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium transition-all shadow-lg hover:shadow-red-600/20"
          >
            <PhoneIcon className="h-5 w-5 rotate-[135deg]" />
            <span>End Call</span>
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute right-4 top-16 bg-gray-800 rounded-lg shadow-xl p-4 z-20 w-64 border border-gray-700">
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
            remoteUserJoined ? "opacity-100" : "opacity-90"
          }`}
        >
          {!remoteUserJoined && (
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
              <div className="mt-6 flex space-x-4">
                <div className="flex items-center text-sm text-gray-400">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                  <span>Calling...</span>
                </div>
                <div className="text-sm text-gray-400">
                  <span>Duration: {formatTime(callDuration)}</span>
                </div>
              </div>
            </div>
          )}
          {remoteUserJoined && !camEnabled && (
            <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="inline-block bg-gray-800 p-4 rounded-full mb-3">
                  <VideoCameraSlashIcon className="h-10 w-10 text-gray-500" />
                </div>
                <p className="text-gray-300">
                  {otherParticipant.name}'s camera is off
                </p>
              </div>
            </div>
          )}
          <span className="absolute top-4 left-4 text-sm bg-gray-900/80 px-3 py-1.5 rounded-full text-white flex items-center shadow">
            <UserIcon className="h-3 w-3 mr-1" />
            <span>
              {remoteUserJoined ? otherParticipant.name : "Waiting..."}
            </span>
          </span>
        </div>

        {/* Local video (pip) */}
        <div
          ref={localVideoRef}
          className="absolute bottom-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600 shadow-xl transition-all hover:border-blue-500"
        >
          {!camEnabled && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <div className="text-center p-4">
                <VideoCameraSlashIcon className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Your camera is off</p>
              </div>
            </div>
          )}
          <span className="absolute top-2 left-2 text-xs bg-gray-900/80 px-2 py-1 rounded-full text-white flex items-center">
            <UserIcon className="h-2.5 w-2.5 mr-1" />
            <span>You</span>
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700/50 flex justify-center space-x-6">
        <button
          onClick={toggleMic}
          className={`flex flex-col items-center justify-center px-6 py-3 rounded-xl text-white font-medium transition-all ${
            micEnabled
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-red-500/90 hover:bg-red-600/90"
          } shadow-lg hover:shadow-${micEnabled ? "gray" : "red"}-600/20`}
        >
          {micEnabled ? (
            <MicrophoneIcon className="h-6 w-6 mb-1" />
          ) : (
            <NoSymbolIcon className="h-6 w-6 mb-1" />
          )}
          <span className="text-xs">{micEnabled ? "Mute" : "Unmute"}</span>
        </button>

        <button
          onClick={toggleCam}
          className={`flex flex-col items-center justify-center px-6 py-3 rounded-xl text-white font-medium transition-all ${
            camEnabled
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-red-500/90 hover:bg-red-600/90"
          } shadow-lg hover:shadow-${camEnabled ? "gray" : "red"}-600/20`}
        >
          {camEnabled ? (
            <VideoCameraIcon className="h-6 w-6 mb-1" />
          ) : (
            <VideoCameraSlashIcon className="h-6 w-6 mb-1" />
          )}
          <span className="text-xs">
            {camEnabled ? "Stop Video" : "Start Video"}
          </span>
        </button>

        <button
          onClick={leaveCall}
          className="flex flex-col items-center justify-center px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all shadow-lg hover:shadow-red-600/20"
        >
          <PhoneIcon className="h-6 w-6 mb-1 rotate-[135deg]" />
          <span className="text-xs">End Call</span>
        </button>
      </div>
    </div>
  );
}
