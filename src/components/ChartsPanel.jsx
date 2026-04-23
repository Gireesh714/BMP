function barWidth(value, max) {
  return `${Math.max(8, (value / max) * 100)}%`;
}

function chartLabel(row) {
  return row['Stop Name'];
}

export default function ChartsPanel({ sortedRows, routeChart, topStopsChart }) {
  const topRows = sortedRows.slice(0, 6);
  const routeTotal = routeChart.reduce((sum, item) => sum + item.count, 0) || 1;

  return (
    <section className="insights-grid">
      <article className="insight-card wide">
        <div className="card-heading">
          <h2>Top stops by combined score</h2>
          <span>Safety + amenity</span>
        </div>
        <div className="simple-bars">
          {topRows.map((row) => (
            <div className="simple-bar-row" key={row['Stop Name']}>
              <div className="simple-bar-meta">
                <strong>{chartLabel(row)}</strong>
                <span>
                  {row.safetyIndex.toFixed(2)} safety · {row.amenityIndex.toFixed(2)} amenity
                </span>
              </div>
              <div className="simple-bar-track" aria-hidden="true">
                <div className="simple-bar safety" style={{ width: barWidth(row.safetyIndex, 100) }} />
                <div className="simple-bar amenity" style={{ width: barWidth(row.amenityIndex, 100) }} />
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="insight-card">
        <div className="card-heading">
          <h2>Route split</h2>
          <span>Stops per route</span>
        </div>
        <div className="route-list">
          {routeChart.map((entry, index) => (
            <div className="route-item" key={entry.route}>
              <div className="route-meta">
                <strong>{entry.route}</strong>
                <span>{entry.count} stops</span>
              </div>
              <div className="route-track">
                <div
                  className="route-fill"
                  style={{
                    width: `${(entry.count / routeTotal) * 100}%`,
                    background: ['#60a5fa', '#34d399', '#f59e0b', '#f472b6'][index % 4],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="insight-card wide">
        <div className="card-heading">
          <h2>Best performing stops</h2>
          <span>Ranked by combined score</span>
        </div>
        <div className="trend-list">
          {topStopsChart.map((row, index) => (
            <div className="trend-row" key={row.stop}>
              <span className="trend-index">{index + 1}</span>
              <div className="trend-meta">
                <strong>{row.stop}</strong>
                <span>
                  Safety {row.safety.toFixed(2)}% · Amenity {row.amenity.toFixed(2)}%
                </span>
              </div>
              <div className="trend-total">{(row.safety + row.amenity).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
