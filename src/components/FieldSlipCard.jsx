import React from 'react';
import { Printer, Download, MapPin, Sun, Clock, ShieldAlert } from 'lucide-react';
import { formatTime } from '../utils/terrainEngine.js';

export default function FieldSlipCard({ trail, currentHour, solarData, ridgeData, inferenceData }) {
  const handlePrint = () => {
    window.print();
  };

  const handleExportHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SolTerra Expedition Slip — ${trail.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "JetBrains Mono", monospace; background: #fff; color: #111; padding: 24px; max-width: 480px; margin: 0 auto; line-height: 1.4; border: 2px dashed #333; }
    h1 { font-size: 16px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 1px; }
    .tag { font-size: 11px; color: #666; margin-bottom: 16px; }
    .row { display: flex; justify-content: space-between; border-bottom: 1px solid #ddd; padding: 6px 0; font-size: 13px; }
    .val { font-weight: bold; }
    .alert { background: #fee2e2; border-left: 4px solid #ef4444; padding: 8px; margin-top: 16px; font-size: 12px; }
  </style>
</head>
<body>
  <h1>SOLTERRA FIELD SLIP</h1>
  <div class="tag">${trail.name} • ${trail.region}</div>
  <div class="row"><span>COORDINATES</span><span class="val">${trail.latitude.toFixed(4)}°N, ${Math.abs(trail.longitude).toFixed(4)}°W</span></div>
  <div class="row"><span>SUMMIT ELEVATION</span><span class="val">${trail.elevationMeters}m</span></div>
  <div class="row"><span>WEST RIDGE BARRIER</span><span class="val">${trail.westernBarrierObstructionAngle}°</span></div>
  <div class="row"><span>CIVIL SUNSET</span><span class="val">${solarData?.sunset ? formatTime(solarData.sunset, trail.timeZone) : '18:30'}</span></div>
  <div class="row"><span>RIDGE SHADOW CUTOFF</span><span class="val" style="color: #b91c1c;">${ridgeData?.ridgeShadowTime ? formatTime(ridgeData.ridgeShadowTime, trail.timeZone) : '17:16'}</span></div>
  <div class="row"><span>DAYLIGHT DEFICIT</span><span class="val" style="color: #b91c1c;">-${ridgeData?.sunlightDeficitMinutes || 74} MIN</span></div>
  <div class="row"><span>MANDATORY TURNAROUND</span><span class="val">${inferenceData?.turnaroundFormatted || '15:45'}</span></div>
  <div class="alert">
    <strong>SAFETY NOTICE:</strong> Temperature plunges 6-8°C upon ridge shadow. Stow screen and descend before true cutoff.
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solterra-slip-${trail.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tactile-slip-container">
      <div>
        <div className="slip-title">
          <MapPin size={18} color="#ff8426" />
          <span>{trail.name.toUpperCase()} FIELD SLIP</span>
        </div>
        <div style={{ fontSize: '11px', color: '#4b5563', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
          {trail.region} • {trail.elevationMeters}M SUMMIT • {trail.westernBarrierObstructionAngle}° WEST BARRIER
        </div>

        <div className="slip-metric-row">
          <div className="slip-metric-col">
            <span className="slip-metric-label">RIDGE SHADOW CUTOFF</span>
            <span className="slip-metric-val" style={{ color: '#dc2626' }}>
              {ridgeData?.ridgeShadowTime ? formatTime(ridgeData.ridgeShadowTime, trail.timeZone) : '17:16'}
            </span>
          </div>

          <div className="slip-metric-col">
            <span className="slip-metric-label">SUNLIGHT DEFICIT</span>
            <span className="slip-metric-val" style={{ color: '#dc2626' }}>
              -{ridgeData?.sunlightDeficitMinutes || 74} MIN
            </span>
          </div>

          <div className="slip-metric-col">
            <span className="slip-metric-label">CIVIL SUNSET</span>
            <span className="slip-metric-val">
              {solarData?.sunset ? formatTime(solarData.sunset, trail.timeZone) : '18:30'}
            </span>
          </div>

          <div className="slip-metric-col">
            <span className="slip-metric-label">TURNAROUND CUE</span>
            <span className="slip-metric-val">
              {inferenceData?.turnaroundFormatted || '15:45'}
            </span>
          </div>
        </div>
      </div>

      <div className="slip-actions">
        <button onClick={handlePrint} className="slip-btn-action slip-btn-print">
          <Printer size={14} /> Print Slip
        </button>
        <button onClick={handleExportHTML} className="slip-btn-action slip-btn-export">
          <Download size={14} /> Offline Card
        </button>
      </div>
    </div>
  );
}
