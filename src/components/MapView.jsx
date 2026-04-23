import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import stopCoords from '../data/stopsWithCoords.json';

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

function normalizeSearchName(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/exchnage/g, 'exchange')
    .replace(/secreteriat/g, 'secretariat')
    .replace(/\s+/g, ' ');
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

function normalizeEntryName(name) {
  return String(name).trim().replace(/exchnage/gi, 'exchange').replace(/\s+/g, ' ');
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
            {filteredStops.map((stop) => {
              const safetyIndex = Number(stop.safetyIndex) || 0;
              const amenityIndex = Number(stop.amenityIndex) || 0;
              const stopKey = getStopKey(stop);
              const isSelected = stopKey === effectiveSelectedKey;
              const color = isSelected ? '#3b82f6' : getSafeColor(safetyIndex);
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
