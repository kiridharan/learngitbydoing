/**
 * Core application constants
 * Centralized configuration for breakpoints, spacing, and component settings
 */

// Responsive breakpoints (in pixels)
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const;

// Base spacing unit (4px scale for consistency with Tailwind)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

// Panel configuration for resizable layouts
export const PANEL_CONFIG = {
  module: {
    defaultSize: 15,
    minSize: 10,
    maxSize: 25,
    tabletSize: 20,
  },
  visualization: {
    defaultSize: 40,
    minSize: 20,
    maxSize: 60,
    tabletSize: 35,
  },
  lesson: {
    defaultSize: 45,
    minSize: 20,
    maxSize: 70,
    tabletSize: 45,
  },
  lessonFull: {
    defaultSize: 85,
    minSize: 60,
    maxSize: 70,
  },
} as const;

// Animation durations (in ms)
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000,
} as const;

// Terminal configuration
export const TERMINAL_CONFIG = {
  height: {
    desktop: 256, // 64 * 4 (h-64)
    tablet: 200,
  },
  maxHistoryLines: 1000,
  fontSize: {
    desktop: 14,
    tablet: 12,
  },
} as const;

// Git visualization configuration
export const VIZ_CONFIG = {
  svg: {
    width: 700,
    height: 400,
    viewBoxPadding: 20,
  },
  margin: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
  commit: {
    radius: 12,
    spacing: 100,
    startX: 100,
    y: 200,
  },
  area: {
    y: 50,
    height: 80,
    width: 200,
  },
} as const;

// Z-index scale for layering
export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
} as const;

// Transition configurations
export const TRANSITIONS = {
  default: 'all 0.3s ease-in-out',
  fast: 'all 0.15s ease-in-out',
  slow: 'all 0.5s ease-in-out',
  colors: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out, border-color 0.3s ease-in-out',
} as const;
