import * as d3 from "d3";
import { GitState } from "@/types/git.types";
import { ANIMATION_CONFIG, createAnimatedCommitNode } from "./animations";
import { animateFileAppear } from "./d3Animations";

/**
 * Renders the working directory section
 */
export const renderWorkingDirectory = (
  g: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  workingDirectory: GitState["workingDirectory"],
  areaY: number,
  areaHeight: number,
  areaWidth: number
) => {
  // Container
  g.append("rect")
    .attr("x", 50)
    .attr("y", areaY)
    .attr("width", areaWidth)
    .attr("height", areaHeight)
    .attr("fill", "hsl(var(--card))")
    .attr("stroke", "hsl(var(--border))")
    .attr("stroke-width", 2)
    .attr("rx", 8);

  // Title
  g.append("text")
    .attr("x", 150)
    .attr("y", areaY + 20)
    .attr("text-anchor", "middle")
    .attr("fill", "hsl(var(--foreground))")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text("Working Directory");

  // Files - with animation
  workingDirectory.forEach((file, i) => {
    animateFileAppear(g, file, 60, areaY + 40, i);
  });
};

/**
 * Renders the staging area section
 */
export const renderStagingArea = (
  g: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  stagingArea: GitState["stagingArea"],
  areaY: number,
  areaHeight: number,
  areaWidth: number
) => {
  // Container
  g.append("rect")
    .attr("x", 300)
    .attr("y", areaY)
    .attr("width", areaWidth)
    .attr("height", areaHeight)
    .attr("fill", "hsl(var(--card))")
    .attr("stroke", "hsl(var(--git-orange))")
    .attr("stroke-width", 2)
    .attr("rx", 8);

  // Title
  g.append("text")
    .attr("x", 400)
    .attr("y", areaY + 20)
    .attr("text-anchor", "middle")
    .attr("fill", "hsl(var(--foreground))")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text("Staging Area");

  // Files - with animation
  stagingArea.forEach((file, i) => {
    const fileText = g
      .append("text")
      .attr("x", 310)
      .attr("y", areaY + 40 + i * 15)
      .attr("fill", "hsl(var(--git-orange))")
      .attr("font-size", "10px")
      .attr("font-family", "monospace")
      .attr("opacity", 0)
      .text(`📄 ${file.name}`);

    // Fade in animation for staged files
    fileText
      .transition()
      .duration(400)
      .delay(i * 50)
      .attr("opacity", 1);
  });
};

/**
 * Renders commit connection lines
 */
export const renderCommitConnections = (
  g: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  commits: GitState["commits"],
  commitY: number,
  commitSpacing: number,
  startX: number
) => {
  commits.forEach((commit, i) => {
    if (commit.parents) {
      const parentIndex = commits.findIndex((c) => commit.parents.includes(c.hash));
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
};

/**
 * Renders individual commit nodes with text labels
 */
export const renderCommitNodes = (
  g: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  commits: GitState["commits"],
  commitY: number,
  commitSpacing: number,
  startX: number
) => {
  commits.forEach((commit, i) => {
    const x = startX + i * commitSpacing;
    const y = commitY;

    // Create animated commit circle
    createAnimatedCommitNode(
      g,
      x,
      y,
      i * ANIMATION_CONFIG.commitNodeDelay
    );

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
};

/**
 * Renders branch labels and arrows pointing to commits
 */
export const renderBranchLabels = (
  g: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
  branches: GitState["branches"],
  commits: GitState["commits"],
  currentBranch: string,
  commitY: number,
  commitSpacing: number,
  startX: number
) => {
  branches.forEach((branch, i) => {
    const commit = commits.find((c) => c.hash === branch.commit);
    if (commit) {
      const commitIndex = commits.indexOf(commit);
      const x = startX + commitIndex * commitSpacing;
      const y = commitY - 40 - i * 20;

      // Branch label background
      const text = branch.name;
      const padding = 8;
      const textWidth = text.length * 6;
      const isCurrentBranch = branch.name === currentBranch;

      g.append("rect")
        .attr("x", x - textWidth / 2 - padding)
        .attr("y", y - 12)
        .attr("width", textWidth + padding * 2)
        .attr("height", 18)
        .attr(
          "fill",
          isCurrentBranch
            ? "hsl(var(--git-orange))"
            : "hsl(var(--github-purple))"
        )
        .attr("rx", 4);

      // Branch label text
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
        .attr(
          "stroke",
          isCurrentBranch
            ? "hsl(var(--git-orange))"
            : "hsl(var(--github-purple))"
        )
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
};

/**
 * Renders the current branch indicator at the bottom
 */
export const renderCurrentBranchIndicator = (
  g: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  currentBranch: string,
  height: number
) => {
  g.append("text")
    .attr("x", 20)
    .attr("y", height - 20)
    .attr("fill", "hsl(var(--foreground))")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text(`Current branch: ${currentBranch}`);
};

/**
 * Renders the uninitialized state message
 */
export const renderUninitializedMessage = (
  g: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  width: number,
  height: number
) => {
  g.append("text")
    .attr("x", width / 2)
    .attr("y", height / 2)
    .attr("text-anchor", "middle")
    .attr("fill", "hsl(var(--muted-foreground))")
    .attr("font-size", "16px")
    .text('Type "git init" to initialize repository');
};
