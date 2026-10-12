/**
 * SolTerra Topographic Horizon & Ridge Shadow Analyzer
 * Computes the intersection between NOAA solar trajectory and mountain horizon obstruction profiles.
 */

import { calculateSolarPosition, calculateSolarEvents } from './solarEngine.js';

/**
 * Returns the mountain horizon elevation angle (in degrees above horizontal)
 * for a specific compass azimuth, given a 360-degree topographic profile.
 * 
 * profile: Array of { azimuth: number, elevationAngle: number }
 */
export function getHorizonElevationForAzimuth(profile, targetAzimuth) {
  if (!profile || profile.length === 0) return 0;

  const normalizedAzimuth = ((targetAzimuth % 360) + 360) % 360;

  // Find surrounding points for linear interpolation
  let p1 = profile[profile.length - 1];
  let p2 = profile[0];

  for (let i = 0; i < profile.length; i++) {
    if (profile[i].azimuth <= normalizedAzimuth) {
      p1 = profile[i];
    }
    if (profile[i].azimuth >= normalizedAzimuth) {
      p2 = profile[i];
      break;
    }
  }

  if (p1.azimuth === p2.azimuth) {
    return p1.elevationAngle;
  }

  // Linear interpolation
  const t = (normalizedAzimuth - p1.azimuth) / (p2.azimuth - p1.azimuth);
  return p1.elevationAngle + t * (p2.elevationAngle - p1.elevationAngle);
}

/**
 * Evaluates exact Ridge Shadow Time (when sun dips below the terrain barrier)
 * vs Astronomical Flat Horizon Sunset.
 */
export function calculateRidgeShadowIntersection(lat, lon, date, horizonProfile) {
  const events = calculateSolarEvents(lat, lon, date);
  const flatSunset = events.sunset;

  // Search backwards from flat sunset (up to 4 hours earlier) in 1-minute steps
  let ridgeShadowDate = null;
  let shadowAzimuth = null;
  let barrierAngle = null;

  const searchStart = new Date(flatSunset.getTime() - 4.5 * 3600 * 1000);
  const searchEnd = new Date(flatSunset.getTime() + 15 * 60 * 1000);

  let prevSunAbove = true;

  for (let t = searchStart.getTime(); t <= searchEnd.getTime(); t += 60 * 1000) {
    const testDate = new Date(t);
    const sunPos = calculateSolarPosition(lat, lon, testDate);
    const ridgeElev = getHorizonElevationForAzimuth(horizonProfile, sunPos.azimuth);

    const isAboveRidge = sunPos.elevation > ridgeElev;

    if (prevSunAbove && !isAboveRidge) {
      // Intersection point found
      ridgeShadowDate = testDate;
      shadowAzimuth = sunPos.azimuth;
      barrierAngle = ridgeElev;
      break;
    }
    prevSunAbove = isAboveRidge;
  }

  // If terrain is completely flat, ridge shadow equals flat sunset
  if (!ridgeShadowDate) {
    ridgeShadowDate = flatSunset;
    const finalPos = calculateSolarPosition(lat, lon, flatSunset);
    shadowAzimuth = finalPos.azimuth;
    barrierAngle = 0;
  }

  const deficitMinutes = Math.max(0, Math.round((flatSunset.getTime() - ridgeShadowDate.getTime()) / (60 * 1000)));

  // Thermal drop prediction: typically begins 15 mins after ridge shadow
  const thermalPlungeTime = new Date(ridgeShadowDate.getTime() + 15 * 60 * 1000);

  // Golden hour starts when sun elevation drops below 6° (or 1 hour before ridge shadow)
  const goldenHourStartTime = new Date(ridgeShadowDate.getTime() - 45 * 60 * 1000);

  return {
    flatSunsetTime: flatSunset,
    ridgeShadowTime: ridgeShadowDate,
    sunlightDeficitMinutes: deficitMinutes,
    shadowAzimuth: Math.round(shadowAzimuth * 10) / 10,
    barrierElevationAngle: Math.round(barrierAngle * 10) / 10,
    thermalPlungeTime,
    goldenHourStartTime,
    peakElevation: events.peakElevation,
    solarNoon: events.solarNoon,
    sunriseTime: events.sunrise
  };
}

/**
 * Format local time in clean 12-hour or 24-hour display (e.g. "5:18 PM")
 */
export function formatTime(date, timeZone = undefined) {
  if (!date) return '--:--';
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone
  });
}
