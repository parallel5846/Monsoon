import Icon from '../Icon/Icon';
import { FaVideo } from 'react-icons/fa6';

export default function PreviewArea({
  capturedPhoto,
  recordedVideoUrl,
  onOpenPhotoModal,
  onOpenVideoModal,
}) {
  if (!capturedPhoto && !recordedVideoUrl) {
    return null;
  }

  return (
    <div className="camera-preview-row">
      {capturedPhoto && (
        <button
          type="button"
          className="camera-preview"
          onClick={onOpenPhotoModal}
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
          onClick={onOpenVideoModal}
          aria-label="Open recorded video"
        >
          <span>Video</span>
          <video controls src={recordedVideoUrl} className="camera-video-preview" />
        </button>
      )}
    </div>
  );
}
