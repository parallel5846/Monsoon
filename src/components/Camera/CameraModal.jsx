import Icon from '../Icon/Icon';
import { FiX, FiCamera, FiImage } from 'react-icons/fi';
import { FaCameraRotate, FaStop, FaVideo } from 'react-icons/fa6';

export default function CameraModal({
  videoRef,
  canvasRef,
  mirrored,
  facingMode,
  cameraError,
  cameraMessage,
  capturedPhoto,
  recordedVideoUrl,
  isRecording,
  onClose,
  onToggleCameraMode,
  onCaptureImage,
  onStartRecording,
  onStopRecording,
  onOpenPhotoModal,
  onOpenVideoModal,
}) {
  return (
    <div className="camera-modal" role="dialog" aria-modal="true" aria-label="Camera capture">
      <div className="camera-card">
        <div className="camera-toolbar">
          <button
            className="camera-close"
            type="button"
            onClick={onClose}
            aria-label="Close camera"
          >
            <Icon component={FiX} size={20} title="Close camera" />
          </button>
          <div className="camera-switches">
            <button
              type="button"
              className="camera-toggle"
              onClick={onToggleCameraMode}
              aria-label="Toggle camera mode"
            >
              <Icon component={FaCameraRotate} size={18} title="Toggle camera mode" />
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
              className="camera-button camera-album"
              onClick={onOpenPhotoModal}
              aria-label="Open album"
            >
              <Icon component={FiImage} size={20} title="Album" />
            </button>
            <button
              type="button"
              className="camera-button"
              onClick={onCaptureImage}
              aria-label="Capture photo"
            >
              <Icon component={FiCamera} size={24} title="Capture photo" />
            </button>
            {!isRecording ? (
              <button
                type="button"
                className="camera-button camera-record"
                onClick={onStartRecording}
                aria-label="Start recording"
              >
                <Icon component={FaVideo} size={24} title="Start video recording" />
              </button>
            ) : (
              <button
                type="button"
                className="camera-button camera-stop"
                onClick={onStopRecording}
                aria-label="Stop recording"
              >
                <Icon component={FaStop} size={24} title="Stop recording" />
              </button>
            )}
          </div>
          {cameraMessage && <div className="camera-status">{cameraMessage}</div>}
          {cameraError && <div className="camera-error">{cameraError}</div>}
        </div>
      </div>
    </div>
  );
}
