import React, { useState } from 'react';

export const PageControls = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  isLoading 
}) => {
  const [tempPageInput, setTempPageInput] = useState('');

  const goToPreviousPage = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages && !isLoading) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageInputChange = (e) => {
    const value = e.target.value;
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setTempPageInput(value);
    }
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const targetPage = parseInt(tempPageInput);
    if (targetPage >= 1 && targetPage <= totalPages) {
      onPageChange(targetPage);
      setTempPageInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handlePageInputSubmit(e);
    } else if (e.key === 'Escape') {
      setTempPageInput('');
    }
  };

  return (
    <div className="page-controls">
      <button
        className="btn btn-outline page-nav-btn"
        onClick={goToPreviousPage}
        disabled={currentPage <= 1 || isLoading}
        aria-label="Previous page"
      >
        ←
      </button>
      
      <form onSubmit={handlePageInputSubmit} className="page-input-form">
        <input
          type="text"
          value={tempPageInput || currentPage}
          onChange={handlePageInputChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setTempPageInput('')}
          className="page-input"
          aria-label="Current page number"
          disabled={isLoading}
        />
        <span className="page-separator">/</span>
        <span className="total-pages">{totalPages}</span>
      </form>
      
      <button
        className="btn btn-outline page-nav-btn"
        onClick={goToNextPage}
        disabled={currentPage >= totalPages || isLoading}
        aria-label="Next page"
      >
        →
      </button>
      
      <div className="page-progress">
        {Math.round((currentPage / totalPages) * 100)}%
      </div>
    </div>
  );
};