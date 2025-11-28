/**
 * Custom hooks for responsive design
 */

import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '@/config/constants';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

/**
 * Hook to get current breakpoint
 */
export function useBreakpoint(): Breakpoint {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
        if (typeof window === 'undefined') return 'desktop';
        const width = window.innerWidth;
        if (width >= BREAKPOINTS.wide) return 'wide';
        if (width >= BREAKPOINTS.desktop) return 'desktop';
        if (width >= BREAKPOINTS.tablet) return 'tablet';
        return 'mobile';
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            let newBreakpoint: Breakpoint;

            if (width >= BREAKPOINTS.wide) {
                newBreakpoint = 'wide';
            } else if (width >= BREAKPOINTS.desktop) {
                newBreakpoint = 'desktop';
            } else if (width >= BREAKPOINTS.tablet) {
                newBreakpoint = 'tablet';
            } else {
                newBreakpoint = 'mobile';
            }

            setBreakpoint(newBreakpoint);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return breakpoint;
}

/**
 * Hook for media query matching
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia(query).matches;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches);

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
        // Fallback for older browsers
        else {
            mediaQuery.addListener(handleChange);
            return () => mediaQuery.removeListener(handleChange);
        }
    }, [query]);

    return matches;
}

/**
 * Hook to check if viewport is at least tablet size
 */
export function useIsTabletUp(): boolean {
    return useMediaQuery(`(min-width: ${BREAKPOINTS.tablet}px)`);
}

/**
 * Hook to check if viewport is at least desktop size
 */
export function useIsDesktop(): boolean {
    return useMediaQuery(`(min-width: ${BREAKPOINTS.desktop}px)`);
}

/**
 * Hook to get viewport dimensions
 */
export function useViewportDimensions() {
    const [dimensions, setDimensions] = useState(() => ({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    }));

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return dimensions;
}

/**
 * Get panel configuration based on breakpoint
 */
export function getPanelSizeForBreakpoint(
    breakpoint: Breakpoint,
    panelType: 'module' | 'visualization' | 'lesson' | 'lessonFull'
) {
    const config = {
        module: breakpoint === 'tablet' ? 20 : 15,
        visualization: breakpoint === 'tablet' ? 35 : 40,
        lesson: breakpoint === 'tablet' ? 45 : 45,
        lessonFull: 85,
    };

    return config[panelType];
}
