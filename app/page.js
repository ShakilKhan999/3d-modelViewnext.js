import dynamic from 'next/dynamic'

const ModelViewer = dynamic(() => import('./components/ModelViewer'), { ssr: false })

export default function Home() {
  const modelUrl = 'https://assets.meshy.ai/bdddb4f3-2c9a-441f-ad51-4e9f46f9fa37/tasks/0191f47b-76c9-7bae-814f-413ffa5a032c/output/model.glb?Expires=4879958400&Signature=dMXqaugFsSTqMO6MBJaxCpQ5m68FnWO8iU8cfiV6A0~nMnrJzQICEtLJKQ0CDiGhmSZANSvS9s0d9clj9RXsNr2ejON0Ei2-vLBhaY8BoshN8Dnw6jg4mLng23oZZoVIBVGJwdjjF37ZhOB8Avxo8TkPn1f7KqBOTKAbqcHt1bUJxJny9JXIf8pJIu73N0n-sDOXRDomcDYO8cQhlx~eLbykIyu4X5qeB-0ten5J~PfTmzwI9WM9yUe4o4BF76esUN~LkrQlLtsnK61dbA-IKSpU4dZ2Jlcv0R3T44JFeXrlivxTSZ4aU1nDyOqmRgo7bJz~W2SispzAL~pM-GB1Ew__&Key-Pair-Id=KL5I0C8H7HX83'

  return (
    <div>
      <h1>3D Model Viewer</h1>
      <ModelViewer modelUrl={modelUrl} />
    </div>
  )
}