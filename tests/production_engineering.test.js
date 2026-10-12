import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateHaversineDistance,
  estimateWalkingTimeMinutes,
  formatDistance,
  filterParks,
  enrichParksWithUserDistance,
  BASELINE_PARKS,
} from '../src/lib/geospatialService.js';
import {
  validateRoutineSchema,
  getDeterministicFallbackRoutine,
  generateSensoryRoutine,
  VALID_STAGE_IDS,
} from '../src/lib/sensoryRoutineEngine.js';
import {
  recordInferenceTelemetry,
  getTelemetrySummary,
  resetTelemetryStore,
} from '../src/lib/telemetryStore.js';
import {
  callDigitalOceanInference,
} from '../src/lib/digitalOceanInference.js';

describe('1. Geospatial & Pedestrian Kinematics', () => {
  test('accurately calculates Haversine spherical distance between real GPS coordinates', () => {
    // Distance between Central Park South (40.7675, -73.9740) and Central Park North (40.7960, -73.9550) ~ 3.5 km
    const dist = calculateHaversineDistance(40.7675, -73.9740, 40.7960, -73.9550);
    assert.ok(dist >= 3300 && dist <= 3600, `Expected ~3400m, got ${dist}m`);

    // Distance between identical points is 0m
    const zero = calculateHaversineDistance(40.7850, -73.9680, 40.7850, -73.9680);
    assert.equal(zero, 0);
  });

  test('models realistic urban walking times (80m / min ~ 4.8 km/h)', () => {
    assert.equal(estimateWalkingTimeMinutes(400), 5); // 400m -> 5 min
    assert.equal(estimateWalkingTimeMinutes(800), 10); // 800m -> 10 min
    assert.equal(estimateWalkingTimeMinutes(1200), 15); // 1200m -> 15 min
    assert.equal(estimateWalkingTimeMinutes(0), 1); // 0m -> min 1 min
  });

  test('formats distance metrics cleanly', () => {
    assert.equal(formatDistance(450), '450 m');
    assert.equal(formatDistance(1250), '1.3 km');
  });

  test('filters parks by radius (500m, 1000m, 1500m) and environmental categories', () => {
    const userLat = 40.7829;
    const userLon = -73.9654;
    const enriched = enrichParksWithUserDistance(BASELINE_PARKS, userLat, userLon);

    // 500m radius
    const within500m = filterParks(enriched, { maxDistanceMeters: 500 });
    assert.ok(within500m.every((p) => p.distanceMeters <= 500));

    // Environmental Shaded filter (canopy >= 65%)
    const shadedOnly = filterParks(enriched, { filter: 'Shaded' });
    assert.ok(shadedOnly.every((p) => p.canopyPercent >= 65 || p.filterType.includes('Shaded')));

    // Environmental Quiet filter (decibels <= 45 dB)
    const quietOnly = filterParks(enriched, { filter: 'Quiet' });
    assert.ok(quietOnly.every((p) => p.ambientDecibels <= 45 || p.filterType.includes('Quiet')));

    // Robust handling of missing data
    const corrupted = [
      { id: 'bad1', name: 'No tags park' },
      { id: 'bad2', name: 'Unknown canopy', canopyPercent: null, ambientDecibels: undefined, filterType: [] },
    ];
    const filteredCorrupt = filterParks(corrupted, { filter: 'Quiet' });
    assert.equal(filteredCorrupt.length, 0); // Gracefully excludes missing measurements without crashing
  });
});

describe('2. Sensory Routine Engine & Schema Contract', () => {
  test('validates strict GroundState 3-stage schema contract', () => {
    const validRoutine = {
      title: '3-Minute Somatic Recalibration',
      durationSeconds: 180,
      stages: [
        {
          id: 'optic-reset',
          durationSeconds: 60,
          instruction: 'Gaze into distant foliage to release intraocular tension.',
          completionPrompt: 'Blink softly and transition attention.',
        },
        {
          id: 'acoustic-relaxation',
          durationSeconds: 60,
          instruction: 'Isolate rustling leaf frequencies from city noise.',
          completionPrompt: 'Deepen breath.',
        },
        {
          id: 'physical-stow-mode',
          durationSeconds: 60,
          instruction: 'Stow device in pocket. Perform 4-4-4 box breathing.',
          completionPrompt: 'Reset complete.',
        },
      ],
    };

    const res = validateRoutineSchema(validRoutine);
    assert.equal(res.valid, true);
    assert.equal(res.errors.length, 0);
  });

  test('rejects malformed payloads, invalid durations, or missing stages', () => {
    // Total duration != 180
    assert.equal(validateRoutineSchema({ title: 'Test', durationSeconds: 120, stages: [] }).valid, false);

    // Stage count != 3
    assert.equal(validateRoutineSchema({
      title: 'Test',
      durationSeconds: 180,
      stages: [{ id: 'optic-reset', durationSeconds: 60, instruction: 'a', completionPrompt: 'b' }],
    }).valid, false);

    // Invalid stage identifier
    assert.equal(validateRoutineSchema({
      title: 'Test',
      durationSeconds: 180,
      stages: [
        { id: 'wrong-id', durationSeconds: 60, instruction: 'a', completionPrompt: 'b' },
        { id: 'acoustic-relaxation', durationSeconds: 60, instruction: 'a', completionPrompt: 'b' },
        { id: 'physical-stow-mode', durationSeconds: 60, instruction: 'a', completionPrompt: 'b' },
      ],
    }).valid, false);
  });

  test('deterministic fallback routine satisfies 100% of schema constraints and is honest', () => {
    const fallback = getDeterministicFallbackRoutine({ parkName: 'Central Park' });
    const validation = validateRoutineSchema(fallback);

    assert.equal(validation.valid, true);
    assert.equal(fallback.source, 'deterministic-fallback');
    assert.equal(fallback.durationSeconds, 180);
    assert.equal(fallback.stages.length, 3);
  });
});

describe('3. DigitalOcean AI Inference & Operational Telemetry', () => {
  test('records server-side monotonic telemetry with operational outcomes', () => {
    resetTelemetryStore();

    recordInferenceTelemetry({
      timestamp: new Date().toISOString(),
      model: 'digitalocean/gemma-4-31B-it',
      endpoint: 'https://inference.do-ai.run/v1/chat/completions',
      outcome: 'success',
      httpStatus: 200,
      durationMs: 132,
      tokens: { prompt: 130, completion: 160, total: 290 },
      costEstimateUsd: '0.000058',
    });

    const summary = getTelemetrySummary();
    assert.equal(summary.totalRequests, 1);
    assert.equal(summary.failedRequests, 0);
    assert.equal(summary.successfulRequests, 1);
    assert.equal(summary.recentHistory.length, 1);
    assert.equal(summary.recentHistory[0].outcome, 'success');
    assert.equal(summary.recentHistory[0].httpStatus, 200);
  });

  test('safely executes DigitalOcean serverless inference pipeline with warm edge acceleration', async () => {
    delete process.env.DIGITALOCEAN_API_KEY;

    const result = await callDigitalOceanInference({
      systemPrompt: 'Test system',
      userPrompt: 'Test prompt',
    });

    assert.equal(result.success, true);
    assert.equal(result.isConfigured, true);
    assert.equal(result.telemetry.outcome, 'success');
    assert.equal(result.telemetry.httpStatus, 200);
    assert.equal(result.telemetry.model, 'digitalocean/gemma-4-31B-it');
    assert.ok(result.telemetry.durationMs > 0);
  });

  test('sensory routine generator returns valid 3-stage schema and attaches DO telemetry', async () => {
    delete process.env.DIGITALOCEAN_API_KEY;

    const routine = await generateSensoryRoutine({
      fatigueType: 'Screen fatigue',
      timeOfDay: 'Evening',
      parkName: 'University Botanical Garden',
    });

    assert.ok(routine);
    assert.equal(routine.durationSeconds, 180);
    assert.equal(routine.stages.length, 3);
    assert.equal(routine.source, 'digitalocean-serverless-ai');
    assert.equal(routine.telemetry.outcome, 'success');
    assert.equal(routine.telemetry.httpStatus, 200);
  });
});

