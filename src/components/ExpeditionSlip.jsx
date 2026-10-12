import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Sparkles, 
  Clock, 
  Thermometer, 
  ShieldAlert, 
  Compass, 
  PhoneOff,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { formatTime } from '../utils/terrainEngine.js';

export function ExpeditionSlip({
  trail,
  calculations,
  briefingData,
  isGenerating,
  onRegenerate,
  onActivatePocketMode
}) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const {
    ridgeShadowTime,
    flatSunsetTime,
    sunlightDeficitMinutes,
    thermalPlungeTime,
    goldenHourStartTime,
    barrierElevationAngle
  } = calculations;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadOfflineCard = () => {
    const offlineHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SolTerra Field Card — ${trail.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #FAF8F5; color: #1A2421; padding: 2rem; max-width: 600px; margin: 0 auto; line-height: 1.5; }
    .card { background: #FFFFFF; border: 2px solid #233F35; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .tag { font-family: monospace; font-size: 0.75rem; text-transform: uppercase; background: #EAE6DC; padding: 2px 6px; border-radius: 4px; }
    h1 { font-family: Georgia, serif; margin: 0.5rem 0 0.2rem 0; font-size: 1.4rem; }
    .loc { color: #5B6D64; font-size: 0.85rem; margin-bottom: 1rem; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem; }
    .stat { background: #F5F1E8; padding: 0.75rem; border-radius: 8px; border: 1px solid #E2DCD0; }
    .stat-label { font-size: 0.7rem; color: #5B6D64; text-transform: uppercase; font-family: monospace; }
    .stat-val { font-size: 1.15rem; font-weight: bold; color: #D97724; }
    .briefing { background: #F8F6F0; border-left: 4px solid #233F35; padding: 1rem; border-radius: 4px; font-size: 0.88rem; margin-top: 1rem; white-space: pre-line; }
    .footer { font-size: 0.75rem; color: #7B8C83; text-align: center; margin-top: 1.5rem; font-family: monospace; }
  </style>
</head>
<body>
  <div class="card">
    <span class="tag">SolTerra Backcountry Field Slip · Offline Autonomous</span>
    <h1>${trail.name}</h1>
    <div class="loc">${trail.location} · ${trail.peakElevationFt} ft Peak · Barrier: +${barrierElevationAngle}°</div>
    
    <div class="grid">
      <div class="stat">
        <div class="stat-label">Turnaround Cue</div>
        <div class="stat-val" style="color: #233F35;">${briefingData?.turnaroundFormatted || '--'}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Ridge Shadow Time</div>
        <div class="stat-val">${briefingData?.ridgeShadowFormatted || '--'}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Sunlight Deficit</div>
        <div class="stat-val" style="color: #C8622A;">-${sunlightDeficitMinutes} Minutes</div>
      </div>
      <div class="stat">
        <div class="stat-label">Thermal Plunge</div>
        <div class="stat-val" style="color: #5B6D64;">${briefingData?.thermalPlungeFormatted || '--'}</div>
      </div>
    </div>

    <strong>Ranger Open-Weight Briefing (DigitalOcean Inference):</strong>
    <div class="briefing">
${briefingData?.briefing || 'Review conditions before departure.'}
    </div>

    <div class="footer">
      Generated for Touch Grass Hacktoberfest 2026. Stow your phone. Step into nature.
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([offlineHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solterra-field-card-${trail.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="field-card p-5 sm:p-6 mb-8 border-2 border-[#E5DFCF]">
      {/* Header of Slip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5DFCF]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-tag badge-forest">
              Step 2 · SolTerra Expedition Briefing
            </span>
            <span className="badge-tag badge-amber">
              {briefingData?.mode === 'digitalocean-cloud' ? 'DO Serverless Inference' : 'Open Weights Edge Synthesizer'}
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#18221E]">
            Tactile Mountain Field Card
          </h3>
          <p className="text-xs text-[#5E7A6E]">
            Synthesized by open weights on DigitalOcean to keep your screen time under 30 seconds.
          </p>
        </div>

        {/* Action Button Strip */}
        <div className="flex items-center gap-2 flex-wrap no-print">
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1.5"
            title="Re-run synthesis"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>

          <button
            onClick={handleDownloadOfflineCard}
            className="btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1.5"
            title="Download offline self-contained HTML card"
          >
            {downloadSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{downloadSuccess ? 'Saved Slip' : 'Offline Card'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1.5"
            title="Print printable card"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={onActivatePocketMode}
            className="btn-sun text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-sm"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>Pocket Phone & Go</span>
          </button>
        </div>
      </div>

      {/* The Printable Pocket Slip Card */}
      <div className="printable-pocket-slip mt-4 p-5 rounded-xl bg-[#FFFDF9] border border-[#E5DFCF] shadow-inner">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div>
            <h4 className="font-serif text-lg font-bold text-[#18221E]">
              {trail.name}
            </h4>
            <p className="text-xs font-mono text-[#5E7A6E]">
              {trail.location} · {trail.peakElevationFt.toLocaleString()} ft · Obstruction +{barrierElevationAngle}°
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-[#D97724] bg-[#F4F0E8] px-2 py-0.5 rounded border border-[#E5DFCF]">
              Deficit: -{sunlightDeficitMinutes}m Direct Sun
            </span>
          </div>
        </div>

        {/* 4 Essential Outdoor Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          <div className="p-3 rounded-lg bg-[#FBF9F5] border border-[#E5DFCF]">
            <div className="flex items-center gap-1 text-[10px] uppercase font-mono text-[#5E7A6E] mb-1">
              <Clock className="w-3 h-3 text-[#213B32]" />
              <span>Turnaround Cue</span>
            </div>
            <div className="font-serif text-base font-bold text-[#213B32]">
              {briefingData?.turnaroundFormatted || '--'}
            </div>
            <span className="text-[10px] text-[#5E7A6E]">
              Strict return deadline
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#FBF9F5] border border-[#E5DFCF]">
            <div className="flex items-center gap-1 text-[10px] uppercase font-mono text-[#5E7A6E] mb-1">
              <Sparkles className="w-3 h-3 text-[#D97724]" />
              <span>Ridge Shadow</span>
            </div>
            <div className="font-serif text-base font-bold text-[#D97724]">
              {briefingData?.ridgeShadowFormatted || '--'}
            </div>
            <span className="text-[10px] text-[#4A5852]">
              Sun disappears behind rock
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#FBF9F5] border border-[#E5DFCF]">
            <div className="flex items-center gap-1 text-[10px] uppercase font-mono text-[#5E7A6E] mb-1">
              <Thermometer className="w-3 h-3 text-[#C8622A]" />
              <span>Thermal Plunge</span>
            </div>
            <div className="font-serif text-base font-bold text-[#C8622A]">
              {briefingData?.thermalPlungeFormatted || '--'}
            </div>
            <span className="text-[10px] text-[#C8622A]">
              12°F–16°F sudden drop
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#FBF9F5] border border-[#E5DFCF]">
            <div className="flex items-center gap-1 text-[10px] uppercase font-mono text-[#5E7A6E] mb-1">
              <Compass className="w-3 h-3 text-[#5E7A6E]" />
              <span>Golden Window</span>
            </div>
            <div className="font-serif text-base font-bold text-[#18221E]">
              {briefingData?.goldenHourFormatted || '--'}
            </div>
            <span className="text-[10px] text-[#5E7A6E]">
              Natural photography light
            </span>
          </div>
        </div>

        {/* AI Briefing Narrative Box */}
        <div className="bg-[#F8F6F0] p-4 rounded-lg border-l-4 border-[#213B32] text-xs text-[#18221E] font-medium leading-relaxed">
          <div className="text-[10px] uppercase font-mono text-[#5E7A6E] font-bold mb-2 flex items-center justify-between">
            <span>Ranger Directives (DigitalOcean Open-Weights Inference)</span>
            <span className="text-[#D97724]">{briefingData?.latencyMs} ms · ${briefingData?.costUsd}</span>
          </div>
          {isGenerating ? (
            <div className="py-4 text-center text-[#5E7A6E] flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#D97724]" />
              <span>Querying DigitalOcean Serverless Inference...</span>
            </div>
          ) : (
            <div className="whitespace-pre-line space-y-1">
              {briefingData?.briefing}
            </div>
          )}
        </div>

        {/* Primary Mountain Hazard Note */}
        <div className="mt-3 flex items-start gap-2 text-xs text-[#C8622A] bg-[#FFF8F3] p-2.5 rounded-lg border border-[#FADECB]">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>Primary Terrain Hazard:</strong> {trail.primaryHazard}
          </span>
        </div>
      </div>
    </div>
  );
}
