import React, { useRef, useEffect, useState } from 'react';
import { Sun, Mountain, Clock, AlertTriangle, Info } from 'lucide-react';
import { calculateSolarPosition, generateAfternoonSolarArc } from '../utils/solarEngine.js';
import { getHorizonElevationForAzimuth, formatTime } from '../utils/terrainEngine.js';

export function SolarHorizonChart({ trail, calculations, selectedDate }) {
  const canvasRef = useRef(null);
  const [hoverData, setHoverData] = useState(null);

  const {
    ridgeShadowTime,
    flatSunsetTime,
    sunlightDeficitMinutes,
    barrierElevationAngle,
    shadowAzimuth
  } = calculations;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Handle high DPI displays
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Chart margins
    const margin = { top: 30, right: 30, bottom: 45, left: 50 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    // Azimuth range to display: 180° (South) to 300° (Northwest)
    const minAzimuth = 170;
    const maxAzimuth = 300;

    // Elevation range: -5° to 35°
    const minElev = -4;
    const maxElev = 35;

    const scaleX = (az) => margin.left + ((az - minAzimuth) / (maxAzimuth - minAzimuth)) * plotWidth;
    const scaleY = (el) => margin.top + (1 - (el - minElev) / (maxElev - minElev)) * plotHeight;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // 1. Draw subtle background grid lines
    ctx.strokeStyle = '#E5DFCF';
    ctx.lineWidth = 1;

    // Elevation horizontal grid (0°, 10°, 20°, 30°)
    [0, 10, 20, 30].forEach((elev) => {
      const y = scaleY(elev);
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(width - margin.right, y);
      ctx.stroke();

      ctx.fillStyle = elev === 0 ? '#C8622A' : '#72807A';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(elev === 0 ? '0° (Sea Level)' : `${elev}°`, margin.left - 8, y + 3);
    });

    // Azimuth vertical grid (South 180°, SW 225°, West 270°)
    [
      { az: 180, label: '180° S' },
      { az: 225, label: '225° SW' },
      { az: 270, label: '270° W' }
    ].forEach(({ az, label }) => {
      const x = scaleX(az);
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, height - margin.bottom);
      ctx.stroke();

      ctx.fillStyle = '#72807A';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, height - margin.bottom + 18);
    });

    // 2. Draw Mountain Ridgeline Horizon Obstruction (Filled polygon)
    ctx.beginPath();
    const startX = scaleX(minAzimuth);
    ctx.moveTo(startX, height - margin.bottom);

    for (let az = minAzimuth; az <= maxAzimuth; az += 2) {
      const ridgeEl = getHorizonElevationForAzimuth(trail.horizonProfile, az);
      const x = scaleX(az);
      const y = scaleY(ridgeEl);
      ctx.lineTo(x, y);
    }

    const endX = scaleX(maxAzimuth);
    ctx.lineTo(endX, height - margin.bottom);
    ctx.closePath();

    // Natural mountain terrain gradient fill
    const terrainGrad = ctx.createLinearGradient(0, margin.top, 0, height - margin.bottom);
    terrainGrad.addColorStop(0, '#28463B');
    terrainGrad.addColorStop(1, '#1A2F27');
    ctx.fillStyle = terrainGrad;
    ctx.fill();

    // Mountain ridgeline stroke
    ctx.strokeStyle = '#3D5F54';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 3. Draw NOAA Solar Trajectory Arc
    const solarData = generateAfternoonSolarArc(trail.coordinates.lat, trail.coordinates.lon, selectedDate, 4);
    const arc = solarData.arc.filter((p) => p.azimuth >= minAzimuth && p.azimuth <= maxAzimuth);

    if (arc.length > 1) {
      ctx.beginPath();
      ctx.moveTo(scaleX(arc[0].azimuth), scaleY(arc[0].elevation));
      for (let i = 1; i < arc.length; i++) {
        ctx.lineTo(scaleX(arc[i].azimuth), scaleY(arc[i].elevation));
      }
      ctx.strokeStyle = '#E89A3C';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([]);
      ctx.stroke();

      // Golden solar glow
      ctx.strokeStyle = 'rgba(232, 154, 60, 0.35)';
      ctx.lineWidth = 8;
      ctx.stroke();
    }

    // 4. Mark Ridge Shadow Intersection Point (The exact Touch Grass event)
    const shadowPos = calculateSolarPosition(trail.coordinates.lat, trail.coordinates.lon, ridgeShadowTime);
    const shadowX = scaleX(shadowPos.azimuth);
    const shadowY = scaleY(shadowPos.elevation);

    // Radial pulse indicator
    ctx.beginPath();
    ctx.arc(shadowX, shadowY, 12, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(217, 119, 36, 0.25)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(shadowX, shadowY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#D97724';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Shadow annotation label
    ctx.fillStyle = '#18221E';
    ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Ridge Shadow: ${formatTime(ridgeShadowTime)}`, shadowX + 14, shadowY - 4);

    ctx.fillStyle = '#D97724';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText(`(-${sunlightDeficitMinutes}m daylight lost)`, shadowX + 14, shadowY + 10);

    // 5. Flat Horizon Sunset Marker
    const flatPos = calculateSolarPosition(trail.coordinates.lat, trail.coordinates.lon, flatSunsetTime);
    const flatX = scaleX(flatPos.azimuth);
    const flatY = scaleY(0);

    ctx.beginPath();
    ctx.arc(flatX, flatY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#72807A';
    ctx.fill();

    ctx.fillStyle = '#72807A';
    ctx.font = '9px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Flat Sunset: ${formatTime(flatSunsetTime)}`, flatX - 8, flatY - 6);

  }, [trail, calculations, selectedDate]);

  return (
    <div className="field-card p-5 mb-8 no-print">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <span className="badge-tag badge-amber mb-1">
            Astronomical & Topographic Visualization
          </span>
          <h3 className="font-serif text-xl font-bold text-[#18221E]">
            Solar Ridge Horizon Arc
          </h3>
          <p className="text-xs text-[#4A5852]">
            Visualizing the solar descent against {trail.name}’s ridgeline profile. Notice the intersection where direct sunlight vanishes behind the rock barrier.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono text-[#4A5852] bg-[#F4F0E8] px-3 py-1.5 rounded-lg border border-[#E5DFCF]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 bg-[#E89A3C] rounded-full inline-block" />
            <span>Solar Path</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 bg-[#28463B] rounded-full inline-block" />
            <span>Mountain Barrier</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#D97724] rounded-full inline-block" />
            <span>Ridge Shadow</span>
          </div>
        </div>
      </div>

      {/* Canvas Chart Container */}
      <div className="relative w-full h-72 sm:h-80 bg-[#FFFDF9] rounded-xl border border-[#E5DFCF] overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />
      </div>

      {/* Metric Strip Below Chart */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-[#E5DFCF] text-xs">
        <div className="bg-[#FBF9F5] p-2.5 rounded-lg border border-[#E5DFCF]">
          <span className="text-[10px] uppercase font-mono text-[#5E7A6E] block mb-0.5">
            Actual Ridge Shadow
          </span>
          <span className="font-serif text-base font-bold text-[#D97724]">
            {formatTime(ridgeShadowTime)}
          </span>
          <span className="text-[10px] text-[#4A5852] block mt-0.5">
            At {shadowAzimuth}° Azimuth
          </span>
        </div>

        <div className="bg-[#FBF9F5] p-2.5 rounded-lg border border-[#E5DFCF]">
          <span className="text-[10px] uppercase font-mono text-[#5E7A6E] block mb-0.5">
            Flat-Ground Sunset
          </span>
          <span className="font-serif text-base font-bold text-[#18221E]">
            {formatTime(flatSunsetTime)}
          </span>
          <span className="text-[10px] text-[#72807A] block mt-0.5">
            What weather apps show
          </span>
        </div>

        <div className="bg-[#FBF9F5] p-2.5 rounded-lg border border-[#E5DFCF]">
          <span className="text-[10px] uppercase font-mono text-[#5E7A6E] block mb-0.5">
            Sunlight Deficit
          </span>
          <span className="font-serif text-base font-bold text-[#C8622A]">
            -{sunlightDeficitMinutes} Minutes
          </span>
          <span className="text-[10px] text-[#C8622A] block mt-0.5 font-medium">
            Lost to mountain ridge
          </span>
        </div>

        <div className="bg-[#FBF9F5] p-2.5 rounded-lg border border-[#E5DFCF]">
          <span className="text-[10px] uppercase font-mono text-[#5E7A6E] block mb-0.5">
            Ridge Obstruction
          </span>
          <span className="font-serif text-base font-bold text-[#213B32]">
            +{barrierElevationAngle}° Barrier
          </span>
          <span className="text-[10px] text-[#5E7A6E] block mt-0.5">
            Above true horizon
          </span>
        </div>
      </div>
    </div>
  );
}
