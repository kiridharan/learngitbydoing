import { Header } from "@/components/Header";
import { ModuleSidebar } from "@/components/ModuleSidebar";
import { GitVisualization } from "@/components/GitVisualization";
import { LessonSidebar } from "@/components/LessonSidebar";
import { TerminalSimulator } from "@/components/TerminalSimulator";
import { selectSelectedLesson, useLessonStore } from "@/store/lessonStore";
import { useGitState } from "@/hooks/useGitState";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
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

      <PanelGroup direction="horizontal" className="flex-1 overflow-hidden">
        <Panel defaultSize={15} minSize={10} className="flex">
          <ModuleSidebar />
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-accent transition-colors" />

        {isAnimationLesson && (
          <>
            <Panel defaultSize={40} minSize={20} className="flex">
              <GitVisualization gitState={gitState} />
            </Panel>
            <PanelResizeHandle className="w-1 bg-border hover:bg-accent transition-colors" />
          </>
        )}

        <Panel defaultSize={isAnimationLesson ? 45 : 85} minSize={20} className="flex">
          <LessonSidebar />
        </Panel>
      </PanelGroup>

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
