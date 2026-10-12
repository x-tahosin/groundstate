'use client';
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles, Mountain, Sun, Compass } from 'lucide-react';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff8426', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
      <div className="pulse-dot" style={{ marginRight: '8px' }} /> INITIALIZING 3D SPLINE ENGINE...
    </div>
  ),
});

export default function SplineViewport({ 
  trail, 
  currentHour, 
  sunPosition, 
  ridgeIntersect,
  viewMode, // 'solar-horizon' | 'spline-3d'
  setViewMode
}) {
  const canvasRef = useRef(null);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);

  // Dynamic Solar Horizon Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let time = 0;

    const render = () => {
      time += 0.02;
      const width = canvas.width = canvas.offsetWidth;
      const height = canvas.height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      // 1. Atmosphere Gradient based on Sun Elevation
      const elev = sunPosition ? sunPosition.elevation : 10;
      let skyGradient;
      if (elev > 25) {
        // High Daylight
        skyGradient = ctx.createLinearGradient(0, 0, 0, height);
        skyGradient.addColorStop(0, '#0c1a17');
        skyGradient.addColorStop(0.6, '#132822');
        skyGradient.addColorStop(1, '#070b09');
      } else if (elev > 0) {
        // Golden Twilight
        skyGradient = ctx.createLinearGradient(0, 0, 0, height);
        skyGradient.addColorStop(0, '#1c1511');
        skyGradient.addColorStop(0.5, '#3b1d11');
        skyGradient.addColorStop(0.8, '#ff8426');
        skyGradient.addColorStop(1, '#070a08');
      } else {
        // Post-Sunset Alpine Blue Hour / Night
        skyGradient = ctx.createLinearGradient(0, 0, 0, height);
        skyGradient.addColorStop(0, '#04070a');
        skyGradient.addColorStop(0.7, '#070e17');
        skyGradient.addColorStop(1, '#050706');
      }
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Stars if night or low sun
      if (elev < 8) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for (let i = 0; i < 35; i++) {
          const sx = (Math.sin(i * 99 + time * 0.1) * 0.5 + 0.5) * width;
          const sy = (Math.cos(i * 33) * 0.5 + 0.5) * (height * 0.55);
          const size = (i % 3 === 0) ? 1.5 : 1;
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Grid Coordinates Overlay
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let y = height * 0.2; y < height * 0.8; y += height * 0.2) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 4. Mountain Ridge Silhouette (Western Barrier)
      const barrierAngle = trail ? (trail.westernBarrierObstructionAngle || 20) : 20;
      // Convert barrier angle to canvas Y: 0 deg = bottom-third, 30 deg = mid-height
      const barrierY = height * 0.72 - (barrierAngle / 45) * (height * 0.38);

      // Background Mountain Ridge (Further distance)
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height * 0.65);
      for (let x = 0; x <= width; x += 30) {
        const ny = height * 0.65 - Math.sin(x * 0.008 + 1.2) * 28 - Math.cos(x * 0.02) * 14;
        ctx.lineTo(x, ny);
      }
      ctx.lineTo(width, height);
      ctx.fillStyle = '#0a120e';
      ctx.fill();

      // Foreground Western Ridge Silhouette (Primary Barrier)
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, barrierY + 20);
      for (let x = 0; x <= width; x += 25) {
        const peakFactor = Math.sin((x / width) * Math.PI) * 15;
        const jagged = Math.sin(x * 0.035) * 8;
        const ry = barrierY - peakFactor + jagged;
        ctx.lineTo(x, ry);
      }
      ctx.lineTo(width, height);
      ctx.fillStyle = '#060a08';
      ctx.fill();
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 5. Calculate Sun Canvas Position
      // Current Hour: 6 (06:00) to 20 (20:00)
      const normTime = Math.max(0, Math.min(1, (currentHour - 6) / 14));
      const sunX = width * 0.12 + normTime * (width * 0.76);
      
      // Calculate sun elevation curve
      const maxSunHeight = height * 0.22;
      const baseSunY = height * 0.72;
      const arcFactor = Math.sin(normTime * Math.PI);
      const sunY = baseSunY - arcFactor * (baseSunY - maxSunHeight);

      // Check if Sun is blocked by mountain barrier
      const isBehindRidge = sunY >= barrierY - 5;

      // 6. Solar Arc Trajectory Line
      ctx.beginPath();
      for (let t = 0; t <= 1; t += 0.02) {
        const tx = width * 0.12 + t * (width * 0.76);
        const tArc = Math.sin(t * Math.PI);
        const ty = baseSunY - tArc * (baseSunY - maxSunHeight);
        if (t === 0) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      }
      ctx.strokeStyle = 'rgba(255, 132, 38, 0.2)';
      ctx.setLineDash([4, 6]);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);

      // 7. Mountain Shadow Ray Shading
      if (isBehindRidge) {
        // Sun is behind ridge! Cast alpine shadow overlay
        const shadowGrad = ctx.createLinearGradient(0, barrierY, 0, height);
        shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
        shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
        ctx.fillStyle = shadowGrad;
        ctx.fillRect(0, barrierY, width, height - barrierY);
      }

      // 8. Render Glowing Sun Orb
      const coronaGrad = ctx.createRadialGradient(sunX, sunY, 2, sunX, sunY, isBehindRidge ? 25 : 65);
      if (isBehindRidge) {
        coronaGrad.addColorStop(0, 'rgba(255, 132, 38, 0.4)');
        coronaGrad.addColorStop(0.5, 'rgba(255, 68, 0, 0.15)');
        coronaGrad.addColorStop(1, 'transparent');
      } else {
        coronaGrad.addColorStop(0, 'rgba(255, 235, 180, 0.95)');
        coronaGrad.addColorStop(0.2, 'rgba(255, 132, 38, 0.7)');
        coronaGrad.addColorStop(0.6, 'rgba(255, 132, 38, 0.2)');
        coronaGrad.addColorStop(1, 'transparent');
      }
      ctx.fillStyle = coronaGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, isBehindRidge ? 25 : 65, 0, Math.PI * 2);
      ctx.fill();

      // Solid Sun Core
      ctx.fillStyle = isBehindRidge ? 'rgba(255, 132, 38, 0.6)' : '#ffffff';
      ctx.beginPath();
      ctx.arc(sunX, sunY, isBehindRidge ? 5 : 8, 0, Math.PI * 2);
      ctx.fill();

      // Sun Telemetry Pill in Canvas
      ctx.fillStyle = 'rgba(10, 15, 12, 0.85)';
      ctx.strokeStyle = isBehindRidge ? 'rgba(244, 63, 94, 0.6)' : 'rgba(255, 132, 38, 0.5)';
      ctx.lineWidth = 1;
      const tagText = isBehindRidge ? `SHADOW CAST • ${elev.toFixed(1)}°` : `SUNLIGHT • ${elev.toFixed(1)}°`;
      ctx.font = '10px "JetBrains Mono", monospace';
      const textWidth = ctx.measureText(tagText).width;
      const tagX = Math.min(width - textWidth - 20, Math.max(20, sunX - textWidth / 2));
      const tagY = Math.max(30, sunY - 24);

      ctx.beginPath();
      ctx.roundRect(tagX - 8, tagY - 14, textWidth + 16, 20, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isBehindRidge ? '#f43f5e' : '#ff8426';
      ctx.fillText(tagText, tagX, tagY);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [trail, currentHour, sunPosition]);

  return (
    <div className="spline-interactive-box">
      {/* 3D Spline Scene when toggle is active */}
      {viewMode === 'spline-3d' && !splineError ? (
        <div style={{ position: 'absolute', inset: 0, zIndex: 6 }}>
          <Spline 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            onLoad={() => setSplineLoaded(true)}
            onError={() => setSplineError(true)}
          />
        </div>
      ) : null}

      {/* Dynamic 60fps Solar & Ridge Canvas Visualizer */}
      <canvas 
        ref={canvasRef} 
        className="canvas-horizon-overlay"
        style={{ opacity: viewMode === 'spline-3d' ? 0.35 : 1, transition: 'opacity 0.4s' }}
      />

      {/* Top View Mode Switcher Pills */}
      <div style={{ position: 'absolute', bottom: '16px', right: '16px', zIndex: 25, display: 'flex', gap: '8px' }}>
        <button 
          className={`btn-tick ${viewMode === 'solar-horizon' ? 'active' : ''}`}
          onClick={() => setViewMode('solar-horizon')}
          title="Topographic Solar Horizon Canvas"
        >
          <Mountain size={12} style={{ display: 'inline', marginRight: '4px' }} /> Horizon Trajectory
        </button>
        <button 
          className={`btn-tick ${viewMode === 'spline-3d' ? 'active' : ''}`}
          onClick={() => setViewMode('spline-3d')}
          title="Interactive 3D Spline Visualizer"
        >
          <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} /> 3D Spline Orbit
        </button>
      </div>
    </div>
  );
}
