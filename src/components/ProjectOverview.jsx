export default function ProjectOverview({ totalStops, routes, formatNumber }) {
  return (
    <section className="insight-card section-block">
      <div className="card-heading">
        <h2>Project Overview</h2>
        <span>Bus Stop Safety & Amenities Analysis</span>
      </div>
      <div className="overview-grid">
        <div className="metric-card">
          <p className="summary-label">Stops analyzed</p>
          <strong>{formatNumber(totalStops)}</strong>
        </div>
        <div className="metric-card">
          <p className="summary-label">Routes covered</p>
          <strong>{formatNumber(routes)}</strong>
        </div>
        <div className="metric-card">
          <p className="summary-label">Study focus</p>
          <strong>Ahmedabad vs Gandhinagar</strong>
        </div>
      </div>
      <p className="section-copy">
        This dashboard summarizes stop-level safety and amenity scores, route patterns, and planning gaps
        from the BMP02 spreadsheet.
      </p>
    </section>
  );
}
