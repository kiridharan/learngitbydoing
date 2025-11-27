import { EnhancedModule } from "@/types/types";

export const modules: EnhancedModule[] = [
  {
    id: "1",
    title: "Git Fundamentals",
    description: "Learn the basics of Git version control system",
    lessons: [
      {
        id: "1-1",
        title: "What is Git?",
        description: "Introduction to Git and version control concepts",
        content: "Git is a distributed version control system (DVCS) that allows multiple developers to work on the same project simultaneously. Unlike centralized version control systems, Git keeps a complete history of your project locally. Key concepts:\n\n• Repository: A directory containing your project and its version history\n• Commit: A snapshot of your project at a specific point in time\n• Branch: A parallel version of your code for independent development\n• Merge: Combining changes from different branches\n\nGit is widely used in professional software development because it provides:\n- Complete project history\n- Ability to revert to previous versions\n- Collaboration support for teams\n- Branching for parallel development\n- Distributed workflow capabilities",
        completed: false,
        current: true,
        duration: 10,
        type: 'static',
      },
      {
        id: "1-2",
        title: "Git Setup",
        description: "Setting up Git on your machine",
        content: "Before using Git, you need to install it and configure your identity.\n\nInstallation:\n• macOS: brew install git\n• Windows: Download from git-scm.com\n• Linux: sudo apt-get install git\n\nConfiguration:\nAfter installation, configure your Git identity so commits are attributed correctly.\n\nThis information will be included in every commit you make.",
        completed: false,
        duration: 8,
        type: 'static',
      },
      {
        id: "1-3",
        title: "First Repository",
        description: "Initialize and create your first Git repository",
        content: "A Git repository is the core of version control. Here's how to create one:\n\n1. Create a project directory\n2. Navigate into it\n3. Run: git init\n\nThis creates a .git folder containing all version control information.\n\nYou can also clone an existing repository:\ngit clone <repository-url>\n\nThe .git folder contains:\n- objects: Compressed versions of your files\n- refs: Pointers to commit objects\n- HEAD: Points to your current branch\n- config: Repository configuration",
        completed: false,
        duration: 12,
        type: 'animation',
        commands: [
          {
            command: "git init",
            description: "Initialize a new Git repository",
          },
          {
            command: "git clone <repository-url>",
            description: "Clone an existing repository",
          },
        ],
      },
      {
        id: "1-4",
        title: "Commits & Messages",
        description: "Understanding commits and writing good commit messages",
        content: "A commit represents a snapshot of your project at a specific moment.\n\nWorkflow:\n1. Make changes to files\n2. Stage changes: git add <file>\n3. Commit with a message: git commit -m 'message'\n\nGood Commit Messages:\n✓ Use imperative mood: 'Add feature' not 'Added feature'\n✓ Be concise but descriptive\n✓ Explain what and why, not how\n✓ Keep first line under 50 characters\n✓ Use body for detailed explanation\n\nExample:\nFix critical memory leak in parser\n\nThe parser was retaining references to all parsed objects,\npreventing garbage collection. This fix clears references\nafter processing to allow proper cleanup.",
        completed: false,
        duration: 15,
        type: 'animation',
        commands: [
          {
            command: "git add <file>",
            description: "Stage a file for commit",
          },
          {
            command: "git commit -m 'message'",
            description: "Create a commit with a message",
          },
          {
            command: "git log",
            description: "View commit history",
          },
        ],
      },
    ],
  },
];