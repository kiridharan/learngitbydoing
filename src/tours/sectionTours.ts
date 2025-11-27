/**
 * Section-wise Tour Configuration
 * Modular tour system for Modules, Lessons, and Terminal sections
 */

import { Step } from 'react-joyride';

export const TOUR_SECTIONS = {
  MODULES: 'modules',
  LESSONS: 'lessons',
  TERMINAL: 'terminal',
} as const;

export type TourSection = typeof TOUR_SECTIONS[keyof typeof TOUR_SECTIONS];

/**
 * Modules Sidebar Tour - Learn about modules
 */
const createModulesTourSteps = (): Step[] => [
  {
    target: '[data-tour="modules-sidebar"]',
    content: 'This is the Modules sidebar. It shows all available learning modules.',
    placement: 'right',
  },
  {
    target: '[data-tour="module-list"]',
    content: 'Click on any module to see the lessons it contains.',
    placement: 'right',
  },
  {
    target: '[data-tour="module-item"]',
    content: 'Each module has lessons that progressively teach Git concepts.',
    placement: 'right',
  },
];

/**
 * Lessons Sidebar Tour - Navigate lessons
 */
const createLessonsTourSteps = (): Step[] => [
  {
    target: '[data-tour="lessons-sidebar"]',
    content: 'This is the Lessons sidebar. It displays lessons from the selected module with progress tracking.',
    placement: 'left',
  },
  {
    target: '[data-tour="lesson-content"]',
    content: 'Each lesson has a title, type (Theory or Practical), and your progress within the module. The progress bar shows how many lessons you\'ve completed.',
    placement: 'left',
  },
  {
    target: '[data-tour="lesson-item"]',
    content: 'Click on any lesson to select it. The checkmark shows completed lessons. You can navigate between lessons using the buttons at the bottom.',
    placement: 'left',
  },
  {
    target: '[data-tour="lessons-sidebar"]',
    content: 'Each lesson contains an overview, objectives, theory content or commands to practice, and navigation controls. Complete lessons to track your progress!',
    placement: 'left',
  },
];

/**
 * Terminal Tour - Command execution
 */
const createTerminalTourSteps = (): Step[] => [
  {
    target: '[data-tour="terminal-simulator"]',
    content: 'This is the Terminal Simulator. Execute Git commands here just like in a real terminal.',
    placement: 'top',
  },
  {
    target: '[data-tour="terminal-input"]',
    content: 'Type Git commands in this input field and press Enter to execute them.',
    placement: 'top',
  },
  {
    target: '[data-tour="terminal-output"]',
    content: 'Command output and results are displayed here. The visualization updates in real-time.',
    placement: 'top',
  },
  {
    target: '[data-tour="terminal-actions"]',
    content: 'Use these buttons to clear the terminal, reset the repository, or get hints.',
    placement: 'top',
  },
];

/**
 * Complete Tour - All sections combined
 */
const createCompleteTourSteps = (): Step[] => [
  ...createModulesTourSteps(),
  ...createLessonsTourSteps(),
  ...createTerminalTourSteps(),
  {
    target: 'body',
    content: 'Great! You now know the basics of the app. Start with a lesson to begin learning Git! 🚀',
    placement: 'center',
    disableBeacon: true,
  },
];

/**
 * Map sections to their tour step creators
 */
const tourStepCreators: Record<TourSection, () => Step[]> = {
  [TOUR_SECTIONS.MODULES]: createModulesTourSteps,
  [TOUR_SECTIONS.LESSONS]: createLessonsTourSteps,
  [TOUR_SECTIONS.TERMINAL]: createTerminalTourSteps,
};

/**
 * Cache for tour steps
 */
const tourStepsCache: Partial<Record<TourSection | 'complete', Step[]>> = {};

/**
 * Get tour steps for a specific section
 */
export const getSectionTourSteps = (section: TourSection | 'complete'): Step[] => {
  if (section === 'complete') {
    if (!tourStepsCache['complete']) {
      tourStepsCache['complete'] = createCompleteTourSteps();
    }
    return tourStepsCache['complete'];
  }

  if (!tourStepsCache[section]) {
    const creator = tourStepCreators[section];
    if (creator) {
      tourStepsCache[section] = creator();
    }
  }
  return tourStepsCache[section] || [];
};

/**
 * Get all available sections
 */
export const getAllTourSections = (): TourSection[] => {
  return Object.values(TOUR_SECTIONS);
};

/**
 * Create section tour map for compatibility
 */
export const sectionTourMap: Record<TourSection | 'complete', Step[]> = {
  [TOUR_SECTIONS.MODULES]: getSectionTourSteps(TOUR_SECTIONS.MODULES),
  [TOUR_SECTIONS.LESSONS]: getSectionTourSteps(TOUR_SECTIONS.LESSONS),
  [TOUR_SECTIONS.TERMINAL]: getSectionTourSteps(TOUR_SECTIONS.TERMINAL),
  complete: getSectionTourSteps('complete'),
};
