import { Header } from "@/components/Header";
import { ModuleSidebar } from "@/components/ModuleSidebar";
import { GitVisualization } from "@/components/GitVisualization";
import { LessonSidebar } from "@/components/LessonSidebar";
import { TerminalSimulator } from "@/components/TerminalSimulator";
import { selectSelectedLesson, useLessonStore } from "@/store/lessonStore";
import { useGitState } from "@/hooks/useGitState";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { useEffect } from "react";
import { useBreakpoint } from "@/lib/responsive";
import { PANEL_CONFIG } from "@/config/constants";

const Index = () => {
  const selectedLesson = useLessonStore(selectSelectedLesson);
  const syncLessonData = useLessonStore((state) => state.syncLessonData);
  const isAnimationLesson = selectedLesson?.type === 'animation';
  const breakpoint = useBreakpoint();

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

  // Determine panel sizes based on breakpoint and lesson type
  const getModuleSize = () => {
    return breakpoint === 'tablet' ? PANEL_CONFIG.module.tabletSize : PANEL_CONFIG.module.defaultSize;
  };

  const getVisualizationSize = () => {
    return breakpoint === 'tablet' ? PANEL_CONFIG.visualization.tabletSize : PANEL_CONFIG.visualization.defaultSize;
  };

  const getLessonSize = () => {
    if (!isAnimationLesson) {
      return breakpoint === 'tablet' ? PANEL_CONFIG.lessonFull.defaultSize : PANEL_CONFIG.lessonFull.defaultSize;
    }
    return breakpoint === 'tablet' ? PANEL_CONFIG.lesson.tabletSize : PANEL_CONFIG.lesson.defaultSize;
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <Header />

      <PanelGroup direction="horizontal" className="flex-1 overflow-hidden">
        <Panel
          defaultSize={getModuleSize()}
          minSize={PANEL_CONFIG.module.minSize}
          maxSize={PANEL_CONFIG.module.maxSize}
          className="flex"
        >
          <ModuleSidebar />
        </Panel>

        <PanelResizeHandle className="panel-resize-handle" />

        {isAnimationLesson && (
          <>
            <Panel
              defaultSize={getVisualizationSize()}
              minSize={PANEL_CONFIG.visualization.minSize}
              maxSize={PANEL_CONFIG.visualization.maxSize}
              className="flex"
            >
              <GitVisualization gitState={gitState} />
            </Panel>
            <PanelResizeHandle className="panel-resize-handle" />
          </>
        )}

        <Panel
          defaultSize={getLessonSize()}
          minSize={PANEL_CONFIG.lesson.minSize}
          maxSize={isAnimationLesson ? PANEL_CONFIG.lesson.maxSize : PANEL_CONFIG.lessonFull.maxSize}
          className="flex"
        >
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
