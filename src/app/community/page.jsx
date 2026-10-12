'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, MessageSquare, Plus, CheckCircle2, Sparkles, X } from 'lucide-react';
import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
import SensoryResetModal from '../../components/SensoryResetModal.jsx';
import PocketModeModal from '../../components/PocketModeModal.jsx';
import DigitalOceanAIModal from '../../components/DigitalOceanAIModal.jsx';

export default function CommunityPage() {
  const [likes, setLikes] = useState(342);
  const [hasLiked, setHasLiked] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showSensoryModal, setShowSensoryModal] = useState(false);
  const [showPocketMode, setShowPocketMode] = useState(false);
  const [showAIHUD, setShowAIHUD] = useState(false);
  const [joinForm, setJoinForm] = useState({ username: '', email: '', submitted: false });

  // Restore saved likes and membership
  useEffect(() => {
    try {
      const storedLikes = localStorage.getItem('groundstate_testimonial_likes');
      if (storedLikes) {
        const parsed = JSON.parse(storedLikes);
        setLikes(parsed.count || 342);
        setHasLiked(parsed.hasLiked || false);
      }
      const member = localStorage.getItem('groundstate_community_member');
      if (member) {
        const parsedMem = JSON.parse(member);
        setJoinForm((prev) => ({ ...prev, username: parsedMem.username, email: parsedMem.email, submitted: true }));
      }
    } catch (_) {}
  }, []);

  const handleLike = () => {
    const nextState = !hasLiked;
    const nextCount = nextState ? likes + 1 : Math.max(342, likes - 1);
    setHasLiked(nextState);
    setLikes(nextCount);
    try {
      localStorage.setItem('groundstate_testimonial_likes', JSON.stringify({ count: nextCount, hasLiked: nextState }));
    } catch (_) {}
  };

  return (
    <>
      <Header
        onOpenPocketMode={() => setShowPocketMode(true)}
        onOpenAIHUD={() => setShowAIHUD(true)}
      />

      <main className="community-container">
        {/* Left Column: Mission, Copy, CTAs, Open Community Stats */}
        <section className="community-left">
          <span className="overline-badge">
            PEOPLE • NATURE • BETTER WORK
          </span>

          <h1 className="community-heading">
            A healthier<br />
            community of<br />
            builders and creators.
          </h1>

          <p className="community-description">
            Share your favorite green spaces, photos and reset experiences. Let&apos;s build a healthier, more focused community together.
          </p>

          <div className="community-cta-row">
            <button
              className="btn-primary-mint"
              onClick={() => setShowJoinModal(true)}
            >
              Join Community
            </button>

            <Link href="/explore" className="btn-outline-dark">
              Explore Posts
            </Link>
          </div>

          <div className="community-stats-row">
            <div className="stat-item">
              <span className="stat-value">12K+</span>
              <span className="stat-label">Green Spaces</span>
            </div>

            <div className="stat-item">
              <span className="stat-value">8K+</span>
              <span className="stat-label">Community Members</span>
            </div>

            <div className="stat-item">
              <span className="stat-value">50+</span>
              <span className="stat-label">Cities</span>
            </div>

            <div className="stat-item">
              <span className="stat-value">100%</span>
              <span className="stat-label">Open Source</span>
            </div>
          </div>
        </section>

        {/* Right Column: 4-Photo Bento Grid + Floating Testimonial */}
        <section className="community-right">
          <div className="bento-grid-wrapper">
            {/* Top-Left: Person walking down park tree path */}
            <div className="bento-cell" style={{ gridRow: 'span 1' }}>
              <img
                src="/assets/bento_walk_hd.jpg"
                alt="Person walking down lush sunlit park trail"
              />
            </div>

            {/* Top-Right: Laptop and coffee on outdoor picnic table */}
            <div className="bento-cell">
              <img
                src="/assets/bento_laptop_hd.jpg"
                alt="Laptop and coffee cup on wooden table in nature"
              />
            </div>

            {/* Bottom-Left: Sunset over park lake and city skyline */}
            <div className="bento-cell">
              <img
                src="/assets/bento_lake_hd.jpg"
                alt="Evening sunset over Central park lake with skyline reflections"
              />
            </div>

            {/* Bottom-Right: Park path with sunlight and trees */}
            <div className="bento-cell">
              <img
                src="/assets/bento_trees_hd.jpg"
                alt="Sunlit green park path with tall trees"
              />
            </div>

            {/* Floating Testimonial Card */}
            <div className="bento-testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img
                    src="/assets/avatar_devansh_hd.jpg"
                    alt="@devansh avatar"
                  />
                </div>

                <div>
                  <div className="testimonial-user">@devansh</div>
                  <div className="testimonial-time">2h ago</div>
                </div>
              </div>

              <p className="testimonial-quote">
                &ldquo;Perfect spot for a mid-day reset. Fresh air = better code.&rdquo;
              </p>

              <button
                className="testimonial-likes"
                onClick={handleLike}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Heart size={14} fill={hasLiked ? '#ef4444' : 'none'} color="#ef4444" />
                <span style={{ color: hasLiked ? '#ef4444' : '#9cb1a7', fontWeight: 600 }}>
                  {likes}
                </span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Join Community Modal */}
      {showJoinModal && (
        <div className="modal-overlay-backdrop" onClick={() => setShowJoinModal(false)}>
          <div
            className="modal-content-card"
            style={{ maxWidth: '460px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={() => setShowJoinModal(false)}>
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Sparkles size={18} color="#34e79a" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#34e79a', textTransform: 'uppercase' }}>
                Join GroundState Guild
              </span>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
              Connect with 8,000+ Nature-First Developers
            </h3>

            <p style={{ fontSize: '13.5px', color: '#9cb1a7', marginBottom: '20px', lineHeight: '1.5' }}>
              Share local hidden quiet parks, benchmark your eye strain reductions, and take part in weekly Touch Grass desk-break challenges.
            </p>

            {joinForm.submitted ? (
              <div
                style={{
                  background: 'rgba(52, 231, 154, 0.1)',
                  border: '1px solid #34e79a',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                }}
              >
                <CheckCircle2 size={32} color="#34e79a" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
                  Badge Granted: Nature-First Developer
                </h4>
                <p style={{ color: '#9cb1a7', fontSize: '13px', marginBottom: '16px' }}>
                  Welcome aboard, <strong>@{joinForm.username || 'developer'}</strong>! Your community profile is active.
                </p>
                <button
                  className="btn-primary-mint"
                  onClick={() => setShowJoinModal(false)}
                  style={{ width: '100%', fontSize: '13px' }}
                >
                  Return to Community
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const memberData = {
                    username: joinForm.username,
                    email: joinForm.email,
                    joinedAt: new Date().toISOString(),
                  };
                  try {
                    localStorage.setItem('groundstate_community_member', JSON.stringify(memberData));
                  } catch (_) {}
                  setJoinForm((prev) => ({ ...prev, submitted: true }));
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <input
                  type="text"
                  placeholder="GitHub or DEV Username"
                  required
                  value={joinForm.username}
                  onChange={(e) => setJoinForm({ ...joinForm, username: e.target.value })}
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <input
                  type="email"
                  placeholder="Developer Email"
                  required
                  value={joinForm.email}
                  onChange={(e) => setJoinForm({ ...joinForm, email: e.target.value })}
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <button type="submit" className="btn-primary-mint" style={{ marginTop: '8px' }}>
                  Claim Free Community Badge
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <SensoryResetModal
        isOpen={showSensoryModal}
        onClose={() => setShowSensoryModal(false)}
        initialPark="Community Park"
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
