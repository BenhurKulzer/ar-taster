'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as posenet from '@tensorflow-models/posenet';

import usePosenet from '@hooks/usePosenet';
import useCamera from '@hooks/useCamera';

interface TrackingComponentProps {
  camera: boolean;
  pointer: string;
}

export default function TrackingComponent({ camera, pointer }: TrackingComponentProps) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const [isNoseDetected, setIsNoseDetected] = useState(true);
  const [parentDimensions, setParentDimensions] = useState({ width: 0, height: 0 });

  const { net, isModelLoaded } = usePosenet(camera, parentDimensions);

  const drawPose = useCallback((pose: posenet.Pose) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      drawKeypoints(ctx, pose);
      drawSkeleton(ctx, pose);
    }
  }, [pointer]);

  const videoRef = useCamera(camera, net, parentDimensions, drawPose);

  const drawKeypoints = (ctx: CanvasRenderingContext2D, pose: posenet.Pose) => {
    pose.keypoints.forEach((keypoint) => {
      if (keypoint.score > 0.2) {
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = keypoint.part === pointer ? 'green' : 'red';
        ctx.fill();
      }
    });

    if (pointer) {
      const isOnCam = pose.keypoints.find(point => point.part === pointer);
      if (isOnCam) setIsNoseDetected(isOnCam.score > 0.2);
    }
  };

  const drawSkeleton = (ctx: CanvasRenderingContext2D, pose: posenet.Pose) => {
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(pose.keypoints, 0.2);
    adjacentKeyPoints.forEach((keypoints) => {
      ctx.beginPath();
      ctx.moveTo(keypoints[0].position.x, keypoints[0].position.y);
      ctx.lineTo(keypoints[1].position.x, keypoints[1].position.y);
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'white';
      ctx.stroke();
    });
  };

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
  );
};
