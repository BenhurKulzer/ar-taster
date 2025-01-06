'use client'

import React, { useEffect, useState } from 'react'
import * as tf from '@tensorflow/tfjs';

export const TensorFlowProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const initializeTensorFlow = async () => {
      await tf.ready()
      setIsReady(true)
    }

    initializeTensorFlow()
  }, [])

  if (!isReady) {
    return <div>Inicializando TensorFlow.js...</div>
  }

  return <>{children}</>
}
