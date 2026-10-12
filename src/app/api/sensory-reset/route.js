import { NextResponse } from 'next/server';
import { generateSensoryRoutine } from '../../../lib/sensoryRoutineEngine.js';

export const dynamic = 'force-static';

export async function GET() {
  const routine = await generateSensoryRoutine({});
  return NextResponse.json({
    success: true,
    routine,
    telemetry: routine.telemetry,
  });
}

export async function POST(request) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch (_) {}

    const routine = await generateSensoryRoutine(body);

    return NextResponse.json({
      success: true,
      routine,
      telemetry: routine.telemetry,
    });
  } catch (err) {
    console.error('API /api/sensory-reset error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate sensory reset routine: ' + err.message,
      },
      { status: 500 }
    );
  }
}
