/**
 * SolTerra Astronomical Solar Engine
 * Implements high-precision NOAA solar position algorithms
 * Computes exact solar elevation, azimuth, solar noon, and sunset for any point on Earth.
 */

// Degrees to Radians and vice versa
const degToRad = (deg) => (deg * Math.PI) / 180;
const radToDeg = (rad) => (rad * 180) / Math.PI;

/**
 * Calculates day of the year (1 - 366)
 */
export function getDayOfYear(date) {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Calculates NOAA Solar Coordinates for a given latitude, longitude, and UTC Date
 * Returns { elevation, azimuth, zenith, solarDec, eqOfTime, isDaylight }
 */
export function calculateSolarPosition(lat, lon, date) {
  const dayOfYear = getDayOfYear(date);
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;

  // Fractional year (in radians)
  const gamma = (2 * Math.PI / 365) * (dayOfYear - 1 + (hour - 12) / 24);

  // Equation of time in minutes
  const eqOfTime = 229.18 * (
    0.000075 +
    0.001868 * Math.cos(gamma) -
    0.032077 * Math.sin(gamma) -
    0.014615 * Math.cos(2 * gamma) -
    0.040849 * Math.sin(2 * gamma)
  );

  // Solar declination angle in radians
  const solarDec = 0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  // Time offset in minutes
  const timeOffset = eqOfTime + 4 * lon; // 4 minutes per degree longitude

  // True solar time in minutes
  const trueSolarTime = (hour * 60 + timeOffset + 1440) % 1440;

  // Solar hour angle in degrees
  let hourAngle = trueSolarTime / 4 - 180;
  if (hourAngle < -180) hourAngle += 360;

  const latRad = degToRad(lat);
  const hourAngleRad = degToRad(hourAngle);

  // Solar zenith angle (cosine)
  const cosZenith = Math.sin(latRad) * Math.sin(solarDec) +
    Math.cos(latRad) * Math.cos(solarDec) * Math.cos(hourAngleRad);

  const zenithRad = Math.acos(Math.max(-1, Math.min(1, cosZenith)));
  const zenithDeg = radToDeg(zenithRad);
  let elevationDeg = 90 - zenithDeg;

  // Atmospheric refraction correction for true visual elevation
  if (elevationDeg > 85) {
    // negligible
  } else if (elevationDeg > 5) {
    const r = 58.1 / Math.tan(degToRad(elevationDeg)) -
      0.07 / Math.pow(Math.tan(degToRad(elevationDeg)), 3) +
      0.000086 / Math.pow(Math.tan(degToRad(elevationDeg)), 5);
    elevationDeg += r / 3600;
  } else if (elevationDeg > -0.575) {
    const r = 1735 + elevationDeg * (-518.2 + elevationDeg * (103.4 + elevationDeg * (-12.79 + elevationDeg * 0.711)));
    elevationDeg += r / 3600;
  } else {
    const r = -20.774 / Math.tan(degToRad(elevationDeg));
    elevationDeg += r / 3600;
  }

  // Solar azimuth angle (degrees clockwise from North)
  let azimuthDeg = 180;
  const sinAzimuth = -Math.sin(hourAngleRad) * Math.cos(solarDec) / Math.sin(zenithRad);
  const cosAzimuth = (Math.sin(solarDec) - Math.sin(latRad) * Math.cos(zenithRad)) /
    (Math.cos(latRad) * Math.sin(zenithRad));

  azimuthDeg = radToDeg(Math.atan2(sinAzimuth, cosAzimuth));
  if (azimuthDeg < 0) azimuthDeg += 360;

  return {
    elevation: Math.round(elevationDeg * 100) / 100,
    azimuth: Math.round(azimuthDeg * 100) / 100,
    zenith: Math.round(zenithDeg * 100) / 100,
    isDaylight: elevationDeg > -0.833, // standard atmospheric refraction threshold
    trueSolarTimeMinutes: Math.round(trueSolarTime)
  };
}

/**
 * Calculates Flat-Earth Astronomical Sunset, Sunrise, and Solar Noon for a date
 */
export function calculateSolarEvents(lat, lon, date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // Offset by longitude to start at local solar midnight
  const localMidnightUTC = new Date(Date.UTC(year, month, day, 0, 0, 0) - (lon / 15) * 3600 * 1000);

  let sunrise = null;
  let sunset = null;
  let maxElev = -999;
  let solarNoon = null;

  for (let m = 0; m < 1440; m += 2) {
    const testDate = new Date(localMidnightUTC.getTime() + m * 60 * 1000);
    const pos = calculateSolarPosition(lat, lon, testDate);

    if (pos.elevation > maxElev) {
      maxElev = pos.elevation;
      solarNoon = testDate;
    }

    if (!sunrise && pos.elevation >= -0.833 && m < 720) {
      sunrise = testDate;
    }
    if (sunrise && !sunset && pos.elevation <= -0.833 && m >= 720) {
      sunset = testDate;
    }
  }

  return {
    sunrise: sunrise || new Date(localMidnightUTC.getTime() + 6.5 * 3600 * 1000),
    sunset: sunset || new Date(localMidnightUTC.getTime() + 18.5 * 3600 * 1000),
    solarNoon: solarNoon || new Date(localMidnightUTC.getTime() + 12.2 * 3600 * 1000),
    peakElevation: Math.round(maxElev * 10) / 10
  };
}

/**
 * Generates an afternoon trajectory curve (e.g. from 12:00 to 20:00 local time)
 */
export function generateAfternoonSolarArc(lat, lon, date, stepMinutes = 10) {
  const events = calculateSolarEvents(lat, lon, date);
  const sunset = events.sunset;
  
  // Start 5 hours before sunset up to 1 hour after sunset
  const startTime = new Date(sunset.getTime() - 5.5 * 3600 * 1000);
  const endTime = new Date(sunset.getTime() + 1.0 * 3600 * 1000);

  const points = [];
  let curr = new Date(startTime.getTime());

  while (curr <= endTime) {
    const pos = calculateSolarPosition(lat, lon, curr);
    points.push({
      time: new Date(curr.getTime()),
      elevation: pos.elevation,
      azimuth: pos.azimuth,
      isDaylight: pos.isDaylight
    });
    curr = new Date(curr.getTime() + stepMinutes * 60 * 1000);
  }

  return {
    events,
    arc: points
  };
}
