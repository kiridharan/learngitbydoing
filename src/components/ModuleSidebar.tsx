import { Book, BarChart3 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useLessonStore } from "@/store/lessonStore";
import { SPACING_CLASSES, TRANSITION_CLASSES } from "@/config/ui-constants";

export const ModuleSidebar = () => {
  const modules = useLessonStore((state) => state.modules);
  const selectedModuleId = useLessonStore((state) => state.selectedModuleId);
  const setSelectedModule = useLessonStore((state) => state.setSelectedModule);
  const getModuleProgress = useLessonStore((state) => state.getModuleProgress);

  return (
    <aside className="bg-sidebar border-r border-sidebar-border flex flex-col h-full w-full">
      <div className={`${SPACING_CLASSES.padding.md} border-b border-sidebar-border`}>
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
          <Book className="w-4 h-4" />
          MODULES
        </div>
      </div>

      <ScrollArea className="flex-1 custom-scrollbar">
        <div className={`${SPACING_CLASSES.padding.sm} ${SPACING_CLASSES.gap.md} flex flex-col`}>
          {modules.map((module, moduleIndex) => {
            const isSelected = selectedModuleId === module.id;
            const progress = getModuleProgress(module.id);

            return (
              <div
                key={module.id}
                onClick={() => setSelectedModule(module.id)}
                className={`
                  p-3 rounded-lg border-2 cursor-pointer
                  min-h-[100px] touch-target
                  ${TRANSITION_CLASSES.default}
                  ${isSelected
                    ? "border-accent bg-accent/10 shadow-md"
                    : "border-transparent hover:bg-sidebar-accent hover:border-sidebar-border"
                  }
                `}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedModule(module.id);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground">
                      {moduleIndex + 1}. {module.title}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {module.description}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {module.lessons.filter((l) => l.completed).length}/{module.lessons.length} lessons
                    </span>
                    <span className={`text-xs font-medium ${progress === 100 ? 'text-success' : 'text-accent'}`}>
                      {progress}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>

                {/* Lesson count badge */}
                <div className="mt-2 flex items-center gap-1">
                  <BarChart3 className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {module.lessons.length} lessons
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
};
