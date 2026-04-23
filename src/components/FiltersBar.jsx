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
      <label>
        <span>Area type</span>
        <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)}>
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </label>
      <div className="filter-actions">
        <button type="button" className="reset-btn" onClick={onReset}>
          Reset
        </button>
      </div>
    </section>
  );
}
