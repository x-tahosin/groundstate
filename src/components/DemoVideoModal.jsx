'use client';

import React, { useState } from 'react';
import { X, Play, Pause, CheckCircle2, Volume2, Sparkles } from 'lucide-react';
import { getAssetPath } from '../utils/assetPath.js';

export default function DemoVideoModal({ isOpen, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-backdrop" onClick={onClose}>
      <div
        className="modal-content-card"
        style={{
          maxWidth: '720px',
          background: '#091510',
          border: '1px solid rgba(52, 231, 154, 0.3)',
          padding: '24px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Sparkles size={18} color="#34e79a" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#34e79a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Product Walkthrough • GroundState
          </span>
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
          How GroundState Solves Developer Screen Burnout
        </h3>

        {/* Video Simulation Player */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '360px',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#000',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <img
            src={getAssetPath('/assets/hero_bench.png')}
            alt="Demo Walkthrough"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.8,
            }}
          />

          {/* Overlay Content */}
          <div
            style={{
              position: 'relative',
              zIndex: 5,
              padding: '20px',
              background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.9) 100%)',
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
              1-Tap Green Space Discovery & Sensory Recalibration
            </div>
            <div style={{ fontSize: '13px', color: '#9cb1a7' }}>
              From desk fatigue to fresh air in under 8 minutes. No endless phone scrolling.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn-outline-dark" onClick={onClose}>
            Close
          </button>
          <a href="/explore" className="btn-primary-mint" onClick={onClose}>
            Launch Live Radar
          </a>
        </div>
      </div>
    </div>
  );
}
