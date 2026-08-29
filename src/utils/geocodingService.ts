export interface GeocodedLocation {
  displayName: string;
  cityName: string;
  countryName: string;
  lat: number;
  lng: number;
}

/**
 * Searches global locations via OpenStreetMap Nominatim Free API
 * Returns latitude, longitude, and formatted display names anywhere in the world.
 */
export async function searchGlobalLocations(query: string): Promise<GeocodedLocation[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=8&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SoulRisePanchangApp/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Geocoding HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) return [];

    return data.map((item: any) => {
      const city = item.address?.city || item.address?.town || item.address?.village || item.address?.county || item.name || query;
      const country = item.address?.country || '';

      return {
        displayName: item.display_name,
        cityName: city,
        countryName: country,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
      };
    });
  } catch (error) {
    console.log('Global Geocoding Error, using fallback:', error);
    return [];
  }
}
