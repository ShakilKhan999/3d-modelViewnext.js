'use client'

import React, { useRef, Suspense, useState, Component } from 'react'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from '@react-three/drei'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error caught by ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

const Model = ({ url, scale = 3, onError }) => {
  const [error, setError] = useState(null);
  const gltf = useLoader(GLTFLoader, url, undefined, (error) => {
    console.error('Error loading model:', error);
    setError(error);
    // onError(error);
  });
  const modelRef = useRef();

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.01;
    }
  });

  if (error) {
    return <mesh><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="red" /></mesh>;
  }

  return <primitive object={gltf.scene} ref={modelRef} scale={[scale, scale, scale]} />;
};

const ModelViewer = ({ modelUrl, scale = 3 }) => {
  const proxyUrl = `/api/proxy${new URL(modelUrl).pathname}${new URL(modelUrl).search}`

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ErrorBoundary fallback={<div>Error loading 3D model</div>}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <Suspense fallback={<mesh><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="blue" /></mesh>}>
            <Model url={proxyUrl} scale={scale} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </ErrorBoundary>
    </div>
  )
}

export default ModelViewer