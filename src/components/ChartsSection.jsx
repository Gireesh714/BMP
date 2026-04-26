import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getRouteAverages } from '../utils/dataHelpers.js';

export default function ChartsSection({ data }) {
  const routeAverages = getRouteAverages(data);

  const safetyChartData = routeAverages.map((item) => ({
    route: item.route,
    value: Math.round(item.avgSafety),
  }));

  const amenityChartData = routeAverages.map((item) => ({
    route: item.route,
    value: Math.round(item.avgAmenity),
  }));

  console.log('Route chart values', routeAverages);

  return (
    <section className="insight-card section-block">
      <div className="card-heading">
        <h2>Charts</h2>
        <span>Route averages and area distribution</span>
      </div>
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Avg Safety Index</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={safetyChartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="route" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
              <YAxis tick={{ fill: '#cbd5e1', fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#38bdf8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3>Avg Amenity Score</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={amenityChartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="route" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
              <YAxis tick={{ fill: '#cbd5e1', fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
