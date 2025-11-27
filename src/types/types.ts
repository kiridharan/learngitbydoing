export interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  current?: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Command {
  command: string;
  description: string;
}

// Enhanced Lesson type with more details
export interface EnhancedLesson extends Lesson {
  description?: string;
  content?: string;
  duration?: number; // in minutes
  type?: 'static' | 'animation'; // static = theory/content, animation = practical/visualization
  commands?: Command[]; // git commands for animation lessons
}

// Enhanced Module type
export interface EnhancedModule extends Module {
  description?: string;
  lessons: EnhancedLesson[];
}

