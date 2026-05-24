import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import Icon from '../Icon/Icon';
import {
  FiArrowLeft,
  FiCamera,
  FiMoreVertical,
  FiX,
  FiRotateCcw,
  FiRotateCw,
  FiPlay,
  FiStopCircle,
} from 'react-icons/fi';

export default function Navbar({ user, showBackButton = false, onBack }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [facingMode, setFacingMode] = useState('user');
  const [mirrored, setMirrored] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraMessage, setCameraMessage] = useState('');
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recorderRef = useRef(null);
  const mediaChunksRef = useRef([]);

  const handleMenuClick = (action) => {
    console.log(`Action: ${action}`);
    setShowMenu(false);
    // TODO: Implement actual functionality
  };

  const goToProfile = () => {
    setShowMenu(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setShowMenu(false);
    navigate('/');
  };

  const stopCameraStream = () => {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setIsRecording(false);
  };

  const openCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera not supported in this browser');
      return;
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: true,
      });
      setCameraError('');
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setCameraMessage(
        facingMode === 'environment' ? 'Back camera ready' : 'Front camera ready'
      );
    } catch (error) {
      console.error(error);
      setCameraError('Unable to access camera. Please allow permission and try again.');
    }
  };

  useEffect(() => {
    if (!showCamera) {
      stopCameraStream();
      return;
    }
    openCamera();
    return () => stopCameraStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCamera, facingMode]);

  const toggleFacingMode = () => {
    setFacingMode((current) => (current === 'user' ? 'environment' : 'user'));
  };

  const toggleMirror = () => {
    setMirrored((current) => !current);
  };

  const setBackCamera = () => {
    setFacingMode('environment');
  };

  const setFrontCamera = () => {
    setFacingMode('user');
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (mirrored) {
      ctx.setTransform(-1, 0, 0, 1, canvas.width, 0);
    } else {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    setCapturedPhoto(dataUrl);
    setShowPhotoModal(true);
    setCameraMessage('Photo captured');
  };

  const startRecording = () => {
    if (!stream) return;
    mediaChunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        mediaChunksRef.current.push(event.data);
      }
    };
    recorder.onstop = () => {
      const blob = new Blob(mediaChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
      setShowVideoModal(true);
      setCameraMessage('Video recorded');
    };
    recorder.start();
    recorderRef.current = recorder;
    setIsRecording(true);
    setCameraMessage('Recording...');
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      recorderRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <>
      <header className="navbar-shell">
      <div className="navbar-brand">
        {showBackButton && (
          <button className="navbar-back-button" type="button" onClick={onBack} aria-label="Back to chats">
            <Icon component={FiArrowLeft} size={24} title="Back to chats" />
          </button>
        )}
        <div className="navbar-logo"><img src="/favicon.png" alt="favicon.png" /></div>
        <div>
          <span className="navbar-title">Monsoon</span>
        </div>
      </div>

      <div className="navbar-actions">
        <button className="navbar-icon" aria-label="Open camera" type="button" onClick={() => setShowCamera(true)}>
          <Icon component={FiCamera} size={24} title="Open camera" />
        </button>
        <div className="menu-container">
          <button
            className="navbar-icon"
            aria-label="Open menu"
            type="button"
            onClick={() => setShowMenu(!showMenu)}
          >
            <Icon component={FiMoreVertical} size={24} title="Open menu" />
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <div className="dropdown-profile">
                <div className="dropdown-avatar">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="dropdown-profile-text">
                  <span>{user?.name || 'Unknown User'}</span>
                  <small>@{user?.username || 'unknown'}</small>
                </div>
              </div>

              <button className="dropdown-item" onClick={goToProfile} type="button">
                View Profile
              </button>
              <button className="dropdown-item" onClick={handleLogout} type="button">
                Logout
              </button>
              <div className="dropdown-separator" />
              <button
                className="dropdown-item"
                onClick={() => handleMenuClick('settings')}
                type="button"
              >
                Settings
              </button>
              <button
                className="dropdown-item"
                onClick={() => handleMenuClick('create-group')}
                type="button"
              >
                Create Group
              </button>
              <button
                className="dropdown-item"
                onClick={() => handleMenuClick('new-community')}
                type="button"
              >
                New Community
              </button>
            </div>
          )}
        </div>
      </div>
    </header>

      {showCamera && (
        <div className="camera-modal" role="dialog" aria-modal="true" aria-label="Camera capture">
          <div className="camera-card">
            <div className="camera-toolbar">
              <button
                className="camera-close"
                type="button"
                onClick={() => setShowCamera(false)}
                aria-label="Close camera"
              >
                <Icon component={FiX} size={20} title="Close camera" />
              </button>
              <div className="camera-switches">
                <button
                  type="button"
                  className="camera-toggle"
                  onClick={setBackCamera}
                  aria-label="Use back camera"
                >
                  <Icon component={FiRotateCw} size={18} title="Use back camera" />
                </button>
                <button
                  type="button"
                  className="camera-toggle"
                  onClick={toggleFacingMode}
                  aria-label={`Switch to ${facingMode === 'user' ? 'back' : 'front'} camera`}
                >
                  <Icon component={FiRotateCcw} size={18} title="Switch camera" />
                </button>
                <button
                  type="button"
                  className="camera-toggle"
                  onClick={toggleMirror}
                  aria-label={mirrored ? 'Disable mirror' : 'Enable mirror'}
                >
                  <Icon component={FiRotateCcw} size={18} title="Toggle mirror" />
                </button>
              </div>
            </div>
            <div className="camera-view">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={mirrored ? 'camera-video mirror' : 'camera-video'}
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div className="camera-actions">
                <button
                  type="button"
                  className="camera-button"
                  onClick={captureImage}
                  aria-label="Capture photo"
                >
                  <Icon component={FiCamera} size={24} title="Capture photo" />
                </button>
                {!isRecording ? (
                  <button
                    type="button"
                    className="camera-button camera-record"
                    onClick={startRecording}
                    aria-label="Start recording"
                  >
                    <Icon component={FiPlay} size={24} title="Start recording" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="camera-button camera-stop"
                    onClick={stopRecording}
                    aria-label="Stop recording"
                  >
                    <Icon component={FiStopCircle} size={24} title="Stop recording" />
                  </button>
                )}
              </div>
              {cameraMessage && <div className="camera-status">{cameraMessage}</div>}
              {cameraError && <div className="camera-error">{cameraError}</div>}
              <div className="camera-preview-row">
                {capturedPhoto && (
                  <button
                    type="button"
                    className="camera-preview"
                    onClick={() => setShowPhotoModal(true)}
                    aria-label="Open captured photo"
                  >
                    <span>Photo</span>
                    <img src={capturedPhoto} alt="Captured" />
                  </button>
                )}
                {recordedVideoUrl && (
                  <button
                    type="button"
                    className="camera-preview"
                    onClick={() => setShowVideoModal(true)}
                    aria-label="Open recorded video"
                  >
                    <span>Video</span>
                    <video controls src={recordedVideoUrl} className="camera-video-preview" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPhotoModal && capturedPhoto && (
        <div className="preview-modal" role="dialog" aria-modal="true" aria-label="Captured photo preview">
          <div className="preview-card">
            <button
              type="button"
              className="preview-close"
              onClick={() => setShowPhotoModal(false)}
              aria-label="Close photo preview"
            >
              <Icon component={FiX} size={18} title="Close photo preview" />
            </button>
            <img src={capturedPhoto} alt="Captured preview" className="preview-image" />
          </div>
        </div>
      )}

      {showVideoModal && recordedVideoUrl && (
        <div className="preview-modal" role="dialog" aria-modal="true" aria-label="Recorded video preview">
          <div className="preview-card preview-video-card">
            <button
              type="button"
              className="preview-close"
              onClick={() => setShowVideoModal(false)}
              aria-label="Close video preview"
            >
              <Icon component={FiX} size={18} title="Close video preview" />
            </button>
            <video controls src={recordedVideoUrl} className="preview-video" />
          </div>
        </div>
      )}
    </>
  );
}
