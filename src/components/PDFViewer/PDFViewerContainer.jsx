import React, { useState, useEffect, useRef } from 'react';
import { PDFRenderer } from './PDFRenderer';
import { PageControls } from './PageControls';
import { ZoomControls } from './ZoomControls';

// Initialize PDF.js worker
const pdfjsLib = await import('pdfjs-dist');
pdfjsLib.GlobalWorkerOptions.workerSrc = 
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

export const PDFViewerContainer = ({
  pdfUrl,
  currentPage,
  onPageChange,
  totalPages,
  onTotalPagesChange
}) => {
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  // Calculate scale based on container size
  const calculateScale = (containerWidth) => {
    // Fit to width with some margin
    return Math.max(0.5, Math.min(2.0, (containerWidth - 40) / 600));
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const newScale = calculateScale(containerRef.current.clientWidth);
        setScale(newScale);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update total pages when PDF loads
  const handleLoadComplete = (numPages) => {
    onTotalPagesChange(numPages);
    setIsLoading(false);
  };

  const handleError = (err) => {
    setError(err.message);
    setIsLoading(false);
  };

  // Zoom functions
  const zoomIn = () => {
    setScale(prev => Math.min(2.0, prev + 0.1));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.1));
  };

  const fitToWidth = () => {
    if (containerRef.current) {
      const newScale = calculateScale(containerRef.current.clientWidth);
      setScale(newScale);
    }
  };

  return (
    <div className="pdf-viewer-container" ref={containerRef}>
      {error ? (
        <div className="error-message">
          Error loading PDF: {error}
        </div>
      ) : (
        <>
          <div className="viewer-controls">
            <PageControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              isLoading={isLoading}
            />
            <ZoomControls
              scale={scale}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onFitToWidth={fitToWidth}
            />
          </div>
          
          <div className="pdf-renderer-wrapper">
            <PDFRenderer
              pdfUrl={pdfUrl}
              pageNumber={currentPage}
              scale={scale}
              onLoadComplete={handleLoadComplete}
              onError={handleError}
            />
          </div>
        </>
      )}
    </div>
  );
};
