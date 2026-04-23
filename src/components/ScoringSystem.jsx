const legendItems = [
  { label: 'Red', range: '0-40', color: '#ef4444' },
  { label: 'Yellow', range: '41-70', color: '#f59e0b' },
  { label: 'Green', range: '71-100', color: '#22c55e' },
];

function FormulaCard({ title, numerator }) {
  return (
    <div className="formula-card">
      <h3>{title}</h3>
      <p className="math-line">
        <span className="math-label">Formula</span>
        <span className="math-expression">{numerator} / 18 × 100</span>
      </p>
    </div>
  );
}

export default function ScoringSystem() {
  return (
    <section className="insight-card section-block">
      <div className="card-heading">
        <h2>Scoring System</h2>
        <span>How the indices are calculated</span>
      </div>

      <div className="formula-list scoring-grid">
        <FormulaCard title="Safety Index" numerator="Total safety score" />
        <FormulaCard title="Amenity Score" numerator="Total amenity score" />
      </div>

      <div className="legend-card">
        <h3>Color Legend</h3>
        <div className="legend-list">
          {legendItems.map((item) => (
            <div className="legend-item" key={item.label}>
              <span className="legend-swatch" style={{ backgroundColor: item.color }} />
              <strong>{item.label}</strong>
              <span>{item.range}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
