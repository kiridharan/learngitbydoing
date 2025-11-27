# Lesson Plan Documentation

## Overview

The Git-D3-Viz application uses a comprehensive, structured lesson plan with Zustand state management and local storage persistence. This document describes the curriculum, lesson structure, and how to extend it.

## Curriculum Structure

### Module Organization

The curriculum is organized into **4 main modules**, each with multiple lessons:

#### 1. **Git Fundamentals** (Module 1)
Introduction to Git concepts and basic operations.

| Lesson ID | Title | Duration | Description |
|-----------|-------|----------|-------------|
| 1-1 | What is Git? | 10 min | Introduction to Git and version control concepts |
| 1-2 | Git Setup | 8 min | Setting up Git on your machine |
| 1-3 | First Repository | 12 min | Initialize and create your first Git repository |
| 1-4 | Commits & Messages | 15 min | Understanding commits and writing good commit messages |

**Total Duration**: 45 minutes

#### 2. **Branching & Merging** (Module 2)
Master Git branches and merge strategies.

| Lesson ID | Title | Duration | Description |
|-----------|-------|----------|-------------|
| 2-1 | Understanding Branches | 12 min | What are branches and how to use them effectively |
| 2-2 | Merging Basics | 14 min | Learn different merge strategies |
| 2-3 | Conflict Resolution | 18 min | Resolving merge conflicts |

**Total Duration**: 44 minutes

#### 3. **Remote Repositories** (Module 3)
Work with remote Git repositories.

| Lesson ID | Title | Duration | Description |
|-----------|-------|----------|-------------|
| 3-1 | Remote Basics | 10 min | Understanding remote repositories |
| 3-2 | Push & Pull | 12 min | Synchronize with remote repositories |

**Total Duration**: 22 minutes

#### 4. **Advanced Git Workflows** (Module 4)
Learn advanced Git patterns and workflows.

| Lesson ID | Title | Duration | Description |
|-----------|-------|----------|-------------|
| 4-1 | Rebase vs Merge | 16 min | Understanding rebase and when to use it |
| 4-2 | Cherry-pick & Revert | 12 min | Selective commit management |
| 4-3 | Stashing & Reflog | 14 min | Temporary storage and history recovery |

**Total Duration**: 42 minutes

**Overall Curriculum**: 14 lessons, ~153 minutes

## Data Structure

### Lesson Interface

```typescript
interface EnhancedLesson {
  id: string;              // Unique identifier (e.g., "1-1")
  title: string;           // Lesson title
  description?: string;    // Brief description
  content?: string;        // Detailed content/objectives
  completed: boolean;      // Completion status
  current?: boolean;       // Current/active lesson
  duration?: number;       // Duration in minutes
}
```

### Module Interface

```typescript
interface EnhancedModule {
  id: string;              // Unique identifier (e.g., "1")
  title: string;           // Module title
  description?: string;    // Module description
  lessons: EnhancedLesson[];  // Array of lessons
}
```

## Zustand Store

### Location
`src/store/lessonStore.ts`

### Store State

```typescript
interface LessonStoreState {
  // Data
  modules: EnhancedModule[];

  // Selection state
  selectedModuleId: string | null;
  selectedLessonId: string | null;

  // Computed selectors
  selectedModule: EnhancedModule | null;
  selectedLesson: EnhancedLesson | null;

  // Actions
  setSelectedModule(moduleId: string): void;
  setSelectedLesson(lessonId: string): void;
  markLessonComplete(lessonId: string): void;
  markLessonIncomplete(lessonId: string): void;
  resetProgress(): void;
  getModuleProgress(moduleId: string): number;
  getTotalProgress(): number;
}
```

### Local Storage

The store is persisted to local storage under the key `"lesson-store"` with version 1. This allows:

- ✅ Progress tracking across browser sessions
- ✅ Automatic loading of completion status
- ✅ Resuming from last selected lesson

**Storage Format**:
```json
{
  "state": {
    "modules": [...],
    "selectedModuleId": "1",
    "selectedLessonId": "1-1"
  },
  "version": 1
}
```

## Store Actions

### `setSelectedModule(moduleId: string)`

Selects a module and automatically sets the first lesson in that module as selected.

**Usage**:
```typescript
const { setSelectedModule } = useLessonStore();
setSelectedModule("2"); // Switch to module 2
```

### `setSelectedLesson(lessonId: string)`

Sets the active lesson without changing the module.

**Usage**:
```typescript
const { setSelectedLesson } = useLessonStore();
setSelectedLesson("1-3"); // Go to lesson 1-3
```

### `markLessonComplete(lessonId: string)`

Marks a lesson as completed and updates local storage immediately.

**Usage**:
```typescript
const { markLessonComplete } = useLessonStore();
markLessonComplete("1-1");
```

### `markLessonIncomplete(lessonId: string)`

Marks a lesson as incomplete.

**Usage**:
```typescript
const { markLessonIncomplete } = useLessonStore();
markLessonIncomplete("1-1");
```

### `resetProgress()`

Resets all lessons to incomplete and selects module 1, lesson 1.

**Usage**:
```typescript
const { resetProgress } = useLessonStore();
resetProgress();
```

### `getModuleProgress(moduleId: string): number`

Returns the completion percentage (0-100) for a specific module.

**Usage**:
```typescript
const { getModuleProgress } = useLessonStore();
const progress = getModuleProgress("1"); // Returns 0-100
```

### `getTotalProgress(): number`

Returns the overall curriculum completion percentage (0-100).

**Usage**:
```typescript
const { getTotalProgress } = useLessonStore();
const total = getTotalProgress(); // Returns 0-100
```

## Component Integration

### ModuleSidebar

- Displays all modules with descriptions
- Shows progress bar for each module
- Shows lesson count
- Allows module selection

**Store Usage**:
```typescript
const { modules, selectedModuleId, setSelectedModule, getModuleProgress } = useLessonStore();
```

### LessonSidebar

- Displays the selected module's lessons
- Shows completion status for each lesson
- Displays selected lesson details with description and content
- Allows lesson navigation (Previous/Next)
- Provides Complete/Incomplete toggle button
- Shows overall module progress

**Store Usage**:
```typescript
const {
  selectedModule,
  selectedLesson,
  setSelectedLesson,
  markLessonComplete,
  markLessonIncomplete,
  getModuleProgress,
} = useLessonStore();
```

### GitVisualization

- Displays the selected lesson title in the header
- Shows lesson description in the visualization area
- Can be extended to show visualizations specific to each lesson

**Store Usage**:
```typescript
const { selectedLesson } = useLessonStore();
```

## Usage Example

```typescript
import { useLessonStore } from "@/store/lessonStore";

export function MyComponent() {
  const {
    modules,
    selectedLesson,
    selectedModule,
    setSelectedModule,
    markLessonComplete,
    getTotalProgress,
  } = useLessonStore();

  return (
    <div>
      <h1>Total Progress: {getTotalProgress()}%</h1>
      
      <button onClick={() => setSelectedModule("2")}>
        Go to Module 2
      </button>

      {selectedLesson && (
        <div>
          <h2>{selectedLesson.title}</h2>
          <p>{selectedLesson.description}</p>
          <button onClick={() => markLessonComplete(selectedLesson.id)}>
            Complete Lesson
          </button>
        </div>
      )}
    </div>
  );
}
```

## Adding New Lessons

### 1. Update Store Lesson Data

Edit `src/store/lessonStore.ts` and add to the `initialModules` array:

```typescript
{
  id: "5",
  title: "Your New Module",
  description: "Module description",
  lessons: [
    {
      id: "5-1",
      title: "Your New Lesson",
      description: "Lesson description",
      content: "Detailed content...",
      completed: false,
      duration: 15,
    },
  ],
}
```

### 2. ID Convention

- **Module ID**: Sequential number (1, 2, 3, 4, 5...)
- **Lesson ID**: `{module-id}-{lesson-number}` (e.g., 5-1, 5-2)

### 3. No Component Changes Required

The UI components will automatically display new modules and lessons since they read from the store.

## Data Persistence Flow

```
Component → useLessonStore() → Zustand Store
                                   ↓
                            React State Update
                                   ↓
                            Zustand Middleware
                                   ↓
                            Local Storage Persist
```

## Progress Tracking

### Completion Status

- Each lesson has a `completed` boolean flag
- Stored in local storage automatically
- Persists across page refreshes
- Can be reset with `resetProgress()`

### Progress Calculation

```typescript
// Module Progress
const completed = module.lessons.filter(l => l.completed).length;
const progress = (completed / module.lessons.length) * 100;

// Total Progress
const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
const totalCompleted = modules.reduce(
  (sum, m) => sum + m.lessons.filter(l => l.completed).length,
  0
);
const totalProgress = (totalCompleted / totalLessons) * 100;
```

## Performance Considerations

### Zustand Benefits

- ✅ Minimal re-renders (only affected components re-render)
- ✅ Direct state access without context overhead
- ✅ Fast selector functions
- ✅ Automatic local storage synchronization

### Optimization Tips

1. Use selectors to extract only needed state
2. Component-level `useLessonStore()` calls for modularity
3. Computed properties avoid recalculation
4. Local storage updates are debounced automatically

## Future Enhancements

### Planned Features

1. **Lesson Tracking**
   - [ ] Track time spent per lesson
   - [ ] Quiz/assessment scoring
   - [ ] Note-taking capability

2. **Advanced Features**
   - [ ] Lesson recommendations based on progress
   - [ ] Spaced repetition scheduling
   - [ ] Prerequisite checking
   - [ ] Achievements/badges

3. **Data Export**
   - [ ] Export progress as JSON
   - [ ] CSV export for analytics
   - [ ] Sync with backend server

### Implementation Pattern

For new features, follow the existing Zustand pattern:

```typescript
// Add new state properties
interface LessonStoreState {
  // ... existing
  notesList: Record<string, string>; // Lesson ID -> notes
  
  // New actions
  saveNote(lessonId: string, note: string): void;
  getNote(lessonId: string): string | null;
}

// Implement in store
saveNote: (lessonId: string, note: string) => {
  set((state) => ({
    notesList: { ...state.notesList, [lessonId]: note }
  }));
}
```

## Troubleshooting

### Progress Not Saving

**Issue**: Lessons marked complete but not persisting after refresh

**Solution**:
1. Check browser's local storage is enabled
2. Verify browser isn't in private mode
3. Check browser console for errors
4. Clear storage and retry: `localStorage.clear()`

### Store Not Updating

**Issue**: UI not updating after `markLessonComplete()`

**Solution**:
1. Verify component uses `useLessonStore()` hook
2. Check that store subscription is active
3. Ensure immutable updates (never mutate state directly)
4. Use browser React DevTools to inspect store state

### Lessons Not Displaying

**Issue**: ModuleSidebar or LessonSidebar showing nothing

**Solution**:
1. Verify `initialModules` is populated in store
2. Check `selectedModuleId` and `selectedLessonId` are not null
3. Ensure modules have lessons array
4. Check browser console for TypeScript/runtime errors

## References

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Store Implementation](../../src/store/lessonStore.ts)
- [Component Guide](./COMPONENTS.md)
- [Development Guide](./DEVELOPMENT.md)
