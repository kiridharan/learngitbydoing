import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { Button } from "@/components/ui/button";
import { Play, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLessonStore, selectSelectedLesson } from "@/store/lessonStore";
import { GitState } from "@/types/git.types";
import { ANIMATION_CONFIG } from "@/services/animations";
import { VIZ_CONFIG } from "@/config/constants";
import {
  renderUninitializedMessage,
  renderWorkingDirectory,
  renderStagingArea,
  renderCommitConnections,
  renderCommitNodes,
  renderBranchLabels,
  renderCurrentBranchIndicator,
} from "@/services/d3Renderer";

interface GitVisualizationProps {
  gitState: GitState;
}

export const GitVisualization = ({ gitState }: GitVisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const selectedLesson = useLessonStore(selectSelectedLesson);

  // Memoize SVG dimensions
  const svgDimensions = useMemo(() => ({
    width: VIZ_CONFIG.svg.width,
    height: VIZ_CONFIG.svg.height,
    viewBox: `0 0 ${VIZ_CONFIG.svg.width} ${VIZ_CONFIG.svg.height}`,
  }), []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = svgDimensions;
    const { margin } = VIZ_CONFIG;

    // Create main group
    const g = svg.append("g");

    // If not initialized, show welcome message
    if (!gitState.initialized) {
      renderUninitializedMessage(g, width, height);
      return;
    }

    // Draw working directory and staging area
    const { area, commit } = VIZ_CONFIG;

    renderWorkingDirectory(g, gitState.workingDirectory, area.y, area.height, area.width);
    renderStagingArea(g, gitState.stagingArea, area.y, area.height, area.width);

    // Draw commits
    if (gitState.commits.length > 0) {
      renderCommitConnections(g, gitState.commits, commit.y, commit.spacing, commit.startX);
      renderCommitNodes(g, gitState.commits, commit.y, commit.spacing, commit.startX);
      renderBranchLabels(
        g,
        svg,
        gitState.branches,
        gitState.commits,
        gitState.currentBranch,
        commit.y,
        commit.spacing,
        commit.startX
      );
    }

    // Show current branch indicator
    renderCurrentBranchIndicator(g, gitState.currentBranch, height);
  }, [gitState, svgDimensions]);

  const handleAnimate = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-border px-6 py-3 flex items-center justify-between bg-card">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <span className="text-accent">📊</span> Git Visualization
          {selectedLesson && (
            <span className="ml-4 text-sm font-normal text-muted-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {selectedLesson.title}
            </span>
          )}
        </h2>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAnimate}
            disabled={isAnimating}
          >
            <Play className="w-4 h-4 mr-2" />
            Animate
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 md:p-6">
        <Card className="w-full max-w-4xl p-4 md:p-6 bg-card/50 backdrop-blur transition-smooth">
          <svg
            ref={svgRef}
            viewBox={svgDimensions.viewBox}
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-auto max-h-[500px]"
            style={{
              opacity: isAnimating ? 0.5 : 1,
              transition: `opacity ${ANIMATION_CONFIG.opacityTransition}ms`,
            }}
            role="img"
            aria-label="Git repository visualization"
          />
          <p className="text-center text-xs md:text-sm text-muted-foreground mt-4">
            {selectedLesson
              ? `Learning: ${selectedLesson.title} - ${selectedLesson.description}`
              : "Git commit tree visualization will render here with D3.js"
            }
          </p>
        </Card>
      </div>
    </div>
  );
};
