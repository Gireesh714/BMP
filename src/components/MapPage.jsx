import MapView from './MapView.jsx';

export default function MapPage({ data }) {
  return (
    <>
      <div className="page-note">
        <h2>Map</h2>
        <p>Search and inspect individual bus stops on the map without crowding the overview.</p>
      </div>
      <MapView data={data} />
    </>
  );
}
