import Dexie from 'dexie';

// Initialize Dexie database
const db = new Dexie('PDFReaderDB');

// Define database schema
db.version(1).stores({
  documents: '++id, fileName, fileSize, totalPages, createdAt, lastOpened, lastPageRead, readPercentage, totalReadingTime, metadata',
  readingProgress: '++id, documentId, currentPage, percentage, lastUpdated, readingSessions',
  notes: '++id, documentId, page, content, tags, createdAt, updatedAt, isPinned, type',
  readingSessions: '++id, documentId, startTime, endTime, duration, pagesRead, goalMet',
  appSettings: '++id, theme, readingGoal, pdfViewMode, zoomLevel, lastUsedTags, showPageNumbers',
  goals: '++id, name, target, targetType, period, currentProgress, startDate, endDate, isActive'
});

// Helper functions for database operations
export const databaseService = {
  // Documents
  getDocument: async (fileName) => {
    return await db.documents.where('fileName').equals(fileName).first();
  },
  
  saveDocument: async (document) => {
    // Check if document already exists
    const existing = await db.documents.where('fileName').equals(document.fileName).first();
    
    if (existing) {
      // Update existing document
      return await db.documents.update(existing.id, document);
    } else {
      // Add new document
      return await db.documents.add(document);
    }
  },
  
  getAllDocuments: async () => {
    return await db.documents.orderBy('lastOpened').reverse().toArray();
  },
  
  updateDocumentProgress: async (fileName, progressData) => {
    const doc = await db.documents.where('fileName').equals(fileName).first();
    if (doc) {
      return await db.documents.update(doc.id, {
        lastPageRead: progressData.currentPage,
        readPercentage: progressData.percentage,
        lastOpened: new Date(),
        ...progressData
      });
    }
  },

  // Notes
  getNotesByDocument: async (documentId) => {
    return await db.notes.where('documentId').equals(documentId).sortBy('page');
  },
  
  getNotesByPage: async (documentId, page) => {
    return await db.notes.where({ documentId, page }).sortBy('createdAt');
  },
  
  saveNote: async (note) => {
    if (note.id) {
      // Update existing note
      return await db.notes.update(note.id, {
        content: note.content,
        tags: note.tags,
        updatedAt: new Date(),
        isPinned: note.isPinned,
        type: note.type
      });
    } else {
      // Add new note
      note.createdAt = new Date();
      note.updatedAt = new Date();
      return await db.notes.add(note);
    }
  },
  
  deleteNote: async (noteId) => {
    return await db.notes.delete(noteId);
  },
  
  updateNote: async (noteId, updates) => {
    return await db.notes.update(noteId, updates);
  },

  // Reading Progress
  getReadingProgress: async (documentId) => {
    return await db.readingProgress.where('documentId').equals(documentId).first();
  },
  
  saveReadingProgress: async (progress) => {
    const existing = await db.readingProgress.where('documentId').equals(progress.documentId).first();
    
    if (existing) {
      return await db.readingProgress.update(existing.id, progress);
    } else {
      return await db.readingProgress.add(progress);
    }
  },

  // Reading Sessions
  getReadingSessions: async (documentId) => {
    return await db.readingSessions.where('documentId').equals(documentId).toArray();
  },
  
  saveReadingSession: async (session) => {
    return await db.readingSessions.add(session);
  },
  
  updateReadingSession: async (sessionId, updates) => {
    return await db.readingSessions.update(sessionId, updates);
  },

  // App Settings
  getAppSettings: async () => {
    return await db.appSettings.where('id').equals('app_settings').first();
  },
  
  saveAppSettings: async (settings) => {
    const existing = await db.appSettings.where('id').equals('app_settings').first();
    
    if (existing) {
      return await db.appSettings.update('app_settings', settings);
    } else {
      settings.id = 'app_settings';
      return await db.appSettings.add(settings);
    }
  },

  // Goals
  getAllGoals: async () => {
    return await db.goals.toArray();
  },
  
  saveGoal: async (goal) => {
    if (goal.id) {
      return await db.goals.update(goal.id, goal);
    } else {
      return await db.goals.add(goal);
    }
  },
  
  deleteGoal: async (goalId) => {
    return await db.goals.delete(goalId);
  }
};

export default db;