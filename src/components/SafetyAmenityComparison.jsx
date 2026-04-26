import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SafetyAmenityComparison({ data }) {
  // Prepare data for individual stops using pre-calculated indices from Excel
  const stopData = data
    .filter(stop => stop['Stop Name']) // Only filter stops that have a name
    .map((stop, index) => {
      const safety = Math.round(Number(stop.safetyIndex) || 0);
      const amenity = Math.round(Number(stop.amenityIndex) || 0);
      return {
        stop: stop['Stop Name'],
        safety: safety,
        amenity: amenity,
      };
    })
    .sort((a, b) => b.safety - a.safety);

  console.log('📊 Chart Data Ready:', stopData.length, 'stops');
  console.log('📊 First 5 stops:', stopData.slice(0, 5));

  if (!stopData || stopData.length === 0) {
    return (
      <div style={{ marginTop: '40px', marginBottom: '40px' }}>
        <div className="chart-container full-width">
          <div className="chart-header">
            <h3>Stop-wise Safety and Amenity Distribution</h3>
          </div>
          <p style={{ color: '#cbd5e1', padding: '20px', textAlign: 'center' }}>
            No data available. Total data items: {data?.length}
          </p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => {
            const displayName = entry.dataKey === 'safety' ? 'Safety' : 'Amenity';
            return (
              <p key={index} style={{ color: entry.color, fontSize: '12px', margin: '4px 0' }}>
                {`${displayName}: ${entry.value}`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ marginTop: '40px', marginBottom: '40px' }}>
      <div className="chart-container full-width">
        <div className="chart-header">
          <h3>Stop-wise Safety and Amenity Distribution</h3>
          <p>Compare safety (blue) and amenity (red) scores across all bus stops. Hover to see detailed scores.</p>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={800}>
            <BarChart
              data={stopData}
              layout="horizontal"
              margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis type="number" stroke="#cbd5e1" fontSize={11} domain={[0, 100]} />
              <YAxis
                type="category"
                dataKey="stop"
                stroke="#cbd5e1"
                width={5}
                tick={false}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.1)' }} />
              <Bar dataKey="safety" fill="#3b82f6" radius={[0, 3, 3, 0]} />
              <Bar dataKey="amenity" fill="#ef4444" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}