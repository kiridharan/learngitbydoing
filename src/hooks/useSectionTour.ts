/**
 * useSectionTour Hook
 * Manages tour state for section-wise guided tours
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { CallBackProps, STATUS } from 'react-joyride';
import {
  TOUR_SECTIONS,
  TourSection,
  getSectionTourSteps,
  sectionTourMap,
} from '@/tours/sectionTours';

export interface UseSectionTourOptions {
  autoStart?: boolean;
  allowSkip?: boolean;
  continuous?: boolean;
  showProgress?: boolean;
  scrollDuration?: number;
  spotlightPadding?: number;
}

export interface SectionTourState {
  run: boolean;
  currentSection: TourSection | null;
  stepIndex: number;
  isFinished: boolean;
  visitedSections: Set<TourSection>;
}

const STORAGE_KEY = 'sectionTourState';

const loadTourState = (): Partial<SectionTourState> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        visitedSections: new Set(parsed.visitedSections || []),
      };
    }
  } catch (error) {
    console.warn('Failed to load tour state:', error);
  }
  return {};
};

const saveTourState = (state: SectionTourState): void => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        visitedSections: Array.from(state.visitedSections),
      })
    );
  } catch (error) {
    console.warn('Failed to save tour state:', error);
  }
};

/**
 * Hook to manage section-wise tours
 * @param options - Configuration options for the tour
 * @returns Tour state and control functions
 */
export const useSectionTour = (
  options: UseSectionTourOptions = {}
): {
  tourState: SectionTourState;
  steps: typeof sectionTourMap[keyof typeof sectionTourMap];
  handleJoyrideCallback: (data: CallBackProps) => void;
  startSectionTour: (section: TourSection) => void;
  nextSection: () => void;
  previousSection: () => void;
  skipTour: () => void;
  resetTour: () => void;
  getCurrentSection: () => TourSection | null;
  isCurrentSectionVisited: () => boolean;
  markSectionVisited: (section: TourSection) => void;
} => {
  const {
    autoStart = true,
    allowSkip = true,
    continuous = false,
    showProgress = true,
    scrollDuration = 300,
    spotlightPadding = 10,
  } = options;

  const [tourState, setTourState] = useState<SectionTourState>(() => {
    const stored = loadTourState();
    const sections = Object.values(TOUR_SECTIONS);
    const isFinished = stored.isFinished || false;

    // Determine the initial section
    let initialSection: TourSection | null = null;
    if (!isFinished) {
      // If not finished, use stored section or start with the first section
      initialSection = (stored.currentSection as TourSection) || (sections[0] as TourSection);
    }

    return {
      run: autoStart && !isFinished && initialSection !== null,
      currentSection: initialSection,
      stepIndex: stored.stepIndex || 0,
      isFinished,
      visitedSections: stored.visitedSections || new Set(),
    };
  });

  const stateRef = useRef(tourState);

  // Update ref when state changes
  useEffect(() => {
    stateRef.current = tourState;
    saveTourState(tourState);
  }, [tourState]);

  // Initialize tour on mount if autoStart is enabled and not finished
  useEffect(() => {
    if (autoStart && !tourState.isFinished && tourState.currentSection === null) {
      const sections = Object.values(TOUR_SECTIONS);
      setTourState((prev) => ({
        ...prev,
        currentSection: sections[0] as TourSection,
        run: true,
      }));
    }
  }, [autoStart]);

  // Get steps for current section
  const steps = tourState.currentSection
    ? getSectionTourSteps(tourState.currentSection)
    : [];

  const startSectionTour = useCallback((section: TourSection) => {
    setTourState((prev) => ({
      ...prev,
      run: true,
      currentSection: section,
      stepIndex: 0,
      isFinished: false,
    }));
  }, []);

  const nextSection = useCallback(() => {
    const sections = Object.values(TOUR_SECTIONS);
    const currentIndex = tourState.currentSection
      ? sections.indexOf(tourState.currentSection)
      : -1;
    const nextIndex = currentIndex + 1;

    if (nextIndex < sections.length) {
      startSectionTour(sections[nextIndex] as TourSection);
    } else {
      // All sections completed - show complete tour
      setTourState((prev) => ({
        ...prev,
        run: false,
        isFinished: true,
      }));
    }
  }, [tourState.currentSection, startSectionTour]);

  const previousSection = useCallback(() => {
    const sections = Object.values(TOUR_SECTIONS);
    const currentIndex = tourState.currentSection
      ? sections.indexOf(tourState.currentSection)
      : -1;
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      startSectionTour(sections[prevIndex] as TourSection);
    }
  }, [tourState.currentSection, startSectionTour]);

  const skipTour = useCallback(() => {
    setTourState((prev) => ({
      ...prev,
      run: false,
      isFinished: true,
    }));
  }, []);

  const resetTour = useCallback(() => {
    const sections = Object.values(TOUR_SECTIONS);
    setTourState({
      run: true,
      currentSection: sections[0] as TourSection,
      stepIndex: 0,
      isFinished: false,
      visitedSections: new Set(),
    });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getCurrentSection = useCallback((): TourSection | null => {
    return stateRef.current.currentSection;
  }, []);

  const isCurrentSectionVisited = useCallback((): boolean => {
    const section = stateRef.current.currentSection;
    return section ? stateRef.current.visitedSections.has(section) : false;
  }, []);

  const markSectionVisited = useCallback((section: TourSection) => {
    setTourState((prev) => ({
      ...prev,
      visitedSections: new Set(prev.visitedSections).add(section),
    }));
  }, []);

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { action, index, status, type } = data;

    // Mark current section as visited when entering it
    if (tourState.currentSection && type === 'step:before') {
      markSectionVisited(tourState.currentSection);
    }

    // Handle tour completion
    if (status === STATUS.FINISHED) {
      nextSection();
      return;
    }

    if (status === STATUS.SKIPPED) {
      if (allowSkip) {
        skipTour();
      } else {
        nextSection();
      }
      return;
    }

    // Update step index
    if (type === 'step:after') {
      setTourState((prev) => ({
        ...prev,
        stepIndex: index + 1,
      }));
    }
  }, [tourState.currentSection, markSectionVisited, skipTour, allowSkip, nextSection]);

  return {
    tourState,
    steps,
    handleJoyrideCallback,
    startSectionTour,
    nextSection,
    previousSection,
    skipTour,
    resetTour,
    getCurrentSection,
    isCurrentSectionVisited,
    markSectionVisited,
  };
};

export default useSectionTour;
