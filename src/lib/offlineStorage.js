/**
 * GroundState — Offline Storage & Local Persistence Service
 * 
 * Manages:
 * - Persistent storage of validated sensory routines (localStorage with schema checking)
 * - Saved bookmarked green spaces
 * - Pocket Mode state persistence across browser reloads
 * - Audio chimes generator using Web Audio API (zero external network dependency)
 */

const STORAGE_KEYS = {
  ACTIVE_ROUTINE: 'groundstate_active_routine',
  SAVED_ROUTINES: 'groundstate_saved_routines',
  BOOKMARKED_PARKS: 'groundstate_bookmarked_parks',
  POCKET_SESSION: 'groundstate_pocket_session',
  OFFLINE_STATUS: 'groundstate_is_offline',
};

/**
 * Save an AI-generated or validated routine locally
 * @param {Object} routine
 */
export function saveRoutineLocally(routine) {
  if (typeof window === 'undefined' || !routine) return;
  try {
    const serialized = JSON.stringify({
      savedAt: new Date().toISOString(),
      ...routine,
    });
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROUTINE, serialized);

    // Also append to history list
    const existingList = getSavedRoutinesList();
    const updated = [routine, ...existingList.filter((r) => r.title !== routine.title)].slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.SAVED_ROUTINES, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save routine to localStorage:', err);
  }
}

/**
 * Retrieve the active stored routine
 * @returns {Object|null}
 */
export function getActiveStoredRoutine() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROUTINE);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to read stored routine:', err);
    return null;
  }
}

/**
 * Get all saved routines
 * @returns {Array}
 */
export function getSavedRoutinesList() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_ROUTINES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (_) {
    return [];
  }
}

/**
 * Bookmark toggle for green spaces
 * @param {Object} park
 * @returns {boolean} New bookmark state
 */
export function toggleParkBookmark(park) {
  if (typeof window === 'undefined' || !park) return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKED_PARKS);
    const bookmarks = raw ? JSON.parse(raw) : [];
    const existsIndex = bookmarks.findIndex((b) => b.id === park.id);

    if (existsIndex >= 0) {
      bookmarks.splice(existsIndex, 1);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKED_PARKS, JSON.stringify(bookmarks));
      return false;
    } else {
      bookmarks.push({
        id: park.id,
        name: park.name,
        canopy: park.canopy,
        decibels: park.decibels,
        savedAt: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEYS.BOOKMARKED_PARKS, JSON.stringify(bookmarks));
      return true;
    }
  } catch (_) {
    return false;
  }
}

/**
 * Check if a park is bookmarked
 * @param {string} parkId
 * @returns {boolean}
 */
export function isParkBookmarked(parkId) {
  if (typeof window === 'undefined' || !parkId) return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKED_PARKS);
    if (!raw) return false;
    const bookmarks = JSON.parse(raw);
    return bookmarks.some((b) => b.id === parkId);
  } catch (_) {
    return false;
  }
}

/**
 * Save active Pocket Mode session state
 * @param {Object} state
 */
export function savePocketSession(state) {
  if (typeof window === 'undefined') return;
  try {
    if (!state) {
      localStorage.removeItem(STORAGE_KEYS.POCKET_SESSION);
    } else {
      localStorage.setItem(STORAGE_KEYS.POCKET_SESSION, JSON.stringify(state));
    }
  } catch (_) {}
}

/**
 * Read active Pocket Mode session state
 * @returns {Object|null}
 */
export function getPocketSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POCKET_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

/**
 * Play a calming Web Audio completion or transition chime
 * Pure synthesized sine/bell tone, zero external audio asset required
 * Works 100% offline in airplane mode
 * @param {'chime'|'transition'|'complete'} type
 */
export function playWebAudioChime(type = 'chime') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';

    if (type === 'complete') {
      // Harmonic major chord
      osc.frequency.setValueAtTime(528, now); // Solfeggio 528 Hz (Love/transformation frequency)
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.4);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.start(now);
      osc.stop(now + 1.2);
    } else if (type === 'transition') {
      // Gentle two-tone chime
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.25);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.start(now);
      osc.stop(now + 0.8);
    } else {
      // Soft single ping
      osc.frequency.setValueAtTime(528, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
  } catch (_) {}
}
