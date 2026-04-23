export default function StopsTable({ rows, selectedStop, onSelectStop, formatNumber, scoreColor }) {
  return (
    <article className="insight-card wide">
      <div className="card-heading">
        <h2>Stops table</h2>
        <span>Click a stop in the list to inspect it</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Stop</th>
              <th>Route</th>
              <th>Area</th>
              <th>Safety</th>
              <th>Amenity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const active = row['Stop Name'] === (selectedStop || '');
              return (
                <tr
                  key={row['Stop Name']}
                  className={active ? 'active-row' : ''}
                  onClick={() => onSelectStop(row['Stop Name'])}
                >
                  <td>{row['Stop Name']}</td>
                  <td>{row['Route (Ahmedabad / Gandhinagar)']}</td>
                  <td>{row['Area Type (Residential / Commercial / Institutional / Mixed)']}</td>
                  <td>
                    <span className="score-pill" style={{ background: scoreColor(row.safetyIndex) }}>
                      {formatNumber(row.safetyIndex)}%
                    </span>
                  </td>
                  <td>
                    <span className="score-pill" style={{ background: scoreColor(row.amenityIndex) }}>
                      {formatNumber(row.amenityIndex)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
}
