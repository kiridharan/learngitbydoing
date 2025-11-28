/**
 * UI design system constants
 * Standardized patterns for spacing, typography, and component styling
 */

// Standard spacing patterns (using Tailwind classes)
export const SPACING_CLASSES = {
    // Padding patterns
    padding: {
        none: '',
        xs: 'p-1',
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
    },
    paddingX: {
        sm: 'px-2',
        md: 'px-4',
        lg: 'px-6',
    },
    paddingY: {
        sm: 'py-2',
        md: 'py-4',
        lg: 'py-6',
    },
    // Gap patterns for flex/grid
    gap: {
        xs: 'gap-1',
        sm: 'gap-2',
        md: 'gap-3',
        lg: 'gap-4',
        xl: 'gap-6',
    },
} as const;

// Card styling patterns
export const CARD_STYLES = {
    base: 'rounded-lg border bg-card text-card-foreground',
    elevated: 'rounded-lg border bg-card text-card-foreground shadow-lg',
    interactive: 'rounded-lg border bg-card text-card-foreground transition-all hover:shadow-md cursor-pointer',
    highlighted: 'rounded-lg border-2 border-accent bg-accent/10',
} as const;

// Typography patterns
export const TEXT_STYLES = {
    heading: {
        h1: 'text-2xl font-bold text-foreground',
        h2: 'text-xl font-semibold text-foreground',
        h3: 'text-lg font-semibold text-foreground',
        h4: 'text-base font-semibold text-foreground',
    },
    body: {
        large: 'text-base text-foreground',
        normal: 'text-sm text-foreground',
        small: 'text-xs text-foreground',
    },
    muted: {
        large: 'text-base text-muted-foreground',
        normal: 'text-sm text-muted-foreground',
        small: 'text-xs text-muted-foreground',
    },
    mono: {
        normal: 'font-mono text-sm',
        small: 'font-mono text-xs',
    },
} as const;

// Button size patterns
export const BUTTON_SIZES = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
} as const;

// Border patterns
export const BORDER_STYLES = {
    default: 'border border-border',
    thick: 'border-2 border-border',
    accent: 'border-2 border-accent',
    none: 'border-0',
    top: 'border-t border-border',
    bottom: 'border-b border-border',
    left: 'border-l border-border',
    right: 'border-r border-border',
} as const;

// Touch target sizes (minimum 44x44px for accessibility)
export const TOUCH_TARGET = {
    minHeight: 'min-h-[44px]',
    minWidth: 'min-w-[44px]',
} as const;

// Transition classes
export const TRANSITION_CLASSES = {
    default: 'transition-all duration-300 ease-in-out',
    fast: 'transition-all duration-150 ease-in-out',
    slow: 'transition-all duration-500 ease-in-out',
    colors: 'transition-colors duration-300 ease-in-out',
    transform: 'transition-transform duration-300 ease-in-out',
} as const;

// Common layout patterns
export const LAYOUT_PATTERNS = {
    flexCenter: 'flex items-center justify-center',
    flexBetween: 'flex items-center justify-between',
    flexStart: 'flex items-center justify-start',
    flexColumn: 'flex flex-col',
    gridAuto: 'grid grid-cols-[auto_1fr]',
} as const;

// Responsive visibility classes
export const RESPONSIVE_VISIBILITY = {
    desktopOnly: 'hidden lg:block',
    tabletUp: 'hidden md:block',
    tabletOnly: 'hidden md:block lg:hidden',
    mobileOnly: 'block md:hidden',
} as const;
