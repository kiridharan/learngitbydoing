import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface TourStep {
    title: string;
    description: string;
    target?: string; // CSS selector for highlighting
    position?: "center" | "left" | "right" | "top" | "bottom";
}

const tourSteps: TourStep[] = [
    {
        title: "Welcome to Git D3 Viz! 👋",
        description:
            "Learn Git visually with interactive lessons and real-time visualizations. Let's take a quick tour!",
        position: "center",
    },
    {
        title: "Learning Modules 📚",
        description:
            "Start here! Browse through modules covering Git fundamentals, branching, and advanced concepts.",
        target: ".module-sidebar",
        position: "right",
    },
    {
        title: "Interactive Terminal 💻",
        description:
            "Practice real Git commands here. Type commands and see instant feedback!",
        target: ".terminal-simulator",
        position: "top",
    },
    {
        title: "Real-Time Visualization 🎨",
        description:
            "Watch your commits, branches, and merges come to life with beautiful D3.js animations!",
        target: ".git-visualization",
        position: "right",
    },
    {
        title: "Lesson Details 📝",
        description:
            "Find lesson objectives, commands to practice, and navigation controls here.",
        target: ".lesson-sidebar",
        position: "left",
    },
    {
        title: "Ready to Learn? 🚀",
        description:
            "Start with 'Git Fundamentals' to build a strong foundation. You can always skip or restart the tour from settings!",
        position: "center",
    },
];

export const WelcomeTour = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Check if tour has been seen
        const tourSeen = localStorage.getItem("git-viz-tour-seen");
        if (!tourSeen) {
            // Wait a bit for the page to load, then show tour
            setTimeout(() => {
                setIsOpen(true);
            }, 1000);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("git-viz-tour-seen", "true");
    };

    const handleNext = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        handleClose();
    };

    if (!isOpen) return null;

    const step = tourSteps[currentStep];
    const isFirst = currentStep === 0;
    const isLast = currentStep === tourSteps.length - 1;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-300" />

            {/* Tour Card */}
            <div
                className={`fixed z-50 animate-in fade-in slide-in-from-bottom-4 duration-500 ${step.position === "center"
                    ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    : step.position === "left"
                        ? "top-1/2 left-8 -translate-y-1/2"
                        : step.position === "right"
                            ? "top-1/2 right-8 -translate-y-1/2"
                            : step.position === "top"
                                ? "top-8 left-1/2 -translate-x-1/2"
                                : "bottom-8 left-1/2 -translate-x-1/2"
                    }`}
            >
                <Card className="w-[400px] border-2 border-git-orange shadow-2xl">
                    <CardHeader className="relative pb-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-4 h-6 w-6"
                            onClick={handleClose}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <CardTitle className="pr-8">{step.title}</CardTitle>
                        <CardDescription className="mt-2">
                            {step.description}
                        </CardDescription>
                    </CardHeader>

                    <CardFooter className="flex items-center justify-between pt-0">
                        <div className="flex gap-1">
                            {tourSteps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1.5 rounded-full transition-all ${index === currentStep
                                        ? "w-6 bg-git-orange"
                                        : index < currentStep
                                            ? "w-1.5 bg-success"
                                            : "w-1.5 bg-muted"
                                        }`}
                                />
                            ))}
                        </div>

                        <div className="flex gap-2">
                            {!isFirst && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePrevious}
                                    className="gap-1"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Back
                                </Button>
                            )}

                            {!isLast ? (
                                <>
                                    <Button variant="ghost" size="sm" onClick={handleSkip}>
                                        Skip Tour
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleNext}
                                        className="gap-1 bg-git-orange hover:bg-git-orange/90"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    size="sm"
                                    onClick={handleClose}
                                    className="bg-success hover:bg-success/90"
                                >
                                    Let's Go! 🚀
                                </Button>
                            )}
                        </div>
                    </CardFooter>

                    {/* Step Counter */}
                    <div className="px-6 pb-4 text-xs text-muted-foreground text-center">
                        Step {currentStep + 1} of {tourSteps.length}
                    </div>
                </Card>
            </div>

            {/* Highlight target element if specified */}
            {step.target && (
                <style>{`
          ${step.target} {
            position: relative;
            z-index: 51;
            box-shadow: 0 0 0 4px hsl(var(--git-orange)), 0 0 0 8px rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            transition: all 0.3s ease;
          }
        `}</style>
            )}
        </>
    );
};

// Hook to restart tour
export const useRestartTour = () => {
    return () => {
        localStorage.removeItem("git-viz-tour-seen");
        window.location.reload();
    };
};
