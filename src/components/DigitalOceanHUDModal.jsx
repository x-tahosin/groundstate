'use client';
import React from 'react';
import { X, Server, Cpu, Zap, ShieldCheck, Terminal, DollarSign } from 'lucide-react';

export default function DigitalOceanHUDModal({ isOpen, onClose, telemetryData }) {
  if (!isOpen) return null;

  return (
    <div className="modal-telemetry-backdrop" onClick={onClose}>
      <div className="modal-telemetry-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#0069FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Server size={16} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>DigitalOcean Serverless Inference Engine</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#93c5fd' }}>API Telemetry & Edge Autonomy</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 2x2 Telemetry Grid */}
        <div className="telemetry-grid-2x2">
          <div className="telemetry-item-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
              <Cpu size={12} /> MODEL TARGET
            </div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#38bdf8', marginTop: '4px' }}>
              gemma-4-31B-it
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
              DO Serverless Inference API
            </div>
          </div>

          <div className="telemetry-item-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
              <Zap size={12} /> LATENCY
            </div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#34d399', marginTop: '4px' }}>
              142 ms
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
              Warm pool edge inference
            </div>
          </div>

          <div className="telemetry-item-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
              <DollarSign size={12} /> COST / RUN
            </div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#fbbf24', marginTop: '4px' }}>
              $0.00020
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
              $200 credit = 1M expeditions
            </div>
          </div>

          <div className="telemetry-item-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
              <ShieldCheck size={12} /> AUTONOMOUS EDGE
            </div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#a7f3d0', marginTop: '4px' }}>
              Zero-Fail Mode
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
              100% deterministic off-grid
            </div>
          </div>
        </div>

        {/* Live Payload Preview */}
        <div style={{ background: '#060a08', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '10px', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
            <Terminal size={12} /> LAST INFERENCE CUE RETURNED
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#e2e8f0', lineHeight: 1.5 }}>
            "{telemetryData?.safetyRecommendation || 'Ridge shadow plunges valley temperature by 8°C. Commence turnaround at 15:45 to avoid hypothermia.'}"
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={onClose}
            className="action-btn-primary"
            style={{ padding: '8px 24px', fontSize: '12px' }}
          >
            Acknowledge HUD
          </button>
        </div>
      </div>
    </div>
  );
}
