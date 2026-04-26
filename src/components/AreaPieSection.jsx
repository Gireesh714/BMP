import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import SafetyAmenityComparison from './SafetyAmenityComparison.jsx';

const COLORS = [
  '#8b5cf6',
  '#06b6d4',
  '#f97316',
  '#22c55e',
  '#f43f5e',
  '#eab308',
  '#14b8a6',
  '#a855f7',
  '#3b82f6',
  '#ef4444',
  '#84cc16',
  '#ec4899',
  '#f59e0b',
  '#0ea5e9',
  '#10b981',
  '#c084fc',
  '#fb7185',
  '#64748b',
  '#2dd4bf',
  '#d946ef',
];

export default function AreaPieSection({ data }) {
  const areaDistribution = Object.values(
    data.reduce((acc, stop) => {
      const key = stop['Area Type (Residential / Commercial / Institutional / Mixed)'] || 'Unknown';
      acc[key] = acc[key] || { name: key, value: 0 };
      acc[key].value += 1;
      return acc;
    }, {}),
  );

  return (
    <section className="insight-card section-block">
      <div className="card-heading">
        <h2>Area Type Pie Chart</h2>
        <span>Full view distribution</span>
      </div>
      <div className="pie-hero">
        <div className="pie-panel">
          <ResponsiveContainer width="100%" height={420}>
            <PieChart>
              <Pie
                data={areaDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={150}
                innerRadius={70}
                paddingAngle={4}
                labelLine={false}
               
              >
                {areaDistribution.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
             <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="pie-legend-card">
          <h3>Area Types</h3>
          <div className="pie-legend-list">
            {areaDistribution.map((entry, index) => (
              <div className="pie-legend-item" key={entry.name}>
                <span className="legend-swatch" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <strong>{entry.name}</strong>
                <span>{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SafetyAmenityComparison data={data} />
    </section>
  );
}
