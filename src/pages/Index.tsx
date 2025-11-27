import { Header } from "@/components/Header";
import { ModuleSidebar } from "@/components/ModuleSidebar";
import { GitVisualization } from "@/components/GitVisualization";
import { LessonSidebar } from "@/components/LessonSidebar";
import { TerminalSimulator } from "@/components/TerminalSimulator";
import { TourController } from "@/components/TourController";
import { selectSelectedLesson, useLessonStore } from "@/store/lessonStore";
import { useGitState } from "@/hooks/useGitState";
import { useEffect, useState } from "react";

const Index = () => {
  const selectedLesson = useLessonStore(selectSelectedLesson);
  const syncLessonData = useLessonStore((state) => state.syncLessonData);
  const isAnimationLesson = selectedLesson?.type === 'animation';
  
  // Track initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Sync lesson data on component mount to ensure latest lesson data with persisted user progress 
  useEffect(() => {
    syncLessonData();
    setIsInitialLoad(false);
  }, [syncLessonData]);

  // Git state management
  const {
    gitState,
    terminalHistory,
    executeCommand,
    resetRepository,
    clearTerminal,
  } = useGitState();

  // Determine layout based on lesson type
  // On initial load or when viewing static lesson: show lessons
  // When viewing animation lesson: show visualization + lessons + terminal
  const shouldShowVisualization = isAnimationLesson;
  const shouldShowLessons = selectedLesson !== null;

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <Header />
      <TourController />

      <div className="flex flex-1 overflow-hidden">
        {/* Module Sidebar - Always visible */}
        <ModuleSidebar />

        {/* Git Visualization - Only for animation lessons */}
        {shouldShowVisualization && <GitVisualization gitState={gitState} />}

        {/* Lesson Sidebar - Always show when lesson selected */}
        {shouldShowLessons && (
          <LessonSidebar className={shouldShowVisualization ? "w-80" : "flex-1"} />
        )}
      </div>

      {/* Terminal - Only for animation lessons */}
      {shouldShowVisualization && (
        <TerminalSimulator
          terminalHistory={terminalHistory}
          onExecuteCommand={executeCommand}
          onClear={clearTerminal}
          onReset={resetRepository}
        />
      )}
    </div>
  );
};

export default Index;
