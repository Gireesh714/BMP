export default function SummaryPanel({ summary, sortedRows, filteredRows, formatNumber, scoreColor, getCombinedScore }) {
  const bestScore = summary.bestStop ? getCombinedScore(summary.bestStop) : 0;
  const weakestScore = summary.weakestStop ? getCombinedScore(summary.weakestStop) : 0;

  return (
    <article className="insight-card">
      <div className="card-heading">
        <h2>Summary picks</h2>
        <span>Highest and lowest combined score</span>
      </div>
      <div className="summary-list">
        {summary.bestStop ? (
          <div className="summary-row">
            <div>
              <p className="summary-label">Best stop</p>
              <strong>{summary.bestStop['Stop Name']}</strong>
              <span className="summary-subline">
                {summary.bestStop['Route (Ahmedabad / Gandhinagar)']} · {summary.bestStop['Area Type (Residential / Commercial / Institutional / Mixed)']}
              </span>
            </div>
            <span className="score-pill" style={{ background: scoreColor(bestScore) }}>
              {formatNumber(bestScore)}
            </span>
          </div>
        ) : (
          <div className="summary-row">
            <div>
              <p className="summary-label">Best stop</p>
              <strong>No data available</strong>
            </div>
            <span className="score-pill muted">—</span>
          </div>
        )}

        {summary.weakestStop ? (
          <div className="summary-row">
            <div>
              <p className="summary-label">Needs attention</p>
              <strong>{summary.weakestStop['Stop Name']}</strong>
              <span className="summary-subline">
                {summary.weakestStop['Route (Ahmedabad / Gandhinagar)']} · {summary.weakestStop['Area Type (Residential / Commercial / Institutional / Mixed)']}
              </span>
            </div>
            <span className="score-pill muted">{formatNumber(weakestScore)}</span>
          </div>
        ) : (
          <div className="summary-row">
            <div>
              <p className="summary-label">Needs attention</p>
              <strong>No data available</strong>
            </div>
            <span className="score-pill muted">—</span>
          </div>
        )}

        <div className="summary-row">
          <div>
            <p className="summary-label">Displayed rows</p>
            <strong>{sortedRows.length}</strong>
          </div>
          <span className="score-pill muted">{filteredRows.length} filtered</span>
        </div>
      </div>
    </article>
  );
}
