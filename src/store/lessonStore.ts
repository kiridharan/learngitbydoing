import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Module, Lesson, EnhancedLesson, EnhancedModule } from "@/types/types";
import { modules } from "@/lessons/lessons";


// Store state interface
export interface LessonStoreState {
  // Data
  modules: EnhancedModule[];
  lastSyncHash: string; // Hash of lesson data to detect changes

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
  syncLessonData: () => void; // Sync lesson data while preserving user progress
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

// Utility function to generate hash of lesson data
function generateLessonHash(modulesData: EnhancedModule[]): string {
  try {
    const dataStr = JSON.stringify(modulesData.map(m => ({
      id: m.id,
      lessons: m.lessons.map(l => ({ id: l.id, title: l.title }))
    })));
    let hash = 0;
    for (let i = 0; i < dataStr.length; i++) {
      const char = dataStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  } catch (error) {
    return "0";
  }
}

// Utility function to merge new lesson data with persisted user progress
function mergeWithUserProgress(
  newModules: EnhancedModule[],
  persistedModules: EnhancedModule[]
): EnhancedModule[] {
  return newModules.map((newModule) => {
    const persistedModule = persistedModules.find((m) => m.id === newModule.id);
    if (!persistedModule) return newModule;

    return {
      ...newModule,
      lessons: newModule.lessons.map((newLesson) => {
        const persistedLesson = persistedModule.lessons.find(
          (l) => l.id === newLesson.id
        );
        // Preserve completion status if lesson exists in persisted data
        if (persistedLesson) {
          return {
            ...newLesson,
            completed: persistedLesson.completed,
          };
        }
        return newLesson;
      }),
    };
  });
}

// Initial lesson data
const initialModules: EnhancedModule[] = modules; // Import from lessons.ts
const initialHash = generateLessonHash(initialModules);

// Create the Zustand store with persistence
export const useLessonStore = create<LessonStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      modules: initialModules,
      lastSyncHash: initialHash,
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
          lastSyncHash: initialHash,
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

      // Sync lesson data from lessons.ts while preserving user progress
      syncLessonData: () => {
        const currentHash = generateLessonHash(modules);
        const state = get();

        // Only sync if lesson data has changed
        if (currentHash !== state.lastSyncHash) {
          const mergedModules = mergeWithUserProgress(modules, state.modules);
          set({
            modules: mergedModules,
            lastSyncHash: currentHash,
          });
          console.log("✓ Lesson data synced while preserving user progress");
        }
      },
    }),
    {
      name: "lesson-store", // localStorage key
      version: 1,
    }
  )
);
