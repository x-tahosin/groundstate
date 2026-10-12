'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  Bookmark, 
  Download, 
  Share2, 
  Check, 
  Eye, 
  Headphones, 
  Leaf, 
  Sparkles 
} from 'lucide-react';
import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
import SensoryResetModal from '../../components/SensoryResetModal.jsx';
import PocketModeModal from '../../components/PocketModeModal.jsx';
import DigitalOceanAIModal from '../../components/DigitalOceanAIModal.jsx';
import OfflineCardModal from '../../components/OfflineCardModal.jsx';
import { isParkBookmarked, toggleParkBookmark } from '../../lib/offlineStorage.js';
import { getAssetPath } from '../../utils/assetPath.js';

export default function BenefitsPage() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [showSensoryModal, setShowSensoryModal] = useState(false);
  const [showPocketMode, setShowPocketMode] = useState(false);
  const [showAIHUD, setShowAIHUD] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);

  useEffect(() => {
    setIsBookmarked(isParkBookmarked('botanical'));
  }, []);

  const handleToggleBookmark = () => {
    const newState = toggleParkBookmark({
      id: 'botanical',
      name: 'University Botanical Garden',
      canopy: '82% canopy',
      decibels: '38 dB',
    });
    setIsBookmarked(newState);
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <>
      <Header
        onOpenPocketMode={() => setShowPocketMode(true)}
        onOpenAIHUD={() => setShowAIHUD(true)}
      />

      <main className="benefits-container">
        {/* Back Link */}
        <Link href="/explore" className="back-to-map-link">
          <ArrowLeft size={16} /> Back to map
        </Link>

        {/* Place Hero Banner */}
        <section className="place-hero-banner">
          <div className="place-hero-left">
            <div className="place-header-row">
              <div className="place-header-thumb">
                <img
                  src={getAssetPath('/assets/thumb_botanical.png')}
                  alt="University Botanical Garden"
                />
              </div>

              <div className="place-title-info">
                <h1 className="place-title">University Botanical Garden</h1>
                <div className="place-metrics-line">
                  6 min walk • 82% canopy • 38 dB
                </div>
              </div>
            </div>

            <div className="place-tags-row">
              <span className="place-tag-pill">Shaded</span>
              <span className="place-tag-pill">Quiet</span>
              <span className="place-tag-pill">Benches</span>
              <span className="place-tag-pill">Clean</span>
            </div>

            <div className="place-actions-row">
              <button
                className="btn-primary-mint"
                onClick={() => setShowSensoryModal(true)}
              >
                Start 3-Minute Reset <ArrowRight size={16} />
              </button>

              <button
                className="btn-icon"
                onClick={handleToggleBookmark}
                style={{
                  borderRadius: '12px',
                  width: '44px',
                  height: '44px',
                  borderColor: isBookmarked ? '#34e79a' : 'rgba(255, 255, 255, 0.1)',
                  color: isBookmarked ? '#34e79a' : '#9cb1a7',
                }}
                title={isBookmarked ? 'Bookmarked' : 'Save Place'}
              >
                <Bookmark size={18} fill={isBookmarked ? '#34e79a' : 'none'} />
              </button>
            </div>
          </div>

          <div className="place-hero-right">
            <img
              src={getAssetPath('/assets/botanical_banner.png')}
              alt="Panoramic sunlit botanical garden pathway with wooden bench"
              className="place-hero-panorama"
            />
          </div>
        </section>

        {/* Sensory Reset Cards Section */}
        <section>
          <div className="sensory-reset-section-header">
            <div className="sensory-header-left">
              <h2 className="sensory-main-title">Your 3-Minute Sensory Reset</h2>
              <div className="sensory-context-sub">
                Based on your current state:{' '}
                <strong style={{ color: '#38bdf8' }}>Screen fatigue</strong> •{' '}
                <strong style={{ color: '#34e79a' }}>Afternoon</strong> •{' '}
                <strong style={{ color: '#fbbf24' }}>Hot weather</strong>
              </div>
            </div>

            <div className="sensory-header-actions">
              <button
                className="btn-outline-dark"
                onClick={() => setShowOfflineModal(true)}
                style={{ fontSize: '13px', padding: '8px 18px' }}
              >
                <Download size={15} /> Offline Card
              </button>

              <button
                className="btn-outline-dark"
                onClick={handleShare}
                style={{ fontSize: '13px', padding: '8px 18px' }}
              >
                {copiedShare ? (
                  <>
                    <Check size={15} color="#34e79a" /> Copied
                  </>
                ) : (
                  <>
                    <Share2 size={15} /> Share
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="sensory-cards-grid">
            {/* Card 1: Optic Reset */}
            <div
              className="sensory-reset-card"
              onClick={() => setShowSensoryModal(true)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-step-header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="step-badge-circle">1</div>
                  <h3 className="step-card-name">Optic Reset</h3>
                </div>
                <span className="step-card-duration">1 minute</span>
              </div>

              <div className="step-card-img-wrap">
                <img
                  src={getAssetPath('/assets/reset_optic.png')}
                  alt="Person looking up at tree canopy"
                  className="step-card-img"
                />
              </div>

              <p className="step-card-desc">
                Relax your eyes with simple natural focusing techniques.
              </p>
            </div>

            {/* Card 2: Acoustic Relaxation */}
            <div
              className="sensory-reset-card"
              onClick={() => setShowSensoryModal(true)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-step-header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="step-badge-circle">2</div>
                  <h3 className="step-card-name">Acoustic Relaxation</h3>
                </div>
                <span className="step-card-duration">1 minute</span>
              </div>

              <div className="step-card-img-wrap">
                <img
                  src={getAssetPath('/assets/reset_acoustic.png')}
                  alt="Sunlit leaves and clear blue sky"
                  className="step-card-img"
                />
              </div>

              <p className="step-card-desc">
                Listen to and notice natural sounds around you.
              </p>
            </div>

            {/* Card 3: Physical Sto Mode */}
            <div
              className="sensory-reset-card"
              onClick={() => setShowPocketMode(true)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-step-header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="step-badge-circle">3</div>
                  <h3 className="step-card-name">Physical Sto Mode</h3>
                </div>
                <span className="step-card-duration">1 minute</span>
              </div>

              <div className="step-card-img-wrap">
                <img
                  src={getAssetPath('/assets/reset_sto.png')}
                  alt="Backpack placed on park bench in nature"
                  className="step-card-img"
                />
              </div>

              <p className="step-card-desc">
                Put your phone away, breathe deeply, and be present.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <SensoryResetModal
        isOpen={showSensoryModal}
        onClose={() => setShowSensoryModal(false)}
        initialPark="University Botanical Garden"
      />
      <PocketModeModal
        isOpen={showPocketMode}
        onClose={() => setShowPocketMode(false)}
      />
      <DigitalOceanAIModal
        isOpen={showAIHUD}
        onClose={() => setShowAIHUD(false)}
      />
      <OfflineCardModal
        isOpen={showOfflineModal}
        onClose={() => setShowOfflineModal(false)}
        parkName="University Botanical Garden"
      />
    </>
  );
}
