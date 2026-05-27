import Icon from '../Icon/Icon';
import { FiX, FiCamera } from 'react-icons/fi';
import { FaCameraRotate } from 'react-icons/fa6';
import { IoPause } from 'react-icons/io5';
import { FaPlay, FaStop } from 'react-icons/fa6';
import PreviewArea from './PreviewArea';

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
  isPaused,
  onClose,
  onToggleCameraMode,
  onCaptureImage,
  onTogglePause,
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
              className="camera-button"
              onClick={onCaptureImage}
              aria-label="Capture photo"
            >
              <Icon component={FiCamera} size={24} title="Capture photo" />
            </button>
            <button
              type="button"
              className="camera-button camera-pause"
              onClick={onTogglePause}
              aria-label={isPaused ? 'Resume preview' : 'Pause preview'}
            >
              <Icon
                component={isPaused ? FaPlay : IoPause}
                size={24}
                title={isPaused ? 'Resume preview' : 'Pause preview'}
              />
            </button>
            {!isRecording ? (
              <button
                type="button"
                className="camera-button camera-record"
                onClick={onStartRecording}
                aria-label="Start recording"
              >
                <Icon component={FaPlay} size={24} title="Start recording" />
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
          <PreviewArea
            capturedPhoto={capturedPhoto}
            recordedVideoUrl={recordedVideoUrl}
            onOpenPhotoModal={onOpenPhotoModal}
            onOpenVideoModal={onOpenVideoModal}
          />
        </div>
      </div>
    </div>
  );
}
