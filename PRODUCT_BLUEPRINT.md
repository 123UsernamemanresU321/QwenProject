# PDF Reading Companion - Product & System Blueprint

## 1. Product Overview

### Purpose
A distraction-free PDF reader with integrated note-taking, progress tracking, and study companion features for students and deep readers who prioritize privacy and local-first functionality.

### Target Users
- **Primary**: Students reading textbooks and academic papers
- **Secondary**: Researchers, professionals, and avid readers who take detailed notes
- **Tertiary**: Anyone seeking a focused, private reading environment

### Value Proposition
- **Privacy-first**: All data stays on your device, no cloud required
- **Academic focus**: Built specifically for serious reading and note-taking
- **Progress tracking**: Never lose your place or reading history
- **Exportable knowledge**: Take your notes with you anywhere via JSON export
- **Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## 2. Feature Set

### MVP (Minimum Viable Product)
- PDF import and rendering via PDF.js
- Basic page navigation (next/prev/jump to page)
- Reading progress tracking (page position, percentage)
- Simple note-taking with page association
- Note tagging system
- Session timing and daily goal tracking
- Dark/light mode
- JSON export/import of all data
- Responsive design

### V1.1 Improvements
- Advanced note formatting (markdown support)
- Note search functionality
- Reading statistics dashboard
- Multiple document libraries
- Note filtering and organization
- Keyboard shortcut improvements
- Better PDF performance optimization
- Print/export to PDF with notes

### Stretch Features
- PWA offline capability
- Multiple reading modes (sepia, night, etc.)
- Flashcard generation from notes
- Reading streak tracking
- Collaboration features (optional sharing)
- Integration with reference managers
- AI-powered summary generation
- Text selection and annotation highlighting

## 3. User Flows

### First-Time User Flow
1. Landing page explains the app
2. User selects "Open PDF" button
3. File picker opens, user selects PDF
4. App processes and loads PDF
5. Shows first page with welcome message
6. Guided tour highlights key features

### Opening a PDF Flow
1. Click "Open PDF" or "New Document"
2. Select PDF file from device
3. App calculates document fingerprint
4. Check if document exists in database
5. If exists, resume from last position
6. If new, start at page 1
7. Load PDF in viewer component

### Taking Notes Flow
1. Navigate to desired page
2. Click "Add Note" button or press shortcut
3. Note form appears with current page pre-filled
4. User enters note text and selects tags
5. Note saved and appears in notes panel
6. Note clickable to return to that page

### Resuming Reading Flow
1. App opens
2. Shows recent documents list
3. User clicks previously read document
4. App retrieves document fingerprint
5. Loads PDF and restores last page position
6. Shows progress and related notes

### Exporting Notes Flow
1. Click "Export" menu
2. Choose export format (JSON, Markdown, CSV)
3. Confirm export action
4. Download file to device
5. Option to share via email/files

## 4. Information Architecture

### Views/Pages
- **Home/Dashboard**: Recent documents, reading stats, quick actions
- **PDF Viewer**: Main reading interface with sidebar
- **Notes Library**: Browse all notes across documents
- **Settings**: Theme, export/import, preferences
- **Document List**: All imported PDFs with metadata

### Panels/Sections
- **Header**: App title, document info, main controls
- **PDF Viewer Area**: PDF rendering canvas
- **Sidebar**: Notes panel, filters, controls
- **Bottom Bar**: Mobile-specific controls and drawer toggle

## 5. UI Layout Specification

### Desktop Layout (1200px+)
```
┌─────────────────────────────────────────────────────────┐
│ Header: [Logo] Doc Title [Controls] [Theme] [Export]    │
├─────────────────────────────────────────────────────────┤
│              │                                           │
│    PDF       │      Notes Panel                         │
│   Viewer     │  ┌──────────────────────────────┐        │
│    Area      │  │ Filters: [Tag] [Sort]        │        │
│              │  ├──────────────────────────────┤        │
│              │  │ Note List                     │        │
│              │  │ • Page 12: Important concept │        │
│              │  │ • Page 25: Key formula       │        │
│              │  └──────────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

### Tablet Layout (768px-1199px)
- Collapsible sidebar (toggle button)
- Main PDF area with expandable notes panel
- Optimized touch targets

### Mobile Layout (<768px)
```
┌─────────────────────────┐
│ Header: [Menu] Title    │
├─────────────────────────┤
│         PDF             │
│        Viewer           │
│                         │
├─────────────────────────┤
│ [Note Btn] [Page Ctrl]  │
│─────────────────────────│
│ Notes Panel (Drawer)    │
│ • Filter buttons        │
│ • Note list             │
│ • Add note form         │
└─────────────────────────┘
```

## 6. Component Architecture

```
App
├── Header
│   ├── Logo
│   ├── DocumentInfo
│   ├── NavigationControls
│   ├── ThemeToggle
│   └── ExportMenu
├── MainLayout
│   ├── PDFViewerContainer
│   │   ├── PDFRenderer (using PDF.js)
│   │   ├── PageControls
│   │   └── ZoomControls
│   └── NotesPanel
│       ├── NoteFilters
│       ├── NoteList
│       │   ├── NoteItem
│       │   └── NoteActions
│       ├── NoteEditor
│       └── TagManager
├── SettingsModal
├── ImportExportModal
└── ThemeProvider
```

## 7. Data Model/Schema for IndexedDB

### Documents Store
```javascript
{
  id: string (SHA-256 hash of file + metadata),
  fileName: string,
  fileSize: number,
  totalPages: number,
  createdAt: Date,
  lastOpened: Date,
  lastPageRead: number,
  readPercentage: number,
  totalReadingTime: number (seconds),
  metadata: {
    title: string,
    author: string,
    subject: string,
    keywords: string[]
  }
}
```

### ReadingProgress Store
```javascript
{
  id: string (composite: documentId + userId),
  documentId: string,
  currentPage: number,
  percentage: number,
  lastUpdated: Date,
  readingSessions: [
    {
      startTime: Date,
      endTime: Date,
      duration: number (seconds),
      pagesRead: number[]
    }
  ]
}
```

### Notes Store
```javascript
{
  id: string (auto-generated UUID),
  documentId: string,
  page: number,
  content: string,
  tags: string[],
  createdAt: Date,
  updatedAt: Date,
  isPinned: boolean,
  type: enum ('note', 'question', 'quote', 'definition', 'summary')
}
```

### ReadingSessions Store
```javascript
{
  id: string (auto-generated UUID),
  documentId: string,
  startTime: Date,
  endTime: Date,
  duration: number (seconds),
  pagesRead: number[],
  goalMet: boolean
}
```

### AppSettings Store
```javascript
{
  id: 'app_settings',
  theme: enum ('light', 'dark', 'system'),
  readingGoal: {
    targetMinutes: number,
    targetPages: number,
    period: enum ('daily', 'weekly')
  },
  pdfViewMode: enum ('single', 'continuous'),
  zoomLevel: number,
  lastUsedTags: string[],
  showPageNumbers: boolean
}
```

### Goals Store
```javascript
{
  id: string (auto-generated UUID),
  name: string,
  target: number,
  targetType: enum ('minutes', 'pages', 'percentage'),
  period: enum ('daily', 'weekly', 'monthly'),
  currentProgress: number,
  startDate: Date,
  endDate: Date,
  isActive: boolean
}
```

## 8. Storage Strategy

### Local-First Privacy Design
- All user data stored locally using IndexedDB
- No automatic cloud synchronization
- Export/Import as JSON for backup/migration
- PDF files loaded into memory temporarily, never uploaded

### Data Persistence Plan
- Documents: PDF metadata and identification
- Reading Progress: Last position and session data
- Notes: All user annotations and tags
- Sessions: Time-based reading activity
- Settings: User preferences and configurations

### Security Considerations
- Client-side encryption optional (future enhancement)
- No sensitive data beyond personal notes
- Clear data removal option
- Private browsing mode detection

## 9. State Management Strategy

### React Context Pattern
- **PDFContext**: Current document, page, zoom, loading state
- **NotesContext**: Active notes, filters, selected note
- **SettingsContext**: Theme, preferences, goals
- **DocumentsContext**: Available documents, recent files

### Custom Hooks
- `usePDFLoader`: Handle PDF.js integration
- `useIndexedDB`: Database operations wrapper
- `useReadingSession`: Session timing and tracking
- `useKeyboardShortcuts`: Global keyboard handling
- `useTheme`: Theme management and persistence

### State Flow
1. App initializes contexts
2. Document selection updates PDFContext
3. Page changes trigger progress saves
4. Note actions update NotesContext and DB
5. Settings changes propagate through SettingsContext

## 10. Accessibility Requirements

### Keyboard Navigation
- Tab order follows logical reading flow
- Arrow keys for page navigation
- Enter/Space for activation
- Escape to close modals/pickers
- Shortcuts for common actions

### ARIA Labels & Semantics
- Proper landmark regions (`main`, `aside`, `header`)
- Dynamic labels for changing content
- Status updates for loading states
- Error messaging for invalid inputs

### Contrast & Visual Design
- WCAG AA compliance (4.5:1 minimum)
- Focus indicators visible
- Color not sole information carrier
- Scalable text up to 200%

### Screen Reader Support
- Logical heading hierarchy
- Descriptive alt text for icons
- Live regions for dynamic content
- Skip links for main content

## 11. Performance Strategy

### PDF Rendering Optimization
- Lazy page loading
- Virtual scrolling for large documents
- Memory cleanup for inactive pages
- Progressive loading indicators

### Database Performance
- IndexedDB transactions for bulk operations
- Debounced writes to prevent excessive I/O
- Efficient indexing on frequently queried fields
- Pagination for large note collections

### UI Responsiveness
- Web Workers for heavy computations
- Memoization of expensive calculations
- Virtualized lists for note display
- Optimistic updates where appropriate

## 12. Error Handling Plan

### Common Error Scenarios
- **Corrupt PDF**: Display friendly error, suggest alternative
- **Storage Quota Exceeded**: Prompt user to delete old data
- **Unsupported Browser**: Show compatibility notice
- **Large File**: Warn about performance impact
- **Database Errors**: Fallback to basic functionality

### Error Recovery
- Graceful degradation of features
- Clear error messages with solutions
- Auto-retry mechanisms for transient failures
- Safe fallback to localStorage if IndexedDB unavailable

## 13. Privacy Model

### Data Location
- All data stored locally on user's device
- No automatic data transmission
- Explicit user action required for export
- Clear indication of any network activity

### Export/Import Behavior
- JSON format ensures data portability
- Validation prevents malicious data injection
- Merge vs. Replace options during import
- Confirmation dialogs for destructive actions

### Privacy Controls
- Option to clear all data
- Export transparency (show what will be exported)
- No analytics/tracking by default
- Optional usage statistics opt-in

## 14. GitHub Pages Deployment Plan

### Build Configuration
- Vite build with proper base path for GitHub Pages
- Static asset optimization
- Code splitting for faster initial load
- Service worker for PWA features

### Deployment Process
- GitHub Actions workflow automation
- Branch protection for main branch
- Preview deployments for PRs
- Automated versioning and tagging

### URL Structure
- Base URL configurable for subdirectory hosting
- Clean routing without hash fragments
- Proper 404 handling for SPA routing

## 15. Project Folder Structure

```
pdf-reading-companion/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── PDFViewer/
│   │   ├── NotesPanel/
│   │   ├── common/
│   │   └── ui/
│   ├── hooks/
│   ├── utils/
│   ├── services/
│   │   ├── database.js
│   │   ├── pdfHandler.js
│   │   └── exportImport.js
│   ├── styles/
│   ├── contexts/
│   ├── types/
│   └── App.jsx
├── tests/
├── docs/
├── package.json
├── vite.config.js
└── README.md
```

## 16. Development Roadmap

### Milestone 1: Core PDF Functionality (Week 1)
- PDF.js integration
- Basic page navigation
- File import system
- Responsive layout foundation

### Milestone 2: Progress Tracking (Week 1-2)
- IndexedDB setup
- Reading progress persistence
- Session timing
- Auto-resume functionality

### Milestone 3: Note Taking (Week 2-3)
- Note creation/editing/deletion
- Page linking
- Tagging system
- Note filtering/sorting

### Milestone 4: UI Polish & Export (Week 3-4)
- Dark/light mode
- Export/import functionality
- Keyboard shortcuts
- Accessibility improvements

### Milestone 5: Deployment & Testing (Week 4)
- GitHub Pages deployment
- Cross-browser testing
- Performance optimization
- Documentation completion

## 17. Testing Checklist

### Manual Testing
- [ ] PDF loading on different file sizes
- [ ] Page navigation works correctly
- [ ] Progress tracking persists between sessions
- [ ] Notes save and load properly
- [ ] Export/import maintains data integrity
- [ ] Responsive layouts work on all devices
- [ ] Keyboard navigation functional
- [ ] Accessibility features work with screen readers
- [ ] Dark/light mode toggle works
- [ ] Error handling displays appropriate messages

### Automated Testing (Future Enhancement)
- Unit tests for utility functions
- Integration tests for database operations
- Component tests for UI interactions
- End-to-end tests for critical user flows

## 18. Future Upgrade Path

### Optional Cloud Sync
- **Supabase**: Real-time sync, authentication
- **Firebase**: Firestore for data, Auth for users
- **Custom API**: Self-hosted solution

### Enhanced Features
- Collaborative reading groups
- Advanced analytics and insights
- Integration with learning management systems
- AI-powered summarization and Q&A
- Offline-first with background sync
- Cross-platform mobile apps

### Platform Expansion
- Progressive Web App with offline capabilities
- Desktop application using Tauri/Electron
- Browser extension for web PDFs
- Mobile applications (React Native/Capacitor)