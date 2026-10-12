import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header.jsx';
import { TrailSelector } from './components/TrailSelector.jsx';
import { SolarHorizonChart } from './components/SolarHorizonChart.jsx';
import { ExpeditionSlip } from './components/ExpeditionSlip.jsx';
import { PocketMode } from './components/PocketMode.jsx';
import { ArchitectureModal } from './components/ArchitectureModal.jsx';
import { DEFAULT_TRAIL, TRAILS } from './utils/trailData.js';
import { calculateRidgeShadowIntersection } from './utils/terrainEngine.js';
import { generateExpeditionBriefing } from './utils/digitalOceanClient.js';
import { Compass, Mountain, Sun, Sparkles, ExternalLink, Heart } from 'lucide-react';

export function App() {
  const [selectedTrail, setSelectedTrail] = useState(DEFAULT_TRAIL);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customCoords, setCustomCoords] = useState({
    lat: 40.0,
    lon: -105.3,
    barrierAngle: 18
  });

  const [briefingData, setBriefingData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [isPocketMode, setIsPocketMode] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

  // DigitalOcean settings
  const [apiKey, setApiKey] = useState('');
  const [endpoint, setEndpoint] = useState('https://inference.digitalocean.com/v1/chat/completions');
  const [model, setModel] = useState('gemma-4-31B-it');

  // Compute active trail configuration
  const activeTrail = useMemo(() => {
    if (!isCustomMode) return selectedTrail;
    return {
      id: 'custom-trail',
      name: `Custom Waypoint (${customCoords.lat.toFixed(2)}°, ${customCoords.lon.toFixed(2)}°)`,
      location: 'Custom Backcountry GPS',
      coordinates: { lat: customCoords.lat, lon: customCoords.lon },
      baseElevationFt: 4500,
      peakElevationFt: 6200,
      lengthMiles: 4.0,
      difficulty: 'Custom Expedition',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      description: `Custom expedition route with western topographic ridgeline obstacle of +${customCoords.barrierAngle}°.`,
      horizonProfile: [
        { azimuth: 0, elevationAngle: 4 },
        { azimuth: 90, elevationAngle: 2 },
        { azimuth: 180, elevationAngle: 8 },
        { azimuth: 220, elevationAngle: Math.max(0, customCoords.barrierAngle - 4) },
        { azimuth: 250, elevationAngle: customCoords.barrierAngle },
        { azimuth: 280, elevationAngle: customCoords.barrierAngle },
        { azimuth: 360, elevationAngle: 4 }
      ],
      primaryHazard: 'Unsurveyed terrain; early valley shadow.',
      recommendedTurnaroundTimeMinutesBeforeShadow: 40
    };
  }, [isCustomMode, selectedTrail, customCoords]);

  // Execute astronomical & terrain calculations
  const calculations = useMemo(() => {
    return calculateRidgeShadowIntersection(
      activeTrail.coordinates.lat,
      activeTrail.coordinates.lon,
      selectedDate,
      activeTrail.horizonProfile
    );
  }, [activeTrail, selectedDate]);

  // Generate expedition briefing via DigitalOcean client
  const runBriefing = async () => {
    setIsGenerating(true);
    try {
      const result = await generateExpeditionBriefing({
        trail: activeTrail,
        calculations,
        selectedDate,
        apiKey,
        endpoint,
        model
      });
      setBriefingData(result);
    } catch (err) {
      console.error('Error generating briefing:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Re-run briefing on trail or date change
  useEffect(() => {
    runBriefing();
  }, [activeTrail, calculations]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Pocket Mode Overlay */}
      {isPocketMode && (
        <PocketMode
          trail={activeTrail}
          calculations={calculations}
          briefingData={briefingData}
          onClose={() => setIsPocketMode(false)}
        />
      )}

      {/* Architecture Inspector Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
        apiKey={apiKey}
        onChangeApiKey={setApiKey}
        endpoint={endpoint}
        onChangeEndpoint={setEndpoint}
        model={model}
        onChangeModel={setModel}
      />

      {/* Top Navigation */}
      <Header
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onTogglePocketMode={() => setIsPocketMode(true)}
        isPocketMode={isPocketMode}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full">
        {/* Natural Hero Intro Banner */}
        <section className="mb-10 text-center max-w-3xl mx-auto no-print">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5DFCF]/60 border border-[#D8D0BF] text-xs font-mono text-[#213B32] mb-3">
            <Sun className="w-3.5 h-3.5 text-[#D97724]" />
            <span>Hacktoberfest 2026 Week 1 · Theme: Touch Grass</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-[#18221E] font-bold tracking-tight mb-3 leading-tight">
            Step Away From the Screen. <br className="hidden sm:inline" />
            Navigate by the Ridge Line.
          </h1>

          <p className="text-sm sm:text-base text-[#4A5852] leading-relaxed">
            Standard weather apps assume a flat sea-level horizon. In mountain valleys, ridgelines steal sunlight <strong>40 to 90 minutes early</strong>, plunging trails into freezing shadow. SolTerra computes your true daylight window in 30 seconds so you can pocket your phone, step into the backcountry, and touch grass.
          </p>
        </section>

        {/* Step 1: Trail Selection */}
        <TrailSelector
          selectedTrail={selectedTrail}
          onSelectTrail={setSelectedTrail}
          selectedDate={selectedDate}
          onChangeDate={setSelectedDate}
          isCustomMode={isCustomMode}
          onToggleCustomMode={setIsCustomMode}
          customCoords={customCoords}
          onChangeCustomCoords={setCustomCoords}
        />

        {/* Step 2: Solar Horizon Chart */}
        <SolarHorizonChart
          trail={activeTrail}
          calculations={calculations}
          selectedDate={selectedDate}
        />

        {/* Step 3: Tactile Mountain Field Card (Expedition Slip) */}
        <ExpeditionSlip
          trail={activeTrail}
          calculations={calculations}
          briefingData={briefingData}
          isGenerating={isGenerating}
          onRegenerate={runBriefing}
          onActivatePocketMode={() => setIsPocketMode(true)}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5DFCF] bg-[#F4F0E8] py-8 px-4 sm:px-8 text-xs text-[#5E7A6E] no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#D97724]" />
            <span className="font-serif font-bold text-sm text-[#18221E]">SolTerra</span>
            <span>· Built for the Hacktoberfest 2026 Open-Source AI Challenge</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center font-mono text-[11px]">
            <span>Category: Best Use of DigitalOcean</span>
            <span>·</span>
            <span>NOAA Astronomical Algorithms</span>
            <span>·</span>
            <span className="text-[#213B32] font-semibold">100% Offline-Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
