import { useEffect, useRef, useState } from 'react';

export default function FiltersBar({
  search,
  setSearch,
  sortBy,
  setSortBy,
  routeFilter,
  setRouteFilter,
  areaFilter,
  setAreaFilter,
  routes,
  areas,
  onReset,
}) {
  const [areaDropdownOpen, setAreaDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleDocumentClick(event) {
      if (!dropdownRef.current || dropdownRef.current.contains(event.target)) {
        return;
      }
      setAreaDropdownOpen(false);
    }

    if (areaDropdownOpen) {
      document.addEventListener('mousedown', handleDocumentClick);
      return () => document.removeEventListener('mousedown', handleDocumentClick);
    }

    return undefined;
  }, [areaDropdownOpen]);

  return (
    <section className="controls">
      <label>
        <span>Search stop or route</span>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type a stop name..."
        />
      </label>
      <label>
        <span>Sort by</span>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="combined">Combined score</option>
          <option value="safety">Safety index</option>
          <option value="amenity">Amenity index</option>
          <option value="name">Stop name</option>
        </select>
      </label>
      <label>
        <span>Route</span>
        <select value={routeFilter} onChange={(e) => setRouteFilter(e.target.value)}>
          {routes.map((route) => (
            <option key={route} value={route}>
              {route}
            </option>
          ))}
        </select>
      </label>
      <label className="area-filter-label">
        <span>Area type</span>
        <div className="dropdown-checkbox" ref={dropdownRef}>
          <button
            type="button"
            className="dropdown-toggle"
            onClick={() => setAreaDropdownOpen((open) => !open)}
          >
            Area type
            <span className="dropdown-arrow">▾</span>
          </button>
          {areaDropdownOpen && (
            <div className="dropdown-menu">
              {areas.map((area) => (
                <label key={area} className="area-checkbox-item">
                  <input
                    type="checkbox"
                    value={area}
                    checked={areaFilter.includes(area)}
                    onChange={() => {
                      if (area === 'All') {
                        setAreaFilter(['All']);
                        return;
                      }

                      const activeSelected = areaFilter.includes('All') ? [] : [...areaFilter];
                      const nextSet = new Set(activeSelected);

                      if (nextSet.has(area)) {
                        nextSet.delete(area);
                      } else {
                        nextSet.add(area);
                      }

                      const next = [...nextSet];
                      setAreaFilter(next.length === 0 ? ['All'] : next);
                    }}
                  />
                  {area}
                </label>
              ))}
            </div>
          )}
        </div>
      </label>
      <div className="filter-actions">
        <button type="button" className="reset-btn" onClick={onReset}>
          Reset
        </button>
      </div>
    </section>
  );
}
