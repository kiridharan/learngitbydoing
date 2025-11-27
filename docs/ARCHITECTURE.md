# Architecture Guide

## Overview

Git-D3-Viz follows a modern React architecture with TypeScript, organized into distinct layers for components, utilities, types, and data.

## Architectural Layers

### 1. **Presentation Layer** (`src/components/`)

Components are organized into two categories:

#### Core Components
- **GitVisualization.tsx** - D3.js-based visualization of Git commit graphs
- **Header.tsx** - Main application header
- **LessonSidebar.tsx** - Sidebar for lesson navigation
- **ModuleSidebar.tsx** - Sidebar for module navigation
- **NavLink.tsx** - Reusable navigation link component
- **TerminalSimulator.tsx** - Interactive terminal interface

#### UI Component Library (`src/components/ui/`)
Pre-built shadcn-ui components providing:
- Form controls (input, checkbox, select, etc.)
- Layout components (card, accordion, tabs, etc.)
- Dialogs and modals
- Navigation elements
- Tooltips and popovers

All UI components use Radix UI primitives and are styled with Tailwind CSS.

### 2. **Routing Layer**

**File**: `src/App.tsx`

Uses React Router v6 for navigation:

```
/         → Index page (main application)
/*        → NotFound page (catch-all 404)
```

The router is wrapped with:
- QueryClientProvider (React Query for state management)
- TooltipProvider (UI tooltips)
- Toaster components (notifications)

### 3. **Data & Types Layer**

#### Lesson Data (`src/lessons/lessons.ts`)
Defines the curriculum structure with modules and lessons:
- Module data with IDs and titles
- Lesson definitions with completion tracking
- Current lesson markers for progress

#### Type Definitions (`src/types/types.ts`)
- `Module` interface - Structure of a learning module
- `Lesson` interface - Structure of individual lessons

### 4. **Utilities & Hooks Layer**

#### Custom Hooks (`src/hooks/`)
- `use-mobile.tsx` - Detect mobile device
- `use-toast.ts` - Toast notification management

#### Utilities (`src/lib/utils.ts`)
- Helper functions and utilities for common operations

## Data Flow

### 1. **Lesson Navigation Flow**

```
ModuleSidebar (displays modules)
    ↓
LessonSidebar (displays lessons in selected module)
    ↓
User selects lesson
    ↓
Lesson state updated
    ↓
Content/Visualization rendered based on lesson
```

### 2. **Visualization Flow**

```
GitVisualization component mounts
    ↓
Initial commit data loaded (initialCommits array)
    ↓
D3.js renders SVG visualization
    ↓
User interactions (hover, click)
    ↓
State updates trigger re-render
    ↓
Animation/Reset buttons update commit state
```

### 3. **UI Updates Flow**

```
User action (click, input, etc.)
    ↓
Event handler triggered
    ↓
State updated (useState)
    ↓
Component re-renders
    ↓
D3 visualization updates if needed
```

## Component Hierarchy

```
App
├── BrowserRouter (routing)
├── QueryClientProvider (state)
├── TooltipProvider (UI)
├── Toaster & Sonner (notifications)
└── Routes
    └── Route / (Index)
        └── Header
        ├── ModuleSidebar
        ├── LessonSidebar
        ├── GitVisualization
        └── TerminalSimulator
```

## Styling Architecture

### Tailwind CSS
- Utility-first CSS framework
- Configuration in `tailwind.config.ts`
- Responsive design using Tailwind breakpoints

### Custom CSS Variables
Git-specific colors defined in CSS:
- `--git-orange` - Git brand color
- `--github-purple` - GitHub brand color
- Standard vars: `--foreground`, `--background`, `--border`, etc.

### shadcn-ui Components
- Built on Radix UI primitives
- Pre-styled with Tailwind CSS
- Located in `src/components/ui/`
- Can be customized by modifying Tailwind classes

## State Management

### React Hooks (Local State)
- Components use `useState` for local state
- Examples: commits in GitVisualization, selected lesson

### React Query (Global State)
- Configured in App.tsx
- Ready for async data fetching
- Currently minimal usage, can be expanded

### Lesson State
- Stored in `src/lessons/lessons.ts`
- Includes completion tracking
- Current lesson markers

## Build & Optimization

### Vite Configuration (`vite.config.ts`)
- SWC compiler for fast builds
- React plugin for JSX transformation
- Development server with HMR (Hot Module Replacement)

### Code Splitting
- Automatic by Vite
- Route-based splitting possible with React Router

### Tree Shaking
- Automatically removes unused D3 imports
- Tailwind CSS purges unused utilities

## D3.js Integration

### Architecture
1. **SVG Container** - `<svg>` ref in GitVisualization
2. **D3 Selection** - `d3.select()` to target SVG
3. **Data Binding** - D3 joins data to visual elements
4. **Visualization** - Renders circles (commits), lines (connections)
5. **Interactions** - Mouse events for hover effects

### Pattern Used
```typescript
// Bind data to visual elements
svg.append("g")
  .selectAll("element")
  .data(data)
  .join("element")
  .attr("x", d => d.x)
  .on("mouseenter", function() { /* animate */ })
```

## Type Safety

### TypeScript Strict Mode
- Enabled in `tsconfig.json`
- Ensures type safety across the codebase

### Interface Definitions
```typescript
interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  current?: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CommitNode {
  id: string;
  message: string;
  x: number;
  y: number;
  branch: string;
}
```

## Performance Considerations

1. **D3 Rendering** - Updates only when SVG ref or commits change
2. **Component Memoization** - Use React.memo for expensive components if needed
3. **CSS in JS** - Tailwind CSS generates minimal CSS
4. **Bundle Size** - Tree-shaking removes unused dependencies

## Scalability

### For Adding New Lessons
1. Add lesson data to `src/lessons/lessons.ts`
2. Create new lesson content component
3. Add routing if needed

### For Adding New Features
1. Create component in `src/components/`
2. Define types in `src/types/types.ts`
3. Add utilities in `src/lib/utils.ts`
4. Update routing in `src/App.tsx`

### For Adding New Visualizations
1. Create new D3 component
2. Use same pattern: SVG ref → D3 selection → data binding
3. Integrate with existing state management
