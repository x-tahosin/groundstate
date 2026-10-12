'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Smartphone, CheckCircle, ShieldAlert, Play, Pause, RotateCcw } from 'lucide-react';
import { savePocketSession, getPocketSession, playWebAudioChime } from '../lib/offlineStorage.js';

export default function PocketModeModal({ isOpen, onClose }) {
  // State machine: 'ready' | 'active' | 'paused' | 'completed'
  const [modeState, setModeState] = useState('active');
  const [secondsLeft, setSecondsLeft] = useState(900); // 15-minute walk mode
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const wakeLockRef = useRef(null);

  // Restore existing session if user refreshed while walking
  useEffect(() => {
    if (!isOpen) return;
    const existingSession = getPocketSession();
    if (existingSession && existingSession.secondsLeft > 0) {
      setSecondsLeft(existingSession.secondsLeft);
      setModeState(existingSession.modeState || 'active');
    } else {
      setSecondsLeft(900);
      setModeState('active');
    }
  }, [isOpen]);

  // Request Wake Lock API if available
  useEffect(() => {
    if (!isOpen || modeState !== 'active') {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
        setWakeLockActive(false);
      }
      return;
    }

    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen').then((lock) => {
        wakeLockRef.current = lock;
        setWakeLockActive(true);
      }).catch(() => {
        setWakeLockActive(false);
      });
    }

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, [isOpen, modeState]);

  // Countdown timer with state persistence
  useEffect(() => {
    if (!isOpen || modeState !== 'active') return;

    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          setModeState('completed');
          savePocketSession(null);
          playWebAudioChime('complete');
          return 0;
        }
        const updated = s - 1;
        savePocketSession({ modeState: 'active', secondsLeft: updated, timestamp: Date.now() });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, modeState]);

  const handleClose = () => {
    savePocketSession(null);
    onClose();
  };

  const handlePauseResume = () => {
    if (modeState === 'active') {
      setModeState('paused');
      savePocketSession({ modeState: 'paused', secondsLeft, timestamp: Date.now() });
    } else if (modeState === 'paused') {
      setModeState('active');
      savePocketSession({ modeState: 'active', secondsLeft, timestamp: Date.now() });
    }
  };

  const handleRestart = () => {
    setSecondsLeft(900);
    setModeState('active');
    savePocketSession({ modeState: 'active', secondsLeft: 900, timestamp: Date.now() });
  };

  if (!isOpen) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <div className="pocket-mode-overlay">
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          background: 'transparent',
          border: '1px solid #451a1a',
          color: '#ff4d4d',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Exit Pocket Mode"
      >
        <X size={20} />
      </button>

      <div className="pocket-badge">
        OLED POCKET STOW {modeState === 'completed' ? '• COMPLETED' : modeState === 'paused' ? '• PAUSED' : 'ACTIVE'} • {wakeLockActive ? 'WAKELOCK ON' : 'STANDBY'}
      </div>

      <div className="pocket-timer">
        {modeState === 'completed' ? 'Arrived' : formatted}
      </div>

      <p className="pocket-instruction">
        {modeState === 'completed' ? (
          'You have reached your green sanctuary. Take a deep breath and begin your 3-minute sensory reset.'
        ) : (
          'Screen brightness minimized to save battery. Stow this device in your pocket or backpack now. Do not look at screens during your walk to the green space.'
        )}
      </p>

      {/* Real Controls */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {modeState !== 'completed' && (
          <button
            onClick={handlePauseResume}
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '12px 20px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {modeState === 'active' ? (
              <>
                <Pause size={15} /> Pause Walk
              </>
            ) : (
              <>
                <Play size={15} /> Resume Walk
              </>
            )}
          </button>
        )}

        {modeState === 'completed' && (
          <button
            onClick={handleRestart}
            style={{
              background: '#34e79a',
              color: '#000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RotateCcw size={15} /> Start Another Walk
          </button>
        )}

        <button
          onClick={handleClose}
          style={{
            background: modeState === 'completed' ? '#34e79a' : '#ff4d4d',
            color: '#000',
            border: 'none',
            padding: '12px 28px',
            borderRadius: '9999px',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          {modeState === 'completed' ? 'Enter Sanctuary' : 'Exit Screen Stow'}
        </button>
      </div>
    </div>
  );
}
