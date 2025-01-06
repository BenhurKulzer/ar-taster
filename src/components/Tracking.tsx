'use client'

import React, { useRef, useEffect, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl'
import * as posenet from '@tensorflow-models/posenet'

interface TrackingComponentProps {
  camera: boolean;
  pointer: string;
}

export default function TrackingComponent({ camera, pointer }: TrackingComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isNoseDetected, setIsNoseDetected] = useState(true);
  const [parentDimensions, setParentDimensions] = useState({ width: 0, height: 0 });

  const startCamera = async (net: posenet.PoseNet) => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.width = parentDimensions.width;
      video.height = parentDimensions.height;

      const detectPose = async () => {
        if (video.readyState === 4) {
          const pose = await net.estimateSinglePose(video);
          drawPose(pose);
        }
        if (camera) requestAnimationFrame(detectPose);
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
          detectPose();
        }
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  }

  const drawPose = (pose: posenet.Pose) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && videoRef.current) {
      ctx.clearRect(0, 0, videoRef.current.width, videoRef.current.height);
      drawKeypoints(ctx, pose);
      drawSkeleton(ctx, pose);
    }
  }

  const drawKeypoints = (ctx: CanvasRenderingContext2D, pose: posenet.Pose) => {
    pose.keypoints.forEach((keypoint) => {
      if (keypoint.score > 0.2) {
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 3, 0, 2 * Math.PI);

        ctx.fillStyle =  keypoint.part === pointer ? 'green' : 'red';
        ctx.fill();
      }
    });

    if (pointer) {
      const isOnCam = pose.keypoints.find(point => point.part === pointer);

      if (isOnCam) setIsNoseDetected(isOnCam.score > 0.2);
    }
  }

  const drawSkeleton = (ctx: CanvasRenderingContext2D, pose: posenet.Pose) => {
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(pose.keypoints, 0.2);
    adjacentKeyPoints.forEach((keypoints) => {
      ctx.beginPath();
      ctx.moveTo(keypoints[0].position.x, keypoints[0].position.y);
      ctx.lineTo(keypoints[1].position.x, keypoints[1].position.y);

      ctx.lineWidth = 3;
      ctx.strokeStyle = 'blue';
      ctx.stroke();
    });
  }

  useEffect(() => {
    const runPosenet = async () => {
      try {
        await tf.ready();
        await tf.setBackend('webgl');
        const net = await posenet.load({ inputResolution: { width: parentDimensions.width, height: parentDimensions.height }, scale: 0.5 });
        setIsModelLoaded(true);
        if (camera) await startCamera(net);
      } catch (error) {
        console.error('Error initializing TensorFlow.js:', error);
      }
    }

    if (camera) {
      runPosenet();
    }

    return () => stopCamera();
  }, [camera, parentDimensions]);

  useEffect(() => {
    const updateDimensions = () => {
      if (parentRef.current) {
        setParentDimensions({ width: parentRef.current.clientWidth, height: parentRef.current.clientHeight });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div ref={parentRef} className="w-full h-full relative bg-muted">
      {camera && (
        <>
          <video
            ref={videoRef}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
            className="rounded-lg shadow-lg absolute top-0 left-0"
          />

          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
            width={parentDimensions.width}
            height={parentDimensions.height}
          />

          {!isNoseDetected && (
            <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-2 text-center">
              Nariz não detectado. Por favor, afaste-se, gire a câmera ou aponte para o seu nariz.
            </div>
          )}
        </>
      )}

      {!camera && (
        <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-50 text-white">
          Câmera desativada
        </div>
      )}

      {!isModelLoaded && camera && (
        <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-50 text-white">
          Carregando modelo PoseNet...
        </div>
      )}
    </div>
  )
}
