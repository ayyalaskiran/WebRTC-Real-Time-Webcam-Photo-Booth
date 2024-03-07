'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FaCamera, FaDownload} from 'react-icons/fa';

const PhotoBooth: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isCaptured, setIsCaptured] = useState(false);
    const [webcamAccessGranted, setWebcamAccessGranted] = useState(true);

    const { handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        const getUserMedia = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (error) {
                setWebcamAccessGranted(false);
                console.error('Error accessing webcam:', error);
            }
        };

        getUserMedia();
    }, []);

    const handleCapture = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current ?? document.createElement('canvas');

        if (!video) {
            console.error('Failed to capture photo. Please try again later.');
            return;
        }

        const context = canvas.getContext('2d');

        if (!context) {
            console.error('Failed to get 2D context from canvas.');
            return;
        }

        canvas.width = video.videoWidth || 0;
        canvas.height = video.videoHeight || 0;

        context.drawImage(video, 0, 0);

        const imageData = canvas.toDataURL('image/jpeg', 1.0);
        setCapturedImage(imageData);
        setIsCaptured(true);
    };

    const handleDownload = () => {
        if (capturedImage) {
            const link = document.createElement('a');
            link.href = capturedImage;
            link.download = 'photo.jpg';
            link.click();
        }
    };

    return (
        <div className={`photo-booth-container ${isCaptured ? 'two-column' : 'one-column'}`}>
            {!webcamAccessGranted && (
                <p className='access-denied'>Webcam access was denied. Please grant access to use the photo booth.</p>
            )}
            {webcamAccessGranted && (
                <>
                    <div className="video-container">
                        <video ref={videoRef} autoPlay muted playsInline></video>
                        {/* {!isCaptured && ( */}
                            <button className="capture-button" onClick={handleCapture}>
                                <FaCamera /> Capture Photo
                            </button>
                        {/* )} */}
                    </div>
                    {isCaptured && capturedImage &&(
                        <div className="captured-photo-container">
                            <img className="captured-photo" src={capturedImage} alt="Captured Photo" />
                            <button className="download-button" onClick={handleDownload}>
                                <FaDownload /> Download
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PhotoBooth;
