'use client'

import React, { useRef, Suspense, useState } from 'react'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from '@react-three/drei'
import { ErrorBoundary } from 'react-error-boundary'

const Model = ({ url }) => {
  const [error, setError] = useState(null)
  const gltf = useLoader(GLTFLoader, url, undefined, (error) => {
    console.error('Error loading model:', error)
    setError(error)
  })
  const modelRef = useRef()

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.01
    }
  })

  if (error) {
    return <mesh><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="red" /></mesh>
  }

  return <primitive object={gltf.scene} ref={modelRef} />
}

const ModelViewer = ({ modelUrl }) => {
  const proxyUrl = `/api/proxy${new URL(modelUrl).pathname}${new URL(modelUrl).search}`

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ErrorBoundary fallback={<div>Error loading 3D model</div>}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <Suspense fallback={<mesh><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="blue" /></mesh>}>
            <Model url={proxyUrl} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </ErrorBoundary>
    </div>
  )
}

export default ModelViewer