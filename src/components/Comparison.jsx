export default function Comparison({ routeAverages }) {
  const ahmedabad = routeAverages.find((item) => item.route === 'Ahmedabad');
  const gandhinagar = routeAverages.find((item) => item.route === 'Gandhinagar');

  return (
    <section className="insight-card section-block">
      <div className="card-heading">
        <h2>Comparison</h2>
        <span>Ahmedabad vs Gandhinagar</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Factor</th>
              <th>Ahmedabad</th>
              <th>Gandhinagar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Density</td>
              <td>{ahmedabad?.count ?? 0}</td>
              <td>{gandhinagar?.count ?? 0}</td>
            </tr>
            <tr>
              <td>Amenities</td>
              <td>{ahmedabad?.avgAmenity?.toFixed(2) ?? '0.00'}</td>
              <td>{gandhinagar?.avgAmenity?.toFixed(2) ?? '0.00'}</td>
            </tr>
            <tr>
              <td>Planning</td>
              <td>{ahmedabad?.avgSafety?.toFixed(2) ?? '0.00'}</td>
              <td>{gandhinagar?.avgSafety?.toFixed(2) ?? '0.00'}</td>
            </tr>
            <tr>
              <td>Safety</td>
              <td>{ahmedabad?.avgSafety?.toFixed(2) ?? '0.00'}</td>
              <td>{gandhinagar?.avgSafety?.toFixed(2) ?? '0.00'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="section-copy">
        Ahmedabad currently shows a denser stop network, while Gandhinagar tends to perform better where stops
        are fewer and better planned. The gap highlights the need for route-level standardization.
      </p>
    </section>
  );
}
