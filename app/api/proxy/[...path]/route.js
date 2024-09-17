import { createProxyMiddleware } from 'http-proxy-middleware';
import { NextResponse } from 'next/server';

const proxy = createProxyMiddleware({
  target: 'https://assets.meshy.ai',
  changeOrigin: true,
  pathRewrite: {
    '^/api/proxy': '',
  },
});

export async function GET(request) {
  return new Promise((resolve, reject) => {
    proxy(request, {
      end: (proxyRes) => {
        let body = '';
        proxyRes.on('data', (chunk) => (body += chunk));
        proxyRes.on('end', () => {
          resolve(new NextResponse(body, {
            status: proxyRes.statusCode,
            headers: proxyRes.headers,
          }));
        });
        proxyRes.on('error', reject);
      },
    }, reject);
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};