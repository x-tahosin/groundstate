'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Footprints, 
  Flower2, 
  Brain, 
  Eye, 
  Headphones, 
  Leaf, 
  ArrowRight,
  Play,
  Volume2
} from 'lucide-react';
import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
import SensoryResetModal from '../../components/SensoryResetModal.jsx';
import PocketModeModal from '../../components/PocketModeModal.jsx';
import DigitalOceanAIModal from '../../components/DigitalOceanAIModal.jsx';

export default function HowItWorksPage() {
  const [showSensoryModal, setShowSensoryModal] = useState(false);
  const [showPocketMode, setShowPocketMode] = useState(false);
  const [showAIHUD, setShowAIHUD] = useState(false);

  return (
    <>
      <Header
        onOpenPocketMode={() => setShowPocketMode(true)}
        onOpenAIHUD={() => setShowAIHUD(true)}
      />

      <main className="how-it-works-container">
        {/* Header Block */}
        <section className="how-header-block">
          <h1 className="how-main-title">A simple flow to a calmer, sharper you</h1>
          <p className="how-sub-title">From finding a nearby green space to a guided 3-minute reset.</p>
        </section>

        {/* 4-Step Timeline Sequence */}
        <section className="steps-timeline-row">
          {/* Step 1 */}
          <div className="step-item-card">
            <div className="step-icon-circle">
              <MapPin size={26} />
            </div>
            <div className="step-number-tag">1</div>
            <h3 className="step-title">Find nearby<br />green spaces</h3>
            <p className="step-text">See parks and quiet spots within a 5–15 minute walk.</p>
          </div>

          <div className="steps-arrow-divider">››</div>

          {/* Step 2 */}
          <div className="step-item-card">
            <div className="step-icon-circle">
              <Footprints size={26} />
            </div>
            <div className="step-number-tag">2</div>
            <h3 className="step-title">Take a short walk</h3>
            <p className="step-text">Follow the route and put your phone away.</p>
          </div>

          <div className="steps-arrow-divider">››</div>

          {/* Step 3 */}
          <div className="step-item-card">
            <div className="step-icon-circle">
              <Flower2 size={26} />
            </div>
            <div className="step-number-tag">3</div>
            <h3 className="step-title">Follow a 3-minute<br />reset routine</h3>
            <p className="step-text">Get a personalized guided routine based on your current state.</p>
          </div>

          <div className="steps-arrow-divider">››</div>

          {/* Step 4 */}
          <div className="step-item-card">
            <div className="step-icon-circle">
              <Brain size={26} />
            </div>
            <div className="step-number-tag">4</div>
            <h3 className="step-title">Feel refreshed<br />and focused</h3>
            <p className="step-text">Reduce eye strain, clear your mind, and return with more energy.</p>
          </div>
        </section>

        {/* Lower Grid: Interactive Phone Mockup + Science-Backed Routine Cards */}
        <section className="how-lower-grid">
          {/* Left Column: Phone Mockup */}
          <div 
            className="phone-mockup-frame"
            onClick={() => setShowSensoryModal(true)}
            style={{ cursor: 'pointer' }}
            title="Click to start live 3-minute reset"
          >
            <img
              src="/assets/phone_mockup_clean.png"
              alt="3-Minute Reset Screen on Smartphone"
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '24px' }}
            />
          </div>

          {/* Right Column: 3 Routine Cards */}
          <div className="how-routine-col">
            <h2 className="how-routine-heading">
              A science-backed routine<br />for your mind and eyes
            </h2>

            <div className="routine-cards-row">
              {/* Card 1: Optic Reset */}
              <div
                className="routine-pillar-card"
                onClick={() => setShowSensoryModal(true)}
                style={{ cursor: 'pointer' }}
              >
                <Eye className="pillar-icon" />
                <h3 className="pillar-title">Optic Reset</h3>
                <p className="pillar-desc">Relax your eyes and reduce strain.</p>
              </div>

              {/* Card 2: Acoustic Relaxation */}
              <div
                className="routine-pillar-card"
                onClick={() => setShowSensoryModal(true)}
                style={{ cursor: 'pointer' }}
              >
                <Headphones className="pillar-icon" />
                <h3 className="pillar-title">Acoustic Relaxation</h3>
                <p className="pillar-desc">Focus on natural sounds around you.</p>
              </div>

              {/* Card 3: Physical Sto Mode */}
              <div
                className="routine-pillar-card"
                onClick={() => setShowPocketMode(true)}
                style={{ cursor: 'pointer' }}
              >
                <Leaf className="pillar-icon" />
                <h3 className="pillar-title">Physical Sto Mode</h3>
                <p className="pillar-desc">Disconnect, breathe and be present.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <SensoryResetModal
        isOpen={showSensoryModal}
        onClose={() => setShowSensoryModal(false)}
        initialPark="Botanical Sanctuary"
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
