# Setup & Installation Guide

## Prerequisites

Before you start, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm**, **pnpm**, or **bun** - npm comes with Node.js, or use pnpm/bun for better performance
- **Git** - For version control

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/kiridharan/git-d3-viz.git
cd git-d3-viz
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using pnpm (recommended):
```bash
pnpm install
```

Using bun:
```bash
bun install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (Vite default)

### 4. Build for Production

```bash
npm run build
```

Output files will be in the `dist/` directory.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode (unminified) |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview production build locally |

## Project Structure

```
git-d3-viz/
├── src/
│   ├── components/          # React components
│   │   ├── GitVisualization.tsx    # D3.js visualization
│   │   ├── Header.tsx              # Main header
│   │   ├── LessonSidebar.tsx        # Lesson navigation
│   │   ├── ModuleSidebar.tsx        # Module navigation
│   │   ├── TerminalSimulator.tsx    # Terminal interface
│   │   ├── NavLink.tsx              # Navigation link component
│   │   └── ui/                      # shadcn-ui components
│   ├── pages/
│   │   ├── Index.tsx               # Main page
│   │   └── NotFound.tsx            # 404 page
│   ├── hooks/                      # Custom React hooks
│   ├── lib/                        # Utility functions
│   ├── lessons/                    # Lesson data
│   ├── types/                      # TypeScript type definitions
│   ├── App.tsx                     # Main App component
│   └── main.tsx                    # Entry point
├── public/                         # Static assets
├── docs/                          # Documentation (this folder)
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── tailwind.config.ts             # Tailwind CSS config
├── vite.config.ts                 # Vite config
└── README.md                      # Project README
```

## Configuration Files

### TypeScript Configuration
- `tsconfig.json` - Base TypeScript configuration
- `tsconfig.app.json` - App-specific TypeScript settings
- `tsconfig.node.json` - Node/build tool TypeScript settings

### Development Tools
- `eslint.config.js` - ESLint configuration for code quality
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `vite.config.ts` - Vite build configuration

## Environment Setup

### Environment Variables

Create a `.env` file in the project root if needed (currently no required env vars):

```bash
# Example - add if needed for future features
# VITE_API_URL=http://localhost:3000
```

Note: Vite automatically exposes variables prefixed with `VITE_` in the frontend.

## Troubleshooting

### Port Already in Use

If port 5173 is already in use:

```bash
npm run dev -- --port 3000
```

### Dependencies Issues

Clear cache and reinstall:

```bash
rm -rf node_modules pnpm-lock.yaml
npm install
```

### TypeScript Errors

Ensure your IDE is using the correct TypeScript version:

```bash
npx tsc --version
```

Should be 5.8.3 or higher.

### Build Failures

Check for TypeScript errors:

```bash
npx tsc --noEmit
```

## IDE Setup

### VS Code

Recommended extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

### WebStorm/IntelliJ

- Built-in support for React, TypeScript, and Tailwind CSS
- Enable ESLint inspection: Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint

## Next Steps

1. Review the [Architecture Guide](./ARCHITECTURE.md) to understand the codebase
2. Check [Component Guide](./COMPONENTS.md) for component documentation
3. Read [Development Guide](./DEVELOPMENT.md) for contribution guidelines
