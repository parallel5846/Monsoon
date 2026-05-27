import Icon from '../Icon/Icon';
import { FiX } from 'react-icons/fi';

export default function VideoPreviewModal({ videoUrl, onClose }) {
  return (
    <div className="preview-modal" role="dialog" aria-modal="true" aria-label="Recorded video preview">
      <div className="preview-card preview-video-card">
        <button
          type="button"
          className="preview-close"
          onClick={onClose}
          aria-label="Close video preview"
        >
          <Icon component={FiX} size={18} title="Close video preview" />
        </button>
        <video controls src={videoUrl} className="preview-video" />
      </div>
    </div>
  );
}
