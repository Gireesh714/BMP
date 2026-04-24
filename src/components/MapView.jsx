import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import stopCoords from '../data/stopsWithCoords.json';
import { calculateDistance } from '../utils/distance';

function normalizeSearchName(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/exchnage/g, 'exchange')
    .replace(/secreteriat/g, 'secretariat')
    .replace(/\s+/g, ' ');
}

function normalizeEntryName(name) {
  return String(name).trim().replace(/exchnage/gi, 'exchange').replace(/\s+/g, ' ');
}

const routeCenter = [23.04, 72.58];
const coordinateLookup = new Map(
  stopCoords.map((entry) => [`${normalizeSearchName(entry.name)}::${entry.route}`, entry]),
);

function getSafeColor(safetyIndex) {
  if (safetyIndex >= 71) return '#22c55e';
  if (safetyIndex >= 41) return '#f59e0b';
  return '#ef4444';
}

function createMarkerIcon(color) {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `<span style="background:${color}"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });
}

function getStopKey(stop) {
  return `${stop['Stop Name']}-${stop['Route (Ahmedabad / Gandhinagar)']}`;
}

function buildRouteSequence(stopsWithCoords) {
  // Group stops by route
  const routeGroups = {};
  stopsWithCoords.forEach(stop => {
    const route = stop['Route (Ahmedabad / Gandhinagar)'];
    if (!routeGroups[route]) {
      routeGroups[route] = [];
    }
    routeGroups[route].push(stop);
  });

  // Build connections for each route in sequence
  const routeConnections = {};
  Object.entries(routeGroups).forEach(([route, stops]) => {
    routeConnections[route] = [];
    for (let i = 0; i < stops.length - 1; i++) {
      const current = stops[i];
      const next = stops[i + 1];
      const distance = calculateDistance(current.lat, current.lng, next.lat, next.lng);
      routeConnections[route].push({
        from: current,
        to: next,
        distance,
      });
    }
  });

  return { routeGroups, routeConnections };
}

function resolveCoords(stop) {
  const normalizedName = normalizeSearchName(stop['Stop Name'] || '');
  const normalizedRoute = stop['Route (Ahmedabad / Gandhinagar)'];
  return (
    coordinateLookup.get(`${normalizedName}::${normalizedRoute}`) ||
    coordinateLookup.get(`${normalizeEntryName(stop['Stop Name'] || '')}::${normalizedRoute}`) ||
    stopCoords.find(
      (entry) =>
        entry.route === normalizedRoute &&
        (normalizeSearchName(entry.name) === normalizedName || normalizeEntryName(entry.name) === normalizeEntryName(stop['Stop Name'] || '')),
    )
  );
}

function FlyToSingleStop({ stop }) {
  const map = useMap();

  useEffect(() => {
    if (!stop) {
      return;
    }

    map.flyTo([stop.lat, stop.lng], 16, { duration: 0.8 });
  }, [map, stop]);

  return null;
}

export default function MapView({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [selectedStopKey, setSelectedStopKey] = useState('');
  const markerRefs = useRef(new Map());

  const stopsWithCoords = useMemo(
    () =>
      data
        .map((stop) => {
          const coords = resolveCoords(stop);
          if (!coords) return null;
          return {
            ...stop,
            lat: coords.lat,
            lng: coords.lng,
          };
        })
        .filter(Boolean),
    [data],
  );

  const { routeGroups, routeConnections } = useMemo(() => {
    return buildRouteSequence(stopsWithCoords);
  }, [stopsWithCoords]);

  const getPreviousStop = (stop) => {
    const route = stop['Route (Ahmedabad / Gandhinagar)'];
    const route_stops = routeGroups[route] || [];
    const index = route_stops.findIndex(s => getStopKey(s) === getStopKey(stop));
    return index > 0 ? route_stops[index - 1] : null;
  };

  const getNextStop = (stop) => {
    const route = stop['Route (Ahmedabad / Gandhinagar)'];
    const route_stops = routeGroups[route] || [];
    const index = route_stops.findIndex(s => getStopKey(s) === getStopKey(stop));
    return index < route_stops.length - 1 ? route_stops[index + 1] : null;
  };

  const getDistanceToPrevious = (stop) => {
    const prevStop = getPreviousStop(stop);
    if (!prevStop) return null;
    return calculateDistance(prevStop.lat, prevStop.lng, stop.lat, stop.lng);
  };

  const getDistanceToNext = (stop) => {
    const nextStop = getNextStop(stop);
    if (!nextStop) return null;
    return calculateDistance(stop.lat, stop.lng, nextStop.lat, nextStop.lng);
  };

  const filteredStops = useMemo(() => {
    const term = debouncedTerm.trim().toLowerCase();
    if (!term) {
      return stopsWithCoords;
    }

    return stopsWithCoords.filter((stop) =>
      normalizeSearchName(stop['Stop Name'] || '').includes(term),
    );
  }, [debouncedTerm, stopsWithCoords]);

  const effectiveSelectedKey = useMemo(() => {
    if (filteredStops.length === 1) {
      return getStopKey(filteredStops[0]);
    }

    return selectedStopKey;
  }, [filteredStops, selectedStopKey]);

  const selectedStop = useMemo(() => {
    if (!effectiveSelectedKey) {
      return null;
    }

    return filteredStops.find((stop) => getStopKey(stop) === effectiveSelectedKey) || null;
  }, [effectiveSelectedKey, filteredStops]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    if (!selectedStop) {
      return;
    }

    const marker = markerRefs.current.get(effectiveSelectedKey);
    if (marker) {
      marker.openPopup();
    }
  }, [effectiveSelectedKey, selectedStop]);

  console.log('Map markers rendered', filteredStops.length, 'of', data.length);

  return (
    <section className="insight-card section-block">
      <div className="card-heading">
        <h2>Map View</h2>
        <span>Stop locations</span>
      </div>

      <div className="map-search">
        <label className="search-label" htmlFor="map-stop-search">
          Search bus stop
        </label>
        <input
          id="map-stop-search"
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search bus stop..."
        />
      </div>

      {filteredStops.length > 0 ? (
        <div className="map-shell">
          <MapContainer center={routeCenter} zoom={12} scrollWheelZoom={false} className="map-canvas">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredStops.length === 1 ? <FlyToSingleStop stop={filteredStops[0]} /> : null}
            
            {/* Render routes for each city */}
            {['Ahmedabad', 'Gandhinagar'].map((route) => {
              const connections = routeConnections[route] || [];
              return connections.map((connection, idx) => {
                if (!connection.from || !connection.to) return null;
                return (
                  <Polyline
                    key={`route-${route}-${idx}`}
                    positions={[[connection.from.lat, connection.from.lng], [connection.to.lat, connection.to.lng]]}
                    color={route === 'Ahmedabad' ? '#ef4444' : '#3b82f6'}
                    weight={6}
                    opacity={0.85}
                  />
                );
              });
            })}
            
            {filteredStops.map((stop) => {
              const safetyIndex = Number(stop.safetyIndex) || 0;
              const amenityIndex = Number(stop.amenityIndex) || 0;
              const stopKey = getStopKey(stop);
              const isSelected = stopKey === effectiveSelectedKey;
              const color = isSelected ? '#3b82f6' : getSafeColor(safetyIndex);
              const prevStop = getPreviousStop(stop);
              const nextStop = getNextStop(stop);
              const distToPrev = getDistanceToPrevious(stop);
              const distToNext = getDistanceToNext(stop);
              
              return (
                <Marker
                  key={stopKey}
                  position={[stop.lat, stop.lng]}
                  icon={createMarkerIcon(color)}
                  ref={(marker) => {
                    if (marker) {
                      markerRefs.current.set(stopKey, marker);
                    } else {
                      markerRefs.current.delete(stopKey);
                    }
                  }}
                  eventHandlers={{
                    click: () => setSelectedStopKey(stopKey),
                  }}
                >
                  <Popup>
                    <strong>{stop['Stop Name']}</strong>
                    <br />
                    Safety Index: {safetyIndex.toFixed(2)}%
                    <br />
                    Amenity Score: {amenityIndex.toFixed(2)}%
                    {prevStop && (
                      <>
                        <br />
                        <hr style={{ margin: '6px 0' }} />
                        <div style={{ fontSize: '0.9em', marginTop: '6px' }}>
                          <strong>Previous:</strong> {prevStop['Stop Name']}
                          <br />
                          Distance: {distToPrev?.toFixed(2)} km
                        </div>
                      </>
                    )}
                    {nextStop && (
                      <>
                        <br />
                        <div style={{ fontSize: '0.9em', marginTop: '6px' }}>
                          <strong>Next:</strong> {nextStop['Stop Name']}
                          <br />
                          Distance: {distToNext?.toFixed(2)} km
                        </div>
                      </>
                    )}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      ) : (
        <div className="empty-map">
          <p>No stops found</p>
        </div>
      )}
    </section>
  );
}
