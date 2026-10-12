import React from 'react';
import { MapPin, Mountain, ArrowUpRight, Calendar, Sliders } from 'lucide-react';
import { TRAILS } from '../utils/trailData.js';

export function TrailSelector({
  selectedTrail,
  onSelectTrail,
  selectedDate,
  onChangeDate,
  isCustomMode,
  onToggleCustomMode,
  customCoords,
  onChangeCustomCoords
}) {
  return (
    <section className="mb-8 no-print">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <span className="badge-tag badge-forest mb-1.5">
            Step 1 · Alpine Route & Horizon Coordinates
          </span>
          <h2 className="text-2xl font-serif text-[#18221E] font-bold">
            Select Your Mountain Trail
          </h2>
          <p className="text-sm text-[#4A5852] max-w-xl">
            Surrounding ridges obstruct the setting sun long before the astronomical horizon. Select a mountain trail to analyze its topographic ridge shadow.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-[#F4F0E8] border border-[#E5DFCF] p-2 rounded-xl">
          <Calendar className="w-4 h-4 text-[#D97724]" />
          <label className="text-xs font-semibold text-[#4A5852] uppercase font-mono">
            Hike Date:
          </label>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => {
              if (e.target.value) {
                const parts = e.target.value.split('-');
                const newD = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 12, 0, 0));
                onChangeDate(newD);
              }
            }}
            className="bg-[#FBF9F5] border border-[#D8D0BF] text-xs font-mono rounded px-2 py-1 text-[#18221E] focus:outline-none focus:border-[#D97724]"
          />
        </div>
      </div>

      {/* Trail Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TRAILS.map((trail) => {
          const isSelected = selectedTrail.id === trail.id && !isCustomMode;
          // Maximum ridge barrier in the western sector (220° - 300°)
          const westernObstruction = Math.max(
            ...trail.horizonProfile
              .filter((p) => p.azimuth >= 220 && p.azimuth <= 300)
              .map((p) => p.elevationAngle)
          );

          return (
            <div
              key={trail.id}
              onClick={() => {
                onToggleCustomMode(false);
                onSelectTrail(trail);
              }}
              className={`field-card field-card-interactive cursor-pointer overflow-hidden flex flex-col justify-between border-2 transition-all ${
                isSelected
                  ? 'border-[#D97724] ring-2 ring-[#D97724]/20 shadow-md bg-[#FFFDF9]'
                  : 'border-[#E5DFCF] hover:border-[#D8D0BF]'
              }`}
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={trail.image}
                  alt={trail.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#162822]/80 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-[#162822]/80 backdrop-blur-sm border border-white/20">
                    {trail.difficulty}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#E89A3C]">
                    +{westernObstruction}° Ridge Barrier
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#18221E] leading-snug mb-1">
                    {trail.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#5E7A6E] mb-2 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#D97724] shrink-0" />
                    <span className="truncate">{trail.location}</span>
                  </div>
                  <p className="text-xs text-[#4A5852] line-clamp-2 mb-3">
                    {trail.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E5DFCF] flex items-center justify-between text-xs font-mono text-[#5E7A6E]">
                  <span className="flex items-center gap-1">
                    <Mountain className="w-3.5 h-3.5" />
                    {trail.peakElevationFt.toLocaleString()} ft
                  </span>
                  <span>{trail.lengthMiles} miles</span>
                  <span className="text-[#D97724] font-semibold flex items-center">
                    Select <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Custom Coordinates Card */}
        <div
          onClick={() => onToggleCustomMode(true)}
          className={`field-card field-card-interactive cursor-pointer p-5 flex flex-col justify-between border-2 border-dashed ${
            isCustomMode
              ? 'border-[#D97724] bg-[#FFFDF9] ring-2 ring-[#D97724]/20'
              : 'border-[#D8D0BF] hover:border-[#D97724]'
          }`}
        >
          <div>
            <div className="w-9 h-9 rounded-lg bg-[#F4F0E8] border border-[#E5DFCF] flex items-center justify-center text-[#213B32] mb-3">
              <Sliders className="w-5 h-5 text-[#D97724]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#18221E] mb-1">
              Custom Trail Coordinates
            </h3>
            <p className="text-xs text-[#4A5852] mb-3">
              Input custom backcountry GPS coordinates and estimated western mountain ridge obstruction angle.
            </p>
          </div>

          {isCustomMode && (
            <div className="space-y-2.5 pt-2 border-t border-[#E5DFCF]" onClick={(e) => e.stopPropagation()}>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <label className="text-[10px] text-[#5E7A6E] block mb-0.5">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={customCoords.lat}
                    onChange={(e) => onChangeCustomCoords({ ...customCoords, lat: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#FBF9F5] border border-[#D8D0BF] rounded px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#5E7A6E] block mb-0.5">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={customCoords.lon}
                    onChange={(e) => onChangeCustomCoords({ ...customCoords, lon: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#FBF9F5] border border-[#D8D0BF] rounded px-2 py-1 text-xs"
                  />
                </div>
              </div>
              <div className="text-xs font-mono">
                <label className="text-[10px] text-[#5E7A6E] block mb-0.5">
                  West Barrier Angle: {customCoords.barrierAngle}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="35"
                  value={customCoords.barrierAngle}
                  onChange={(e) => onChangeCustomCoords({ ...customCoords, barrierAngle: parseInt(e.target.value) || 0 })}
                  className="w-full accent-[#D97724]"
                />
              </div>
            </div>
          )}

          {!isCustomMode && (
            <span className="text-xs font-mono text-[#D97724] font-semibold flex items-center pt-3 border-t border-[#E5DFCF]">
              Configure GPS <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
