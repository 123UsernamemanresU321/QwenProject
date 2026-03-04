import React, { useState, useEffect } from 'react';

export const NoteEditor = ({ 
  currentDocumentId, 
  currentPage, 
  onSaveNote, 
  selectedNote, 
  onCancelEdit 
}) => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [notePage, setNotePage] = useState(currentPage);
  const [noteType, setNoteType] = useState('note');

  // Pre-fill form when editing existing note
  useEffect(() => {
    if (selectedNote) {
      setContent(selectedNote.content || '');
      setTags(selectedNote.tags ? selectedNote.tags.join(', ') : '');
      setNotePage(selectedNote.page || currentPage);
      setNoteType(selectedNote.type || 'note');
    } else {
      // Reset form for new note
      setContent('');
      setTags('');
      setNotePage(currentPage);
      setNoteType('note');
    }
  }, [selectedNote, currentPage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const noteData = {
      ...(selectedNote && { id: selectedNote.id }), // Include id only when updating
      content: content.trim(),
      page: parseInt(notePage),
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      type: noteType
    };

    if (noteData.content) {
      onSaveNote(noteData);
    }
  };

  const handleCancel = () => {
    setContent('');
    setTags('');
    setNotePage(currentPage);
    setNoteType('note');
    onCancelEdit();
  };

  const predefinedTags = ['important', 'question', 'definition', 'quote', 'todo'];

  const addPredefinedTag = (tag) => {
    const currentTags = tags.split(',').map(t => t.trim()).filter(t => t);
    if (!currentTags.includes(tag)) {
      setTags([...currentTags, tag].join(', '));
    }
  };

  return (
    <div className="note-editor">
      <h4>{selectedNote ? 'Edit Note' : 'Add New Note'}</h4>
      
      <form onSubmit={handleSubmit} className="note-form">
        <div className="form-group">
          <label htmlFor="note-page">Page Number:</label>
          <input
            type="number"
            id="note-page"
            value={notePage}
            onChange={(e) => setNotePage(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="note-type">Note Type:</label>
          <select
            id="note-type"
            value={noteType}
            onChange={(e) => setNoteType(e.target.value)}
            className="form-control"
          >
            <option value="note">Note</option>
            <option value="question">Question</option>
            <option value="quote">Quote</option>
            <option value="definition">Definition</option>
            <option value="summary">Summary</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="note-content">Content:</label>
          <textarea
            id="note-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            rows="4"
            required
            className="form-control textarea-full"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="note-tags">Tags (comma separated):</label>
          <input
            type="text"
            id="note-tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., important, research, key-point"
            className="form-control"
          />
          <div className="predefined-tags">
            {predefinedTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => addPredefinedTag(tag)}
                className="tag-chip"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {selectedNote ? 'Update Note' : 'Save Note'}
          </button>
          {selectedNote && (
            <button 
              type="button" 
              onClick={handleCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};