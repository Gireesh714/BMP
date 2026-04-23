const metricColor = (value) => {
  if (value >= 2.5) return '#22c55e';
  if (value >= 1.5) return '#f59e0b';
  return '#ef4444';
};

export default function StopDetails({ selectedRow, metricChart, fieldMap, formatNumber, getCombinedScore }) {
  if (!selectedRow) {
    return (
      <article className="insight-card">
        <div className="card-heading">
          <h2>Selected stop</h2>
          <span>Metric breakdown</span>
        </div>
        <p>No stop selected.</p>
      </article>
    );
  }

  const maxMetric = 3;

  return (
    <article className="insight-card">
      <div className="card-heading">
        <h2>Selected stop</h2>
        <span>Metric breakdown</span>
      </div>
      <div className="selected-panel">
        <div className="selected-meta">
          <div>
            <p className="summary-label">Stop</p>
            <strong>{selectedRow['Stop Name']}</strong>
          </div>
          <div>
            <p className="summary-label">Route</p>
            <strong>{selectedRow['Route (Ahmedabad / Gandhinagar)']}</strong>
          </div>
          <div>
            <p className="summary-label">Area</p>
            <strong>{selectedRow['Area Type (Residential / Commercial / Institutional / Mixed)']}</strong>
          </div>
        </div>

        <div className="score-grid">
          <div className="score-card">
            <span>Safety index</span>
            <strong>{formatNumber(selectedRow.safetyIndex)}%</strong>
          </div>
          <div className="score-card">
            <span>Amenity index</span>
            <strong>{formatNumber(selectedRow.amenityIndex)}%</strong>
          </div>
          <div className="score-card">
            <span>Passenger density</span>
            <strong>{selectedRow[fieldMap.passengerDensity]}</strong>
          </div>
          <div className="score-card">
            <span>Combined score</span>
            <strong>{formatNumber(getCombinedScore(selectedRow))}</strong>
          </div>
        </div>

        <div className="metric-list">
          {metricChart.map((item) => (
            <div className="metric-item" key={item.metric}>
              <div className="route-meta">
                <strong>{item.metric}</strong>
                <span>{formatNumber(item.value)}/3</span>
              </div>
              <div className="route-track">
                <div
                  className="route-fill metric-fill"
                  style={{
                    width: `${(item.value / maxMetric) * 100}%`,
                    backgroundColor: metricColor(item.value),
                    backgroundImage: 'none',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
