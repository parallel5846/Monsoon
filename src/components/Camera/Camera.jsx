import { useEffect, useRef, useState } from 'react';
import './Camera.css';
import CameraModal from './CameraModal';
import ImagePreviewModal from './ImagePreviewModal';
import VideoPreviewModal from './VideoPreviewModal';

export default function Camera({ showCamera, onClose }) {
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
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recorderRef = useRef(null);
  const mediaChunksRef = useRef([]);

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

  const toggleCameraMode = () => {
    setFacingMode((currentFacing) =>
      currentFacing === 'user' ? 'environment' : 'user'
    );
    setMirrored((currentMirror) => !currentMirror);
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

  const handleClose = () => {
    stopCameraStream();
    onClose();
  };

  if (!showCamera) return null;

  return (
    <>
      <CameraModal
        videoRef={videoRef}
        canvasRef={canvasRef}
        mirrored={mirrored}
        facingMode={facingMode}
        cameraError={cameraError}
        cameraMessage={cameraMessage}
        capturedPhoto={capturedPhoto}
        recordedVideoUrl={recordedVideoUrl}
        isRecording={isRecording}
        onClose={handleClose}
        onToggleCameraMode={toggleCameraMode}
        onCaptureImage={captureImage}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onOpenPhotoModal={() => setShowPhotoModal(true)}
        onOpenVideoModal={() => setShowVideoModal(true)}
      />

      {showPhotoModal && capturedPhoto && (
        <ImagePreviewModal photo={capturedPhoto} onClose={() => setShowPhotoModal(false)} />
      )}

      {showVideoModal && recordedVideoUrl && (
        <VideoPreviewModal videoUrl={recordedVideoUrl} onClose={() => setShowVideoModal(false)} />
      )}
    </>
  );
}
