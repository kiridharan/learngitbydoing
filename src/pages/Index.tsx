import { Header } from "@/components/Header";
import { ModuleSidebar } from "@/components/ModuleSidebar";
import { GitVisualization } from "@/components/GitVisualization";
import { LessonSidebar } from "@/components/LessonSidebar";
import { TerminalSimulator } from "@/components/TerminalSimulator";
import { selectSelectedLesson, useLessonStore } from "@/store/lessonStore";
import { useGitState } from "@/hooks/useGitState";
import { useEffect } from "react";

const Index = () => {
  const selectedLesson = useLessonStore(selectSelectedLesson);
  const syncLessonData = useLessonStore((state) => state.syncLessonData);
  const isAnimationLesson = selectedLesson?.type === 'animation';

  // Sync lesson data on component mount to ensure latest lesson data with persisted user progress 
  useEffect(() => {
    syncLessonData();
  }, [syncLessonData]);

  // Git state management
  const {
    gitState,
    terminalHistory,
    executeCommand,
    resetRepository,
    clearTerminal,
  } = useGitState();

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <ModuleSidebar />
        {isAnimationLesson && <GitVisualization gitState={gitState} />}
        <LessonSidebar className={isAnimationLesson ? "w-80" : "flex-1"} />
      </div>

      {isAnimationLesson && (
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
