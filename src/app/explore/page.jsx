'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, MapPin, Sparkles, Navigation, Layers, Volume2, TreePine, Sun } from 'lucide-react';
import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
import SensoryResetModal from '../../components/SensoryResetModal.jsx';
import PocketModeModal from '../../components/PocketModeModal.jsx';
import DigitalOceanAIModal from '../../components/DigitalOceanAIModal.jsx';
import { BASELINE_PARKS, enrichParksWithUserDistance } from '../../lib/geospatialService.js';

export default function ExplorePage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeRadius, setActiveRadius] = useState('15 min');
  const [selectedParkId, setSelectedParkId] = useState('botanical');
  const [showSensoryModal, setShowSensoryModal] = useState(false);
  const [showPocketMode, setShowPocketMode] = useState(false);
  const [showAIHUD, setShowAIHUD] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 40.7829, lng: -73.9654 });
  const [parks, setParks] = useState(enrichParksWithUserDistance(BASELINE_PARKS, 40.7829, -73.9654));
  const [isLoading, setIsLoading] = useState(false);

  // Request real user geolocation on mount
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          // Fallback to Central Park area coordinates if permission denied
          setUserLocation({ lat: 40.7829, lng: -73.9654 });
        },
        { timeout: 7000 }
      );
    }
  }, []);

  // Fetch real green spaces when location, radius, or filter changes
  useEffect(() => {
    let isCancelled = false;
    const radiusMeters = activeRadius === '5 min' ? 500 : activeRadius === '10 min' ? 1000 : 1500;

    async function loadPlaces() {
      setIsLoading(true);
      try {
        const query = new URLSearchParams({
          lat: String(userLocation.lat),
          lng: String(userLocation.lng),
          radius: String(radiusMeters),
          filter: activeFilter,
        });

        const res = await fetch(`/api/places/?${query.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!isCancelled && data.parks && data.parks.length > 0) {
          // Ensure pin coords exist for radar map visualization
          const defaultPins = [
            { top: '32%', left: '72%' },
            { top: '44%', left: '52%' },
            { top: '54%', left: '88%' },
            { top: '78%', left: '55%' },
            { top: '25%', left: '42%' },
            { top: '65%', left: '35%' },
          ];

          const prepared = data.parks.map((p, idx) => ({
            ...p,
            pinCoords: p.pinCoords || defaultPins[idx % defaultPins.length],
            thumb: p.thumb || (idx % 2 === 0 ? '/assets/thumb_botanical_sm.png' : '/assets/thumb_central_park.png'),
          }));

          setParks(prepared);
          if (!prepared.some((p) => p.id === selectedParkId)) {
            setSelectedParkId(prepared[0]?.id || 'botanical');
          }
        }
      } catch (err) {
        console.warn('Live places fetch fallback:', err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadPlaces();
    return () => {
      isCancelled = true;
    };
  }, [userLocation, activeRadius, activeFilter]);

  const filteredParks = parks.filter((park) => {
    if (activeFilter === 'All') return true;
    if (park.filterType && park.filterType.includes(activeFilter)) return true;
    if (activeFilter === 'Shaded' && park.canopyPercent >= 65) return true;
    if (activeFilter === 'Sunlit' && park.canopyPercent < 65) return true;
    if (activeFilter === 'Quiet' && park.ambientDecibels <= 45) return true;
    return false;
  });

  const selectedPark = filteredParks.find((p) => p.id === selectedParkId) || filteredParks[0] || parks[0];

  return (
    <>
      <Header
        onOpenPocketMode={() => setShowPocketMode(true)}
        onOpenAIHUD={() => setShowAIHUD(true)}
      />

      <div className="explore-container">
        {/* Left Sidebar: Filters & Park Cards */}
        <aside className="explore-sidebar">
          <h1 className="explore-title">Green spaces around you</h1>
          <p className="explore-subtitle">Find peaceful places within a 5–15 minute walk.</p>

          {/* Filter Chips */}
          <div className="filter-chips-row">
            <button
              className={`filter-chip ${activeFilter === 'All' ? 'active' : ''}`}
              onClick={() => setActiveFilter('All')}
            >
              <Layers size={14} /> All
            </button>
            <button
              className={`filter-chip ${activeFilter === 'Shaded' ? 'active' : ''}`}
              onClick={() => setActiveFilter('Shaded')}
            >
              <TreePine size={14} /> Shaded
            </button>
            <button
              className={`filter-chip ${activeFilter === 'Sunlit' ? 'active' : ''}`}
              onClick={() => setActiveFilter('Sunlit')}
            >
              <Sun size={14} /> Sunlit
            </button>
            <button
              className={`filter-chip ${activeFilter === 'Quiet' ? 'active' : ''}`}
              onClick={() => setActiveFilter('Quiet')}
            >
              <Volume2 size={14} /> Quiet
            </button>
          </div>

          {/* Parks List */}
          <div className="parks-list">
            {filteredParks.map((park) => {
              const isSelected = park.id === selectedParkId;
              return (
                <div
                  key={park.id}
                  className={`park-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedParkId(park.id)}
                >
                  <div className="park-thumb">
                    <img src={park.thumb} alt={park.name} />
                  </div>

                  <div className="park-details">
                    <h3 className="park-name">{park.name}</h3>
                    <div className="park-metrics">
                      {park.walkTime} • {park.canopy} • {park.decibels}
                    </div>
                    <div className="park-tags">
                      {park.tags.map((tag) => (
                        <span key={tag} className="tag-badge">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ChevronRight className="park-arrow" />
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Panel: Radar Map Visual & Interactive Markers */}
        <main className="explore-map-view">
          <img
            src="/assets/radar_map_clean.jpg"
            alt="Dark styled green space radar map"
            className="map-radar-bg"
          />

          {/* Radius Toggles (Top Right) */}
          <div className="radius-toggle-wrap">
            {['5 min', '10 min', '15 min'].map((radius) => (
              <button
                key={radius}
                className={`radius-btn ${activeRadius === radius ? 'active' : ''}`}
                onClick={() => setActiveRadius(radius)}
              >
                {radius}
              </button>
            ))}
          </div>

          {/* User Location Radar Pulse Center */}
          <div className="user-pulse-pin" title="Your current location" />
          <div className="user-pulse-ring" />
          <div className="user-pulse-ring-outer" />

          {/* Interactive Park Markers positioned on radar map */}
          {filteredParks.map((park) => {
            const isSelected = park.id === selectedParkId;
            return (
              <div
                key={park.id}
                className="map-park-marker"
                style={{
                  top: park.pinCoords.top,
                  left: park.pinCoords.left,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => setSelectedParkId(park.id)}
              >
                <div
                  className="marker-icon-glow"
                  style={{
                    background: isSelected ? 'rgba(52, 231, 154, 0.4)' : 'rgba(52, 231, 154, 0.15)',
                    borderColor: '#34e79a',
                  }}
                >
                  <MapPin size={16} />
                </div>

                <div
                  className="marker-badge"
                  style={{
                    background: isSelected ? '#34e79a' : '#091712',
                    color: isSelected ? '#06150e' : '#34e79a',
                  }}
                >
                  {park.markerLabel}
                </div>
              </div>
            );
          })}

          {/* Floating Directions Card (Bottom Right) */}
          <div className="explore-floating-card">
            <div className="float-card-thumb">
              <img src={selectedPark.thumb} alt={selectedPark.name} />
            </div>

            <div className="float-card-info">
              <span className="float-walk-time">
                Est. walking time
              </span>
              <span className="float-walk-title">
                {selectedPark.walkTime} ({selectedPark.distance})
              </span>
              <Link href="/benefits" className="btn-primary-mint" style={{ padding: '8px 16px', fontSize: '12.5px' }}>
                Get Directions <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </main>
      </div>

      <SensoryResetModal
        isOpen={showSensoryModal}
        onClose={() => setShowSensoryModal(false)}
        initialPark={selectedPark.name}
      />
      <PocketModeModal
        isOpen={showPocketMode}
        onClose={() => setShowPocketMode(false)}
      />
      <DigitalOceanAIModal
        isOpen={showAIHUD}
        onClose={() => setShowAIHUD(false)}
      />
    </>
  );
}
