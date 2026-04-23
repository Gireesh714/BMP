import * as XLSX from 'xlsx';
import { calculateAmenityScore, calculateSafetyIndex } from '../utils/dataHelpers.js';

export const SHEET_URL = '/BMP02 excelsheet.xlsx';

export const FIELD_MAP = {
  passengerDensity: 'Passenger Density',
  lighting: 'Lighting Quality',
  cctv: 'CCTV Presence',
  crossing: 'Pedestrian Crossing Facility',
  traffic: 'Traffic Speed Control',
  structure: 'Structural Condition',
  visibility: 'Visibility / Natural Surveillance',
  shelter: 'Covered Shelter',
  seating: 'Seating Availability',
  routeInfo: 'Route Information Display',
  digitalDisplay: 'Digital Display',
  cleanliness: 'Cleanliness',
  nearbyShops: 'Nearby Shops',
};

export const SCORE_FIELDS = Object.values(FIELD_MAP);

export const METRIC_LABELS = {
  [FIELD_MAP.passengerDensity]: 'Passenger density',
  [FIELD_MAP.lighting]: 'Lighting',
  [FIELD_MAP.cctv]: 'CCTV',
  [FIELD_MAP.crossing]: 'Pedestrian crossing',
  [FIELD_MAP.traffic]: 'Traffic control',
  [FIELD_MAP.structure]: 'Structure',
  [FIELD_MAP.visibility]: 'Visibility',
  [FIELD_MAP.shelter]: 'Covered shelter',
  [FIELD_MAP.seating]: 'Seating',
  [FIELD_MAP.routeInfo]: 'Route info',
  [FIELD_MAP.digitalDisplay]: 'Digital display',
  [FIELD_MAP.cleanliness]: 'Cleanliness',
  [FIELD_MAP.nearbyShops]: 'Nearby shops',
};

function findKey(row, predicate) {
  return Object.keys(row).find(predicate);
}

export function normalizeRow(row) {
  const normalized = { ...row };

  SCORE_FIELDS.forEach((label) => {
    const sourceKey = findKey(row, (keyName) => keyName.toLowerCase().includes(label.toLowerCase()));
    normalized[label] = Number(row[sourceKey]) || 0;
  });

  normalized.safetyIndex = calculateSafetyIndex(normalized);
  normalized.amenityIndex = calculateAmenityScore(normalized);
  normalized.combinedScore = normalized.safetyIndex + normalized.amenityIndex;

  return normalized;
}

export function loadWorkbookFromBuffer(arrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' }).map(normalizeRow);

  console.log(
    'Sample stop scores:',
    rows.slice(0, 3).map((row) => ({
      stop: row['Stop Name'],
      safetyIndex: Number(row.safetyIndex.toFixed(2)),
      amenityScore: Number(row.amenityIndex.toFixed(2)),
      combinedScore: Number(row.combinedScore.toFixed(2)),
    })),
  );

  return rows;
}
