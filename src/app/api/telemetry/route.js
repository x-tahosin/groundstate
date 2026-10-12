import { NextResponse } from 'next/server';
import { getTelemetrySummary } from '../../../lib/telemetryStore.js';

export async function GET() {
  const summary = getTelemetrySummary();
  return NextResponse.json({
    success: true,
    telemetry: summary,
  });
}
