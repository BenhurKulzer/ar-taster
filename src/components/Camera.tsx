'use client'

import React, { useRef, useEffect, useState } from 'react'

export default function CameraComponent() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isStreamStarted, setIsStreamStarted] = useState(false)

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreamStarted(true)
      }
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error)
    }
  }

  const stopStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      setIsStreamStarted(false)
    }
  }

  useEffect(() => {
    return () => {
      stopStream()
    }
  }, [])

  return (
    <div className="flex flex-col items-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="mb-4 rounded-lg shadow-lg"
        style={{ display: isStreamStarted ? 'block' : 'none' }}
      />
      
      {!isStreamStarted ? (
        <button
          onClick={startStream}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Iniciar Câmera
        </button>
      ) : (
        <button
          onClick={stopStream}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Parar Câmera
        </button>
      )}
    </div>
  )
}