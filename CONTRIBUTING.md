# Contributing to Git-D3-Viz

Thank you for your interest in contributing to Git-D3-Viz! This document provides guidelines and instructions for contributing to the project.

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm package manager
- Git

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Visit https://github.com/kiridharan/git-d3-viz and click "Fork"
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/git-d3-viz.git
   cd git-d3-viz
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/kiridharan/git-d3-viz.git
   ```

4. **Install dependencies**
   ```bash
   pnpm install
   ```

5. **Start development server**
   ```bash
   pnpm run dev
   ```

## Development Workflow

### Creating a Feature Branch

```bash
# Update your local master
git fetch upstream
git checkout master
git merge upstream/master

# Create a feature branch
git checkout -b feature/your-feature-name
```

### Code Standards

#### TypeScript
- Use strict TypeScript mode
- Provide proper type annotations
- Avoid `any` types

#### React Components
- Use functional components with hooks
- Keep components focused and reusable
- Use proper prop typing with TypeScript
- Add JSDoc comments for complex components

#### Styling
- Use Tailwind CSS for styling
- Follow the existing design system using shadcn/ui components
- Ensure responsive design
- Maintain dark/light mode compatibility

#### Git Commits
```bash
# Use conventional commit messages
git commit -m "feat: add feature description"
git commit -m "fix: resolve issue description"
git commit -m "docs: update documentation"
git commit -m "refactor: improve code structure"
git commit -m "test: add test coverage"
```

### Common Commit Types
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation changes
- `refactor:` Code refactoring without feature changes
- `test:` Adding or updating tests
- `style:` Code style changes (formatting, semicolons, etc.)
- `perf:` Performance improvements
- `chore:` Build process, dependencies, etc.

## Making Changes

### Before You Start
1. Check existing issues and PRs to avoid duplicate work
2. For major changes, open an issue first to discuss the approach
3. Follow the existing code style and patterns

### Linting and Formatting

```bash
# Run ESLint
pnpm run lint

# Fix formatting issues
pnpm run lint -- --fix
```

### Testing

While developing:
1. Test locally in your browser at `http://localhost:5173`
2. Test with different screen sizes for responsive design
3. Test in both light and dark modes

### Building

```bash
# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## Submitting a Pull Request

### Before Submitting
1. Ensure your code passes linting: `pnpm run lint`
2. Test your changes thoroughly
3. Update documentation if needed
4. Update the README if adding new features
5. Rebase on latest upstream/master

### PR Guidelines

1. **Title**: Use clear, descriptive titles following commit conventions
   - Good: `feat: add resizable panel layout`
   - Bad: `Update files`

2. **Description**: Include:
   - What changes were made and why
   - Any related issues (use `Fixes #123`)
   - Steps to test the changes
   - Screenshots for UI changes

3. **Keep PRs focused**
   - One feature or fix per PR
   - Smaller PRs are easier to review

### Example PR Description

```markdown
## Description
Added resizable panel layout to improve user experience when working with multiple panes.

## Changes
- Integrated react-resizable-panels library
- Updated Index.tsx to use PanelGroup with resizable panels
- Updated ModuleSidebar and LessonSidebar components for flexible sizing

## Related Issues
Fixes #42

## How to Test
1. Start the dev server: `pnpm run dev`
2. Drag the resize handles between panels
3. Verify panels resize smoothly and maintain content
4. Test with animation lessons to see all three panels

## Screenshots
[If applicable, add screenshots]
```

## Project Structure

```
src/
  components/     # React components
  hooks/          # Custom React hooks
  services/       # Business logic and utilities
  store/          # State management (Zustand)
  types/          # TypeScript type definitions
  pages/          # Page components
  lib/            # Utility functions
  lessons/        # Lesson content and data
docs/             # Documentation
```

## Key Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **D3.js** - Data visualization
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Zustand** - State management
- **React Router** - Routing

## Getting Help

- **Issues**: Open an issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check `/docs` folder for detailed guides

## Code Review Process

All PRs require:
1. At least one approval from maintainers
2. Passing automated checks (linting, builds)
3. No merge conflicts with main branch

Reviewers will look for:
- Code quality and maintainability
- Adherence to project standards
- Testing and documentation
- Performance implications

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions

## License

By contributing, you agree that your contributions will be licensed under the same MIT license as the project.

Thank you for contributing to Git-D3-Viz! 🎉
