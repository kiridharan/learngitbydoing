# API Reference

Complete reference for types, interfaces, and data structures used throughout the application.

## Zustand Store

Located in: `src/store/lessonStore.ts`

### useLessonStore Hook

The main store hook for accessing lesson data and state management.

```typescript
const {
  // State
  modules,
  selectedModuleId,
  selectedLessonId,
  selectedModule,
  selectedLesson,
  
  // Actions
  setSelectedModule,
  setSelectedLesson,
  markLessonComplete,
  markLessonIncomplete,
  resetProgress,
  getModuleProgress,
  getTotalProgress,
} = useLessonStore();
```

### Store Actions

- `setSelectedModule(moduleId: string)` - Select a module
- `setSelectedLesson(lessonId: string)` - Select a lesson
- `markLessonComplete(lessonId: string)` - Mark lesson as completed
- `markLessonIncomplete(lessonId: string)` - Mark lesson as incomplete
- `resetProgress()` - Reset all progress
- `getModuleProgress(moduleId: string): number` - Get module completion %
- `getTotalProgress(): number` - Get total completion %

**Persistence**: Automatically saved to localStorage as "lesson-store"

---

### EnhancedLesson

Located in: `src/store/lessonStore.ts`

Extends the base Lesson interface with additional properties:

```typescript
interface EnhancedLesson extends Lesson {
  description?: string;    // Brief description
  content?: string;        // Detailed lesson content
  duration?: number;       // Duration in minutes
}
```

---

### EnhancedModule

Located in: `src/store/lessonStore.ts`

Extends the base Module interface:

```typescript
interface EnhancedModule extends Module {
  description?: string;    // Module description
  lessons: EnhancedLesson[];
}
```

---

## Type Definitions

### Lesson

Located in: `src/types/types.ts`

Represents a single lesson in the learning path.

```typescript
interface Lesson {
  id: string;              // Unique identifier (e.g., "1-1")
  title: string;           // Lesson title
  completed: boolean;      // Whether lesson is completed
  current?: boolean;       // Whether this is the current/active lesson (optional)
}
```

**Example**:
```typescript
const lesson: Lesson = {
  id: "1-1",
  title: "What is Git?",
  completed: false,
  current: true
};
```

---

### Module

Located in: `src/types/types.ts`

Represents a learning module containing multiple lessons.

```typescript
interface Module {
  id: string;              // Unique identifier (e.g., "1", "2", "3")
  title: string;           // Module title
  lessons: Lesson[];       // Array of lessons in module
}
```

**Example**:
```typescript
const module: Module = {
  id: "1",
  title: "Git Fundamentals",
  lessons: [
    { id: "1-1", title: "What is Git?", completed: false, current: true },
    { id: "1-2", title: "Git Setup", completed: true },
    { id: "1-3", title: "First Repository", completed: false }
  ]
};
```

---

### CommitNode

Located in: `src/components/GitVisualization.tsx`

Represents a commit in the Git visualization graph.

```typescript
interface CommitNode {
  id: string;              // Git commit hash (shortened)
  message: string;         // Commit message
  x: number;               // X coordinate in SVG (pixels)
  y: number;               // Y coordinate in SVG (pixels)
  branch: string;          // Branch name (e.g., "main", "feature")
}
```

**Example**:
```typescript
const commit: CommitNode = {
  id: "a1b2c3d",
  message: "Initial commit",
  x: 100,
  y: 200,
  branch: "main"
};
```

**Notes**:
- Coordinates are used for SVG positioning
- Branch determines the color in visualization:
  - "main" → Git orange color
  - other → GitHub purple color

---

## Lesson Data

Located in: `src/lessons/lessons.ts`

### modules Array

The complete curriculum structure.

```typescript
export const modules: Module[] = [
  {
    id: "1",
    title: "Git Fundamentals",
    lessons: [
      { id: "1-1", title: "What is Git?", completed: false, current: true },
      { id: "1-2", title: "Git Setup", completed: true },
      { id: "1-3", title: "First Repository", completed: false },
      { id: "1-4", title: "Commits & Messages", completed: false }
    ]
  },
  {
    id: "2",
    title: "Branching & Merging",
    lessons: [
      { id: "2-1", title: "Understanding Branches", completed: false },
      { id: "2-2", title: "Merging Basics", completed: false },
      { id: "2-3", title: "Conflict Resolution", completed: false }
    ]
  },
  {
    id: "3",
    title: "Remote Repositories",
    lessons: [
      { id: "3-1", title: "Remote Basics", completed: false },
      { id: "3-2", title: "Push & Pull", completed: false }
    ]
  }
];
```

---

## Utility Functions

Located in: `src/lib/utils.ts`

### cn()

Merge classnames using clsx and tailwind-merge.

```typescript
export function cn(...inputs: (string | undefined | null | false)[]) {
  // Implementation uses clsx and tailwind-merge
}
```

**Usage**:
```typescript
const buttonClass = cn(
  "px-4 py-2 rounded",
  isActive && "bg-blue-500",
  isDisabled && "opacity-50"
);
```

---

## Component Props

### GitVisualization Props

```typescript
// No props - uses internal state
export const GitVisualization = () => { ... }
```

**State**:
- `commits: CommitNode[]`
- `isAnimating: boolean`

**Methods**:
- `handleAnimate()` - Start/stop animation
- `handleReset()` - Reset to initial commits

---

### NavLink Props

```typescript
interface NavLinkProps {
  to: string;              // Route destination
  children: React.ReactNode;
  active?: boolean;        // Active state
  onClick?: () => void;    // Click handler
}
```

---

## React Hooks

### useToast

From shadcn-ui, used for toast notifications.

```typescript
const { toast } = useToast();

toast({
  title: "Title",
  description: "Description",
  variant?: "default" | "destructive";
  action?: React.ReactNode;
});
```

### useMobile

Custom hook to detect mobile device.

```typescript
const isMobile = useMobile();
// Returns: boolean
```

---

## Color Variables

CSS custom properties for Git-themed colors:

```css
--git-orange: orange color for Git/main branch
--github-purple: purple color for feature branches
--foreground: text/foreground color
--background: background color
--card: card background
--card-foreground: card text
--primary: primary color
--primary-foreground: primary text
--secondary: secondary color
--secondary-foreground: secondary text
--muted: muted color
--muted-foreground: muted text
--accent: accent color
--destructive: destructive/error color
--border: border color
--input: input background
--ring: focus ring color
```

---

## Environment Variables

Create `.env` file in project root if needed:

```bash
# Example - add for future features
VITE_API_URL=http://localhost:3000
```

**Note**: Only `VITE_*` variables are exposed to the frontend.

---

## Constants

### Git Colors

In `src/components/GitVisualization.tsx`:

```typescript
// Main branch color
const MAIN_BRANCH_COLOR = "hsl(var(--git-orange))";

// Feature branch color
const FEATURE_BRANCH_COLOR = "hsl(var(--github-purple))";

// Node radius
const NODE_RADIUS = 8;
const NODE_RADIUS_HOVER = 12;

// SVG dimensions
const SVG_WIDTH = 700;
const SVG_HEIGHT = 400;
```

---

## Routes

Defined in: `src/App.tsx`

```typescript
/           → Index page (main application)
/*          → NotFound page (404)
```

---

## Dependencies API

### D3.js

```typescript
import * as d3 from "d3";

// Common selections and operations
d3.select(element)         // Select single element
d3.append(type)            // Add element
d3.selectAll(type)         // Select all matching elements
.data(array)               // Bind data
.join(type)                // Join pattern
.attr(name, value)         // Set attribute
.on(event, handler)        // Add event listener
.transition()              // Animate
.duration(ms)              // Animation duration
```

### React Router

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<BrowserRouter>
  <Routes>
    <Route path="/path" element={<Component />} />
  </Routes>
</BrowserRouter>
```

### React Query

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
<QueryClientProvider client={queryClient}>
  {/* app content */}
</QueryClientProvider>
```

### Tailwind CSS

```typescript
// Import styles in index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

// Use in components
<div className="flex items-center justify-center p-4">
  {/* content */}
</div>
```

---

## Type Exports

All types are exported from `src/types/types.ts`:

```typescript
export interface Lesson { ... }
export interface Module { ... }
```

---

## Extending the API

### Adding New Lesson Modules

1. Add to `modules` array in `src/lessons/lessons.ts`
2. Follow existing Module/Lesson interface
3. Ensure unique IDs

### Adding New Types

1. Add to `src/types/types.ts`
2. Export from file
3. Document in this file

### Adding New Utilities

1. Add function to `src/lib/utils.ts`
2. Export from file
3. Add documentation in this reference
