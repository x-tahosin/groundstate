'use client';
import React from 'react';
import { Mountain, Sliders, MapPin } from 'lucide-react';
import { TRAILS } from '../utils/trailData.js';

export default function AlpineMassifsGrid({
  selectedTrail,
  setSelectedTrail,
  isCustomGps,
  setIsCustomGps,
  customParams,
  setCustomParams
}) {
  return (
    <section className="section-massifs">
      <div className="section-title-bar">
        <h2 className="section-h2">
          <Mountain size={20} color="var(--solar-flame)" />
          ALPINE TERRAIN MASSIFS
        </h2>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
          AUTHENTIC TOPOGRAPHIC RIDGELINES
        </div>
      </div>

      <div className="massifs-grid">
        {TRAILS.map((trail) => {
          const isActive = !isCustomGps && selectedTrail.id === trail.id;
          const barrier = trail.horizonProfile.find(p => p.azimuth >= 240 && p.azimuth <= 270)?.elevationAngle || 18;

          return (
            <div
              key={trail.id}
              onClick={() => { setSelectedTrail(trail); setIsCustomGps(false); }}
              className={`massif-card ${isActive ? 'active' : ''}`}
            >
              <div 
                className="massif-card-photo"
                style={{ backgroundImage: `url(${trail.image})` }}
              >
                <span className="massif-badge-elev">
                  {Math.round(trail.peakElevationFt * 0.3048)}M
                </span>
              </div>

              <div className="massif-card-body">
                <div className="massif-title">{trail.name}</div>
                <div className="massif-meta-row">
                  <span>BARRIER: {barrier}° W</span>
                  <span style={{ color: 'var(--solar-flame)' }}>{trail.difficulty}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Custom Backcountry Coordinates Card */}
        <div
          onClick={() => setIsCustomGps(true)}
          className={`massif-card ${isCustomGps ? 'active' : ''}`}
          style={{ background: 'rgba(18, 24, 32, 0.7)' }}
        >
          <div 
            className="massif-card-photo"
            style={{ 
              backgroundImage: `url(${customParams.image})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ zIndex: 5, display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontFamily: 'var(--font-tech)', fontSize: '13px', fontWeight: '700' }}>
              <Sliders size={18} color="var(--solar-flame)" /> CUSTOM GPS RADAR
            </div>
          </div>

          <div className="massif-card-body">
            <div className="massif-title">Custom Trail Waypoint</div>
            <div className="massif-meta-row">
              <span>LAT/LON SLIDER MODE</span>
              <span style={{ color: 'var(--telemetry-emerald)' }}>ACTIVE TUNER</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Tuner Slider Controls */}
      {isCustomGps && (
        <div className="custom-radar-tuner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', fontFamily: 'var(--font-tech)' }}>
              BACKCOUNTRY RADAR TUNER
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--solar-flame)' }}>
              INTERACTIVE OVERRIDE
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <span>WEST RIDGE BARRIER OBSTRUCTION</span>
                <span style={{ color: 'var(--solar-flame)', fontWeight: '700' }}>{customParams.westernBarrierObstructionAngle}°</span>
              </div>
              <input
                type="range"
                min="5"
                max="45"
                value={customParams.westernBarrierObstructionAngle}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setCustomParams(prev => ({
                    ...prev,
                    westernBarrierObstructionAngle: v,
                    horizonProfile: prev.horizonProfile.map(p => (p.azimuth >= 240 && p.azimuth <= 270) ? { ...p, elevationAngle: v } : p)
                  }));
                }}
                style={{ width: '100%', accentColor: 'var(--solar-flame)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <span>LATITUDE POSITION</span>
                <span style={{ color: '#ffffff', fontWeight: '700' }}>{customParams.coordinates.lat.toFixed(2)}° N</span>
              </div>
              <input
                type="range"
                min="25"
                max="65"
                step="0.5"
                value={customParams.coordinates.lat}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setCustomParams(prev => ({
                    ...prev,
                    coordinates: { ...prev.coordinates, lat: v }
                  }));
                }}
                style={{ width: '100%', accentColor: 'var(--telemetry-emerald)' }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
