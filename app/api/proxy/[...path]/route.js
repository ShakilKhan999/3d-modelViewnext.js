export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const url = new URL(request.url);
  const targetUrl = `https://assets.meshy.ai${url.pathname.replace('/api/proxy', '')}${url.search}`;
  console.log('Proxy request received:', targetUrl);
  
  try {
    console.log('Fetching from:', targetUrl);
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': request.headers.get('user-agent') || '',
        'Accept': request.headers.get('accept') || '',
      },
    });
    
    console.log('Proxy response status:', response.status);
    console.log('Proxy response headers:', JSON.stringify(Object.fromEntries(response.headers)));
    
    const body = await response.arrayBuffer();
    console.log('Proxy response body length:', body.byteLength);
    
    return new NextResponse(body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}