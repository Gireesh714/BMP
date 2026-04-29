import { useMemo, useState } from 'react';
import './BusStopDesignAnalysis.css';

const stopDesignMap = {
  // ---------------- BRTS / Structured ----------------
  'akbar-nagar': 'brts',
  'ambavadi': 'brts',
  'bhavsar-hostel': 'brts',
  'danilimda-cross-roads': 'brts',
  'gujarat-university': 'brts',
  'himmatlal-park': 'brts',
  'maninagar-char-rasta': 'brts',
  'memnagar': 'brts',
  'nehrunagar': 'brts',
  'ranip': 'brts',
  'rto-circle': 'brts',
  'shivranjani': 'brts',
  'sola-cross-road': 'brts',
  'kankaria-lake': 'brts',
  'manekbhaug': 'brts',
  'anjali-brts': 'brts',
  'maninagar': 'brts',

  // ---------------- Semi-Covered ----------------
  'andhjan-mandal': 'semi',
  'infocity': 'semi',
  'jaymangal': 'semi',
  'kankariya-telephone': 'semi',
  'pragatinagar': 'semi',
  'rambaug': 'semi',
  'sector-21': 'semi',
  'shastrinagar': 'semi',
  'swaminarayan-college': 'semi',
  'vaikunthdham-mandir': 'semi',
  'chandranagar': 'semi',
  'dharnidhar-derasar': 'semi',
  'khodiyarnagar': 'semi',
  'shree-walinath-chowk': 'semi',

  // ---------------- Minimal ----------------
  'chiloda': 'minimal',
  'janshi-ki-rani': 'minimal',
  'koba-circle': 'minimal',
  'pdpu-road': 'minimal',
  'raysan': 'minimal',
  'sector-10': 'minimal',
  'pathikashram': 'minimal',
};

const categoryDetails = {
  brts: {
    title: 'Enhanced BRTS Stations',
    description: 'Fully structured stations with dedicated corridors, barriers, and high safety standards.',
  },
  semi: {
    title: 'Semi-Covered Stops',
    description: 'Basic shelter with moderate amenities and partial protection.',
  },
  minimal: {
    title: 'Minimal Stops',
    description: 'Limited infrastructure with minimal passenger facilities.',
  },
};

const categoryOrder = ['brts', 'semi', 'minimal'];
const placeholderImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23101e2f"/%3E%3Ctext x="50%" y="40%" fill="%23cbd5e1" font-family="Arial, Helvetica, sans-serif" font-size="20" text-anchor="middle"%3EImage unavailable%3C/text%3E%3Ctext x="50%" y="55%" fill="%2398a2b8" font-family="Arial, Helvetica, sans-serif" font-size="14" text-anchor="middle"%3ENo image found%3C/text%3E%3C/svg%3E';

const formatStopLabel = (stopKey) =>
  stopKey
    .split('-')
    .map((word) => {
      if (word.toLowerCase() === 'brts') return 'BRTS';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');

export default function BusStopDesignAnalysis({ rows = [] }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const allStops = useMemo(() => {
    const stopKeys = Object.keys(stopDesignMap);

    const stopNameAlias = {
      'Akhbarnagar': 'akbar-nagar',
      'Valinath Chowk': 'shree-walinath-chowk',
      'Jhansi Ki Rani': 'janshi-ki-rani',
      'Manekbaug': 'manekbhaug',
      'Kankaria Telephone Exchnage': 'kankariya-telephone',
      'Anjali': 'anjali-brts',
    };

    const rowsByKey = rows
      .map((row) => row['Stop Name'])
      .filter(Boolean)
      .reduce((acc, stopName) => {
        const normalized = stopName
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/_/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        const fileKey = stopNameAlias[stopName] || normalized;
        acc[fileKey] = stopName;
        return acc;
      }, {});

    const stopEntries = stopKeys.map((key) => {
      const category = stopDesignMap[key] || 'minimal';
      const stopName = rowsByKey[key] || formatStopLabel(key);
      return {
        key,
        label: stopName,
        image: `/images/stops/${key}.jpg`,
        category,
      };
    });

    const unmatchedKeys = Object.keys(rowsByKey).filter((fileKey) => !stopDesignMap[fileKey]);
    if (unmatchedKeys.length) {
      console.warn(`[Bus Stop Design] Missing category for ${unmatchedKeys.length} stop${unmatchedKeys.length > 1 ? 's' : ''}:`, unmatchedKeys);
    }

    return stopEntries;
  }, [rows]);

  const visibleStops = useMemo(() => {
    if (activeCategory === 'all') return allStops;
    return allStops.filter((stop) => stop.category === activeCategory);
  }, [activeCategory, allStops]);

  const visibleCategories = activeCategory === 'all' ? categoryOrder : [activeCategory];

  return (
    <section className="design-page section-block">
      <div className="card-heading">
        <div>
          <h2>Bus Stop Design Analysis</h2>
          <p className="design-page-subtitle">
            Review stop infrastructure by category and identify design quality differences across the network.
          </p>
        </div>
      </div>

      <div className="design-filter-bar">
        {['all', 'brts', 'semi', 'minimal'].map((filter) => (
          <button
            key={filter}
            type="button"
            className={filter === activeCategory ? 'design-filter-btn active' : 'design-filter-btn'}
            onClick={() => setActiveCategory(filter)}
          >
            {filter === 'all' ? 'All' : filter === 'brts' ? 'BRTS' : filter === 'semi' ? 'Semi-Covered' : 'Minimal'}
          </button>
        ))}
      </div>

      {visibleCategories.map((category) => {
        const stopsForCategory = visibleStops.filter((stop) => stop.category === category);
        if (stopsForCategory.length === 0) return null;

        return (
          <div className="design-category-block" key={category}>
            <div className="design-category-header">
              <h3>{categoryDetails[category].title}</h3>
              <p>{categoryDetails[category].description}</p>
            </div>
            <div className="design-card-grid">
              {stopsForCategory.map((stop) => (
                <div className="design-card" key={stop.key}>
                  <img
                    className="design-card-image"
                    src={stop.image}
                    alt={stop.label}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = placeholderImage;
                    }}
                  />
                  <div className="design-card-body">
                    <h4 className="design-stop-name">{stop.label}</h4>
                    <span className="design-category-label">{categoryDetails[stop.category].title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <section className="design-insights">
        <h3>Design Insights</h3>
        <p>BRTS stations show the highest safety and structural quality, reflecting full station design and dedicated corridor standards.</p>
        <p>Semi-covered stops provide moderate comfort but limited enclosure, offering partial protection with basic amenities.</p>
        <p>Minimal stops lack essential infrastructure and reduce usability for passengers, especially in challenging weather conditions.</p>
        <p>Design quality strongly correlates with urban density and commercial activity, where busier corridors receive more robust transit investments.</p>
      </section>
    </section>
  );
}
