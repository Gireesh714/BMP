import React from 'react';
import './InsightCard.css';
import './InsightCard.css';

const InsightCard = ({ title, stopName, score, explanation, isHighest }) => {
  return (
    <div className={`insight-card ${isHighest ? 'highest' : 'lowest'}`}>
      <div className="card-header">
        <span className="card-icon">{isHighest ? '↑' : '↓'}</span>
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-content">
        <p className="stop-name">{stopName}</p>
        <p className="score">{score}%</p>
        <p className="explanation">{explanation}</p>
      </div>
    </div>
  );
};

export default InsightCard;