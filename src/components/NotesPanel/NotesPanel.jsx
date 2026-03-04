import React, { useState, useEffect } from 'react';
import { NoteList } from './NoteList';
import { NoteEditor } from './NoteEditor';
import { useDatabase } from '../../contexts/DatabaseContext';

export const NotesPanel = ({ documentId, currentPage }) => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [filterTag, setFilterTag] = useState('');
  const [sortBy, setSortBy] = useState('page'); // 'page', 'newest', 'oldest'
  const [isLoading, setIsLoading] = useState(false);
  const db = useDatabase();

  // Load notes for current document
  useEffect(() => {
    const loadNotes = async () => {
      if (!documentId) return;
      
      setIsLoading(true);
      try {
        const allNotes = await db.getNotesByDocument(documentId);
        setNotes(allNotes);
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, [documentId, db]);

  // Add or update note
  const handleSaveNote = async (noteData) => {
    try {
      const note = {
        ...noteData,
        documentId
      };
      
      const savedId = await db.saveNote(note);
      
      // Refresh notes list
      const updatedNotes = await db.getNotesByDocument(documentId);
      setNotes(updatedNotes);
      
      // If this was an edit, clear selection
      if (noteData.id) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  // Delete note
  const handleDeleteNote = async (noteId) => {
    try {
      await db.deleteNote(noteId);
      
      // Refresh notes list
      const updatedNotes = await db.getNotesByDocument(documentId);
      setNotes(updatedNotes);
      
      // Clear selection if deleted note was selected
      if (selectedNote && selectedNote.id === noteId) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Filter and sort notes
  const filteredNotes = notes.filter(note => {
    if (!filterTag) return true;
    return note.tags && note.tags.includes(filterTag);
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'page') {
      return a.page - b.page;
    } else if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  // Get unique tags for filter dropdown
  const allTags = [...new Set(notes.flatMap(note => note.tags || []))];

  return (
    <div className="notes-panel">
      <div className="notes-header">
        <h3>Notes</h3>
        <div className="notes-filters">
          <select 
            value={filterTag} 
            onChange={(e) => setFilterTag(e.target.value)}
            className="filter-select"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="page">Sort by Page</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="notes-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading notes...</p>
          </div>
        ) : (
          <>
            <NoteList
              notes={sortedNotes}
              selectedNote={selectedNote}
              onSelectNote={setSelectedNote}
              onDeleteNote={handleDeleteNote}
              currentPage={currentPage}
            />
            
            <NoteEditor
              currentDocumentId={documentId}
              currentPage={currentPage}
              onSaveNote={handleSaveNote}
              selectedNote={selectedNote}
              onCancelEdit={() => setSelectedNote(null)}
            />
          </>
        )}
      </div>
    </div>
  );
};