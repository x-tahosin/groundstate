/**
 * Curated authentic mountain trail profiles for SolTerra
 * Includes coordinates, elevation metrics, horizon obstruction profiles, and natural photography.
 */

export const TRAILS = [
  {
    id: 'rainier-skyline',
    name: 'Skyline Trail & Panorama Point',
    location: 'Mount Rainier National Park, Washington',
    timeZone: 'America/Los_Angeles',
    coordinates: { lat: 46.7865, lon: -121.7351 },
    baseElevationFt: 5400,
    peakElevationFt: 7051,
    lengthMiles: 5.5,
    difficulty: 'Challenging Alpine',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    description: 'Glacial meadows sweeping up toward the southern face of Tahoma. The towering Nisqually Ridge to the southwest casts an immense early shadow across the subalpine tarns.',
    // Horizon obstruction profile: elevation angle (degrees above horizontal) by compass azimuth
    horizonProfile: [
      { azimuth: 0, elevationAngle: 28 },   // Rainier summit to North
      { azimuth: 45, elevationAngle: 18 },  // Cowlitz Chimneys
      { azimuth: 90, elevationAngle: 10 },  // Eastern cascades
      { azimuth: 135, elevationAngle: 8 },  // Tatoosh range gap
      { azimuth: 180, elevationAngle: 12 }, // Tatoosh Peaks to South
      { azimuth: 220, elevationAngle: 19 }, // Nisqually Ridge Southwest
      { azimuth: 245, elevationAngle: 22 }, // High Western ridge wall
      { azimuth: 270, elevationAngle: 16 }, // West ridge drop
      { azimuth: 315, elevationAngle: 24 }, // Kautz crest
      { azimuth: 360, elevationAngle: 28 }  // Loop back
    ],
    primaryHazard: 'Sudden subalpine freeze post-shadow; glazed snow bridges.',
    recommendedTurnaroundTimeMinutesBeforeShadow: 45
  },
  {
    id: 'boulder-flatirons',
    name: 'Chautauqua Mesa & Royal Arch',
    location: 'Boulder Mountain Park, Colorado',
    timeZone: 'America/Denver',
    coordinates: { lat: 39.9989, lon: -105.2828 },
    baseElevationFt: 5710,
    peakElevationFt: 6915,
    lengthMiles: 3.4,
    difficulty: 'Moderate Steep',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    description: 'Dramatic vertical Fountain sandstone monoliths standing directly against the western sky. Sunset occurs dramatically early as the sun drops behind the Third Flatiron wall.',
    horizonProfile: [
      { azimuth: 0, elevationAngle: 4 },   // Open plains to North
      { azimuth: 45, elevationAngle: 0 },  // Plains
      { azimuth: 90, elevationAngle: 0 },  // Eastern plains horizon (0°)
      { azimuth: 135, elevationAngle: 2 },  // South mesa
      { azimuth: 180, elevationAngle: 9 },  // Bear Peak ridge
      { azimuth: 220, elevationAngle: 18 }, // South Flatirons
      { azimuth: 250, elevationAngle: 26 }, // Third Flatiron rock face
      { azimuth: 270, elevationAngle: 24 }, // Flagstaff Mountain ridge
      { azimuth: 300, elevationAngle: 15 }, // Sanitas gap
      { azimuth: 360, elevationAngle: 4 }
    ],
    primaryHazard: 'Severe temperature inversion; rapid canyon downdrafts.',
    recommendedTurnaroundTimeMinutesBeforeShadow: 30
  },
  {
    id: 'franconia-ridge',
    name: 'Franconia Ridge Traverse',
    location: 'White Mountains, New Hampshire',
    timeZone: 'America/New_York',
    coordinates: { lat: 44.1569, lon: -71.6814 },
    baseElevationFt: 1800,
    peakElevationFt: 5260,
    lengthMiles: 8.9,
    difficulty: 'Strenuous Ridge',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    description: 'Exposed granite crest between Mount Lincoln and Mount Lafayette. Above treeline, twilight wind speeds double within minutes of the sun disappearing behind Cannon Mountain.',
    horizonProfile: [
      { azimuth: 0, elevationAngle: 6 },
      { azimuth: 45, elevationAngle: 5 },
      { azimuth: 90, elevationAngle: 4 },
      { azimuth: 135, elevationAngle: 7 },
      { azimuth: 180, elevationAngle: 11 }, // Mount Liberty South
      { azimuth: 220, elevationAngle: 14 }, // Kinsman Ridge
      { azimuth: 255, elevationAngle: 17 }, // Cannon Mountain cliff West
      { azimuth: 285, elevationAngle: 15 }, // Notch wall
      { azimuth: 315, elevationAngle: 8 },
      { azimuth: 360, elevationAngle: 6 }
    ],
    primaryHazard: 'Above-treeline gale winds and rime ice after radiant heat cessation.',
    recommendedTurnaroundTimeMinutesBeforeShadow: 60
  },
  {
    id: 'peaks-of-otter',
    name: 'Sharp Top Summit Trail',
    location: 'Blue Ridge Parkway, Virginia',
    timeZone: 'America/New_York',
    coordinates: { lat: 37.4522, lon: -79.6053 },
    baseElevationFt: 2500,
    peakElevationFt: 3875,
    lengthMiles: 3.3,
    difficulty: 'Moderate Rocky',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    description: '360-degree pinnacle overlooking the Piedmont basin and Shenandoah valley. Ridge shadow strikes early in the eastern hollows while the granite summit retains golden light.',
    horizonProfile: [
      { azimuth: 0, elevationAngle: 3 },
      { azimuth: 45, elevationAngle: 2 },
      { azimuth: 90, elevationAngle: 1 },
      { azimuth: 135, elevationAngle: 3 },
      { azimuth: 180, elevationAngle: 6 },
      { azimuth: 220, elevationAngle: 11 }, // Flat Top mountain West
      { azimuth: 260, elevationAngle: 13 }, // Ridge barrier
      { azimuth: 290, elevationAngle: 9 },
      { azimuth: 320, elevationAngle: 5 },
      { azimuth: 360, elevationAngle: 3 }
    ],
    primaryHazard: 'Deep shadow on rocky descent switchbacks; leaf slickness.',
    recommendedTurnaroundTimeMinutesBeforeShadow: 35
  },
  {
    id: 'lac-blanc-alps',
    name: 'Lac Blanc & Aiguilles Rouges',
    location: 'Chamonix Valley, French Alps',
    timeZone: 'Europe/Paris',
    coordinates: { lat: 45.9822, lon: 6.8874 },
    baseElevationFt: 4600,
    peakElevationFt: 7716,
    lengthMiles: 5.2,
    difficulty: 'Alpine Rocky',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80',
    description: 'High glacial lake overlooking the entire Mont Blanc massif. The valley plunges into deep evening shade hours before the glaciated peaks lose their alpine glow.',
    horizonProfile: [
      { azimuth: 0, elevationAngle: 15 },
      { azimuth: 45, elevationAngle: 12 },
      { azimuth: 90, elevationAngle: 8 },
      { azimuth: 135, elevationAngle: 26 }, // Mont Blanc & Aiguille du Midi (South)
      { azimuth: 180, elevationAngle: 22 },
      { azimuth: 220, elevationAngle: 16 },
      { azimuth: 255, elevationAngle: 20 }, // Western Aiguilles Rouges crest
      { azimuth: 285, elevationAngle: 23 }, // Col des Montets barrier
      { azimuth: 315, elevationAngle: 18 },
      { azimuth: 360, elevationAngle: 15 }
    ],
    primaryHazard: 'Frosting of steep boulder scrambles as soon as direct sun leaves.',
    recommendedTurnaroundTimeMinutesBeforeShadow: 50
  }
];

export const DEFAULT_TRAIL = TRAILS[0];
