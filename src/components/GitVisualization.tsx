import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Button } from "@/components/ui/button";
import { Play, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLessonStore, selectSelectedLesson } from "@/store/lessonStore";
import { GitState } from "@/types/git.types";
import { ANIMATION_CONFIG } from "@/services/animations";
import {
  renderUninitializedMessage,
  renderWorkingDirectory,
  renderStagingArea,
  renderCommitConnections,
  renderCommitNodes,
  renderBranchLabels,
  renderCurrentBranchIndicator,
} from "@/services/d3Renderer";

interface CommitNode {
  id: string;
  message: string;
  x: number;
  y: number;
  branch: string;
}

interface GitVisualizationProps {
  gitState: GitState;
}

const initialCommits: CommitNode[] = [
  { id: "a1b2c3d", message: "Initial commit", x: 100, y: 200, branch: "main" },
  { id: "e4f5g6h", message: "Add README", x: 200, y: 200, branch: "main" },
  { id: "i7j8k9l", message: "Create index.html", x: 300, y: 200, branch: "main" },
  { id: "m0n1o2p", message: "Add styles", x: 400, y: 150, branch: "feature" },
  { id: "q3r4s5t", message: "Update README", x: 400, y: 250, branch: "main" },
];

export const GitVisualization = ({ gitState }: GitVisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const selectedLesson = useLessonStore(selectSelectedLesson);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 700;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // Create main group
    const g = svg.append("g");

    // If not initialized, show welcome message
    if (!gitState.initialized) {
      renderUninitializedMessage(g, width, height);
      return;
    }

    // Draw working directory and staging area
    const areaY = 50;
    const areaHeight = 80;
    const areaWidth = 200;

    renderWorkingDirectory(g, gitState.workingDirectory, areaY, areaHeight, areaWidth);
    renderStagingArea(g, gitState.stagingArea, areaY, areaHeight, areaWidth);

    // Draw commits
    if (gitState.commits.length > 0) {
      const commitY = 200;
      const commitSpacing = 100;
      const startX = 100;

      renderCommitConnections(g, gitState.commits, commitY, commitSpacing, startX);
      renderCommitNodes(g, gitState.commits, commitY, commitSpacing, startX);
      renderBranchLabels(
        g,
        svg,
        gitState.branches,
        gitState.commits,
        gitState.currentBranch,
        commitY,
        commitSpacing,
        startX
      );
    }

    // Show current branch indicator
    renderCurrentBranchIndicator(g, gitState.currentBranch, height);
  }, [gitState]);

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

      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-3xl p-6 bg-card/50 backdrop-blur">
          <svg
            ref={svgRef}
            width="700"
            height="400"
            className="w-full h-auto"
            style={{
              opacity: isAnimating ? 0.5 : 1,
              transition: `opacity ${ANIMATION_CONFIG.opacityTransition}ms`,
            }}
          />
          <p className="text-center text-sm text-muted-foreground mt-4">
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
