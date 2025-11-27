# Development Guide

Guidelines for developing and contributing to the Git-D3-Viz project.

## Development Workflow

### 1. Setting Up Your Development Environment

```bash
# Clone repository
git clone https://github.com/kiridharan/git-d3-viz.git
cd git-d3-viz

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open in browser
# http://localhost:5173
```

### 2. Creating a Feature Branch

```bash
# Create and switch to new branch
git checkout -b feature/your-feature-name

# Make your changes
# Commit regularly
git add .
git commit -m "descriptive commit message"

# Push to remote
git push origin feature/your-feature-name
```

### 3. Committing Code

Follow conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build/dependency changes

**Examples**:
```bash
git commit -m "feat(visualization): add drag-and-drop for commits"
git commit -m "fix(sidebar): resolve lesson navigation bug"
git commit -m "docs: update installation guide"
```

### 4. Code Quality

#### ESLint

Check code quality:
```bash
pnpm lint
```

Fix auto-fixable issues:
```bash
pnpm lint -- --fix
```

#### TypeScript

Ensure no TypeScript errors:
```bash
npx tsc --noEmit
```

#### Building

Test production build:
```bash
pnpm build
pnpm preview
```

## Project Structure Guidelines

### Adding a New Component

**Location**: `src/components/YourComponent.tsx`

**Template**:
```typescript
import React from "react";
import { Button } from "@/components/ui/button";

interface YourComponentProps {
  title: string;
  onClose?: () => void;
}

/**
 * YourComponent - Brief description of what it does
 * 
 * @param {YourComponentProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const YourComponent: React.FC<YourComponentProps> = ({
  title,
  onClose
}) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {onClose && (
        <Button onClick={onClose} variant="outline">
          Close
        </Button>
      )}
    </div>
  );
};

export default YourComponent;
```

**Key Points**:
- Use TypeScript with proper interfaces
- Add JSDoc comments
- Use Tailwind CSS for styling
- Export both named and default
- Follow component naming (PascalCase)

### Adding a New Lesson Module

**Edit**: `src/lessons/lessons.ts`

```typescript
{
  id: "4",
  title: "Your Module Title",
  lessons: [
    { 
      id: "4-1", 
      title: "Lesson One", 
      completed: false,
      current: false 
    },
    { 
      id: "4-2", 
      title: "Lesson Two", 
      completed: false 
    }
  ]
}
```

**ID Convention**:
- Module ID: Sequential number (1, 2, 3, 4...)
- Lesson ID: `{module-id}-{lesson-number}`

### Adding New Types

**File**: `src/types/types.ts`

```typescript
export interface NewType {
  id: string;
  name: string;
  // ... other properties
}
```

**Guidelines**:
- Use PascalCase for interface names
- Document complex types
- Export all types
- Use standard property names

### Adding Utilities

**File**: `src/lib/utils.ts`

```typescript
/**
 * Utility function description
 * @param param1 - Parameter description
 * @returns Return value description
 */
export function yourUtility(param1: string): string {
  // Implementation
  return result;
}
```

## React Best Practices

### 1. Functional Components

Always use functional components with hooks:

```typescript
// ✅ Good
export const MyComponent = () => {
  const [state, setState] = useState(0);
  return <div>{state}</div>;
};

// ❌ Avoid
class MyComponent extends React.Component { ... }
```

### 2. Custom Hooks

Extract reusable logic into custom hooks:

```typescript
// ✅ Good
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(c => c + 1);
  return { count, increment };
}

function MyComponent() {
  const { count, increment } = useCounter();
  return <button onClick={increment}>{count}</button>;
}
```

### 3. State Management

Keep state as local as possible:

```typescript
// ✅ Good - local state
function Form() {
  const [input, setInput] = useState("");
  // ...
}

// Use React Query for async state
// Use Context only for truly global state
```

### 4. Event Handlers

Use useCallback for stability:

```typescript
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies]);
```

### 5. Rendering Lists

Always use stable keys:

```typescript
// ✅ Good
lessons.map(lesson => (
  <LessonItem key={lesson.id} lesson={lesson} />
))

// ❌ Avoid
lessons.map((lesson, index) => (
  <LessonItem key={index} lesson={lesson} />
))
```

### 6. Conditional Rendering

Use ternary or logical operators clearly:

```typescript
// ✅ Good
{isLoading ? <Spinner /> : <Content />}
{error && <ErrorMessage error={error} />}

// ❌ Avoid complex nested ternaries
```

## TypeScript Guidelines

### 1. Type Annotations

Always type function parameters and returns:

```typescript
// ✅ Good
function calculate(a: number, b: number): number {
  return a + b;
}

// ❌ Avoid
function calculate(a, b) {
  return a + b;
}
```

### 2. Interfaces for Objects

Use interfaces for object shapes:

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ Avoid using type for simple objects
type User = {
  id: string;
  name: string;
  email: string;
}
```

### 3. Strict Mode

Code should pass TypeScript strict mode:

```bash
npx tsc --strict --noEmit
```

### 4. Union Types

Use for multiple possible values:

```typescript
type Status = "idle" | "loading" | "success" | "error";
type Role = "admin" | "user" | "guest";
```

## Styling Guidelines

### Using Tailwind CSS

```typescript
// ✅ Good
<div className="flex items-center justify-between p-4 bg-card rounded-lg">
  <h1 className="text-2xl font-bold">Title</h1>
  <Button>Action</Button>
</div>

// ❌ Avoid inline styles
<div style={{ display: 'flex', justifyContent: 'space-between' }}>
```

### Responsive Design

```typescript
// ✅ Use Tailwind breakpoints
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* responsive grid */}
</div>
```

### Dark Mode

Already configured via next-themes:

```typescript
// Components automatically support dark mode
// CSS variables adjust automatically
```

## Testing (Future)

When testing is added:

```bash
# Run tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

Test file naming: `ComponentName.test.tsx`

## Performance Optimization

### 1. Code Splitting

Routes are automatically split:

```typescript
const Page = React.lazy(() => import("./Page"));
```

### 2. Memoization

Use for expensive computations:

```typescript
const MemoizedComponent = React.memo(MyComponent);

const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

### 3. Tree Shaking

Only import what you need:

```typescript
// ✅ Good
import { Button } from "@/components/ui/button";

// ❌ Avoid
import * from "@/components/ui";
```

## Debugging

### Browser DevTools

1. Open DevTools (F12)
2. React tab (install React DevTools extension)
3. Component tree inspection
4. Props/state inspection

### VS Code Debugging

**.vscode/launch.json**:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### Console Logging

```typescript
console.log("Debug:", variable);
console.error("Error:", error);
console.table(arrayOfObjects);
```

## Documentation

### Comments

```typescript
// ✅ Good - explain WHY, not WHAT
// We need to debounce input to reduce API calls
const debouncedSearch = useDebounce(searchTerm, 300);

// ❌ Avoid - obvious from code
// Set name to value
setName(value);
```

### JSDoc

```typescript
/**
 * Calculates the total price including tax
 * @param basePrice - Price before tax
 * @param taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @returns {number} Total price including tax
 * @example
 * const total = calculateTotal(100, 0.08); // returns 108
 */
function calculateTotal(basePrice: number, taxRate: number): number {
  return basePrice * (1 + taxRate);
}
```

### README Comments

```typescript
/**
 * GitVisualization Component
 * 
 * Renders an interactive D3.js visualization of Git commits and branches.
 * Features include:
 * - Interactive hover effects
 * - Branch color coding
 * - Animation controls
 * 
 * @see {@link ./GitVisualization.tsx}
 * @see {@link ../docs/COMPONENTS.md#gitvisualization}
 */
```

## Pre-commit Checks

Before committing, run:

```bash
# Lint check
pnpm lint

# TypeScript check
npx tsc --noEmit

# Build check
pnpm build
```

## Submitting Changes

1. Create feature branch
2. Make changes following guidelines
3. Run linting and tests
4. Commit with clear messages
5. Push to GitHub
6. Create Pull Request with description
7. Request review
8. Address feedback
9. Merge when approved

## Common Tasks

### Update Dependencies

```bash
# Check for updates
pnpm outdated

# Update all
pnpm update

# Update specific package
pnpm update package-name
```

### Add New Package

```bash
pnpm add package-name

# Or dev dependency
pnpm add -D package-name
```

### Remove Package

```bash
pnpm remove package-name
```

## Troubleshooting

### Port Already in Use

```bash
pnpm dev -- --port 3000
```

### Clear Cache

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Module Not Found

Ensure path alias is correct:
```typescript
import from "@/components"  // ✅ Correct
import from "src/components"  // ❌ Won't work
```

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [D3.js](https://d3js.org)
- [Vite Documentation](https://vitejs.dev)
- [shadcn/ui Components](https://ui.shadcn.com)
