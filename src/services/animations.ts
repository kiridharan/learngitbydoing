import * as d3 from "d3";
import { GitState } from "@/types/git.types";

/**
 * Animation configurations and durations
 */
export const ANIMATION_CONFIG = {
  commitNodeRadius: {
    duration: 500,
    initialRadius: 0,
    normalRadius: 12,
    hoverRadius: 16,
  },
  commitNodeDelay: 100, // ms between each commit animation
  hoverTransition: 200,
  opacityTransition: 300,
} as const;

/**
 * Animates the appearance of a commit circle node
 * @param selection - D3 selection for the circle element
 * @param delayMs - Delay in milliseconds before animation starts
 */
export const animateCommitNode = (
  selection: d3.Selection<SVGCircleElement, unknown, HTMLElement, unknown>,
  delayMs: number = 0
) => {
  selection
    .transition()
    .duration(ANIMATION_CONFIG.commitNodeRadius.duration)
    .delay(delayMs)
    .attr("r", ANIMATION_CONFIG.commitNodeRadius.normalRadius);
};

/**
 * Adds hover animation to a commit node
 * @param selection - D3 selection for the circle element
 */
export const addCommitNodeHoverEffect = (
  selection: d3.Selection<SVGCircleElement, unknown, HTMLElement, unknown>
) => {
  selection
    .on("mouseenter", function () {
      d3.select(this)
        .transition()
        .duration(ANIMATION_CONFIG.hoverTransition)
        .attr("r", ANIMATION_CONFIG.commitNodeRadius.hoverRadius);
    })
    .on("mouseleave", function () {
      d3.select(this)
        .transition()
        .duration(ANIMATION_CONFIG.hoverTransition)
        .attr("r", ANIMATION_CONFIG.commitNodeRadius.normalRadius);
    });
};

/**
 * Creates a commit circle node with animation setup
 * @param parentSelection - D3 parent selection to append circle to
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param delayMs - Delay for animation start
 * @returns D3 selection for the circle element
 */
export const createAnimatedCommitNode = (
  parentSelection: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  x: number,
  y: number,
  delayMs: number = 0
): d3.Selection<SVGCircleElement, unknown, HTMLElement, unknown> => {
  const circle = parentSelection
    .append("circle")
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", ANIMATION_CONFIG.commitNodeRadius.initialRadius)
    .attr("fill", "hsl(var(--git-orange))")
    .attr("stroke", "hsl(var(--foreground))")
    .attr("stroke-width", 2)
    .style("cursor", "pointer");

  animateCommitNode(circle, delayMs);
  addCommitNodeHoverEffect(circle);

  return circle;
};

/**
 * Animates SVG opacity (used for overall visualization effects)
 * @param svg - D3 selection for SVG element
 * @param opacity - Target opacity value
 * @param durationMs - Animation duration in milliseconds
 */
export const animateSVGOpacity = (
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
  opacity: number,
  durationMs: number = ANIMATION_CONFIG.opacityTransition
) => {
  svg.style("opacity", opacity === 0.5 ? "0.5" : "1");
  svg.style("transition", `opacity ${durationMs}ms`);
};

/**
 * Creates staggered animations for multiple elements
 * @param selections - Array of D3 selections
 * @param animationFn - Function to apply animation
 * @param delayInterval - Delay between each element animation
 */
export const staggerAnimation = (
  selections: d3.Selection<any, unknown, HTMLElement, unknown>[],
  animationFn: (selection: any, delay: number) => void,
  delayInterval: number = ANIMATION_CONFIG.commitNodeDelay
) => {
  selections.forEach((selection, index) => {
    animationFn(selection, index * delayInterval);
  });
};
