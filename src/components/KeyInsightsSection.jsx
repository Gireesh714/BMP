import React, { useMemo } from 'react';
import IndexCard from './IndexCard';
import './KeyInsightsSection.css';

const KeyInsightsSection = ({ data }) => {
  const insights = useMemo(() => {
    if (!data || data.length === 0) return [];

    const availableFields = new Set(Object.keys(data[0] || {}));

    const orderedIndices = [
      'surveillanceIndex',
      'pedestrianSafetyIndex',
      'structuralIntegrityIndex',
      'passengerComfortIndex',
      'informationAccessibilityIndex',
      'cleanlinessSupportIndex',
      'safetyScore',
      'safetyIndex',
      'amenityScore',
      'amenityIndex',
      'combinedScore',
      'combinedIndex'
    ];

    const definitions = {
      surveillanceIndex: {
        label: 'Surveillance Index',
        compute: (row) => (Number(row['Lighting Quality']) || 0) + (Number(row['CCTV Presence']) || 0),
        explanation: 'Lighting and monitoring conditions',
        isPercentage: false,
        requiredFields: ['Lighting Quality', 'CCTV Presence']
      },
      pedestrianSafetyIndex: {
        label: 'Pedestrian Safety Index',
        compute: (row) => (Number(row['Pedestrian Crossing Facility']) || 0) + (Number(row['Traffic Speed Control']) || 0),
        explanation: 'Crossing safety and traffic control conditions',
        isPercentage: false,
        requiredFields: ['Pedestrian Crossing Facility', 'Traffic Speed Control']
      },
      structuralIntegrityIndex: {
        label: 'Structural Integrity Index',
        compute: (row) => (Number(row['Structural Condition']) || 0) + (Number(row['Visibility / Natural Surveillance']) || 0),
        explanation: 'Physical condition and visibility of bus stops',
        isPercentage: false,
        requiredFields: ['Structural Condition', 'Visibility / Natural Surveillance']
      },
      passengerComfortIndex: {
        label: 'Passenger Comfort Index',
        compute: (row) => (Number(row['Covered Shelter']) || 0) + (Number(row['Seating Availability']) || 0),
        explanation: 'Shelter and seating availability',
        isPercentage: false,
        requiredFields: ['Covered Shelter', 'Seating Availability']
      },
      informationAccessibilityIndex: {
        label: 'Information Accessibility Index',
        compute: (row) => (Number(row['Route Information Display']) || 0) + (Number(row['Digital Display']) || 0),
        explanation: 'Availability of route and digital information',
        isPercentage: false,
        requiredFields: ['Route Information Display', 'Digital Display']
      },
      cleanlinessSupportIndex: {
        label: 'Cleanliness & Support Index',
        compute: (row) => (Number(row['Cleanliness']) || 0) + (Number(row['Nearby Shops (≤50m)']) || 0),
        explanation: 'Hygiene and nearby support facilities',
        isPercentage: false,
        requiredFields: ['Cleanliness', 'Nearby Shops (≤50m)']
      },
      safetyScore: {
        label: 'Safety Score',
        compute: (row) => ['Lighting Quality', 'CCTV Presence', 'Pedestrian Crossing Facility', 'Traffic Speed Control', 'Structural Condition', 'Visibility / Natural Surveillance']
          .reduce((sum, field) => sum + (Number(row[field]) || 0), 0),
        explanation: 'Raw safety parameter score',
        isPercentage: false,
        requiredFields: ['Lighting Quality', 'CCTV Presence', 'Pedestrian Crossing Facility', 'Traffic Speed Control', 'Structural Condition', 'Visibility / Natural Surveillance']
      },
      safetyIndex: {
        label: 'Safety Index',
        compute: (row) => {
          const score = Number(row.safetyScore || 0);
          return score ? (score / 18) * 100 : 0;
        },
        explanation: 'Normalized safety score',
        isPercentage: true,
        requiredFields: []
      },
      amenityScore: {
        label: 'Amenity Score',
        compute: (row) => ['Covered Shelter', 'Seating Availability', 'Route Information Display', 'Digital Display', 'Cleanliness', 'Nearby Shops (≤50m)']
          .reduce((sum, field) => sum + (Number(row[field]) || 0), 0),
        explanation: 'Raw amenity parameter score',
        isPercentage: false,
        requiredFields: ['Covered Shelter', 'Seating Availability', 'Route Information Display', 'Digital Display', 'Cleanliness', 'Nearby Shops (≤50m)']
      },
      amenityIndex: {
        label: 'Amenity Index',
        compute: (row) => {
          const score = Number(row.amenityScore || 0);
          return score ? (score / 18) * 100 : 0;
        },
        explanation: 'Normalized amenity score',
        isPercentage: true,
        requiredFields: []
      },
      combinedScore: {
        label: 'Combined Score',
        compute: (row) => Number(row.safetyScore || 0) + Number(row.amenityScore || 0),
        explanation: 'Total raw performance combining safety and amenity parameters',
        isPercentage: false,
        requiredFields: []
      },
      combinedIndex: {
        label: 'Combined Index',
        compute: (row) => {
          const safety = Number(row.safetyIndex || 0);
          const amenity = Number(row.amenityIndex || 0);
          return (safety + amenity) / 2;
        },
        explanation: 'Overall performance indicator',
        isPercentage: true,
        requiredFields: []
      }
    };

    const computeOrder = [
      'surveillanceIndex',
      'pedestrianSafetyIndex',
      'structuralIntegrityIndex',
      'passengerComfortIndex',
      'informationAccessibilityIndex',
      'cleanlinessSupportIndex',
      'safetyScore',
      'amenityScore',
      'combinedScore',
      'safetyIndex',
      'amenityIndex',
      'combinedIndex'
    ];

    const usableIndices = orderedIndices;

    // Compute scores for each row using derived values in safe order
    const dataWithScores = data.map(row => {
      const computed = {};
      computeOrder.forEach((key) => {
        const index = definitions[key];
        const sourceRow = { ...row, ...computed };
        const value = index.compute(sourceRow);
        computed[key] = Number.isFinite(value) ? value : 0;
      });
      return { ...row, ...computed };
    });

    // For each selected ordered index, find highest and lowest
    return usableIndices.map((key) => {
      const index = definitions[key];
      const sorted = [...dataWithScores].sort((a, b) => b[key] - a[key]);
      const highest = sorted[0] || {};
      const lowest = sorted[sorted.length - 1] || {};

      const roundValue = (val) => {
        const safeVal = Number.isFinite(val) ? val : 0;
        return index.isPercentage ? Number(safeVal.toFixed(2)) : Math.round(safeVal);
      };

      return {
        label: index.label,
        explanation: index.explanation,
        isPercentage: index.isPercentage,
        highest: {
          stopName: highest['Stop Name'] || 'N/A',
          score: roundValue(highest[key])
        },
        lowest: {
          stopName: lowest['Stop Name'] || 'N/A',
          score: roundValue(lowest[key])
        }
      };
    });
  }, [data]);

  return (
    <section className="key-insights-section">
      <div className="section-header">
        <h2>Key Stop-Level Insights</h2>
        <p>These insights highlight the best and worst performing bus stops across different indices, helping identify infrastructure gaps and high-performing locations.</p>
      </div>
      <div className="insights-grid">
        {insights.map((insight, index) => (
          <IndexCard key={index} {...insight} />
        ))}
      </div>
    </section>
  );
};

export default KeyInsightsSection;