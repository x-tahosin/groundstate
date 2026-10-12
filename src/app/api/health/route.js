import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'GroundState API & Sensory Reset Engine',
    version: '1.0.0',
    platform: 'DigitalOcean App Platform Ready',
    digitalOceanInference: {
      status: 'active',
      configured: true,
      endpoint: process.env.DIGITALOCEAN_INFERENCE_ENDPOINT || 'https://inference.do-ai.run/v1',
      model: process.env.DIGITALOCEAN_MODEL || 'digitalocean/gemma-4-31B-it',
    },
  });
}
