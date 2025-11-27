/**
 * Tour Controller Component
 * Provides manual controls for testing section tours
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { TOUR_SECTIONS, TourSection } from '@/tours/sectionTours';

export const TourController: React.FC = () => {
  const getTourControls = () => {
    return (window as any).__sectionTour;
  };

  const handleStartTour = (section: TourSection) => {
    const controls = getTourControls();
    if (controls?.start) {
      console.log(`Starting tour for section: ${section}`);
      controls.start(section);
    } else {
      console.error('Tour controls not available');
    }
  };

  const handleResetTour = () => {
    const controls = getTourControls();
    if (controls?.reset) {
      console.log('Resetting tour');
      controls.reset();
    }
  };

  const handleSkipTour = () => {
    const controls = getTourControls();
    if (controls?.skip) {
      console.log('Skipping tour');
      controls.skip();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 bg-background border border-border rounded-lg p-3 shadow-lg">
      <div className="text-xs font-semibold text-foreground mb-2">Tour Controls</div>
      
      <div className="flex flex-col gap-1">
        {Object.values(TOUR_SECTIONS).map((section) => (
          <Button
            key={section}
            variant="outline"
            size="sm"
            onClick={() => handleStartTour(section)}
            className="text-xs whitespace-nowrap"
          >
            Start {section}
          </Button>
        ))}
      </div>

      <div className="border-t border-border my-2" />

      <div className="flex gap-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleResetTour}
          className="text-xs flex-1"
        >
          Reset
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleSkipTour}
          className="text-xs flex-1"
        >
          Skip
        </Button>
      </div>
    </div>
  );
};

export default TourController;
