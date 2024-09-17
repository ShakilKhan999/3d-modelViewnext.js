'use client';

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

const ModelViewer = dynamic(() => import('../../components/ModelViewer'), { ssr: false })

const API_KEY = 'msy_FhJBg9tEAYWGzU2FGZVwJ66OGO7WLF9mKVGM';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function makeApiCall(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

function getProxiedUrl(originalUrl) {
  const url = new URL(originalUrl);
  return `/api/proxy${url.pathname}${url.search}`;
}

export default function Home() {
  const [modelUrl, setModelUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const postRequestMade = useRef(false)

  useEffect(() => {
    async function generateAndPollModel() {
      if (postRequestMade.current) return; // Skip if POST request was already made
      postRequestMade.current = true;

      try {
        // Step 1: Make a single POST request
        console.log('Sending POST request to Meshy AI API');
        const postResult = await makeApiCall('https://api.meshy.ai/v2/text-to-3d', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "mode": "preview",
            "prompt": "a monster mask",
            "art_style": "realistic",
            "negative_prompt": "low quality, low resolution, low poly, ugly"
          })
        });
        console.log('POST response:', postResult);
        const modelId = postResult.result;
        console.log(`Model ID received: ${modelId}`);

        // Step 2: Poll the GET API until progress is 100% and GLB URL is available
        while (true) {
          await delay(3000); // Wait for 3 seconds before each GET request
          
          console.log('Sending GET request to check progress');
          const getResult = await makeApiCall(`https://api.meshy.ai/v2/text-to-3d/${modelId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${API_KEY}`
            }
          });
          console.log('GET response:', getResult);
          setProgress(getResult.progress);

          if (getResult.progress === 100 && getResult.model_urls.glb) {
            console.log('Model generation complete');
            const originalUrl = getResult.model_urls.glb;
            console.log('Original GLB URL:', originalUrl);
            const proxiedUrl = getProxiedUrl(originalUrl);
            console.log('Proxied GLB URL:', proxiedUrl);
            setModelUrl(proxiedUrl);
            setIsLoading(false);
            break; // Exit the loop when the model is ready
          }
        }
      } catch (err) {
        console.error('Error generating or polling 3D model:', err);
        setError(`Failed to generate or poll 3D model. Error: ${err.message}`);
        setIsLoading(false);
      }
    }

    generateAndPollModel();
  }, []);

  useEffect(() => {
    if (modelUrl) {
      console.log('Attempting to load model from URL:', modelUrl);
      // You could add a test fetch here to verify the URL is accessible
      fetch(modelUrl)
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          console.log('Model URL is accessible');
        })
        .catch(error => {
          console.error('Error accessing model URL:', error);
          setError(`Failed to access model URL: ${error.message}`);
        });
    }
  }, [modelUrl]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>3D Model Viewer</h1>
      {isLoading ? (
        <p>Generating 3D model... Progress: {progress}%</p>
      ) : modelUrl ? (
        <>
          <p>Model URL: {modelUrl}</p>
          <ModelViewer modelUrl={modelUrl} scale={2} />
        </>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <p>Unexpected error: Model URL not available.</p>
      )}
    </div>
  )
}