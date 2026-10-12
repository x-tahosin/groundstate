'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, ArrowRight, Clock, Trees, Headphones, Sprout } from 'lucide-react';
import Header from '../components/Header.jsx';
import SensoryResetModal from '../components/SensoryResetModal.jsx';
import PocketModeModal from '../components/PocketModeModal.jsx';
import DigitalOceanAIModal from '../components/DigitalOceanAIModal.jsx';
import DemoVideoModal from '../components/DemoVideoModal.jsx';
import { getAssetPath } from '../utils/assetPath.js';

export default function HomePage() {
  const [showSensoryModal, setShowSensoryModal] = useState(false);
  const [showPocketMode, setShowPocketMode] = useState(false);
  const [showAIHUD, setShowAIHUD] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <>
      <Header
        onOpenPocketMode={() => setShowPocketMode(true)}
        onOpenAIHUD={() => setShowAIHUD(true)}
      />

      <main className="home-container">
        {/* Left Content Column */}
        <section className="home-left">
          <span className="overline-badge">
            STEP OUT. RESET. FEEL HUMAN AGAIN.
          </span>

          <h1 className="home-heading">
            Find green spaces<br />
            near you, reset in<br />
            <span className="highlight-mint">just 3 minutes.</span>
          </h1>

          <p className="home-description">
            GroundState helps developers and remote workers discover nearby peaceful green spaces and provides science-backed guided routines to reduce screen fatigue and mental burnout.
          </p>

          <div className="home-cta-group">
            <Link href="/explore" className="btn-primary-mint">
              Find Green Spaces <ArrowRight size={16} />
            </Link>

            <button
              className="btn-outline-dark"
              onClick={() => setShowDemoModal(true)}
            >
              <Play size={14} fill="currentColor" /> Watch Demo
            </button>
          </div>

          <div className="home-stats-row">
            <div className="stat-item">
              <span className="stat-value">5–15 min</span>
              <span className="stat-label">walking distance</span>
            </div>

            <div className="stat-divider" />

            <div className="stat-item">
              <span className="stat-value">3 min</span>
              <span className="stat-label">reset routine</span>
            </div>

            <div className="stat-divider" />

            <div className="stat-item">
              <span className="stat-value">Less fatigue</span>
              <span className="stat-label">more focus</span>
            </div>
          </div>
        </section>

        {/* Right Visual Column — Coder on park bench with Today's Suggestion card resting on the bench */}
        <section className="home-right">
          <div className="hero-visual-card">
            <img
              src={getAssetPath('/assets/coder_bench_perfect_hd.png')}
              alt="GroundState nature sanctuary with remote worker on park bench"
              className="hero-coder-bench-img"
            />

            {/* Real, Razor-Sharp Vector HTML Card Component */}
            <div className="hero-today-suggestion-card">
              <div className="suggestion-card-header">
                <div className="suggestion-badge-icon">
                  <Sprout size={13} color="#34e79a" strokeWidth={2.4} />
                </div>
                <span className="suggestion-header-title">Today's suggestion</span>
              </div>

              <div className="suggestion-thumbnail-wrap">
                <img
                  src={getAssetPath('/assets/central_park_garden_hd.jpg')}
                  alt="Central Park Garden walking path"
                  className="suggestion-thumb-img"
                />
              </div>

              <div className="suggestion-card-body">
                <div className="suggestion-info-col">
                  <h4 className="suggestion-place-name">Central Park Garden</h4>
                  <div className="suggestion-metrics-row">
                    <span className="suggestion-metric-item">
                      <Clock size={12} className="metric-icon" strokeWidth={2.2} /> 8 min
                    </span>
                    <span className="suggestion-metric-item">
                      <Trees size={12} className="metric-icon" strokeWidth={2.2} /> Shaded
                    </span>
                    <span className="suggestion-metric-item">
                      <Headphones size={12} className="metric-icon" strokeWidth={2.2} /> Quiet
                    </span>
                  </div>
                </div>

                <Link
                  href="/benefits"
                  className="suggestion-action-btn"
                  title="Start 3-Minute Reset for Central Park Garden"
                  aria-label="Start 3-Minute Reset for Central Park Garden"
                >
                  <ArrowRight size={20} strokeWidth={2.6} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Interactive Modals */}
      <SensoryResetModal
        isOpen={showSensoryModal}
        onClose={() => setShowSensoryModal(false)}
        initialPark="Central Park Garden"
      />
      <PocketModeModal
        isOpen={showPocketMode}
        onClose={() => setShowPocketMode(false)}
      />
      <DigitalOceanAIModal
        isOpen={showAIHUD}
        onClose={() => setShowAIHUD(false)}
      />
      <DemoVideoModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
      />
    </>
  );
}
