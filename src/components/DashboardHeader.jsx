export default function DashboardHeader({ total, avgSafety, avgAmenity, formatNumber }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">BMP02 Excel Visualization</p>
        <h1>Bus stop safety and amenity dashboard</h1>
        <p className="hero-text">
          Search stops, filter by route or area type, sort records, and inspect one stop in detail.
        </p>
      </div>
      <div className="hero-panel">
        <div className="hero-stat">
          <span className="stat-label">Stops shown</span>
          <strong>{total}</strong>
        </div>
        <div className="hero-stat">
          <span className="stat-label">Avg safety</span>
          <strong>{formatNumber(avgSafety)}%</strong>
        </div>
        <div className="hero-stat">
          <span className="stat-label">Avg amenity</span>
          <strong>{formatNumber(avgAmenity)}%</strong>
        </div>
      </div>
    </section>
  );
}
