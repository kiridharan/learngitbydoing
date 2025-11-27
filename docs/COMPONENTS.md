# Component Guide

Detailed documentation of all React components in the application.

## Core Components

### GitVisualization

**Location**: `src/components/GitVisualization.tsx`

**Purpose**: Renders an interactive D3.js visualization of Git commit trees with branches.

**Key Features**:
- Visualizes commit nodes with IDs and branch labels
- Shows connections between commits
- Interactive hover effects on commit nodes
- Control buttons for animation, reset, and save

**Props**: None

**State**:
- `commits` - Array of commit nodes
- `isAnimating` - Boolean flag for animation state

**Data Structure**:
```typescript
interface CommitNode {
  id: string;           // Git hash
  message: string;      // Commit message
  x: number;            // X coordinate
  y: number;            // Y coordinate
  branch: string;       // Branch name
}
```

**Initial Data**:
```typescript
const initialCommits: CommitNode[] = [
  { id: "a1b2c3d", message: "Initial commit", x: 100, y: 200, branch: "main" },
  { id: "e4f5g6h", message: "Add README", x: 200, y: 200, branch: "main" },
  { id: "i7j8k9l", message: "Create index.html", x: 300, y: 200, branch: "main" },
  { id: "m0n1o2p", message: "Add styles", x: 400, y: 150, branch: "feature" },
  { id: "q3r4s5t", message: "Update README", x: 400, y: 250, branch: "main" },
];
```

**Key Methods**:
- `handleAnimate()` - Toggles animation state
- `handleReset()` - Resets commits to initial state

**D3 Elements**:
- **Lines**: Connections between commits (edges)
- **Circles**: Commit nodes (colored by branch)
- **Text**: Commit IDs and branch labels

**Styling**:
- Uses CSS variables: `--git-orange` (main), `--github-purple` (feature)
- Colors responsive to branch type

**Future Enhancements**:
- [ ] Drag-and-drop for manual graph manipulation
- [ ] Click to expand commit details
- [ ] Animated transitions between states
- [ ] Merge visualization

---

### Header

**Location**: `src/components/Header.tsx`

**Purpose**: Main application header displaying branding and navigation.

**Key Features**:
- Application title/logo
- Main navigation links
- Responsive design

**Props**: None (may be extended with props in future)

**Usage**: Rendered at the top of the main layout.

---

### ModuleSidebar

**Location**: `src/components/ModuleSidebar.tsx`

**Purpose**: Sidebar navigation for selecting learning modules.

**Key Features**:
- Lists all available modules
- Module selection handling
- Visual indicators for selected module
- Scrollable list for many modules

**Props**: None (may be extended to accept callbacks)

**State**: 
- Tracks selected module

**Integration**:
- Receives module data from `src/lessons/lessons.ts`
- Updates LessonSidebar when module selected

---

### LessonSidebar

**Location**: `src/components/LessonSidebar.tsx`

**Purpose**: Sidebar navigation for lessons within a selected module.

**Key Features**:
- Displays lessons from selected module
- Shows completion status with visual indicators
- Marks current/active lesson
- Handles lesson selection

**Props**: None (may be extended to accept module data)

**State**:
- Tracks selected lesson
- Reflects lesson completion status

**Visual Indicators**:
- ✓ Check marks for completed lessons
- Current lesson highlight
- Progress indicators

---

### TerminalSimulator

**Location**: `src/components/TerminalSimulator.tsx`

**Purpose**: Interactive terminal interface for practicing Git commands in a safe environment.

**Key Features**:
- Command input area
- Output display
- Command history (planned)
- Git command auto-completion (planned)

**Props**: None

**State**: 
- `commands` - Array of executed commands
- `input` - Current command input
- `output` - Terminal output

**Status**: Currently in development

---

### NavLink

**Location**: `src/components/NavLink.tsx`

**Purpose**: Reusable navigation link component with active state styling.

**Props**:
```typescript
interface NavLinkProps {
  to: string;              // Route path
  children: React.ReactNode;
  active?: boolean;        // Is currently active
  onClick?: () => void;    // Click handler
}
```

**Features**:
- Active state styling
- Smooth transitions
- Keyboard accessible

---

## UI Component Library

### Active Components (17 total)

The following UI components from shadcn-ui are currently in use:

#### **Forms & Input**
- `input.tsx` - Text input field
- `label.tsx` - Form labels
- `toggle.tsx` - Toggle switch

#### **Layout & Structure**
- `card.tsx` - Card container
- `tabs.tsx` - Tabbed interface
- `separator.tsx` - Divider line
- `scroll-area.tsx` - Scrollable container
- `sheet.tsx` - Side sheet/drawer

#### **Data Display**
- `badge.tsx` - Badge/pill
- `progress.tsx` - Progress bar
- `skeleton.tsx` - Loading skeleton

#### **Dialogs & Modals**
- `dialog.tsx` - Modal dialog

#### **Notifications**
- `toast.tsx` - Toast notification
- `toaster.tsx` - Toast container
- `sonner.tsx` - Sonner toast system

#### **Utilities**
- `tooltip.tsx` - Tooltip component
- `button.tsx` - Button component

### Removed Components

The following 30 unused UI components have been removed to reduce bundle size and maintenance overhead:

**Forms**: textarea, checkbox, radio-group, select, switch, form, input-otp

**Layout**: accordion, resizable, sidebar, breadcrumb

**Navigation**: navigation-menu, menubar, pagination, dropdown-menu, context-menu

**Dialogs**: alert-dialog, popover, hover-card, drawer

**Data Display**: table, slider, carousel, avatar, aspect-ratio, chart, command

**Notifications**: alert

**Utilities**: toggle-group, use-toast, use-mobile

**Rationale**: Components were removed as they were not used in the current codebase. This keeps the project lean and focused on active functionality.

### Using UI Components

All UI components from shadcn-ui can be imported and used:

```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MyComponent() {
  return (
    <Card>
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <Button>Click me</Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
```

## Custom Hooks

Custom hooks are minimal. The project primarily uses React built-in hooks (useState, useEffect, useRef) and hooks provided by integrated libraries (React Router, React Query).

### Toast Notifications (via Sonner)

Toast notifications are handled through the Sonner library:

```typescript
import { toast } from "sonner";

// Usage
toast.success("Success message");
toast.error("Error message");
toast.loading("Loading...");
```

## Component Patterns

### Controlled Components

```typescript
const [value, setValue] = useState("");
<Input value={value} onChange={(e) => setValue(e.target.value)} />
```

### Composition Pattern

```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Tabs Component

```typescript
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

## Best Practices

1. **Always import from `@/components/ui/`** for UI components
2. **Use TypeScript** for type-safe component props
3. **Keep components focused** on a single responsibility
4. **Use composition** over inheritance
5. **Prop drill minimally** - consider context for deep trees
6. **Memoize expensive components** with React.memo
7. **Document props** with JSDoc comments
8. **Handle loading and error states** in async components

## Adding New Components

1. Create file in `src/components/`
2. Write component with TypeScript
3. Export default component
4. Add documentation here
5. Use in other components as needed

Example:

```typescript
// src/components/MyComponent.tsx
import React from "react";

interface MyComponentProps {
  title: string;
  onClose?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onClose }) => {
  return (
    <div>
      <h1>{title}</h1>
      {onClose && <button onClick={onClose}>Close</button>}
    </div>
  );
};

export default MyComponent;
```
