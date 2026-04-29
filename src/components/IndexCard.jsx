import React from 'react';
import './IndexCard.css';

const IndexCard = ({ label, explanation, isPercentage, highest, lowest }) => {
  return (
    <div className="index-card">
      <div className="card-header">
        <h3 className="card-title">{label}</h3>
        <p className="card-subtitle">{explanation}</p>
      </div>
      <div className="card-content">
        <div className="insight-row row highest">
          <div>
            <span className="icon">↑</span>
            <span className="label">Highest:</span>
            <span className="stop-name">{highest.stopName}</span>
          </div>
          <span className="score value">{highest.score}{isPercentage ? '%' : ''}</span>
        </div>
        <div className="insight-row row lowest">
          <div>
            <span className="icon">↓</span>
            <span className="label">Lowest:</span>
            <span className="stop-name">{lowest.stopName}</span>
          </div>
          <span className="score value">{lowest.score}{isPercentage ? '%' : ''}</span>
        </div>
      </div>
    </div>
  );
};

export default IndexCard;