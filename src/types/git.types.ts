// Git Command Types
export type GitCommandType =
  | 'init'
  | 'add'
  | 'commit'
  | 'status'
  | 'log'
  | 'branch'
  | 'checkout'
  | 'merge'
  | 'reset'
  | 'help'
  | 'unknown';

export type FileStatus = 'untracked' | 'modified' | 'staged' | 'committed';

// Git Command Structure
export interface GitCommand {
  type: GitCommandType;
  args: string[];
  flags: Record<string, string | boolean>;
  raw: string;
  valid: boolean;
  error?: string;
}

// Git File
export interface GitFile {
  name: string;
  content: string;
  status: FileStatus;
  lastModified: number;
}

// Git Commit
export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  timestamp: number;
  parent: string | null;
  files: GitFile[];
  branch: string;
}

// Git Branch
export interface GitBranch {
  name: string;
  commit: string; // hash of the commit this branch points to
  color?: string; // for visualization
}

// Git State
export interface GitState {
  initialized: boolean;
  workingDirectory: GitFile[];
  stagingArea: GitFile[];
  commits: GitCommit[];
  branches: GitBranch[];
  currentBranch: string;
  HEAD: string; // commit hash or branch name
}

// Terminal Output
export interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success' | 'info';
  text: string;
  timestamp: number;
}

// Command Execution Result
export interface CommandResult {
  success: boolean;
  message: string;
  output: TerminalLine[];
  stateChange?: Partial<GitState>;
}

// Animation Step
export interface AnimationStep {
  id: string;
  type: 'create' | 'move' | 'update' | 'delete' | 'highlight';
  target: string; // element to animate
  duration: number;
  delay?: number;
  data?: any;
}

// Animation Queue
export interface AnimationQueue {
  steps: AnimationStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number; // 1 = normal, 2 = 2x, etc.
}

// Visualization Node (for D3)
export interface VisualizationNode {
  id: string;
  type: 'commit' | 'branch' | 'file' | 'area';
  x: number;
  y: number;
  data: any;
  color?: string;
}

// Visualization Link (for D3)
export interface VisualizationLink {
  source: string;
  target: string;
  type: 'parent' | 'branch' | 'merge';
}
