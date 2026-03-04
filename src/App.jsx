import React, { useState, useEffect } from 'react';
import { PDFViewerContainer } from './components/PDFViewer/PDFViewerContainer';
import { Header } from './components/common/Header';
import { NotesPanel } from './components/NotesPanel/NotesPanel';
import { useTheme } from './hooks/useTheme';
import { useIndexedDB } from './hooks/useIndexedDB';
import { DatabaseProvider } from './contexts/DatabaseContext';
import './styles/App.css';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [currentDocument, setCurrentDocument] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize database
  const db = useIndexedDB();

  // Handle PDF file selection
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.includes('pdf')) {
      setError('Please select a valid PDF file');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Create object URL for the PDF
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      
      // Here we would normally extract document info from PDF
      // For now, we'll just store basic file info
      const documentInfo = {
        fileName: file.name,
        fileSize: file.size,
        lastModified: file.lastModified
      };
      
      setCurrentDocument(documentInfo);
    } catch (err) {
      setError(`Failed to load PDF: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <DatabaseProvider value={db}>
      <div className={`app ${theme}`}>
        <Header 
          onFileSelect={handleFileSelect}
          currentDocument={currentDocument}
          isLoading={isLoading}
          theme={theme}
          onThemeToggle={toggleTheme}
        />
        
        <div className="app-main">
          {currentDocument ? (
            <>
              <div className="pdf-viewer-container">
                <PDFViewerContainer 
                  pdfUrl={pdfUrl}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  totalPages={totalPages}
                  onTotalPagesChange={setTotalPages}
                />
              </div>
              
              <div className="notes-panel-container">
                <NotesPanel 
                  documentId={currentDocument.fileName} 
                  currentPage={currentPage}
                />
              </div>
            </>
          ) : (
            <div className="welcome-screen">
              <h2>Welcome to PDF Reading Companion</h2>
              <p>Select a PDF file to begin reading and taking notes</p>
              <label className="file-input-label">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <span className="btn btn-primary">Choose PDF File</span>
              </label>
              {error && <div className="error-message">{error}</div>}
            </div>
          )}
        </div>
      </div>
    </DatabaseProvider>
  );
}

export default App;