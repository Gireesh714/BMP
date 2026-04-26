export function calculateSafetyIndex(stop) {
  if (!stop) return 0;
  const safetyFields = [
    'Lighting Quality',
    'CCTV Presence',
    'Pedestrian Crossing Facility',
    'Traffic Speed Control',
    'Structural Condition',
    'Visibility / Natural Surveillance',
  ];
  const score = safetyFields.reduce((sum, field) => sum + (Number(stop[field]) || 0), 0);
  return (score / 18) * 100;
}

export function calculateAmenityScore(stop) {
  if (!stop) return 0;
  const amenityFields = [
    'Covered Shelter',
    'Seating Availability',
    'Route Information Display',
    'Digital Display',
    'Cleanliness',
    'Nearby Shops (≤50m)',
  ];
  const score = amenityFields.reduce((sum, field) => sum + (Number(stop[field]) || 0), 0);
  return (score / 18) * 100;
}

export function getTopStops(data) {
  return [...data]
    .sort((a, b) => calculateSafetyIndex(b) - calculateSafetyIndex(a))
    .slice(0, 5);
}

export function getBottomStops(data) {
  const topNames = new Set(getTopStops(data).map((stop) => stop['Stop Name']));
  return [...data]
    .sort((a, b) => calculateSafetyIndex(a) - calculateSafetyIndex(b))
    .filter((stop) => !topNames.has(stop['Stop Name']))
    .slice(0, 5);
}

export function getRouteAverages(data) {
  const grouped = data.reduce((acc, stop) => {
    const route = stop['Route (Ahmedabad / Gandhinagar)'] || 'Unknown';
    if (!acc[route]) {
      acc[route] = { route, count: 0, safety: 0, amenity: 0 };
    }
    acc[route].count += 1;
    acc[route].safety += calculateSafetyIndex(stop);
    acc[route].amenity += calculateAmenityScore(stop);
    return acc;
  }, {});

  return Object.values(grouped).map((item) => ({
    ...item,
    avgSafety: item.count ? item.safety / item.count : 0,
    avgAmenity: item.count ? item.amenity / item.count : 0,
  }));
}

export function getAreaAverages(data) {
  const grouped = data.reduce((acc, stop) => {
    const area = stop['Area Type (Residential / Commercial / Institutional / Mixed)'] || 'Unknown';
    if (!acc[area]) {
      acc[area] = { area, count: 0, safety: 0, amenity: 0 };
    }
    acc[area].count += 1;
    acc[area].safety += calculateSafetyIndex(stop);
    acc[area].amenity += calculateAmenityScore(stop);
    return acc;
  }, {});

  return Object.values(grouped).map((item) => ({
    ...item,
    avgSafety: item.count ? item.safety / item.count : 0,
    avgAmenity: item.count ? item.amenity / item.count : 0,
  }));
}
