/**
 * useLessonAwareTour Hook
 * Manages tours dynamically based on lesson type (static vs animation)
 * Tracks lesson views and progress
 */

import { useEffect, useCallback } from 'react';
import { useSectionTour } from '@/hooks/useSectionTour';
import { TOUR_SECTIONS } from '@/tours/sectionTours';
import { useLessonStore, selectSelectedLesson } from '@/store/lessonStore';
import {
  trackLessonView,
  isFirstLessonView,
  getLessonProgress,
  markLessonCompletedWithTracking,
} from '@/services/lessonProgressService';

export const useLessonAwareTour = () => {
  const selectedLesson = useLessonStore(selectSelectedLesson);
  const selectedModule = useLessonStore((state) => {
    const moduleId = state.selectedModuleId;
    return moduleId ? state.modules.find((m) => m.id === moduleId) : null;
  });

  const sectionTour = useSectionTour({
    autoStart: false, // We'll control when to start
  });

  // Auto-start appropriate tour when lesson changes
  useEffect(() => {
    if (!selectedLesson) return;

    const lessonId = selectedLesson.id;
    const isFirstView = isFirstLessonView(lessonId);
    const isAnimationLesson = selectedLesson.type === 'animation';

    console.log(`[useLessonAwareTour] Lesson changed:`, {
      lessonTitle: selectedLesson.title,
      lessonType: selectedLesson.type,
      isFirstView,
    });

    // Track the lesson view
    trackLessonView(lessonId);

    // Only auto-start tour on first view
    if (isFirstView) {
      if (isAnimationLesson) {
        // For animation lessons: show Terminal tour
        console.log('[useLessonAwareTour] Starting animation lesson tours (first view)');
        sectionTour.startSectionTour(TOUR_SECTIONS.TERMINAL);
      } else {
        // For static lessons: show Modules tour, then Lessons will auto-progress
        console.log('[useLessonAwareTour] Starting static lesson tours (first view)');
        sectionTour.startSectionTour(TOUR_SECTIONS.MODULES);
      }
    } else {
      console.log('[useLessonAwareTour] Not first view, tour already shown');
    }
  }, [selectedLesson?.id]); // Only trigger when lesson ID changes

  const startTourForCurrentLesson = useCallback(() => {
    if (!selectedLesson) return;

    const isAnimationLesson = selectedLesson.type === 'animation';
    if (isAnimationLesson) {
      sectionTour.startSectionTour(TOUR_SECTIONS.TERMINAL);
    } else {
      sectionTour.startSectionTour(TOUR_SECTIONS.MODULES);
    }
  }, [selectedLesson, sectionTour]);

  /**
   * Get lesson progress
   */
  const getLessonProgressData = useCallback(() => {
    if (!selectedLesson) return null;
    return getLessonProgress(selectedLesson.id);
  }, [selectedLesson]);

  /**
   * Mark lesson as completed with progress tracking
   */
  const markLessonCompletedWithProgress = useCallback((lessonId: string) => {
    return markLessonCompletedWithTracking(lessonId);
  }, []);

  return {
    ...sectionTour,
    startTourForCurrentLesson,
    selectedLesson,
    selectedModule,
    isAnimationLesson: selectedLesson?.type === 'animation',
    getLessonProgress: getLessonProgressData,
    markLessonCompletedWithProgress,
    isFirstLessonView: selectedLesson ? isFirstLessonView(selectedLesson.id) : false,
  };
};

export default useLessonAwareTour;
