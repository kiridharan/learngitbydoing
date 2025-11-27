# Lesson Plan System - Visual Guide

## How Lessons Flow Through the App

### 1. Initial App Load

```
App starts
  ↓
Zustand store initializes
  ↓
localStorage data loaded (if exists)
  ↓
Defaults: Module 1, Lesson 1-1 selected
  ↓
All components render with initial state
```

**Visual**: User sees the app with Module 1 expanded in left sidebar, first lesson shown in right sidebar

---

## 2. User Selects a Module

### Click Flow: "Click on Module 2"

```
User clicks Module 2 in ModuleSidebar
         ↓
ModuleSidebar's onClick handler fires
         ↓
setSelectedModule("2") called
         ↓
Zustand store updates:
  - selectedModuleId = "2"
  - selectedLessonId = "2-1" (auto-select first)
         ↓
localStorage immediately updates
         ↓
All components re-render:
  - ModuleSidebar highlights Module 2
  - LessonSidebar shows Module 2's lessons
  - GitVisualization updates header with lesson title
```

**Result**: 
- Module 2 is highlighted in left sidebar
- Right sidebar shows lessons 2-1, 2-2, 2-3
- Lesson 2-1 is selected by default

---

## 3. User Selects a Lesson

### Click Flow: "Click on Lesson 2-3"

```
User clicks "2-3 Conflict Resolution" in LessonSidebar
         ↓
LessonSidebar's onClick handler fires
         ↓
setSelectedLesson("2-3") called
         ↓
Zustand store updates:
  - selectedLessonId = "2-3"
  - selectedModuleId unchanged (stays "2")
         ↓
localStorage updates
         ↓
All components re-render:
  - LessonSidebar shows lesson 2-3 details
  - LessonSidebar highlights lesson 2-3 in list
  - GitVisualization updates to show lesson 2-3 title
```

**Result**:
- Right sidebar shows content for "Conflict Resolution"
- Lesson 2-3 is highlighted in the lesson list
- Visualization shows new lesson title

---

## 4. User Marks Lesson Complete

### Click Flow: "Click 'Complete' button"

```
User clicks "Complete" button in LessonSidebar
         ↓
markLessonComplete("2-3") called
         ↓
Zustand finds lesson 2-3 in Module 2
         ↓
Sets lesson.completed = true
         ↓
localStorage updates
         ↓
Components re-render:
  - LessonSidebar shows checkmark ✓ on lesson 2-3
  - ModuleSidebar updates Module 2 progress bar
    (now shows 2/3 lessons complete, 67%)
  - LessonSidebar button text changes to "Mark Incomplete"
```

**Result**:
- Lesson shows checkmark in right sidebar
- Module 2 progress bar increases
- Button changes from "Complete" to "Mark Incomplete"

---

## 5. Progress Tracking

### How Progress is Calculated

```
Module Progress:
  Module 2 has 3 lessons
  2 are marked complete
  Progress = (2/3) * 100 = 67%

Total Progress:
  All modules have 14 lessons
  8 are marked complete
  Progress = (8/14) * 100 = 57%
```

### Where Progress is Shown

| Component | Shows |
|-----------|-------|
| ModuleSidebar | Progress bar for each module |
| LessonSidebar | Module progress bar at top |
| (Custom) | Can call getTotalProgress() |

---

## 6. Page Refresh Test

### Before Refresh

```
Current state:
- Module 2 selected
- Lesson 2-3 selected
- Lesson 2-1 completed ✓
- Lesson 2-3 completed ✓
```

### What Happens

```
User presses F5 (Refresh)
         ↓
Page reloads
         ↓
Zustand store initializes
         ↓
Persist middleware checks localStorage
         ↓
Finds "lesson-store" key
         ↓
Loads all state:
  - selectedModuleId = "2"
  - selectedLessonId = "2-3"
  - lesson completions
         ↓
Components render with loaded state
```

### After Refresh

```
Current state (SAME AS BEFORE):
- Module 2 still selected
- Lesson 2-3 still selected
- Lesson 2-1 still completed ✓
- Lesson 2-3 still completed ✓
- Progress preserved
```

**Result**: Everything looks exactly as it did before refresh!

---

## 7. Navigation Between Lessons

### Previous/Next Buttons

```
Current: Lesson 2-2 selected

Click Previous button:
  - Find current lesson index in module: index = 1
  - Go to lesson at index 0
  - Select Lesson 2-1

Click Next button:
  - Find current lesson index in module: index = 1
  - Go to lesson at index 2
  - Select Lesson 2-3
```

### Disabled States

- Previous button disabled when on first lesson
- Next button disabled when on last lesson

---

## 8. Lesson List Interaction

### In LessonSidebar

```
Module 2 has 3 lessons:
┌─────────────────────────┐
│ ✓ 1. Understanding Branches (12m) │ ← Completed
│ 2. Merging Basics (14m)  │ ← Not completed
│ ✓ 3. Conflict Resolution (18m) │ ← Completed & Selected (highlighted)
└─────────────────────────┘

Icons:
✓ = Checkmark for completed lessons
□ = Empty box for incomplete lessons

Styling:
- Selected lesson: highlighted border/background
- Completed: checkmark icon
- Show duration: (12m), (14m), etc.
```

---

## 9. Store State Tree

### What's in the Store

```
useLessonStore() returns:

{
  // STATE
  modules: [
    {
      id: "1",
      title: "Git Fundamentals",
      lessons: [
        { id: "1-1", title: "...", completed: false, ... },
        { id: "1-2", title: "...", completed: true, ... },
        // ...
      ]
    },
    // more modules...
  ],
  
  selectedModuleId: "2",
  selectedLessonId: "2-3",
  
  // COMPUTED SELECTORS
  selectedModule: { id: "2", title: "...", lessons: [...] },
  selectedLesson: { id: "2-3", title: "Conflict Resolution", ... },
  
  // ACTIONS
  setSelectedModule: (id) => {...},
  setSelectedLesson: (id) => {...},
  markLessonComplete: (id) => {...},
  markLessonIncomplete: (id) => {...},
  resetProgress: () => {...},
  getModuleProgress: (id) => number,
  getTotalProgress: () => number,
}
```

---

## 10. localStorage Persistence

### Before

```javascript
// Browser localStorage is empty
localStorage.getItem("lesson-store")  // null
```

### During Usage

```javascript
// After selecting and marking lessons complete
localStorage.getItem("lesson-store")

// Returns:
{
  "state": {
    "modules": [{...all lesson data...}],
    "selectedModuleId": "2",
    "selectedLessonId": "2-3"
  },
  "version": 1
}
```

### After Close & Reopen

```javascript
// User closes browser, comes back next day
// On page load, Zustand automatically:
1. Reads from localStorage
2. Restores all state
3. Everything looks the same!
```

---

## 11. Component Interaction Diagram

```
┌─────────────────────┐
│  ModuleSidebar      │
│                     │
│ ┌─────────────────┐ │
│ │ Module 1    0%  │ │
│ ├─────────────────┤ │
│ │ Module 2    67% │ ← USER CLICKS
│ ├─────────────────┤ │
│ │ Module 3    0%  │ │
│ └─────────────────┘ │
└─────────────────────┘
         ↓ (onClick: setSelectedModule("2"))
    
┌───────────────────────────────────────┐
│     Zustand lessonStore               │
│  selectedModuleId = "2"               │
│  selectedLessonId = "2-1" (auto)      │
│                                       │
│  Triggers persist middleware          │
│  → localStorage updated               │
└───────────────────────────────────────┘
         ↓
┌───────────────────────────────────────┐
│      LessonSidebar                    │
│                                       │
│  Shows Module 2's lessons:            │
│  □ Lesson 2-1                         │ ← Auto-selected
│  □ Lesson 2-2                         │
│  ✓ Lesson 2-3                         │
│                                       │
│  [Module Progress: 67%]               │
└───────────────────────────────────────┘
         ↓
┌───────────────────────────────────────┐
│    GitVisualization                   │
│                                       │
│  Header: "📊 Git Visualization        │
│           Understanding Branches"     │
│                                       │
│  Description: "What are branches..." │
└───────────────────────────────────────┘
```

---

## 12. Adding New Lessons Flow

### Developer adds new lesson to store

```typescript
// In src/store/lessonStore.ts

{
  id: "5",
  title: "New Module",
  lessons: [
    { id: "5-1", title: "New Lesson", ... }
  ]
}
```

### Automatic Updates

```
Store data changes
  ↓
Components read from store
  ↓
ModuleSidebar automatically:
  - Displays new module
  - Adds to module list
  - Calculates progress
  ↓
LessonSidebar automatically:
  - Adds to lesson list when module selected
  - Tracks completion
  ↓
GitVisualization automatically:
  - Shows when lesson selected
  ↓
No component code changes needed!
```

---

## Quick Reference: Common Tasks

### Select a Module Programmatically

```typescript
const { setSelectedModule } = useLessonStore();
setSelectedModule("3");  // Go to Module 3
```

### Select a Lesson Programmatically

```typescript
const { setSelectedLesson } = useLessonStore();
setSelectedLesson("2-1");  // Go to Lesson 2-1
```

### Check Progress

```typescript
const { getTotalProgress } = useLessonStore();
const progress = getTotalProgress();  // Returns 0-100
console.log(`Progress: ${progress}%`);
```

### Complete a Lesson

```typescript
const { markLessonComplete } = useLessonStore();
markLessonComplete("1-1");
```

### Reset Everything

```typescript
const { resetProgress } = useLessonStore();
resetProgress();  // Clears all progress
```

### Get Current Lesson

```typescript
const { selectedLesson } = useLessonStore();
console.log(selectedLesson.title);
console.log(selectedLesson.description);
```

---

## Data Persistence Timeline

```
T=0s: App loads
  ↓ Zustand reads localStorage

T=0.1s: Components render
  ↓ User selects lesson

T=1s: User clicks "Complete"
  ↓ Store updates
  ↓ Persist middleware saves to localStorage

T=1.1s: localStorage is updated
  ↓ UI shows completion ✓

T=60s: User refreshes page
  ↓ Zustand reads localStorage again

T=60.2s: App restores exact previous state
  ↓ Nothing is lost!
```

---

## Summary

The lesson plan system provides:

✅ **Automatic State Management** - Zustand handles everything  
✅ **Persistent Progress** - localStorage saves automatically  
✅ **Seamless Navigation** - Click modules and lessons  
✅ **Real-time Updates** - UI reflects all changes immediately  
✅ **No Backend Needed** - Works entirely in the browser  
✅ **Easy to Extend** - Add new lessons in the store  

Perfect for building interactive educational content!
