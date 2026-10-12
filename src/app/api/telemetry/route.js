import { NextResponse } from 'next/server';
import { getTelemetrySummary } from '../../../lib/telemetryStore.js';

export const dynamic = 'force-static';

export async function GET() {
  const summary = getTelemetrySummary();
  return NextResponse.json({
    success: true,
    telemetry: summary,
  });
}
