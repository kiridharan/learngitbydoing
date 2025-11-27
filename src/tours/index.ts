// Section-wise tours
export {
  TOUR_SECTIONS,
  type TourSection,
  headerTourSteps,
  modulesTourSteps,
  lessonsTourSteps,
  visualizationTourSteps,
  terminalTourSteps,
  completeTourSteps,
  sectionTourMap,
  getSectionTourSteps,
  getAllTourSections,
} from "@/tours/sectionTours";

export { useSectionTour, type UseSectionTourOptions, type SectionTourState } from "@/hooks/useSectionTour";
export { useLessonAwareTour } from "@/hooks/useLessonAwareTour";
