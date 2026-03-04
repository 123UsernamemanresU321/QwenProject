import React, { useEffect, useRef, useState } from 'react';

export const PDFRenderer = ({ 
  pdfUrl, 
  pageNumber, 
  scale, 
  onLoadComplete, 
  onError 
}) => {
  const canvasRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pdfUrl) return;

    const loadPDF = async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const doc = await loadingTask.promise;
        setPdfDoc(doc);
        
        if (onLoadComplete) {
          onLoadComplete(doc.numPages);
        }
      } catch (err) {
        console.error('Error loading PDF:', err);
        if (onError) {
          onError(err);
        }
      }
    };

    loadPDF();
  }, [pdfUrl, onLoadComplete, onError]);

  useEffect(() => {
    if (!pdfDoc || !pageNumber || !canvasRef.current) return;

    const renderPage = async () => {
      try {
        setLoading(true);
        const page = await pdfDoc.getPage(pageNumber);
        
        const viewport = page.getViewport({ scale });
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Set canvas dimensions
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Render the page on the canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        
        await page.render(renderContext).promise;
        setLoading(false);
      } catch (err) {
        console.error('Error rendering page:', err);
        if (onError) {
          onError(err);
        }
        setLoading(false);
      }
    };

    renderPage();
  }, [pdfDoc, pageNumber, scale, onError]);

  return (
    <div className="pdf-page-container">
      {loading && (
        <div className="pdf-loading">
          <div className="loading-spinner"></div>
          <p>Loading page {pageNumber}...</p>
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        className="pdf-canvas"
        style={{ display: loading ? 'none' : 'block' }}
      />
    </div>
  );
};