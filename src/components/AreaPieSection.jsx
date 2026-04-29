import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import SafetyAmenityComparison from './SafetyAmenityComparison.jsx';

const COLORS = [
  '#2563eb',
  '#22c55e',
  '#f59e0b',
  '#ec4899',
  '#14b8a6',
  '#a855f7',
  '#fb7185',
  '#0ea5e9',
  '#84cc16',
  '#f97316',
];

const LOCATION_LABELS = {
  Residential: 'Residential Area',
  Commercial: 'Commercial Area',
  Institutional: 'Institutional Area',
  Mixed: 'Mixed-Use Area',
  'Mixed-Use': 'Mixed-Use Area',
  'Mixed Use': 'Mixed-Use Area',
  'Mixed-Use Area': 'Mixed-Use Area',
  'Residential Area': 'Residential Area',
  'Commercial Area': 'Commercial Area',
  'Institutional Area': 'Institutional Area',
};

const getLocationLabel = (value) => LOCATION_LABELS[value] || value || 'Unknown Location Type';

export default function AreaPieSection({ data }) {
  if (!data || data.length === 0) return null;

  const areaDistribution = Object.values(
    data.reduce((acc, stop) => {
      const rawType =
        stop['Area Type (Residential / Commercial / Institutional / Mixed)'] ||
        stop.areaType ||
        stop.locationType ||
        'Unknown';
      const name = getLocationLabel(rawType);
      acc[name] = acc[name] || { name, value: 0 };
      acc[name].value += 1;
      return acc;
    }, {}),
  ).map((item) => ({
    ...item,
    count: Number(item.value || 0),
  }));

  const totalStops = areaDistribution.reduce((sum, item) => sum + Number(item.count || 0), 0);

  console.log('Total Stops:', totalStops);
  areaDistribution.forEach((item) => console.log('Item Count:', item.count, item.name));

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;
    const entry = payload[0];
    const count = Number(entry.value || 0);
    const percentage = totalStops > 0 ? Number(((count / totalStops) * 100).toFixed(2)) : 0;
    return (
      <div className="custom-tooltip">
        <div className="tooltip-line">
          <strong>Location Type:</strong> {entry.name}
        </div>
        <div className="tooltip-line">
          <strong>Number of Stops:</strong> {count}
        </div>
        <div className="tooltip-line">
          <strong>Percentage:</strong> {percentage ? `${percentage}%` : '0%'}
        </div>
      </div>
    );
  };

  return (
    <section className="insight-card section-block">
      <div className="card-heading">
        <h2>Location of Bus Stops</h2>
        <span>Distribution by bus stop location type</span>
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
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <p className="section-copy pie-chart-copy">
            The distribution of bus stop locations indicates a strong concentration in residential and mixed-use areas, reflecting higher public transport dependency in densely populated zones. Commercial and institutional areas also show notable presence, highlighting the role of economic and administrative hubs in shaping transit demand. Smaller category segments represent specialized or transitional zones, indicating diverse urban land-use patterns across the study corridors.
          </p>
        </div>
        <div className="pie-legend-card">
          <h3>Bus Stop Location Type</h3>
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
    </section>
  );
}
