'use client';
import React, { useState, useEffect } from 'react';
import { EyeOff, Compass, ShieldAlert, Smartphone } from 'lucide-react';

export default function PocketModeHUD({ isOpen, onClose, ridgeIntersect, trailName }) {
  const [timeLeft, setTimeLeft] = useState(3600);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  const timerStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="pocket-mode-overlay">
      <div className="pocket-night-glow" aria-hidden="true" />

      {/* Top Bar */}
      <div className="pocket-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <EyeOff size={18} />
          <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '1px' }}>RHODOPSIN NIGHT-VISION LOCKOUT</span>
        </div>
        <div style={{ fontSize: '11px', opacity: 0.8 }}>
          {trailName}
        </div>
      </div>

      {/* Centerpiece Timer & Touch Grass Directives */}
      <div className="pocket-centerpiece">
        <div style={{ fontSize: '12px', letterSpacing: '2px', opacity: 0.8 }}>
          COUNTDOWN TO RIDGE SHADOW CUTOFF
        </div>

        <div className="pocket-giant-timer">
          {timerStr}
        </div>

        <div className="pocket-compass-ring">
          <Compass size={48} style={{ transform: 'rotate(245deg)' }} />
          <div style={{ position: 'absolute', bottom: '10px', fontSize: '9px', letterSpacing: '1px' }}>
            AZM 245° W
          </div>
        </div>

        <div style={{ maxWidth: '420px', fontSize: '13px', lineHeight: 1.5, opacity: 0.85, marginTop: '8px' }}>
          Your phone is stowed in your pack. Your biological night vision is preserved. Watch the mountain ridgeline, not the screen.
        </div>
      </div>

      {/* Unlock CTA */}
      <button 
        onClick={onClose}
        className="pocket-unlock-btn"
      >
        <Smartphone size={14} style={{ display: 'inline', marginRight: '8px' }} />
        UNLOCK SCREEN (RESUME CONSOLE)
      </button>
    </div>
  );
}
