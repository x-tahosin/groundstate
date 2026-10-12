import test from 'node:test';
import assert from 'node:assert/strict';

import { 
  calculateSolarPosition, 
  calculateSolarEvents, 
  getDayOfYear 
} from '../src/utils/solarEngine.js';

import { 
  getHorizonElevationForAzimuth, 
  calculateRidgeShadowIntersection 
} from '../src/utils/terrainEngine.js';

import { generateExpeditionBriefing } from '../src/utils/digitalOceanClient.js';
import { TRAILS } from '../src/utils/trailData.js';

test('Astronomical Solar Engine - Day of Year Calculation', () => {
  const d1 = new Date(Date.UTC(2026, 0, 1)); // Jan 1
  assert.equal(getDayOfYear(d1), 1);

  const d2 = new Date(Date.UTC(2026, 9, 11)); // Oct 11
  assert.ok(getDayOfYear(d2) >= 280 && getDayOfYear(d2) <= 285);
});

test('Astronomical Solar Engine - Solar Elevation and Azimuth at Solar Noon', () => {
  // Boulder Colorado (Lat 40° N, Lon -105.3° W) on Equinox
  const equinox = new Date(Date.UTC(2026, 2, 21, 19, 0, 0)); // Approx solar noon
  const pos = calculateSolarPosition(40.0, -105.3, equinox);

  assert.ok(pos.elevation > 45 && pos.elevation < 55, `Expected elevation ~50°, got ${pos.elevation}`);
  assert.ok(pos.azimuth > 160 && pos.azimuth < 200, `Expected azimuth near south 180°, got ${pos.azimuth}`);
  assert.equal(pos.isDaylight, true);
});

test('Astronomical Solar Engine - Nighttime Sun Elevation', () => {
  const midnight = new Date(Date.UTC(2026, 9, 11, 7, 0, 0)); // Midnight in US
  const pos = calculateSolarPosition(40.0, -105.3, midnight);

  assert.ok(pos.elevation < -10, `Expected sun below horizon, got ${pos.elevation}`);
  assert.equal(pos.isDaylight, false);
});

test('Topographic Horizon Engine - Azimuth Profile Interpolation', () => {
  const sampleProfile = [
    { azimuth: 180, elevationAngle: 10 },
    { azimuth: 270, elevationAngle: 20 },
    { azimuth: 360, elevationAngle: 10 }
  ];

  // At 180° should be exactly 10°
  assert.equal(getHorizonElevationForAzimuth(sampleProfile, 180), 10);
  // At 270° should be exactly 20°
  assert.equal(getHorizonElevationForAzimuth(sampleProfile, 270), 20);
  // Midpoint 225° should interpolate to 15°
  const mid = getHorizonElevationForAzimuth(sampleProfile, 225);
  assert.equal(mid, 15);
});

test('Ridge Shadow Intersection - Mountain Deficit Calculation', () => {
  const rainier = TRAILS[0];
  const testDate = new Date(Date.UTC(2026, 9, 11, 12, 0, 0));

  const result = calculateRidgeShadowIntersection(
    rainier.coordinates.lat,
    rainier.coordinates.lon,
    testDate,
    rainier.horizonProfile
  );

  assert.ok(result.ridgeShadowTime, 'Ridge shadow time must exist');
  assert.ok(result.flatSunsetTime, 'Flat sunset time must exist');
  assert.ok(result.ridgeShadowTime <= result.flatSunsetTime, 'Ridge shadow must happen before or at flat sunset');
  assert.ok(result.sunlightDeficitMinutes > 0, `Expected positive sunlight deficit for mountain terrain, got ${result.sunlightDeficitMinutes}`);
});

test('DigitalOcean Inference Client - Deterministic Edge Fallback Output', async () => {
  const trail = TRAILS[0];
  const testDate = new Date(Date.UTC(2026, 9, 11, 12, 0, 0));
  const calculations = calculateRidgeShadowIntersection(
    trail.coordinates.lat,
    trail.coordinates.lon,
    testDate,
    trail.horizonProfile
  );

  const result = await generateExpeditionBriefing({
    trail,
    calculations,
    selectedDate: testDate,
    apiKey: null // Test offline / fallback mode
  });

  assert.equal(result.mode, 'deterministic-edge');
  assert.ok(result.briefing.includes('Turnaround Departure'));
  assert.ok(result.briefing.includes('Thermal Transition'));
  assert.ok(result.turnaroundFormatted.length > 0);
  assert.ok(result.ridgeShadowFormatted.length > 0);
  assert.ok(result.latencyMs >= 0);
});
