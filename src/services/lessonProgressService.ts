/**
 * Lesson Progress Service
 * Manages lesson view tracking and progress in localStorage
 */

export interface LessonProgress {
  lessonId: string;
  viewCount: number;
  firstViewedAt: number;
  lastViewedAt: number;
  completed: boolean;
}

const LESSON_PROGRESS_KEY = 'git-lesson-progress';

/**
 * Get all lesson progress
 */
export const getAllLessonProgress = (): Record<string, LessonProgress> => {
  try {
    const stored = localStorage.getItem(LESSON_PROGRESS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Failed to load lesson progress:', error);
    return {};
  }
};

/**
 * Get progress for a specific lesson
 */
export const getLessonProgress = (lessonId: string): LessonProgress | null => {
  const all = getAllLessonProgress();
  return all[lessonId] || null;
};

/**
 * Save lesson progress
 */
export const saveLessonProgress = (views: Record<string, LessonProgress>): void => {
  try {
    localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(views));
  } catch (error) {
    console.warn('Failed to save lesson progress:', error);
  }
};

/**
 * Track a lesson view
 */
export const trackLessonView = (lessonId: string): LessonProgress => {
  const views = getAllLessonProgress();
  const now = Date.now();

  if (views[lessonId]) {
    views[lessonId].viewCount += 1;
    views[lessonId].lastViewedAt = now;
  } else {
    views[lessonId] = {
      lessonId,
      viewCount: 1,
      firstViewedAt: now,
      lastViewedAt: now,
      completed: false,
    };
  }

  saveLessonProgress(views);
  return views[lessonId];
};

/**
 * Check if this is the first time viewing a lesson
 */
export const isFirstLessonView = (lessonId: string): boolean => {
  const progress = getLessonProgress(lessonId);
  return !progress || progress.viewCount === 0;
};

/**
 * Mark lesson as completed
 */
export const markLessonCompletedWithTracking = (lessonId: string): LessonProgress => {
  const views = getAllLessonProgress();
  const now = Date.now();

  if (views[lessonId]) {
    views[lessonId].completed = true;
    views[lessonId].lastViewedAt = now;
  } else {
    views[lessonId] = {
      lessonId,
      viewCount: 1,
      firstViewedAt: now,
      lastViewedAt: now,
      completed: true,
    };
  }

  saveLessonProgress(views);
  return views[lessonId];
};

/**
 * Get total lessons completed
 */
export const getTotalCompletedLessons = (): number => {
  const all = getAllLessonProgress();
  return Object.values(all).filter((p) => p.completed).length;
};

/**
 * Get total lessons viewed
 */
export const getTotalViewedLessons = (): number => {
  return Object.keys(getAllLessonProgress()).length;
};

/**
 * Get completion percentage
 */
export const getCompletionPercentage = (totalLessons: number): number => {
  if (totalLessons === 0) return 0;
  const completed = getTotalCompletedLessons();
  return Math.round((completed / totalLessons) * 100);
};

/**
 * Clear all progress (for testing)
 */
export const clearAllProgress = (): void => {
  try {
    localStorage.removeItem(LESSON_PROGRESS_KEY);
    console.log('All lesson progress cleared');
  } catch (error) {
    console.warn('Failed to clear lesson progress:', error);
  }
};

/**
 * Export progress as JSON for debugging
 */
export const exportProgress = (): string => {
  const all = getAllLessonProgress();
  return JSON.stringify(all, null, 2);
};

/**
 * Get statistics
 */
export const getProgressStats = () => {
  const all = getAllLessonProgress();
  const completed = getTotalCompletedLessons();
  const viewed = getTotalViewedLessons();

  return {
    totalViewed: viewed,
    totalCompleted: completed,
    completionPercentage: viewed > 0 ? Math.round((completed / viewed) * 100) : 0,
    lessons: all,
  };
};
