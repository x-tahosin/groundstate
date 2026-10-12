'use client';
import React from 'react';
import { Compass, Sun, ShieldAlert } from 'lucide-react';

export default function SolarChronographBezel({ 
  sunElevation = 15, 
  sunAzimuth = 245, 
  barrierAngle = 22,
  isOccluded = false 
}) {
  const size = 200;
  const center = size / 2;
  const radius = 80;

  // Map sun elevation (-15° to +75°) to circular dial angle (-120° to +120°)
  const clampedElevation = Math.max(-15, Math.min(75, sunElevation));
  const needleAngle = ((clampedElevation - 30) / 45) * 90; // degrees

  // Barrier angle mark on the dial
  const barrierMarkerAngle = ((barrierAngle - 30) / 45) * 90;

  return (
    <div className="chronometer-bezel-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px', color: 'var(--text-muted)' }}>
          ASTRONOMICAL CHRONOMETER
        </span>
        <span style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '5px', 
          fontFamily: 'var(--font-mono)', 
          fontSize: '10px', 
          color: isOccluded ? 'var(--shadow-crimson)' : 'var(--telemetry-emerald)' 
        }}>
          {isOccluded ? '● RIDGE SHADOW' : '○ DIRECT SUN'}
        </span>
      </div>

      <div className="bezel-dial-container">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Outer Bezel Rim */}
          <circle 
            cx={center} 
            cy={center} 
            r={radius + 12} 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.08)" 
            strokeWidth="1.5" 
          />
          <circle 
            cx={center} 
            cy={center} 
            r={radius} 
            fill="rgba(8, 12, 16, 0.7)" 
            stroke="rgba(255, 255, 255, 0.12)" 
            strokeWidth="1" 
          />

          {/* Barrier Occlusion Hazard Arc */}
          <path
            d={`M ${center - radius * 0.7} ${center + radius * 0.5} A ${radius} ${radius} 0 0 0 ${center + radius * 0.7} ${center + radius * 0.5}`}
            fill="none"
            stroke="rgba(239, 68, 68, 0.25)"
            strokeWidth="6"
            strokeDasharray="4 4"
          />

          {/* Dial Graduation Ticks */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15 - 90) * (Math.PI / 180);
            const isMajor = i % 6 === 0;
            const r1 = radius - (isMajor ? 10 : 5);
            const r2 = radius - 2;
            const x1 = center + r1 * Math.cos(angle);
            const y1 = center + r1 * Math.sin(angle);
            const x2 = center + r2 * Math.cos(angle);
            const y2 = center + r2 * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isMajor ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.15)'}
                strokeWidth={isMajor ? 1.5 : 1}
              />
            );
          })}

          {/* Western Ridge Barrier Target Line */}
          <g transform={`rotate(${barrierMarkerAngle}, ${center}, ${center})`}>
            <line
              x1={center}
              y1={center - radius}
              x2={center}
              y2={center - radius + 14}
              stroke="var(--solar-flame)"
              strokeWidth="2.5"
            />
          </g>

          {/* Dynamic Solar Indicator Needle */}
          <g transform={`rotate(${needleAngle}, ${center}, ${center})`} style={{ transition: 'transform 0.3s ease-out' }}>
            <line
              x1={center}
              y1={center}
              x2={center}
              y2={center - radius + 10}
              stroke={isOccluded ? 'var(--shadow-crimson)' : 'var(--solar-amber)'}
              strokeWidth="2"
            />
            <circle
              cx={center}
              cy={center - radius + 10}
              r="4"
              fill={isOccluded ? 'var(--shadow-crimson)' : '#ffffff'}
              stroke="var(--solar-flame)"
              strokeWidth="2"
            />
          </g>

          {/* Pivot Center Cap */}
          <circle cx={center} cy={center} r="6" fill="#1e293b" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.5" />
        </svg>

        {/* Center Digital Telemetry Readout */}
        <div className="bezel-center-readout">
          <div className="bezel-solar-angle">
            {sunElevation > 0 ? `+${sunElevation.toFixed(1)}°` : `${sunElevation.toFixed(1)}°`}
          </div>
          <div className="bezel-solar-label">
            SOLAR ALTITUDE
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', marginTop: '6px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
          BARRIER: {barrierAngle}° W
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
          AZIMUTH: {sunAzimuth.toFixed(0)}°
        </span>
      </div>
    </div>
  );
}
