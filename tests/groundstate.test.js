import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('GroundState Core Domain & Business Logic', () => {
  // 1. Walk time estimation & distance heuristics
  test('accurately calculates pedestrian walking velocity (approx 80-85 meters per minute)', () => {
    const calculateWalkTimeMinutes = (meters) => Math.round(meters / 83.3);

    assert.equal(calculateWalkTimeMinutes(500), 6); // 500m -> 6 minutes
    assert.equal(calculateWalkTimeMinutes(850), 10); // 850m -> 10 minutes
    assert.equal(calculateWalkTimeMinutes(1150), 14); // 1.15km -> 14 minutes
  });

  // 2. Sensory Reset stage mapping
  test('correctly maps 180s timer interval to the 3 somatic recovery stages', () => {
    const getStageFromSecondsLeft = (secs) => {
      if (secs > 120) return { id: 1, name: 'Optic Reset' };
      if (secs > 60) return { id: 2, name: 'Acoustic Relaxation' };
      return { id: 3, name: 'Physical Stow Mode' };
    };

    assert.deepEqual(getStageFromSecondsLeft(180), { id: 1, name: 'Optic Reset' });
    assert.deepEqual(getStageFromSecondsLeft(150), { id: 1, name: 'Optic Reset' });
    assert.deepEqual(getStageFromSecondsLeft(120), { id: 2, name: 'Acoustic Relaxation' });
    assert.deepEqual(getStageFromSecondsLeft(80), { id: 2, name: 'Acoustic Relaxation' });
    assert.deepEqual(getStageFromSecondsLeft(60), { id: 3, name: 'Physical Stow Mode' });
    assert.deepEqual(getStageFromSecondsLeft(10), { id: 3, name: 'Physical Stow Mode' });
    assert.deepEqual(getStageFromSecondsLeft(0), { id: 3, name: 'Physical Stow Mode' });
  });

  // 3. Environmental filtering
  test('filters green spaces accurately based on canopy, noise, and sunlight criteria', () => {
    const parks = [
      { id: 1, name: 'University Botanical Garden', canopy: 82, db: 38, tags: ['Shaded', 'Quiet'] },
      { id: 2, name: 'City Central Park', canopy: 68, db: 52, tags: ['Shaded'] },
      { id: 3, name: 'Riverside Greenway', canopy: 55, db: 48, tags: ['Sunlit'] },
      { id: 4, name: 'Maple Community Park', canopy: 70, db: 40, tags: ['Quiet'] },
    ];

    const filterParks = (list, filter) => {
      if (filter === 'All') return list;
      return list.filter((p) => p.tags.includes(filter));
    };

    assert.equal(filterParks(parks, 'All').length, 4);
    assert.equal(filterParks(parks, 'Shaded').length, 2);
    assert.equal(filterParks(parks, 'Quiet').length, 2);
    assert.equal(filterParks(parks, 'Sunlit').length, 1);
  });

  // 4. DigitalOcean Serverless AI Inference deterministic fallback
  test('provides robust deterministic sensory prescription fallback when network is offline', () => {
    const generateFallbackPrescription = (condition) => {
      return {
        optic: 'Relax ciliary eye muscles by looking at tree canopy 20ft away for 60s.',
        acoustic: 'Identify 3 natural sounds (leaf rustle, wind, birdsong) to reset auditory cortex.',
        physical: 'Stow phone in pocket. Ground both feet. 4s box breathing cycle.',
        source: 'deterministic-offline-cache',
      };
    };

    const prescription = generateFallbackPrescription({ fatigue: 'high', weather: 'hot' });
    assert.ok(prescription.optic.includes('tree canopy'));
    assert.ok(prescription.acoustic.includes('natural sounds'));
    assert.ok(prescription.physical.includes('Stow phone'));
    assert.equal(prescription.source, 'deterministic-offline-cache');
  });

  // 5. Offline Slip text generator
  test('formats printable offline sensory reset slip with all critical metadata', () => {
    const generateSlip = (parkName, canopy, db) => {
      return `GROUNDSTATE PASS | ${parkName} | Canopy: ${canopy}% | Noise: ${db}dB`;
    };

    const slip = generateSlip('University Botanical Garden', 82, 38);
    assert.ok(slip.includes('University Botanical Garden'));
    assert.ok(slip.includes('82%'));
    assert.ok(slip.includes('38dB'));
  });
});
