import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Module, Lesson, EnhancedLesson, EnhancedModule } from "@/types/types";
import { modules } from "@/lessons/lessons";


// Store state interface
export interface LessonStoreState {
  // Data
  modules: EnhancedModule[];

  // Selection state
  selectedModuleId: string | null;
  selectedLessonId: string | null;

  // Actions
  setSelectedModule: (moduleId: string) => void;
  setSelectedLesson: (lessonId: string) => void;
  markLessonComplete: (lessonId: string) => void;
  markLessonIncomplete: (lessonId: string) => void;
  resetProgress: () => void;
  getModuleProgress: (moduleId: string) => number; // Returns percentage
  getTotalProgress: () => number; // Returns percentage
}

// Selector functions (use these in components for reactivity)
export const selectSelectedModule = (state: LessonStoreState): EnhancedModule | null => {
  if (!state.selectedModuleId) return null;
  return state.modules.find((m) => m.id === state.selectedModuleId) || null;
};

export const selectSelectedLesson = (state: LessonStoreState): EnhancedLesson | null => {
  const selectedModule = selectSelectedModule(state);
  if (!selectedModule || !state.selectedLessonId) return null;
  return selectedModule.lessons.find((l) => l.id === state.selectedLessonId) || null;
};

// Initial lesson data
const initialModules: EnhancedModule[] = modules; // Import from lessons.ts

// Create the Zustand store with persistence
export const useLessonStore = create<LessonStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      modules: initialModules,
      selectedModuleId: "1", // Default to first module
      selectedLessonId: "1-1", // Default to first lesson

      // Actions
      setSelectedModule: (moduleId: string) => {
        set({ selectedModuleId: moduleId });
        // Auto-select first lesson in the module
        const module = get().modules.find((m) => m.id === moduleId);
        if (module && module.lessons.length > 0) {
          set({ selectedLessonId: module.lessons[0].id });
        }
      },

      setSelectedLesson: (lessonId: string) => {
        set({ selectedLessonId: lessonId });
      },

      markLessonComplete: (lessonId: string) => {
        set((state) => ({
          modules: state.modules.map((module) => ({
            ...module,
            lessons: module.lessons.map((lesson) =>
              lesson.id === lessonId ? { ...lesson, completed: true } : lesson
            ),
          })),
        }));
      },

      markLessonIncomplete: (lessonId: string) => {
        set((state) => ({
          modules: state.modules.map((module) => ({
            ...module,
            lessons: module.lessons.map((lesson) =>
              lesson.id === lessonId ? { ...lesson, completed: false } : lesson
            ),
          })),
        }));
      },

      resetProgress: () => {
        set({
          modules: initialModules,
          selectedModuleId: "1",
          selectedLessonId: "1-1",
        });
      },

      getModuleProgress: (moduleId: string) => {
        const module = get().modules.find((m) => m.id === moduleId);
        if (!module || module.lessons.length === 0) return 0;
        const completed = module.lessons.filter((l) => l.completed).length;
        return Math.round((completed / module.lessons.length) * 100);
      },

      getTotalProgress: () => {
        const modules = get().modules;
        const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
        const completedLessons = modules.reduce(
          (sum, m) => sum + m.lessons.filter((l) => l.completed).length,
          0
        );
        if (totalLessons === 0) return 0;
        return Math.round((completedLessons / totalLessons) * 100);
      },
    }),
    {
      name: "lesson-store", // localStorage key
      version: 1,
    }
  )
);
