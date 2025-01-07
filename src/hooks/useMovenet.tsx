import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';

const useMovenet = (camera: boolean, parentDimensions: { width: number, height: number }) => {
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        await tf.setBackend('webgl');

        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING, // ou MULTIPOSE_LIGHTNING
          enableTracking: true, // Habilita o rastreamento se necessário
        };

        const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
        setDetector(detector);
        setIsModelLoaded(true);
      } catch (error) {
        console.error('Error initializing TensorFlow.js:', error);
      }
    };

    if (camera) {
      loadModel();
    }

    return () => {
      setDetector(null);
      setIsModelLoaded(false);
    };
  }, [camera, parentDimensions]);

  return { detector, isModelLoaded };
};

export default useMovenet;
