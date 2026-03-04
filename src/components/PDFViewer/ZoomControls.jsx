import React from 'react';

export const ZoomControls = ({ 
  scale, 
  onZoomIn, 
  onZoomOut, 
  onFitToWidth 
}) => {
  const zoomPercent = Math.round(scale * 100);

  return (
    <div className="zoom-controls">
      <button
        className="btn btn-outline zoom-btn"
        onClick={onZoomOut}
        aria-label="Zoom out"
      >
        −
      </button>
      
      <span className="zoom-percent">{zoomPercent}%</span>
      
      <button
        className="btn btn-outline zoom-btn"
        onClick={onZoomIn}
        aria-label="Zoom in"
      >
        +
      </button>
      
      <button
        className="btn btn-outline fit-width-btn"
        onClick={onFitToWidth}
        aria-label="Fit to width"
      >
        Fit Width
      </button>
    </div>
  );
};