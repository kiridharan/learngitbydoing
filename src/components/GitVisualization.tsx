import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Button } from "@/components/ui/button";
import { Play, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLessonStore, selectSelectedLesson } from "@/store/lessonStore";
import { GitState } from "@/types/git.types";

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
      g.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "hsl(var(--muted-foreground))")
        .attr("font-size", "16px")
        .text('Type "git init" to initialize repository');
      return;
    }

    // Draw working directory and staging area
    const areaY = 50;
    const areaHeight = 80;
    const areaWidth = 200;

    // Working Directory
    g.append("rect")
      .attr("x", 50)
      .attr("y", areaY)
      .attr("width", areaWidth)
      .attr("height", areaHeight)
      .attr("fill", "hsl(var(--card))")
      .attr("stroke", "hsl(var(--border))")
      .attr("stroke-width", 2)
      .attr("rx", 8);

    g.append("text")
      .attr("x", 150)
      .attr("y", areaY + 20)
      .attr("text-anchor", "middle")
      .attr("fill", "hsl(var(--foreground))")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text("Working Directory");

    // Working directory files
    gitState.workingDirectory.forEach((file, i) => {
      g.append("text")
        .attr("x", 60)
        .attr("y", areaY + 40 + i * 15)
        .attr("fill", "hsl(var(--muted-foreground))")
        .attr("font-size", "10px")
        .attr("font-family", "monospace")
        .text(`📄 ${file.name}`);
    });

    // Staging Area
    g.append("rect")
      .attr("x", 300)
      .attr("y", areaY)
      .attr("width", areaWidth)
      .attr("height", areaHeight)
      .attr("fill", "hsl(var(--card))")
      .attr("stroke", "hsl(var(--git-orange))")
      .attr("stroke-width", 2)
      .attr("rx", 8);

    g.append("text")
      .attr("x", 400)
      .attr("y", areaY + 20)
      .attr("text-anchor", "middle")
      .attr("fill", "hsl(var(--foreground))")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text("Staging Area");

    // Staging area files
    gitState.stagingArea.forEach((file, i) => {
      g.append("text")
        .attr("x", 310)
        .attr("y", areaY + 40 + i * 15)
        .attr("fill", "hsl(var(--git-orange))")
        .attr("font-size", "10px")
        .attr("font-family", "monospace")
        .text(`📄 ${file.name}`);
    });

    // Draw commits
    if (gitState.commits.length > 0) {
      const commitY = 200;
      const commitSpacing = 100;
      const startX = 100;

      // Draw commit connections
      gitState.commits.forEach((commit, i) => {
        if (commit.parent) {
          const parentIndex = gitState.commits.findIndex(
            (c) => c.hash === commit.parent
          );
          if (parentIndex !== -1) {
            g.append("line")
              .attr("x1", startX + parentIndex * commitSpacing)
              .attr("y1", commitY)
              .attr("x2", startX + i * commitSpacing)
              .attr("y2", commitY)
              .attr("stroke", "hsl(var(--git-orange))")
              .attr("stroke-width", 2)
              .attr("opacity", 0.6);
          }
        }
      });

      // Draw commit nodes
      gitState.commits.forEach((commit, i) => {
        const x = startX + i * commitSpacing;
        const y = commitY;

        // Commit circle
        const circle = g
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 0)
          .attr("fill", "hsl(var(--git-orange))")
          .attr("stroke", "hsl(var(--foreground))")
          .attr("stroke-width", 2)
          .style("cursor", "pointer");

        // Animate circle appearance
        circle
          .transition()
          .duration(500)
          .delay(i * 100)
          .attr("r", 12);

        // Hover effect
        circle
          .on("mouseenter", function () {
            d3.select(this).transition().duration(200).attr("r", 16);
          })
          .on("mouseleave", function () {
            d3.select(this).transition().duration(200).attr("r", 12);
          });

        // Commit hash
        g.append("text")
          .attr("x", x)
          .attr("y", y - 20)
          .attr("text-anchor", "middle")
          .attr("fill", "hsl(var(--foreground))")
          .attr("font-size", "10px")
          .attr("font-family", "monospace")
          .text(commit.hash.slice(0, 7));

        // Commit message
        g.append("text")
          .attr("x", x)
          .attr("y", y + 30)
          .attr("text-anchor", "middle")
          .attr("fill", "hsl(var(--muted-foreground))")
          .attr("font-size", "9px")
          .style("max-width", "80px")
          .text(
            commit.message.length > 15
              ? commit.message.slice(0, 15) + "..."
              : commit.message
          );
      });

      // Draw branch labels
      gitState.branches.forEach((branch, i) => {
        const commit = gitState.commits.find((c) => c.hash === branch.commit);
        if (commit) {
          const commitIndex = gitState.commits.indexOf(commit);
          const x = startX + commitIndex * commitSpacing;
          const y = commitY - 40 - i * 20;

          // Branch label background
          const text = branch.name;
          const padding = 8;
          const textWidth = text.length * 6;

          g.append("rect")
            .attr("x", x - textWidth / 2 - padding)
            .attr("y", y - 12)
            .attr("width", textWidth + padding * 2)
            .attr("height", 18)
            .attr("fill", branch.name === gitState.currentBranch ? "hsl(var(--git-orange))" : "hsl(var(--github-purple))")
            .attr("rx", 4);

          g.append("text")
            .attr("x", x)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .attr("font-size", "10px")
            .attr("font-weight", "bold")
            .text(text);

          // Arrow pointing to commit
          g.append("line")
            .attr("x1", x)
            .attr("y1", y + 8)
            .attr("x2", x)
            .attr("y2", commitY - 15)
            .attr("stroke", branch.name === gitState.currentBranch ? "hsl(var(--git-orange))" : "hsl(var(--github-purple))")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrowhead)");
        }
      });

      // Define arrowhead marker
      svg
        .append("defs")
        .append("marker")
        .attr("id", "arrowhead")
        .attr("markerWidth", 10)
        .attr("markerHeight", 10)
        .attr("refX", 5)
        .attr("refY", 3)
        .attr("orient", "auto")
        .append("polygon")
        .attr("points", "0 0, 10 3, 0 6")
        .attr("fill", "hsl(var(--git-orange))");
    }

    // Show current branch indicator
    g.append("text")
      .attr("x", 20)
      .attr("y", height - 20)
      .attr("fill", "hsl(var(--foreground))")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text(`Current branch: ${gitState.currentBranch}`);
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
            style={{ opacity: isAnimating ? 0.5 : 1, transition: "opacity 0.3s" }}
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
