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

### Component Categories

#### **Forms & Input**
- `input.tsx` - Text input field
- `textarea.tsx` - Multi-line text
- `checkbox.tsx` - Checkbox input
- `radio-group.tsx` - Radio buttons
- `select.tsx` - Dropdown select
- `toggle.tsx` - Toggle switch
- `switch.tsx` - Toggle switch component
- `form.tsx` - Form wrapper
- `label.tsx` - Form labels
- `input-otp.tsx` - One-time password input

#### **Layout & Structure**
- `card.tsx` - Card container
- `accordion.tsx` - Collapsible accordion
- `tabs.tsx` - Tabbed interface
- `separator.tsx` - Divider line
- `scroll-area.tsx` - Scrollable container
- `resizable.tsx` - Resizable panels
- `sidebar.tsx` - Sidebar container
- `breadcrumb.tsx` - Breadcrumb navigation

#### **Navigation**
- `navigation-menu.tsx` - Navigation menu
- `menubar.tsx` - Menu bar
- `pagination.tsx` - Pagination controls
- `dropdown-menu.tsx` - Dropdown menu

#### **Dialogs & Popups**
- `dialog.tsx` - Modal dialog
- `alert-dialog.tsx` - Alert dialog
- `popover.tsx` - Popover tooltip
- `hover-card.tsx` - Hover card
- `sheet.tsx` - Side sheet/drawer
- `drawer.tsx` - Drawer panel

#### **Data Display**
- `table.tsx` - Data table
- `badge.tsx` - Badge/pill
- `progress.tsx` - Progress bar
- `slider.tsx` - Range slider
- `carousel.tsx` - Image carousel
- `avatar.tsx` - User avatar
- `skeleton.tsx` - Loading skeleton
- `aspect-ratio.tsx` - Aspect ratio container
- `chart.tsx` - Chart container
- `command.tsx` - Command palette

#### **Notifications**
- `toast.tsx` - Toast notification
- `toaster.tsx` - Toast container
- `sonner.tsx` - Sonner toast system
- `alert.tsx` - Alert message

#### **Utilities**
- `tooltip.tsx` - Tooltip component
- `toggle-group.tsx` - Toggle group
- `use-toast.ts` - Hook for toast notifications
- `use-mobile.tsx` - Mobile detection hook

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

### use-mobile

**Location**: `src/hooks/use-mobile.tsx`

**Purpose**: Detect if device is mobile.

**Returns**: `boolean` - true if mobile device

**Usage**:
```typescript
const isMobile = useMobile();
```

### use-toast

**Location**: `src/hooks/use-toast.ts`

**Purpose**: Show toast notifications.

**Returns**: `{ toast: Function }` - Toast function

**Usage**:
```typescript
const { toast } = useToast();
toast({
  title: "Success",
  description: "Operation completed",
});
```

## Component Patterns

### Controlled Components

```typescript
const [value, setValue] = useState("");
<Input value={value} onChange={(e) => setValue(e.target.value)} />
```

### Render Props Pattern

Some components support render props for flexibility:

```typescript
<Select value={selected} onValueChange={setSelected}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    {options.map(opt => (
      <SelectItem key={opt.id} value={opt.id}>
        {opt.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
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
