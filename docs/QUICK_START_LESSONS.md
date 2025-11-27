# Quick Start: Lesson Plan System

## Installation & First Run

The lesson plan system is already installed and configured. Just run:

```bash
pnpm dev
```

The app will open at `http://localhost:5173` with the lesson system ready to use.

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Git-D3-Viz App                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌─────────────────┐    ┌──────────┐  │
│  │   Header     │    │ Git Visualization│    │ Terminal │  │
│  └──────────────┘    │   (Shows lesson) │    │ Simulator│  │
│                      └─────────────────┘    └──────────┘  │
│                                                             │
│  ┌────────────────┐  ┌────────────────────────────────┐   │
│  │ ModuleSidebar  │  │      LessonSidebar             │   │
│  │                │  │  (Shows selected lesson)       │   │
│  │ - Modules      │  │  (Track progress)              │   │
│  │ - Progress %   │  │  (Navigate lessons)            │   │
│  │ - Lesson count │  │  (Mark complete/incomplete)    │   │
│  └────────────────┘  └────────────────────────────────┘   │
│         ↓                          ↓                        │
│         └──────────→ useLessonStore() ←────────────┘      │
│                          ↓                                 │
│                    Zustand Store                           │
│         (modules, selectedModule, actions, etc)           │
│                          ↓                                 │
│                    localStorage                           │
│              (Persistent storage)                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌────────────────────────────────────────────────────────────┐
│ USER INTERACTION                                           │
└────────────────────────────────────────────────────────────┘
             ↓
   ┌─────────────────┐
   │ Click Module    │ ← setSelectedModule()
   │ Click Lesson    │ ← setSelectedLesson()
   │ Mark Complete   │ ← markLessonComplete()
   └─────────────────┘
             ↓
   ┌─────────────────────────────────────────┐
   │ Zustand Store State Updated             │
   │ - selectedModuleId changed              │
   │ - selectedLessonId changed              │
   │ - lesson.completed = true               │
   └─────────────────────────────────────────┘
             ↓
   ┌─────────────────────────────────────────┐
   │ Zustand Persist Middleware              │
   │ (Automatic serialization)               │
   └─────────────────────────────────────────┘
             ↓
   ┌─────────────────────────────────────────┐
   │ Browser localStorage                    │
   │ Key: "lesson-store"                     │
   │ Value: { state: {...}, version: 1 }     │
   └─────────────────────────────────────────┘
             ↓
   ┌─────────────────────────────────────────┐
   │ Components Re-render with New State     │
   │ - ModuleSidebar updates progress        │
   │ - LessonSidebar shows new lesson        │
   │ - GitVisualization updates title        │
   └─────────────────────────────────────────┘
             ↓
   ┌─────────────────────────────────────────┐
   │ PAGE REFRESH                            │
   │ localStorage auto-loads state           │
   │ Components restore to last state        │
   └─────────────────────────────────────────┘
```

## Usage in Components

### Using the Store in ModuleSidebar

```typescript
import { useLessonStore } from "@/store/lessonStore";

export const ModuleSidebar = () => {
  // Hook into the store
  const { 
    modules,                 // All lesson modules
    selectedModuleId,        // Currently selected module ID
    setSelectedModule,       // Function to change module
    getModuleProgress        // Function to get progress %
  } = useLessonStore();

  return (
    <div>
      {modules.map((module) => (
        <button 
          key={module.id}
          onClick={() => setSelectedModule(module.id)}
          className={selectedModuleId === module.id ? 'active' : ''}
        >
          {module.title}
          <p>Progress: {getModuleProgress(module.id)}%</p>
        </button>
      ))}
    </div>
  );
};
```

### Using the Store in LessonSidebar

```typescript
import { useLessonStore } from "@/store/lessonStore";

export const LessonSidebar = () => {
  const {
    selectedModule,          // Current module object
    selectedLesson,          // Current lesson object
    setSelectedLesson,       // Function to change lesson
    markLessonComplete,      // Mark as complete
    markLessonIncomplete,    // Mark as incomplete
    getModuleProgress        // Get progress %
  } = useLessonStore();

  return (
    <div>
      <h2>{selectedLesson?.title}</h2>
      <p>{selectedLesson?.description}</p>
      
      <div>Module Progress: {getModuleProgress(selectedModule?.id)}%</div>
      
      <div>
        {selectedModule?.lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => setSelectedLesson(lesson.id)}
            className={selectedLesson?.id === lesson.id ? 'active' : ''}
          >
            {lesson.title}
            {lesson.completed && '✓'}
          </button>
        ))}
      </div>
      
      <button onClick={() => markLessonComplete(selectedLesson?.id)}>
        {selectedLesson?.completed ? 'Mark Incomplete' : 'Complete'}
      </button>
    </div>
  );
};
```

### Using in Any Component

```typescript
import { useLessonStore } from "@/store/lessonStore";

export const MyCustomComponent = () => {
  // Access any part of the store
  const {
    modules,
    selectedModule,
    selectedLesson,
    getTotalProgress,
    markLessonComplete,
    setSelectedModule,
    // ... any action or state
  } = useLessonStore();

  return (
    <div>
      <p>Total Progress: {getTotalProgress()}%</p>
      <p>Current Module: {selectedModule?.title}</p>
      <p>Current Lesson: {selectedLesson?.title}</p>
    </div>
  );
};
```

## Adding a New Lesson

### Step 1: Edit the Store

Open `src/store/lessonStore.ts` and add to `initialModules`:

```typescript
{
  id: "5",
  title: "Your New Module",
  description: "What this module teaches",
  lessons: [
    {
      id: "5-1",
      title: "Your First Lesson",
      description: "Brief lesson description",
      content: "Detailed learning objectives...",
      completed: false,
      duration: 12,  // minutes
    },
    {
      id: "5-2",
      title: "Your Second Lesson",
      description: "Another lesson",
      content: "More objectives...",
      completed: false,
      duration: 15,
    },
  ],
}
```

### Step 2: That's It!

The UI components automatically:
- Display the new module in ModuleSidebar
- Show its lessons in LessonSidebar
- Track its progress
- Persist to localStorage

No component changes needed!

## Store API Reference

### Reading State

```typescript
const store = useLessonStore();

// Access state directly
const modules = store.modules;              // EnhancedModule[]
const selectedModuleId = store.selectedModuleId;  // string | null
const selectedLessonId = store.selectedLessonId;  // string | null
const selectedModule = store.selectedModule;      // EnhancedModule | null
const selectedLesson = store.selectedLesson;      // EnhancedLesson | null
```

### Writing State (Actions)

```typescript
const {
  setSelectedModule,         // (moduleId: string) => void
  setSelectedLesson,         // (lessonId: string) => void
  markLessonComplete,        // (lessonId: string) => void
  markLessonIncomplete,      // (lessonId: string) => void
  resetProgress,             // () => void
  getModuleProgress,         // (moduleId: string) => number (0-100)
  getTotalProgress,          // () => number (0-100)
} = useLessonStore();

// Use them
setSelectedModule("2");              // Go to module 2
setSelectedLesson("2-1");            // Go to lesson 2-1
markLessonComplete("2-1");           // Mark lesson 2-1 complete
const progress = getModuleProgress("2");  // Get module 2 progress
const total = getTotalProgress();    // Get total progress
resetProgress();                     // Reset everything
```

## LocalStorage Details

### Key
```
"lesson-store"
```

### Structure
```json
{
  "state": {
    "modules": [...],           // All lesson data
    "selectedModuleId": "1",    // Currently selected
    "selectedLessonId": "1-1"   // Currently selected
  },
  "version": 1                  // For migrations
}
```

### Check in Browser DevTools
1. Open DevTools (F12)
2. Go to "Application" tab
3. Click "Local Storage"
4. Find and click your domain
5. Look for key: `lesson-store`

### Clear Data
```javascript
// In browser console
localStorage.removeItem("lesson-store");
// or
localStorage.clear();  // Clears all
```

## Troubleshooting

### Problem: Progress not saving
**Solution**: Check that localStorage is enabled and browser isn't in private mode

### Problem: Lessons not showing
**Solution**: Verify modules have correct IDs in store, check console for errors

### Problem: Can't access store in component
**Solution**: Make sure you're using the hook correctly:
```typescript
import { useLessonStore } from "@/store/lessonStore";
// Then use inside component
const { modules } = useLessonStore();
```

### Problem: Module doesn't auto-select first lesson
**Solution**: Check that `setSelectedModule()` is being called, not just `selectedModuleId`

## File Locations

```
src/
├── store/
│   └── lessonStore.ts          ← Zustand store
├── components/
│   ├── ModuleSidebar.tsx        ← Uses store
│   ├── LessonSidebar.tsx        ← Uses store
│   └── GitVisualization.tsx     ← Uses store
└── pages/
    └── Index.tsx               ← Main layout

docs/
├── LESSON_PLAN.md              ← Full documentation
├── API_REFERENCE.md            ← Store API
└── COMPONENTS.md               ← Component docs
```

## Next Steps

1. **Run the app**: `pnpm dev`
2. **Test it**: Click modules and lessons, mark some complete
3. **Refresh page**: See that progress is saved!
4. **Check localStorage**: Open DevTools to see the data
5. **Read docs**: See `docs/LESSON_PLAN.md` for full details
6. **Extend it**: Add more lessons or create custom visualizations
