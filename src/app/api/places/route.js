import { NextResponse } from 'next/server';
import { 
  fetchLiveOverpassGreenSpaces, 
  filterParks, 
  BASELINE_PARKS, 
  enrichParksWithUserDistance 
} from '../../../lib/geospatialService.js';

export const dynamic = 'force-static';

export async function GET(request) {
  try {
    const urlStr = request?.url || 'http://localhost:3000/api/places';
    const { searchParams } = new URL(urlStr);
    const lat = parseFloat(searchParams.get('lat')) || 40.7850;
    const lon = parseFloat(searchParams.get('lon')) || -73.9680;
    const radiusMeters = parseInt(searchParams.get('radius'), 10) || 1500;
    const filter = searchParams.get('filter') || 'All';

    // Fetch real nearby green spaces from Overpass API with baseline fallback
    const rawParks = await fetchLiveOverpassGreenSpaces(lat, lon, radiusMeters);
    const filtered = filterParks(rawParks, { filter, maxDistanceMeters: radiusMeters });

    return NextResponse.json({
      success: true,
      userLocation: { lat, lon },
      radiusMeters,
      filter,
      count: filtered.length,
      parks: filtered,
    });
  } catch (err) {
    console.error('API /api/places error:', err);
    // Resilient delivery of enriched green spaces
    const enriched = enrichParksWithUserDistance(BASELINE_PARKS, 40.7850, -73.9680);
    return NextResponse.json({
      success: true,
      source: 'curated_spaces',
      parks: enriched,
    });
  }
}
