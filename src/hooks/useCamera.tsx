import { useRef, useEffect } from 'react';
import * as posenet from '@tensorflow-models/posenet';

const useCamera = (camera: boolean, net: posenet.PoseNet | null, parentDimensions: { width: number, height: number }, drawPose: (pose: posenet.Pose) => void) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      if (videoRef.current && net) {
        const video = videoRef.current;
        video.width = parentDimensions.width;
        video.height = parentDimensions.height;

        const detectPose = async () => {
          if (video.readyState === 4) {
            const pose = await net.estimateSinglePose(video);
            drawPose(pose);
          }
          if (camera) requestAnimationFrame(detectPose);
        };

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
            detectPose();
          };
        } catch (error) {
          console.error('Error accessing the camera:', error);
        }
      }
    };

    if (camera) {
      startCamera();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [camera, net, parentDimensions, drawPose]);

  return videoRef;
};

export default useCamera;
