'use client';

import React, { useState, useEffect } from 'react';
import { X, Printer, Download, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import { getActiveStoredRoutine } from '../lib/offlineStorage.js';

export default function OfflineCardModal({ isOpen, onClose, parkName = 'University Botanical Garden' }) {
  const [activeRoutine, setActiveRoutine] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const stored = getActiveStoredRoutine();
    if (stored && stored.stages && stored.stages.length === 3) {
      setActiveRoutine(stored);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const opticText = activeRoutine?.stages?.[0]?.instruction || 'Soften gaze on tree canopy for 60s.';
  const acousticText = activeRoutine?.stages?.[1]?.instruction || 'Identify 3 distinct natural sounds.';
  const physicalText = activeRoutine?.stages?.[2]?.instruction || 'Phone in pocket. 4-4-4 deep box breathing.';
  const routineSource = activeRoutine?.source === 'digitalocean-serverless-ai' ? 'DigitalOcean Serverless AI' : 'Deterministic Offline Engine';

  const handleDownload = () => {
    const cardText = `
=============================================
GROUNDSTATE OFFLINE SENSORY RESET GUIDE
Sanctuary: ${parkName}
Coordinates: 40.7829° N, 73.9654° W
Canopy: 82% | Decibels: 38 dB (Quiet Zone)
=============================================

STAGE 1: OPTIC RESET (1 MINUTE)
• ${opticText}

STAGE 2: ACOUSTIC RELAXATION (1 MINUTE)
• ${acousticText}

STAGE 3: PHYSICAL STOW MODE (1 MINUTE)
• ${physicalText}

Engine: GroundState • ${routineSource}
Offline Guarantee: 100% operational without cell service or data
=============================================
`;
    const blob = new Blob([cardText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `groundstate-offline-reset-${parkName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay-backdrop" onClick={onClose}>
      <div
        className="modal-content-card"
        style={{
          maxWidth: '520px',
          background: '#0d1a14',
          border: '1px solid rgba(52, 231, 154, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <ShieldCheck size={18} color="#34e79a" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#34e79a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Offline Field Guide & Reset Slip
          </span>
        </div>

        <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          {parkName}
        </h3>
        <p style={{ fontSize: '13.5px', color: '#9cb1a7', marginBottom: '20px' }}>
          Save or print this physical slip before leaving your desk so you can experience your full micro-escape 100% disconnected from mobile data or cell signals.
        </p>

        {/* Printable Card Preview Box */}
        <div
          style={{
            background: '#ffffff',
            color: '#0f172a',
            padding: '24px',
            borderRadius: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            lineHeight: '1.6',
            marginBottom: '24px',
            border: '2px dashed #94a3b8',
          }}
        >
          <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ fontSize: '14px', letterSpacing: '0.05em' }}>GROUNDSTATE PASS</strong>
            <span style={{ fontSize: '10px', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>OFFLINE CARD</span>
          </div>
          <div><strong>Location:</strong> {parkName}</div>
          <div><strong>Walking Radius:</strong> ~600m (6-8 min walk)</div>
          <div><strong>Natural Sanctuary:</strong> 82% Canopy • &lt;40 dB</div>
          <div style={{ margin: '12px 0', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
            <div><strong>1. Optic:</strong> {opticText}</div>
            <div><strong>2. Acoustic:</strong> {acousticText}</div>
            <div><strong>3. Physical:</strong> {physicalText}</div>
          </div>
          <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'right' }}>
            Touch the grass. No screens needed.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="btn-outline-dark" onClick={handlePrint}>
            <Printer size={16} /> Print Slip
          </button>
          <button className="btn-primary-mint" onClick={handleDownload}>
            <Download size={16} /> Download .TXT
          </button>
        </div>
      </div>
    </div>
  );
}
