import React from 'react';

export const NoteList = ({ 
  notes, 
  selectedNote, 
  onSelectNote, 
  onDeleteNote, 
  currentPage 
}) => {
  if (notes.length === 0) {
    return (
      <div className="notes-empty-state">
        <p>No notes yet.</p>
        <p>Add a note on page {currentPage} to get started.</p>
      </div>
    );
  }

  return (
    <div className="note-list">
      {notes.map(note => (
        <div 
          key={note.id} 
          className={`note-item ${selectedNote?.id === note.id ? 'selected' : ''}`}
          onClick={() => onSelectNote(note)}
        >
          <div className="note-header">
            <div className="note-page">Page {note.page}</div>
            <div className="note-actions">
              <button 
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
                aria-label="Delete note"
              >
                ×
              </button>
            </div>
          </div>
          <div className="note-preview">
            {note.content.substring(0, 100)}
            {note.content.length > 100 && '...'}
          </div>
          <div className="note-tags">
            {note.tags && note.tags.map(tag => (
              <span key={tag} className="note-tag">{tag}</span>
            ))}
          </div>
          <div className="note-date">
            {new Date(note.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};