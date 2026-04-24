import { useEffect, useMemo, useState } from 'react';
import ChartsPanel from './components/ChartsPanel.jsx';
import DashboardErrorBoundary from './components/DashboardErrorBoundary.jsx';
import DashboardHeader from './components/DashboardHeader.jsx';
import Comparison from './components/Comparison.jsx';
import ChartsSection from './components/ChartsSection.jsx';
import AreaPieSection from './components/AreaPieSection.jsx';
import FiltersBar from './components/FiltersBar.jsx';
import MapPage from './components/MapPage.jsx';
import ProjectOverview from './components/ProjectOverview.jsx';
import Rankings from './components/Rankings.jsx';
import ScoringSystem from './components/ScoringSystem.jsx';
import StopDetails from './components/StopDetails.jsx';
import StopsTable from './components/StopsTable.jsx';
import SummaryPanel from './components/SummaryPanel.jsx';
import { FIELD_MAP, METRIC_LABELS, SHEET_URL, loadWorkbookFromBuffer, SCORE_FIELDS } from './data/workbook.js';
import { formatNumber, getCombinedScore, scoreColor } from './utils/format.js';
import { getRouteAverages } from './utils/dataHelpers.js';
import './App.css';

function AppShell({
  rows,
  loading,
  error,
  routeFilter,
  setRouteFilter,
  areaFilter,
  setAreaFilter,
  search,
  setSearch,
  sortBy,
  setSortBy,
  selectedStop,
  setSelectedStop,
  page,
  setPage,
}) {
  const [showStopModal, setShowStopModal] = useState(false);

  const routes = useMemo(
    () => ['All', ...new Set(rows.map((row) => row['Route (Ahmedabad / Gandhinagar)']).filter(Boolean))],
    [rows],
  );
  const areas = useMemo(
    () =>
      ['All', ...new Set(rows.map((row) => row['Area Type (Residential / Commercial / Institutional / Mixed)']).filter(Boolean))],
    [rows],
  );

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      const routeMatch = routeFilter === 'All' || row['Route (Ahmedabad / Gandhinagar)'] === routeFilter;
      const rowArea = row['Area Type (Residential / Commercial / Institutional / Mixed)'];
      const areaMatch =
        areaFilter.length === 0 ||
        areaFilter.includes('All') ||
        areaFilter.includes(rowArea);
      const searchMatch =
        !q ||
        row['Stop Name']?.toLowerCase().includes(q) ||
        row['Route (Ahmedabad / Gandhinagar)']?.toLowerCase().includes(q) ||
        rowArea?.toLowerCase().includes(q);
      return routeMatch && areaMatch && searchMatch;
    });
  }, [rows, routeFilter, areaFilter, search]);

  const sortedRows = useMemo(() => {
    const list = [...filteredRows];
    const sorters = {
      combined: (a, b) => getCombinedScore(b) - getCombinedScore(a),
      safety: (a, b) => b.safetyIndex - a.safetyIndex,
      amenity: (a, b) => b.amenityIndex - a.amenityIndex,
      name: (a, b) => String(a['Stop Name']).localeCompare(String(b['Stop Name'])),
    };
    list.sort(sorters[sortBy] || sorters.combined);
    return list;
  }, [filteredRows, sortBy]);

  const selectedRow = useMemo(
    () => filteredRows.find((row) => row['Stop Name'] === selectedStop) || sortedRows[0] || rows[0] || null,
    [filteredRows, sortedRows, selectedStop, rows],
  );

  const summarySource = filteredRows.length ? filteredRows : rows;
  const routeAverages = useMemo(() => getRouteAverages(summarySource), [summarySource]);

  const summary = useMemo(() => {
    const total = summarySource.length;
    const avgSafety = total ? summarySource.reduce((sum, row) => sum + row.safetyIndex, 0) / total : 0;
    const avgAmenity = total ? summarySource.reduce((sum, row) => sum + row.amenityIndex, 0) / total : 0;
    const bestStop = [...summarySource].sort((a, b) => getCombinedScore(b) - getCombinedScore(a))[0];
    const weakestStop = [...summarySource].sort((a, b) => getCombinedScore(a) - getCombinedScore(b))[0];
    return { total, avgSafety, avgAmenity, bestStop, weakestStop };
  }, [summarySource]);

  const routeChart = useMemo(() => {
    const map = new Map();
    summarySource.forEach((row) => {
      const route = row['Route (Ahmedabad / Gandhinagar)'] || 'Unknown';
      if (!map.has(route)) map.set(route, { route, count: 0, safety: 0, amenity: 0 });
      const entry = map.get(route);
      entry.count += 1;
      entry.safety += row.safetyIndex;
      entry.amenity += row.amenityIndex;
    });
    return [...map.values()].map((item) => ({
      ...item,
      safety: item.count ? item.safety / item.count : 0,
      amenity: item.count ? item.amenity / item.count : 0,
    }));
  }, [summarySource]);

  const topStopsChart = useMemo(
    () =>
      [...summarySource]
        .sort((a, b) => getCombinedScore(b) - getCombinedScore(a))
        .slice(0, 8)
        .map((row) => ({
          stop: row['Stop Name'],
          safety: row.safetyIndex,
          amenity: row.amenityIndex,
        })),
    [summarySource],
  );

  const metricChart = useMemo(() => {
    if (!selectedRow) return [];
    return SCORE_FIELDS.map((field) => ({
      metric: METRIC_LABELS[field],
      value: selectedRow[field],
    }));
  }, [selectedRow]);

  if (loading) {
    return (
      <div className="app-shell">
        <div className="loading-card">Loading workbook...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-shell">
        <div className="loading-card error">
          <h1>Could not load the spreadsheet</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const nav = (
    <nav className="top-nav">
      <button className={page === 'overview' ? 'nav-btn active' : 'nav-btn'} onClick={() => setPage('overview')}>
        Overview
      </button>
      <button className={page === 'stops' ? 'nav-btn active' : 'nav-btn'} onClick={() => setPage('stops')}>
        Stops
      </button>
      <button className={page === 'insights' ? 'nav-btn active' : 'nav-btn'} onClick={() => setPage('insights')}>
        Insights
      </button>
      <button className={page === 'map' ? 'nav-btn active' : 'nav-btn'} onClick={() => setPage('map')}>
        Map
      </button>
      <button className={page === 'pie' ? 'nav-btn active' : 'nav-btn'} onClick={() => setPage('pie')}>
        Pie Chart
      </button>
    </nav>
  );

  return (
    <main className="app-shell">
      {/* <section className="preview-strip">
        {summarySource.slice(0, 3).map((row) => (
          <div key={row['Stop Name']} className="preview-chip">
            <strong>{row['Stop Name']}</strong>
            <span>
              {formatNumber(row.safetyIndex)}% safety · {formatNumber(row.amenityIndex)}% amenity
            </span>
          </div>
        ))}
      </section> */}

      {nav}

      {page === 'overview' && (
        <>
          <DashboardHeader total={summary.total} avgSafety={summary.avgSafety} avgAmenity={summary.avgAmenity} formatNumber={formatNumber} />
          <ProjectOverview totalStops={summary.total} routes={routeAverages.length} formatNumber={formatNumber} />
          <ScoringSystem />
          <ChartsSection data={summarySource} />
          <Rankings data={summarySource} />
          <Comparison routeAverages={routeAverages} />
          
        </>
      )}

      {page === 'stops' && (
        <>
          <FiltersBar
            search={search}
            setSearch={setSearch}
            sortBy={sortBy}
            setSortBy={setSortBy}
            routeFilter={routeFilter}
            setRouteFilter={setRouteFilter}
            areaFilter={areaFilter}
            setAreaFilter={setAreaFilter}
            routes={routes}
            areas={areas}
            onReset={() => {
              setSearch('');
              setSortBy('combined');
              setRouteFilter('All');
              setAreaFilter(['All']);
              setSelectedStop(rows[0]?.['Stop Name'] || '');
              setPage('stops');
            }}
          />

          <section className="detail-grid single-column">
            <StopsTable
              rows={sortedRows}
              selectedStop={selectedRow?.['Stop Name'] || ''}
              onSelectStop={(stopName) => {
                setSelectedStop(stopName);
                setShowStopModal(true);
              }}
              formatNumber={formatNumber}
              scoreColor={scoreColor}
            />
          </section>
        </>
      )}

      {page === 'insights' && (
        <>
          <DashboardErrorBoundary>
            <ChartsPanel sortedRows={sortedRows} routeChart={routeChart} topStopsChart={topStopsChart} />
          </DashboardErrorBoundary>
          <section className="detail-grid single-column">
            <SummaryPanel
              summary={summary}
              sortedRows={sortedRows}
              filteredRows={filteredRows}
              formatNumber={formatNumber}
              scoreColor={scoreColor}
              getCombinedScore={getCombinedScore}
            />
          </section>
        </>
      )}

      {showStopModal && selectedRow && (
        <div className="modal-overlay" onClick={() => setShowStopModal(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowStopModal(false)}>
              ×
            </button>
            <StopDetails
              selectedRow={selectedRow}
              metricChart={metricChart}
              fieldMap={FIELD_MAP}
              formatNumber={formatNumber}
              getCombinedScore={getCombinedScore}
            />
          </div>
        </div>
      )}

      {page === 'map' && <MapPage data={summarySource} />}

      {page === 'pie' && <AreaPieSection data={summarySource} />}
    </main>
  );
}

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [routeFilter, setRouteFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState(['All']);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('combined');
  const [selectedStop, setSelectedStop] = useState('');
  const [page, setPage] = useState('overview');

  useEffect(() => {
    const loadWorkbook = async () => {
      try {
        setLoading(true);
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error(`Unable to load spreadsheet (${response.status})`);
        const arrayBuffer = await response.arrayBuffer();
        const workbookRows = loadWorkbookFromBuffer(arrayBuffer);
        setRows(workbookRows);
        setSelectedStop(workbookRows[0]?.['Stop Name'] || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load workbook');
      } finally {
        setLoading(false);
      }
    };

    loadWorkbook();
  }, []);

  return (
    <AppShell
      rows={rows}
      loading={loading}
      error={error}
      routeFilter={routeFilter}
      setRouteFilter={setRouteFilter}
      areaFilter={areaFilter}
      setAreaFilter={setAreaFilter}
      search={search}
      setSearch={setSearch}
      sortBy={sortBy}
      setSortBy={setSortBy}
      selectedStop={selectedStop}
      setSelectedStop={setSelectedStop}
      page={page}
      setPage={setPage}
    />
  );
}