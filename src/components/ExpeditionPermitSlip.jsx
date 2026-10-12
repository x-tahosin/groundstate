'use client';
import React from 'react';
import { Printer, Download, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatTime } from '../utils/terrainEngine.js';

export default function ExpeditionPermitSlip({ trail, solarData, ridgeData, inferenceData }) {
  const handlePrint = () => {
    window.print();
  };

  const handleExportHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SolTerra Alpine Permit — ${trail.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "JetBrains Mono", monospace; background: #fff; color: #111; padding: 32px; max-width: 520px; margin: 0 auto; line-height: 1.5; border: 3px solid #0f172a; }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
    h1 { font-size: 18px; margin: 0; text-transform: uppercase; letter-spacing: 2px; }
    .sub { font-size: 11px; color: #64748b; margin-top: 4px; }
    .row { display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding: 8px 0; font-size: 13px; }
    .val { font-weight: 800; font-family: monospace; }
    .alert-box { background: #fef2f2; border: 1px solid #f87171; color: #991b1b; padding: 12px; margin-top: 20px; border-radius: 4px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>SOLTERRA EXPEDITION PERMIT</h1>
    <div class="sub">${trail.name.toUpperCase()} • ${trail.region.toUpperCase()}</div>
  </div>
  <div class="row"><span>COORDINATES</span><span class="val">${trail.latitude.toFixed(4)}°N, ${Math.abs(trail.longitude).toFixed(4)}°W</span></div>
  <div class="row"><span>SUMMIT ALTITUDE</span><span class="val">${trail.elevationMeters}M</span></div>
  <div class="row"><span>WEST RIDGE BARRIER</span><span class="val">${trail.westernBarrierObstructionAngle}° HORIZON</span></div>
  <div class="row"><span>ASTRONOMICAL SUNSET</span><span class="val">${solarData?.sunset ? formatTime(solarData.sunset, trail.timeZone) : '18:28'}</span></div>
  <div class="row"><span>RIDGE SHADOW CUTOFF</span><span class="val" style="color: #dc2626;">${ridgeData?.ridgeShadowTime ? formatTime(ridgeData.ridgeShadowTime, trail.timeZone) : '16:10'}</span></div>
  <div class="row"><span>MOUNTAIN DEFICIT</span><span class="val" style="color: #dc2626;">-${ridgeData?.sunlightDeficitMinutes || 138} MIN LOSS</span></div>
  <div class="row"><span>STRICT TURNAROUND CUE</span><span class="val" style="color: #15803d;">${inferenceData?.turnaroundFormatted || '15:25'}</span></div>
  <div class="alert-box">
    <strong>SAFETY DIRECTIVE:</strong> Ambient temperature plunges 6°C–8°C within 15 minutes of ridge shadow. Stow screen and commence descent before the shadow line hits.
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solterra-permit-${trail.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="expedition-permit-card">
      <div>
        <div className="permit-header-title">
          <MapPin size={20} color="var(--solar-flame)" />
          <span>{trail.name.toUpperCase()} EXPEDITION PERMIT</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
          {trail.region} • {trail.elevationMeters}M SUMMIT • {trail.westernBarrierObstructionAngle}° HORIZON BARRIER
        </div>

        <div className="permit-grid-data">
          <div>
            <div className="permit-cell-label">RIDGE SHADOW CUTOFF</div>
            <div className="permit-cell-value" style={{ color: '#dc2626' }}>
              {ridgeData?.ridgeShadowTime ? formatTime(ridgeData.ridgeShadowTime, trail.timeZone) : '16:10'}
            </div>
          </div>

          <div>
            <div className="permit-cell-label">MOUNTAIN DEFICIT</div>
            <div className="permit-cell-value" style={{ color: '#dc2626' }}>
              -{ridgeData?.sunlightDeficitMinutes || 138} MIN
            </div>
          </div>

          <div>
            <div className="permit-cell-label">VALLEY SUNSET</div>
            <div className="permit-cell-value">
              {solarData?.sunset ? formatTime(solarData.sunset, trail.timeZone) : '18:28'}
            </div>
          </div>

          <div>
            <div className="permit-cell-label">MANDATORY TURNAROUND</div>
            <div className="permit-cell-value" style={{ color: '#16a34a' }}>
              {inferenceData?.turnaroundFormatted || '15:25'}
            </div>
          </div>
        </div>
      </div>

      <div className="permit-actions">
        <button onClick={handlePrint} className="btn-permit-print">
          <Printer size={14} /> Print Permit
        </button>
        <button onClick={handleExportHTML} className="btn-permit-offline">
          <Download size={14} /> Offline Card
        </button>
      </div>
    </div>
  );
}
