/**
 * SectionTourProvider Component
 * Provides section-wise tour functionality throughout the app
 */

import React, { ReactNode } from 'react';
import Joyride, { Locale, Styles } from 'react-joyride';
import { useLessonAwareTour } from '@/hooks/useLessonAwareTour';
import { type UseSectionTourOptions } from '@/hooks/useSectionTour';
import * as lessonProgressService from '@/services/lessonProgressService';

export interface SectionTourProviderProps {
  children: ReactNode;
  tourOptions?: UseSectionTourOptions;
  customStyles?: Partial<Styles>;
  locale?: Locale;
  autoStartFirstTour?: boolean;
}

/**
 * Custom styles for Joyride tooltips
 */
const defaultStyles: Partial<Styles> = {
  tooltip: {
    backgroundColor: '#1f2937',
    borderRadius: '0.5rem',
    padding: '1rem',
    color: '#f3f4f6',
    fontSize: '0.875rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  buttonNext: {
    backgroundColor: '#3b82f6',
    borderRadius: '0.375rem',
    color: 'white',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    border: 'none',
    cursor: 'pointer',
  },
  buttonBack: {
    backgroundColor: '#6b7280',
    borderRadius: '0.375rem',
    color: 'white',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    border: 'none',
    cursor: 'pointer',
    marginRight: '0.5rem',
  },
   
  buttonSkip: {
    backgroundColor: 'transparent',
    color: '#9ca3af',
    fontSize: '0.875rem',
    cursor: 'pointer',
    border: 'none',
    padding: '0.5rem',
  },
  
  spotlight: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

export const SectionTourProvider: React.FC<SectionTourProviderProps> = ({
  children,
  tourOptions = {},
  customStyles,
  locale,
  autoStartFirstTour = true,
}) => {
  const {
    tourState,
    steps,
    handleJoyrideCallback,
    startSectionTour,
    startTourForCurrentLesson,
    nextSection,
    previousSection,
    skipTour,
    resetTour,
  } = useLessonAwareTour();

  // Expose methods to window for easier access in components
  React.useEffect(() => {
    (window as any).__sectionTour = {
      start: startSectionTour,
      startForCurrentLesson: startTourForCurrentLesson,
      next: nextSection,
      previous: previousSection,
      skip: skipTour,
      reset: resetTour,
      currentSection: tourState.currentSection,
      state: tourState,
    };

    // Expose lesson progress service for debugging
    (window as any).__lessonProgress = {
      getAll: lessonProgressService.getAllLessonProgress,
      get: lessonProgressService.getLessonProgress,
      track: lessonProgressService.trackLessonView,
      isFirstView: lessonProgressService.isFirstLessonView,
      markCompleted: lessonProgressService.markLessonCompletedWithTracking,
      getStats: lessonProgressService.getProgressStats,
      clear: lessonProgressService.clearAllProgress,
      export: lessonProgressService.exportProgress,
    };

    console.log('[SectionTourProvider] Tour and progress services exposed to window');
  }, [startSectionTour, startTourForCurrentLesson, nextSection, previousSection, skipTour, resetTour, tourState]);

  return (
    <>
      {children}
      {tourState.currentSection && steps.length > 0 && (
        <Joyride
          steps={steps}
          run={tourState.run}
          stepIndex={tourState.stepIndex}
          callback={handleJoyrideCallback}
          continuous={tourOptions.continuous !== false}
          showProgress={tourOptions.showProgress !== false}
          showSkipButton={true}
          hideBackButton={tourState.stepIndex === 0}
          scrollDuration={tourOptions.scrollDuration || 300}
          spotlightPadding={tourOptions.spotlightPadding || 10}
          floaterProps={{
            disableAnimation: false,
            hideArrow: false,
          }}
          styles={{
            ...defaultStyles,
            ...customStyles,
          }}
          locale={locale}
        />
      )}
    </>
  );
};

export default SectionTourProvider;
