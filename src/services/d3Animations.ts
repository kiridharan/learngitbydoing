import * as d3 from "d3";
import { GitFile } from "@/types/git.types";

/**
 * Enhanced animation configurations
 */
export const FILE_ANIMATION_CONFIG = {
    fileMovement: {
        duration: 600,
        easing: d3.easeCubicInOut,
    },
    fileAppear: {
        duration: 400,
        easing: d3.easeBackOut.overshoot(1.2),
    },
    highlight: {
        duration: 300,
        pulseCount: 2,
    },
    stagingClear: {
        duration: 500,
        easing: d3.easeCircleIn,
    },
} as const;

export const BRANCH_ANIMATION_CONFIG = {
    labelSlideIn: {
        duration: 400,
        easing: d3.easeBackOut,
    },
    labelUpdate: {
        duration: 300,
        easing: d3.easeCubicOut,
    },
    pointerMove: {
        duration: 500,
        easing: d3.easeCubicInOut,
    },
} as const;

export const MERGE_ANIMATION_CONFIG = {
    highlight: {
        duration: 600,
        easing: d3.easeSinInOut,
    },
    lineDraw: {
        duration: 800,
        easing: d3.easeLinear,
    },
    convergence: {
        duration: 1000,
        easing: d3.easeCubicInOut,
    },
} as const;

/**
 * Animate file appearing in working directory
 */
export const animateFileAppear = (
    g: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
    file: GitFile,
    x: number,
    y: number,
    index: number
): d3.Selection<SVGTextElement, unknown, HTMLElement, unknown> => {
    const fileText = g
        .append("text")
        .attr("x", x)
        .attr("y", y + index * 15)
        .attr("fill", "hsl(var(--muted-foreground))")
        .attr("font-size", "10px")
        .attr("font-family", "monospace")
        .attr("opacity", 0)
        .attr("transform", `translate(0, -10)`)
        .text(`📄 ${file.name}`);

    fileText
        .transition()
        .duration(FILE_ANIMATION_CONFIG.fileAppear.duration)
        .ease(FILE_ANIMATION_CONFIG.fileAppear.easing)
        .attr("opacity", 1)
        .attr("transform", "translate(0, 0)");

    return fileText;
};

/**
 * Animate file moving from working directory to staging area
 */
export const animateFileToStaging = (
    fileElement: d3.Selection<SVGTextElement, unknown, HTMLElement, unknown>,
    targetX: number,
    targetY: number,
    onComplete?: () => void
): void => {
    // Highlight before moving
    fileElement
        .transition()
        .duration(FILE_ANIMATION_CONFIG.highlight.duration)
        .attr("fill", "hsl(var(--git-orange))")
        .attr("font-weight", "bold")
        .transition()
        .duration(FILE_ANIMATION_CONFIG.fileMovement.duration)
        .ease(FILE_ANIMATION_CONFIG.fileMovement.easing)
        .attr("x", targetX)
        .attr("y", targetY)
        .on("end", () => {
            if (onComplete) onComplete();
        });
};

/**
 * Animate file path from one location to another with a glowing line
 */
export const animateFilePath = (
    g: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
    startX: number,
    startY: number,
    endX: number,
    endY: number
): void => {
    const line = g
        .append("line")
        .attr("x1", startX)
        .attr("y1", startY)
        .attr("x2", startX)
        .attr("y2", startY)
        .attr("stroke", "hsl(var(--git-orange))")
        .attr("stroke-width", 3)
        .attr("opacity", 0)
        .attr("stroke-dasharray", "5,5");

    line
        .transition()
        .duration(100)
        .attr("opacity", 0.8)
        .transition()
        .duration(FILE_ANIMATION_CONFIG.fileMovement.duration)
        .ease(FILE_ANIMATION_CONFIG.fileMovement.easing)
        .attr("x2", endX)
        .attr("y2", endY)
        .transition()
        .duration(200)
        .attr("opacity", 0)
        .remove();
};

/**
 * Animate staging area clearing after commit
 */
export const animateStagingClear = (
    g: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
    fileElements: d3.Selection<SVGTextElement, unknown, HTMLElement, unknown>[],
    onComplete?: () => void
): void => {
    fileElements.forEach((element, i) => {
        element
            .transition()
            .delay(i * 50)
            .duration(FILE_ANIMATION_CONFIG.stagingClear.duration)
            .ease(FILE_ANIMATION_CONFIG.stagingClear.easing)
            .attr("opacity", 0)
            .attr("transform", "translate(0, -20) scale(0.8)")
            .on("end", () => {
                if (i === fileElements.length - 1 && onComplete) {
                    onComplete();
                }
            })
            .remove();
    });
};

/**
 * Animate element highlight with pulse effect
 */
export const animateHighlight = (
    element: d3.Selection<any, unknown, HTMLElement, unknown>,
    color: string = "hsl(var(--git-orange))"
): void => {
    const originalStroke = element.attr("stroke");
    const originalStrokeWidth = element.attr("stroke-width") || "2";

    for (let i = 0; i < FILE_ANIMATION_CONFIG.highlight.pulseCount; i++) {
        element
            .transition()
            .delay(i * FILE_ANIMATION_CONFIG.highlight.duration * 2)
            .duration(FILE_ANIMATION_CONFIG.highlight.duration)
            .attr("stroke", color)
            .attr("stroke-width", parseFloat(originalStrokeWidth) + 2)
            .transition()
            .duration(FILE_ANIMATION_CONFIG.highlight.duration)
            .attr("stroke", originalStroke || color)
            .attr("stroke-width", originalStrokeWidth);
    }
};

/**
 * Animate branch label appearing
 */
export const animateBranchLabel = (
    g: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
    text: string,
    x: number,
    y: number,
    isCurrentBranch: boolean = false
): { rect: d3.Selection<SVGRectElement, unknown, HTMLElement, unknown>; text: d3.Selection<SVGTextElement, unknown, HTMLElement, unknown> } => {
    const padding = 8;
    const textWidth = text.length * 6;
    const color = isCurrentBranch ? "hsl(var(--git-orange))" : "hsl(var(--github-purple))";

    const rect = g
        .append("rect")
        .attr("x", x - textWidth / 2 - padding + 20) // Start off-screen
        .attr("y", y - 12)
        .attr("width", textWidth + padding * 2)
        .attr("height", 18)
        .attr("fill", color)
        .attr("rx", 4)
        .attr("opacity", 0);

    const label = g
        .append("text")
        .attr("x", x + 20)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .attr("opacity", 0)
        .text(text);

    // Slide in animation
    rect
        .transition()
        .duration(BRANCH_ANIMATION_CONFIG.labelSlideIn.duration)
        .ease(BRANCH_ANIMATION_CONFIG.labelSlideIn.easing)
        .attr("x", x - textWidth / 2 - padding)
        .attr("opacity", 1);

    label
        .transition()
        .duration(BRANCH_ANIMATION_CONFIG.labelSlideIn.duration)
        .ease(BRANCH_ANIMATION_CONFIG.labelSlideIn.easing)
        .attr("x", x)
        .attr("opacity", 1);

    return { rect, text: label };
};

/**
 * Animate branch pointer movement
 */
export const animateBranchPointer = (
    arrow: d3.Selection<SVGLineElement, unknown, HTMLElement, unknown>,
    targetX: number,
    targetY: number
): void => {
    arrow
        .transition()
        .duration(BRANCH_ANIMATION_CONFIG.pointerMove.duration)
        .ease(BRANCH_ANIMATION_CONFIG.pointerMove.easing)
        .attr("x1", targetX)
        .attr("x2", targetX)
        .attr("y2", targetY);
};

/**
 * Animate merge: highlight both branches before merging
 */
export const animateMergeHighlight = (
    elements: d3.Selection<any, unknown, HTMLElement, unknown>[],
    onComplete?: () => void
): void => {
    elements.forEach((element, i) => {
        animateHighlight(element, "hsl(var(--success))");
        if (i === elements.length - 1) {
            setTimeout(() => {
                if (onComplete) onComplete();
            }, MERGE_ANIMATION_CONFIG.highlight.duration * 2 * FILE_ANIMATION_CONFIG.highlight.pulseCount);
        }
    });
};

/**
 * Animate merge commit line drawing (two parents converging)
 */
export const animateMergeLine = (
    g: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    targetX: number,
    targetY: number
): void => {
    // Draw line from first parent
    const line1 = g
        .append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x1)
        .attr("y2", y1)
        .attr("stroke", "hsl(var(--git-orange))")
        .attr("stroke-width", 2)
        .attr("opacity", 0.6);

    // Draw line from second parent
    const line2 = g
        .append("line")
        .attr("x1", x2)
        .attr("y1", y2)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", "hsl(var(--success))")
        .attr("stroke-width", 2)
        .attr("opacity", 0.6);

    // Animate both lines to merge point
    line1
        .transition()
        .duration(MERGE_ANIMATION_CONFIG.lineDraw.duration)
        .ease(MERGE_ANIMATION_CONFIG.lineDraw.easing)
        .attr("x2", targetX)
        .attr("y2", targetY);

    line2
        .transition()
        .duration(MERGE_ANIMATION_CONFIG.lineDraw.duration)
        .ease(MERGE_ANIMATION_CONFIG.lineDraw.easing)
        .attr("x2", targetX)
        .attr("y2", targetY);
};

/**
 * Animate success indicator (green checkmark)
 */
export const animateSuccess = (
    g: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
    x: number,
    y: number
): void => {
    const checkmark = g
        .append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("font-size", "24px")
        .attr("fill", "hsl(var(--success))")
        .attr("opacity", 0)
        .attr("transform", `translate(${x}, ${y}) scale(0)`)
        .text("✓");

    checkmark
        .transition()
        .duration(400)
        .ease(d3.easeBackOut.overshoot(2))
        .attr("opacity", 1)
        .attr("transform", `translate(0, 0) scale(1)`)
        .transition()
        .delay(800)
        .duration(300)
        .attr("opacity", 0)
        .remove();
};

/**
 * Animate error indicator (red X)
 */
export const animateError = (
    g: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
    x: number,
    y: number
): void => {
    const errorMark = g
        .append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("font-size", "24px")
        .attr("fill", "hsl(var(--destructive))")
        .attr("opacity", 0)
        .text("✗");

    errorMark
        .transition()
        .duration(200)
        .attr("opacity", 1)
        .transition()
        .delay(1000)
        .duration(300)
        .attr("opacity", 0)
        .remove();

    // Shake effect
    for (let i = 0; i < 3; i++) {
        errorMark
            .transition()
            .delay(i * 100)
            .duration(50)
            .attr("x", x + 5)
            .transition()
            .duration(50)
            .attr("x", x - 5)
            .transition()
            .duration(50)
            .attr("x", x);
    }
};
