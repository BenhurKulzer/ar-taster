import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as posenet from '@tensorflow-models/posenet';

const usePosenet = (camera: boolean, parentDimensions: { width: number, height: number }) => {
  const [net, setNet] = useState<posenet.PoseNet | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        await tf.setBackend('webgl');
        const net = await posenet.load({ inputResolution: { width: parentDimensions.width, height: parentDimensions.height }, scale: 0.5 });
        setNet(net);
        setIsModelLoaded(true);
      } catch (error) {
        console.error('Error initializing TensorFlow.js:', error);
      }
    };

    if (camera) {
      loadModel();
    }

    return () => {
      setNet(null);
      setIsModelLoaded(false);
    };
  }, [camera, parentDimensions]);

  return { net, isModelLoaded };
};

export default usePosenet;
