import { calculateAmenityScore, calculateSafetyIndex, getBottomStops, getTopStops } from '../utils/dataHelpers.js';

function ScoreList({ title, items }) {
  return (
    <div className="rank-card">
      <h3>{title}</h3>
      <div className="rank-list">
        {items.map((stop, index) => (
          <div className="rank-row" key={`${title}-${stop['Stop Name']}`}>
            <span className="rank-position">{index + 1}</span>
            <div className="rank-content">
              <strong>{stop['Stop Name']}</strong>
              <p>
                Safety {calculateSafetyIndex(stop).toFixed(2)}% · Amenity {calculateAmenityScore(stop).toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Rankings({ data }) {
  const top = getTopStops(data);
  const bottom = getBottomStops(data);

  console.log('Rankings arrays', {
    top: top.map((stop) => stop['Stop Name']),
    bottom: bottom.map((stop) => stop['Stop Name']),
  });

  return (
    <section className="insight-card section-block">
      <div className="card-heading">
        <h2>Rankings</h2>
        <span>Top and bottom performers</span>
      </div>
      <div className="rankings-grid">
        <ScoreList title="Top 5 safest stops" items={top} />
        <ScoreList title="Bottom 5 stops" items={bottom} />
      </div>
    </section>
  );
}
