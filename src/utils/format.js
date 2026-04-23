export const scoreColor = (value) => {
  if (value >= 85) return '#2dd4bf';
  if (value >= 70) return '#7dd3fc';
  if (value >= 50) return '#fbbf24';
  return '#fb7185';
};

export const formatNumber = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
};

export const getCombinedScore = (row) => {
  if (!row) return 0;
  return row.combinedScore || row.safetyIndex + row.amenityIndex || 0;
};
