# Project Overview

## What is Git-D3-Viz?

Git-D3-Viz is an interactive educational platform for learning Git version control concepts through visual D3.js visualizations. It combines structured lessons with interactive visualizations to help users understand Git branching, merging, commits, and repository workflows.

## Purpose

The project aims to make Git learning more intuitive and engaging by:
- Providing structured, progressive lessons about Git
- Visualizing Git concepts (commits, branches, merges) in real-time
- Offering an interactive learning experience with hands-on terminal simulations
- Presenting content in an organized, module-based structure

## Key Features

### 1. **Structured Learning Modules**
- Organized into learning modules covering different Git topics
- Each module contains multiple progressive lessons
- Lessons track completion status for progress tracking

### 2. **D3.js Git Visualization**
- Interactive visualization of Git commit graphs
- Display of commits, branches, and their relationships
- Visual representation of merges and branching points
- Interactive controls (Animate, Reset, Save buttons)

### 3. **Terminal Simulator**
- Simulated terminal interface for practicing Git commands
- Provides a safe environment to learn Git commands without risk

### 4. **Modular Content Structure**
The following learning modules are included:

#### Module 1: Git Fundamentals
- Lesson 1-1: What is Git?
- Lesson 1-2: Git Setup
- Lesson 1-3: First Repository
- Lesson 1-4: Commits & Messages

#### Module 2: Branching & Merging
- Lesson 2-1: Understanding Branches
- Lesson 2-2: Merging Basics
- Lesson 2-3: Conflict Resolution

#### Module 3: Remote Repositories
- Lesson 3-1: Remote Basics
- Lesson 3-2: Push & Pull

## User Interface

### Layout
The application features a responsive layout with:
- **Header**: Navigation and branding
- **Sidebar Navigation**: Module and lesson navigation
- **Main Content Area**: Displays visualizations and lesson content
- **Interactive Elements**: Buttons for animations, resets, and actions

### Color Scheme
- Primary accent color for Git/Orange elements
- GitHub purple for branch indicators
- Tailwind CSS utility classes for consistency

## Technology Stack

| Category | Technology |
|----------|-----------|
| **Frontend Framework** | React 18 with TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS + shadcn-ui |
| **Visualization** | D3.js v7 |
| **Routing** | React Router v6 |
| **State Management** | React Query |
| **UI Components** | shadcn-ui (Radix UI primitives) |
| **Routing** | React Router DOM v6 |
| **Forms** | React Hook Form + Zod |

## Current Status

The project is in active development with:
- ✅ Core layout and navigation established
- ✅ D3.js visualization component functional
- ✅ Lesson data structure defined
- ✅ UI component library integrated
- 🚧 Terminal simulator component in progress
- 🚧 Interactive lesson content to be added

## Future Enhancements

- [ ] Complete terminal simulator functionality
- [ ] Interactive D3 visualization with drag-and-drop
- [ ] Real-time Git command execution
- [ ] User progress tracking and persistence
- [ ] Additional advanced Git topics
- [ ] Code examples and walkthroughs
- [ ] Quiz and assessment features
- [ ] Dark/Light theme toggle
