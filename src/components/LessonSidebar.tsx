import { CheckSquare, Clock, BookOpen, Terminal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLessonStore, selectSelectedModule, selectSelectedLesson } from "@/store/lessonStore";
import { TRANSITION_CLASSES } from "@/config/ui-constants";
import { useMemo } from "react";

export const LessonSidebar = ({ className = "" }: { className?: string }) => {
  const selectedModule = useLessonStore(selectSelectedModule);
  const selectedLesson = useLessonStore(selectSelectedLesson);
  const setSelectedLesson = useLessonStore((state) => state.setSelectedLesson);
  const markLessonComplete = useLessonStore((state) => state.markLessonComplete);
  const markLessonIncomplete = useLessonStore((state) => state.markLessonIncomplete);
  const getModuleProgress = useLessonStore((state) => state.getModuleProgress);

  // Memoize expensive computations
  const lessonMetrics = useMemo(() => {
    if (!selectedModule || !selectedLesson) return null;

    return {
      moduleProgress: getModuleProgress(selectedModule.id),
      completedLessons: selectedModule.lessons.filter((l) => l.completed).length,
      totalLessons: selectedModule.lessons.length,
      currentLessonIndex: selectedModule.lessons.findIndex((l) => l.id === selectedLesson.id) + 1,
    };
  }, [selectedModule, selectedLesson, getModuleProgress]);

  if (!selectedModule || !selectedLesson || !lessonMetrics) {
    return (
      <aside className={`${className} bg-sidebar border-l border-sidebar-border flex-center h-full w-full animate-fade-in`}>
        <div className="text-center text-muted-foreground">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">Select a lesson to begin</p>
          <p className="text-xs mt-1">Choose a module and lesson from the sidebar</p>
        </div>
      </aside>
    );
  }

  const { moduleProgress, completedLessons, totalLessons, currentLessonIndex } = lessonMetrics;

  return (
    <aside className={`${className} bg-sidebar border-l border-sidebar-border flex flex-col h-full w-full ${TRANSITION_CLASSES.fast}`}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-foreground line-clamp-2 text-responsive-lg">{selectedLesson.title}</h3>
          {selectedLesson.type && (
            <Badge variant={selectedLesson.type === 'static' ? 'secondary' : 'default'} className="text-xs whitespace-nowrap flex-shrink-0">
              {selectedLesson.type === 'static' ? '📖 Theory' : '🎯 Practical'}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span>Lesson {currentLessonIndex} of {totalLessons}</span>
            {selectedLesson.duration && (
              <>
                <span>•</span>
                <Clock className="w-3 h-3" />
                <span>{selectedLesson.duration} min</span>
              </>
            )}
          </p>
          {selectedLesson.completed && (
            <span className="text-xs font-medium text-success px-2 py-1 bg-success/10 rounded flex items-center gap-1">
              <CheckSquare className="w-3 h-3" />
              Completed
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Module Progress</span>
            <span className={`font-medium ${moduleProgress === 100 ? 'text-success' : 'text-accent'}`}>
              {completedLessons}/{totalLessons} ({moduleProgress}%)
            </span>
          </div>
          <Progress value={moduleProgress} className="h-2 ${TRANSITION_CLASSES.default}" />
        </div>
      </div>

      <ScrollArea className="flex-1 custom-scrollbar">
        <div className="p-4 space-y-6">
          {/* Lesson Description */}
          {selectedLesson.description && (
            <div className="${TRANSITION_CLASSES.fast}">
              <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-primary">OVERVIEW</span>
              </div>
              <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r">
                <p className="text-sm text-foreground leading-relaxed">{selectedLesson.description}</p>
              </div>
            </div>
          )}

          {/* Content for Static Lessons */}
          {selectedLesson.type === 'static' ? (
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                <BookOpen className="w-4 h-4 text-info" />
                <span className="text-info">THEORY CONTENT</span>
              </div>
              <div className="bg-info/10 border-l-4 border-info p-4 rounded-r space-y-3">
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedLesson.content || "Master the concepts covered in this lesson through interactive visualization and practice."}
                </p>
              </div>
            </div>
          ) : (
            /* Commands for Animation Lessons */
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                <Terminal className="w-4 h-4 text-success" />
                <span className="text-success">COMMANDS TO PRACTICE</span>
              </div>
              <div className="space-y-2">
                {selectedLesson.commands && selectedLesson.commands.length > 0 ? (
                  selectedLesson.commands.map((cmd, idx) => (
                    <div
                      key={idx}
                      className="bg-background/50 border border-border/50 p-3 rounded font-mono text-xs text-foreground hover:bg-background/80 transition-colors cursor-pointer"
                      onClick={() => {
                        // Copy to clipboard
                        navigator.clipboard.writeText(cmd.command);
                      }}
                      title="Click to copy command"
                    >
                      <div className="text-muted-foreground mb-1">$ {idx + 1}</div>
                      <div className="text-accent break-all">{cmd.command}</div>
                      {cmd.description && (
                        <div className="text-muted-foreground text-xs mt-2 font-normal">
                          {cmd.description}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No commands for this practical lesson yet.
                  </p>
                )}
              </div>
            </div>
          )}



          {/* Lesson Navigation */}
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold mb-3">
              <BookOpen className="w-4 h-4 text-foreground" />
              <span className="text-foreground">LESSONS IN {selectedModule.title.toUpperCase()}</span>
            </div>
            <div className="space-y-2">
              {selectedModule.lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson.id)}
                  className={`
                    w-full text-left text-sm p-2.5 rounded touch-target
                    ${TRANSITION_CLASSES.fast}
                    ${selectedLesson.id === lesson.id
                      ? "bg-accent/20 border border-accent text-accent font-medium shadow-sm"
                      : "border border-transparent hover:bg-sidebar-accent text-foreground hover:border-sidebar-border"
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    {lesson.completed ? (
                      <CheckSquare className="w-4 h-4 text-success flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded border border-muted-foreground/30 flex-shrink-0" />
                    )}
                    <span className="flex-1 min-w-0">
                      <span className="font-medium">{index + 1}.</span> {lesson.title}
                    </span>
                    {lesson.duration && (
                      <span className="text-xs text-muted-foreground flex-shrink-0">{lesson.duration}m</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (currentLessonIndex > 1) {
                  setSelectedLesson(selectedModule.lessons[currentLessonIndex - 2].id);
                }
              }}
              disabled={currentLessonIndex === 1}
              className="flex-1"
            >
              ← Previous
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (selectedLesson.completed) {
                  markLessonIncomplete(selectedLesson.id);
                } else {
                  markLessonComplete(selectedLesson.id);
                  // Auto-advance to next lesson if available
                  // currentLessonIndex is 1-indexed, so next lesson is at currentLessonIndex (0-indexed)
                  if (currentLessonIndex < totalLessons) {
                    setSelectedLesson(selectedModule.lessons[currentLessonIndex].id);
                  }
                }
              }}
              className={`flex-1 ${selectedLesson.completed
                ? "bg-success/90 hover:bg-success"
                : "bg-accent hover:bg-accent/90"
                }`}
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              {selectedLesson.completed ? "Mark Incomplete" : "Complete"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (currentLessonIndex < totalLessons) {
                  setSelectedLesson(selectedModule.lessons[currentLessonIndex].id);
                }
              }}
              disabled={currentLessonIndex === totalLessons}
              className="flex-1"
            >
              Next →
            </Button>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};
