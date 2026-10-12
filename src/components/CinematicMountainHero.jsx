'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles, Mountain, Clock, Sun, ShieldAlert, ArrowRight } from 'lucide-react';
import { formatTime } from '../utils/terrainEngine.js';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff5e1e', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
      <div className="live-beacon" style={{ marginRight: '8px' }} /> LOADING 3D SPLINE SCENE...
    </div>
  ),
});

export default function CinematicMountainHero({
  trail,
  currentHour,
  setCurrentHour,
  sunPosition,
  ridgeIntersect,
  solarEvents,
  isOccluded
}) {
  const [viewMode, setViewMode] = useState('cinematic'); // 'cinematic' | 'spline'

  // Format current scrubber time
  const hrs = Math.floor(currentHour);
  const mins = Math.floor((currentHour % 1) * 60);
  const period = hrs >= 12 ? 'PM' : 'AM';
  const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
  const timeFormatted = `${displayHrs}:${String(mins).padStart(2, '0')} ${period}`;

  // Dynamic Atmospheric Filter calculation based on current sun elevation
  const elev = sunPosition ? sunPosition.elevation : 15;
  let atmosphereFilter = 'brightness(1) contrast(1.05)';
  let atmosphereTint = 'transparent';

  if (elev > 25) {
    // High Daylight
    atmosphereFilter = 'brightness(1.05) contrast(1.1) saturate(1.05)';
  } else if (elev > 5) {
    // Golden Hour
    atmosphereFilter = 'brightness(0.92) contrast(1.18) saturate(1.4) sepia(0.25)';
    atmosphereTint = 'radial-gradient(ellipse at 70% 30%, rgba(255, 94, 30, 0.25) 0%, transparent 60%)';
  } else if (elev > -5) {
    // Alpine Sunset / Shadow Cutoff
    atmosphereFilter = 'brightness(0.72) contrast(1.25) saturate(1.1) sepia(0.15) hue-rotate(15deg)';
    atmosphereTint = 'radial-gradient(ellipse at 50% 60%, rgba(180, 52, 3, 0.35) 0%, rgba(5, 7, 8, 0.7) 100%)';
  } else {
    // Alpine Night / Blue Hour
    atmosphereFilter = 'brightness(0.38) contrast(1.35) saturate(0.6) hue-rotate(190deg)';
    atmosphereTint = 'radial-gradient(ellipse at 50% 50%, rgba(3, 105, 161, 0.15) 0%, rgba(5, 7, 8, 0.85) 100%)';
  }

  // Quick jump time handlers
  const setRidgeCutoffTime = () => {
    if (!ridgeIntersect?.ridgeShadowTime) return;
    const t = ridgeIntersect.ridgeShadowTime;
    setCurrentHour(t.getHours() + t.getMinutes() / 60);
  };

  const setSunsetTime = () => {
    if (!solarEvents?.sunset) return;
    const t = solarEvents.sunset;
    setCurrentHour(t.getHours() + t.getMinutes() / 60);
  };

  return (
    <div className="cinematic-mountain-card">
      {/* 1. Cinematic Photographic Backdrop */}
      {viewMode === 'cinematic' ? (
        <>
          <div 
            className="cinematic-backdrop-img"
            style={{ 
              backgroundImage: `url(${trail.image})`,
              filter: atmosphereFilter
            }}
          />
          <div 
            className="cinematic-vignette-overlay"
            style={{ backgroundImage: atmosphereTint }}
          />
        </>
      ) : (
        /* 2. Interactive 3D Spline Scene */
        <div className="spline-embed-stage">
          <Spline 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" 
          />
        </div>
      )}

      {/* 3. Top Viewport Telemetry Header */}
      <div className="viewport-top-hud">
        <div>
          <div className="telemetry-pill-tag">
            <Sun size={12} />
            <span>RIDGE SHADOW OCCLUSION</span>
          </div>

          <div className="hero-big-stat-row">
            <div className="hero-big-cutoff">
              {formatTime(ridgeIntersect.ridgeShadowTime, trail.timeZone)}
            </div>
            <div className="hero-stat-delta">
              -{ridgeIntersect.sunlightDeficitMinutes}M LOSS
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div className="hero-valley-sunset-box">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
              ASTRONOMICAL DUSK
            </div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>
              {formatTime(solarEvents.sunset, trail.timeZone)}
            </div>
          </div>

          {/* Toggle View Mode Button */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className={`preset-time-pill ${viewMode === 'cinematic' ? 'active' : ''}`}
              onClick={() => setViewMode('cinematic')}
            >
              <Mountain size={12} style={{ display: 'inline', marginRight: '4px' }} /> Massif Atmosphere
            </button>
            <button
              className={`preset-time-pill ${viewMode === 'spline' ? 'active' : ''}`}
              onClick={() => setViewMode('spline')}
            >
              <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} /> 3D Spline Globe
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bottom Controls: Interactive Chronograph Scrubber */}
      <div className="viewport-bottom-controls">
        <div className="scrubber-meta-row">
          <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#ffffff', fontWeight: '600' }}>
            <Clock size={13} color="var(--solar-flame)" />
            LOCAL TRAIL TIME: {timeFormatted}
          </span>

          <span style={{ color: isOccluded ? 'var(--shadow-crimson)' : 'var(--telemetry-emerald)', fontWeight: '600' }}>
            {isOccluded ? '● RIDGE SHADOW ACTIVE' : '○ DIRECT SUNLIGHT'} • SOLAR ELEV {elev.toFixed(1)}° • AZM {sunPosition?.azimuth.toFixed(0)}°
          </span>
        </div>

        <div className="scrubber-slider-rail">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>06:00</span>
          <input
            type="range"
            min="6"
            max="20"
            step="0.05"
            value={currentHour}
            onChange={(e) => setCurrentHour(parseFloat(e.target.value))}
            className="custom-range-slider"
            aria-label="Solar Scrubber Hour"
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>20:00</span>
        </div>

        {/* Quick Jump Buttons */}
        <div className="preset-time-buttons">
          <button className="preset-time-pill" onClick={() => setCurrentHour(12.0)}>Noon 12:00</button>
          <button className="preset-time-pill" onClick={() => setCurrentHour(16.0)}>Golden Hour 16:00</button>
          <button 
            className="preset-time-pill active" 
            onClick={setRidgeCutoffTime}
          >
            Ridge Cutoff {formatTime(ridgeIntersect.ridgeShadowTime, trail.timeZone)}
          </button>
          <button 
            className="preset-time-pill" 
            onClick={setSunsetTime}
          >
            Valley Sunset {formatTime(solarEvents.sunset, trail.timeZone)}
          </button>
        </div>
      </div>
    </div>
  );
}
