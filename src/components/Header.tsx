// import { Button } from "@/components/ui/button";
import { 
  // BarChart3, Settings, Palette, 
  GitBranch,
  Play,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOUR_SECTIONS } from "@/tours/sectionTours";

export const Header = () => {
  const getTourControls = () => {
    return (window as any).__sectionTour;
  };

  const handleStartTourForLesson = () => {
    const controls = getTourControls();
    if (controls?.startForCurrentLesson) {
      controls.startForCurrentLesson();
    }
  };

  const handleResetTour = () => {
    const controls = getTourControls();
    if (controls?.reset) {
      controls.reset();
    }
  };

  const handleSkipTour = () => {
    const controls = getTourControls();
    if (controls?.skip) {
      controls.skip();
    }
  };

  return (
    <header className="bg-black px-6 py-4 flex items-center justify-between border-b border-border" data-tour="header">
      <div className="flex items-center gap-2">
        <img src="/favicon.svg" alt="Git Logo" className="w-6 h-6" />
        <h1 className="text-xl font-bold text-primary-foreground">Learn Git By Doing</h1>
      </div>
      
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleStartTourForLesson}
          className="gap-2 text-xs"
          title="Start tour for current lesson"
        >
          <Play className="w-3 h-3" />
          Start Tour
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetTour}
          className="gap-2 text-xs"
          title="Reset tour progress"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkipTour}
          className="gap-2 text-xs text-muted-foreground hover:text-foreground"
          title="Skip current tour"
        >
          <X className="w-3 h-3" />
          Skip
        </Button>
      </div>
    </header>
  );
};
