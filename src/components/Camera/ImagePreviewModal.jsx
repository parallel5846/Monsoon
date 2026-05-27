import Icon from '../Icon/Icon';
import { FiX } from 'react-icons/fi';

export default function ImagePreviewModal({ photo, onClose }) {
  return (
    <div className="preview-modal" role="dialog" aria-modal="true" aria-label="Captured photo preview">
      <div className="preview-card">
        <button
          type="button"
          className="preview-close"
          onClick={onClose}
          aria-label="Close photo preview"
        >
          <Icon component={FiX} size={18} title="Close photo preview" />
        </button>
        <img src={photo} alt="Captured preview" className="preview-image" />
      </div>
    </div>
  );
}
