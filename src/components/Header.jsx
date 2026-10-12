'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Sparkles, Moon, X, MapPin } from 'lucide-react';
import GroundStateLogo from './GroundStateLogo.jsx';

export default function Header({ onOpenPocketMode, onOpenAIHUD }) {
  const pathname = usePathname();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Explore', href: '/explore' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Benefits', href: '/benefits' },
    { label: 'Community', href: '/community' },
  ];

  const quickParks = [
    { name: 'University Botanical Garden', time: '6 min walk', tag: '82% canopy' },
    { name: 'City Central Park', time: '10 min walk', tag: '68% canopy' },
    { name: 'Riverside Greenway', time: '12 min walk', tag: '55% canopy' },
    { name: 'Maple Community Park', time: '14 min walk', tag: '70% canopy' },
  ];

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <GroundStateLogo />

          <nav>
            <ul className="nav-links">
              {navItems.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                return (
                  <li
                    key={item.href}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="header-actions">
            {/* Pocket Mode Quick Trigger */}
            {onOpenPocketMode && (
              <button
                className="btn-icon nav-btn-pocket"
                title="Stow Mode (OLED Pocket Screen Lock)"
                onClick={onOpenPocketMode}
                aria-label="Pocket Mode"
              >
                <Moon size={18} />
              </button>
            )}

            {/* DigitalOcean Serverless AI Inference Trigger */}
            {onOpenAIHUD && (
              <button
                className="btn-icon nav-btn-highlight"
                title="DigitalOcean Serverless AI Pipeline"
                onClick={onOpenAIHUD}
                aria-label="DigitalOcean AI Engine"
                style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)' }}
              >
                <Sparkles size={18} />
              </button>
            )}

            {/* Search Button */}
            <button
              className="btn-icon"
              title="Search green spaces"
              onClick={() => setShowSearchModal(true)}
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Get Started Button */}
            <Link href="/explore" className="btn-primary-mint">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Quick Search Modal */}
      {showSearchModal && (
        <div className="modal-overlay-backdrop" onClick={() => setShowSearchModal(false)}>
          <div
            className="modal-content-card"
            style={{ maxWidth: '480px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setShowSearchModal(false)}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
              Find Nearby Green Space
            </h3>

            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9cb1a7',
                }}
              />
              <input
                type="text"
                placeholder="Search by park name, canopy, or quiet zone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '9999px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#34e79a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Nearby Verified Sanctuaries
              </span>
              {quickParks
                .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((park) => (
                  <Link
                    key={park.name}
                    href="/benefits"
                    onClick={() => setShowSearchModal(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: 'rgba(16, 28, 23, 0.65)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <MapPin size={16} color="#34e79a" />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700 }}>{park.name}</div>
                        <div style={{ fontSize: '12px', color: '#9cb1a7' }}>{park.time}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '9999px', background: 'rgba(52, 231, 154, 0.15)', color: '#34e79a' }}>
                      {park.tag}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
