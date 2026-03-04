import React, { useState } from 'react';

export const Header = ({ 
  onFileSelect, 
  currentDocument, 
  isLoading, 
  theme, 
  onThemeToggle 
}) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const handleExportClick = () => {
    setIsExportMenuOpen(!isExportMenuOpen);
  };

  const handleExportType = (type) => {
    // Placeholder for export functionality
    console.log(`Exporting as ${type}`);
    setIsExportMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="app-title">PDF Reading Companion</h1>
        {currentDocument && (
          <div className="document-info">
            <span className="document-name" title={currentDocument.fileName}>
              {currentDocument.fileName.length > 30 
                ? `${currentDocument.fileName.substring(0, 30)}...` 
                : currentDocument.fileName}
            </span>
          </div>
        )}
      </div>

      <div className="header-right">
        {currentDocument && (
          <>
            <button 
              className="btn btn-outline"
              onClick={handleExportClick}
              aria-label="Export data"
              title="Export notes and progress"
            >
              Export
            </button>
            
            {isExportMenuOpen && (
              <div className="export-menu">
                <button 
                  onClick={() => handleExportType('json')}
                  className="export-option"
                >
                  Export as JSON
                </button>
                <button 
                  onClick={() => handleExportType('markdown')}
                  className="export-option"
                >
                  Export as Markdown
                </button>
              </div>
            )}
          </>
        )}

        <label className="file-input-label">
          <input
            type="file"
            accept=".pdf"
            onChange={onFileSelect}
            style={{ display: 'none' }}
            disabled={isLoading}
          />
          <span className="btn btn-primary">
            {isLoading ? (
              <>
                <span className="loading" /> Loading...
              </>
            ) : currentDocument ? (
              'Switch Document'
            ) : (
              'Open PDF'
            )}
          </span>
        </label>

        <button
          className="theme-toggle btn btn-outline"
          onClick={onThemeToggle}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Close export menu when clicking elsewhere */}
      {isExportMenuOpen && (
        <div 
          className="overlay" 
          onClick={() => setIsExportMenuOpen(false)}
        />
      )}
    </header>
  );
};