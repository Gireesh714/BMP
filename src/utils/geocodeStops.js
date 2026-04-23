import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');
const workbookPath = path.join(projectRoot, 'public', 'BMP02 excelsheet.xlsx');
const cachePath = path.join(projectRoot, 'src', 'data', 'stopsWithCoords.json');

function getStopRoute(stop) {
  return stop['Route (Ahmedabad / Gandhinagar)'] || stop.route || '';
}

function buildQuery(stop) {
  const name = stop['Stop Name'] || stop.name || '';
  const route = getStopRoute(stop);
  const city = String(route).toLowerCase().includes('gandhinagar') ? 'Gandhinagar' : 'Ahmedabad';
  return `${name}, ${city}, Gujarat, India`;
}

function buildQueryVariants(stop) {
  const name = (stop['Stop Name'] || stop.name || '').trim();
  const route = getStopRoute(stop);
  const city = String(route).toLowerCase().includes('gandhinagar') ? 'Gandhinagar' : 'Ahmedabad';
  const normalizedName = name
    .replace(/cross roads/gi, 'crossroad')
    .replace(/exchnage/gi, 'exchange')
    .replace(/\s+/g, ' ')
    .trim();

  return [
    `${name}, ${city}, Gujarat, India`,
    `${normalizedName}, ${city}, Gujarat, India`,
    `${name}, ${city}, India`,
    `${normalizedName}, ${city}, India`,
    `${name}, Gujarat, India`,
    `${normalizedName}, Gujarat, India`,
    `${name}, India`,
  ];
}

async function loadCache() {
  try {
    const raw = await fs.readFile(cachePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveCache(records) {
  await fs.mkdir(path.dirname(cachePath), { recursive: true });
  await fs.writeFile(cachePath, `${JSON.stringify(records, null, 2)}\n`, 'utf8');
}

async function fetchCoords(query) {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'App_Purb/1.0 (bus-stop-research-dashboard)',
      Referer: 'http://localhost',
    },
  });

  if (!response.ok) {
    throw new Error(`Nominatim request failed with ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const [first] = data;
  return {
    lat: Number(first.lat),
    lng: Number(first.lon),
  };
}

async function fetchCoordsWithFallbacks(stop) {
  for (const query of buildQueryVariants(stop)) {
    try {
      const coords = await fetchCoords(query);
      if (coords) {
        return { coords, query };
      }
    } catch (error) {
      console.warn(`Failed query "${query}": ${error.message}`);
    }
  }
  return null;
}

function readStopsFromWorkbook() {
  return fs.readFile(workbookPath).then((buffer) => {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  });
}

async function readStops() {
  return readStopsFromWorkbook();
}

function toKey(stop) {
  const name = stop['Stop Name'] || stop.name || '';
  const route = getStopRoute(stop);
  return `${name}::${route}`;
}

function normalizeCachedRecord(item) {
  if (!item || !item.name || !item.route) {
    return null;
  }
  return {
    name: item.name,
    route: item.route,
    lat: Number(item.lat),
    lng: Number(item.lng),
  };
}

export async function geocodeStops(stops) {
  const cache = await loadCache();
  const cachedByKey = new Map(
    cache.map((item) => {
      const normalized = normalizeCachedRecord(item);
      return normalized ? [toKey(normalized), normalized] : null;
    }).filter(Boolean),
  );

  const results = [];

  for (const stop of stops) {
    const name = stop['Stop Name'] || stop.name || '';
    const route = getStopRoute(stop);
    const key = `${name}::${route}`;
    const cached = cachedByKey.get(key);

    if (cached && Number.isFinite(cached.lat) && Number.isFinite(cached.lng)) {
      results.push(cached);
      continue;
    }

    const result = await fetchCoordsWithFallbacks(stop);
    if (!result) {
      console.warn(`No geocoding result for: ${buildQuery(stop)}`);
      continue;
    }

    const record = { name, route, lat: result.coords.lat, lng: result.coords.lng };
      results.push(record);
      cachedByKey.set(key, record);

      await new Promise((resolve) => setTimeout(resolve, 1100));
  }

  const merged = [...cachedByKey.values()].filter((item) => item.name && item.route);
  await saveCache(merged);

  return results;
}

async function run() {
  const stops = await readStops();
  const geocoded = await geocodeStops(stops);
  console.log(`Geocoded ${geocoded.length} stops`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
