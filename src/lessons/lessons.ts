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
  {
    id: "2",
    title: "Branching Basics",
    description: "Master Git branching for parallel development",
    lessons: [
      {
        id: "2-1",
        title: "What are Branches?",
        description: "Understanding Git branches and why they matter",
        content: "Branches are one of Git's most powerful features. They allow you to diverge from the main line of development and continue to work without affecting that main line.\n\nThink of branches as parallel universes for your code:\n• Each branch is an independent line of development\n• Changes in one branch don't affect others\n• You can easily switch between branches\n• Branches can be merged back together\n\nWhy use branches?\n✓ Develop new features without breaking working code\n✓ Experiment with ideas safely\n✓ Work on multiple features simultaneously\n✓ Collaborate with others without conflicts\n✓ Keep production code stable\n\nCommon branching strategies:\n• main/master: Stable, production-ready code\n• develop: Integration branch for features\n• feature/*: Individual feature branches\n• hotfix/*: Urgent bug fixes\n\nBranches are lightweight in Git - creating one is instant and takes minimal space!",
        completed: false,
        duration: 10,
        type: 'static',
      },
      {
        id: "2-2",
        title: "Creating Branches",
        description: "Learn to create new branches for development",
        content: "Creating a branch in Git is simple and powerful. It creates a new pointer to your current commit.\n\nCreate a new branch:\ngit branch <branch-name>\n\nThis creates the branch but doesn't switch to it. The branch points to your current commit.\n\nCommon patterns:\n• git branch feature - Create a feature branch\n• git branch bugfix - Create a bugfix branch\n• git branch experiment - Try something new\n\nBranch naming conventions:\n✓ Use descriptive names (feature/login, fix/memory-leak)\n✓ Use lowercase with hyphens\n✓ Keep names concise but clear\n✗ Avoid spaces or special characters\n\nYou can list all branches with: git branch\nThe current branch is marked with an asterisk (*)",
        completed: false,
        duration: 12,
        type: 'animation',
        commands: [
          {
            command: "git branch <name>",
            description: "Create a new branch",
          },
          {
            command: "git branch",
            description: "List all branches",
          },
        ],
      },
      {
        id: "2-3",
        title: "Switching Branches",
        description: "Navigate between branches with git checkout",
        content: "Once you've created a branch, you need to switch to it to start working on it.\n\nSwitch to a branch:\ngit checkout <branch-name>\n\nThis updates your working directory to match the branch's latest commit.\n\nWhat happens when you switch:\n1. Git updates your files to match the branch\n2. HEAD pointer moves to the new branch\n3. Future commits go on the new branch\n\nPro tip: Create and switch in one command:\ngit checkout -b <branch-name>\n\nThis is equivalent to:\ngit branch <branch-name>\ngit checkout <branch-name>\n\nBefore switching branches:\n✓ Commit your changes, or\n✓ Stash them (git stash)\n✗ Don't leave uncommitted work\n\nYou can always check which branch you're on with: git branch",
        completed: false,
        duration: 12,
        type: 'animation',
        commands: [
          {
            command: "git checkout <branch>",
            description: "Switch to an existing branch",
          },
          {
            command: "git checkout -b <name>",
            description: "Create and switch to a new branch",
          },
        ],
      },
      {
        id: "2-4",
        title: "Merging Branches",
        description: "Combine work from different branches",
        content: "Merging integrates changes from one branch into another. This is how you bring your work back into the main codebase.\n\nBasic merge workflow:\n1. Switch to the branch you want to merge INTO:\n   git checkout main\n\n2. Merge the feature branch:\n   git merge feature\n\nTypes of merges:\n\n**Fast-Forward Merge**\nWhen target branch hasn't changed, Git just moves the pointer forward.\n\n**Three-Way Merge**\nWhen both branches have new commits, Git creates a merge commit with two parents.\n\nMerge strategies:\n✓ Always merge INTO the branch you want to update\n✓ Make sure your working directory is clean\n✓ Review changes before merging\n✓ Test after merging\n\nAfter a successful merge:\n• Both branch histories are preserved\n• New merge commit references both parents\n• Feature branch can be deleted if done\n\nDelete a merged branch:\ngit branch -d feature",
        completed: false,
        duration: 15,
        type: 'animation',
        commands: [
          {
            command: "git merge <branch>",
            description: "Merge specified branch into current branch",
          },
          {
            command: "git branch -d <branch>",
            description: "Delete a branch after merging",
          },
        ],
      },
      {
        id: "2-5",
        title: "Understanding Conflicts",
        description: "Learn about merge conflicts and how to handle them",
        content: "A merge conflict occurs when Git can't automatically resolve differences between two commits.\n\nConflicts happen when:\n• Same file modified in both branches\n• Same lines changed differently\n• File deleted in one branch, modified in another\n\nConflict markers look like this:\n```\n<<<<<<< HEAD\nYour changes\n=======\nTheir changes\n>>>>>>> branch-name\n```\n\nResolving conflicts:\n1. Open the conflicting files\n2. Find conflict markers (<<<, ===, >>>)\n3. Decide which changes to keep\n4. Remove conflict markers\n5. Stage the resolved files: git add\n6. Complete the merge: git commit\n\nBest practices:\n✓ Communicate with your team\n✓ Merge frequently to avoid large conflicts\n✓ Use a merge tool (git mergetool)\n✓ Test thoroughly after resolving\n\nPreventing conflicts:\n• Keep branches short-lived\n• Pull changes regularly\n• Work on different parts of codebase\n• Coordinate with team members",
        completed: false,
        duration: 15,
        type: 'static',
      },
    ],
  },
  {
    id: "3",
    title: "Undoing Changes",
    description: "Learn to safely undo and revert changes in Git",
    lessons: [
      {
        id: "3-1",
        title: "Understanding Reset",
        description: "Learn the different ways to undo changes",
        content: "Git provides several ways to undo changes, each with different effects on your repository.\n\nThe three levels of undo:\n\n**1. Working Directory**\nChanges not yet staged\n• Discard: git checkout -- <file>\n• Restore all: git restore .\n\n**2. Staging Area**\nChanges staged but not committed\n• Unstage: git reset <file>\n• Unstage all: git reset\n\n**3. Commit History**\nChanges already committed\n• Soft reset: git reset --soft (keeps changes staged)\n• Mixed reset: git reset (keeps changes unstaged)\n• Hard reset: git reset --hard (discards changes)\n\nKey differences:\n\n**git reset** - Moves branch pointer, changes history\n• --soft: Move pointer, keep changes staged\n• --mixed: Move pointer, unstage changes\n• --hard: Move pointer, discard changes\n\n**git revert** - Creates new commit that undoes changes\n• Safer for shared branches\n• Preserves history\n\nWhen to use which:\n✓ Reset: Private branches, local mistakes\n✓ Revert: Public branches, published commits\n",
        completed: false,
        duration: 12,
        type: 'static',
      },
      {
        id: "3-2",
        title: "Unstaging Files",
        description: "Remove files from the staging area",
        content: "Sometimes you stage files by mistake and need to unstage them before committing.\n\nUnstage files:\ngit reset\n\nThis moves all files from the staging area back to the working directory without losing any changes.\n\nUnstage specific file:\ngit reset <filename>\n\nWhat happens:\n1. File(s) removed from staging area\n2. Changes still exist in working directory\n3. You can edit further or re-stage\n\nCommon scenarios:\n\n**Staged wrong file:**\ngit reset wrong-file.txt\n\n**Want to split into multiple commits:**\ngit reset\ngit add file1.txt\ngit commit -m 'First change'\ngit add file2.txt\ngit commit -m 'Second change'\n\n**Accidentally staged everything:**\ngit reset\ngit add correct-files-only.txt\n\nRemember:\n• Reset is safe for unstaging\n• Your changes are NOT lost\n• Can always re-stage files\n• No commits are affected\n\nCheck status after reset:\ngit status",
        completed: false,
        duration: 10,
        type: 'animation',
        commands: [
          {
            command: "git reset",
            description: "Unstage all files",
          },
          {
            command: "git reset <file>",
            description: "Unstage specific file",
          },
        ],
      },
      {
        id: "3-3",
        title: "Going Back in Time",
        description: "Reset to a previous commit state",
        content: "Sometimes you need to completely undo commits and go back to a previous state.\n\n⚠️ WARNING: This is a destructive operation!\n\nHard reset to a commit:\ngit reset --hard <commit-hash>\n\nWhat this does:\n1. Moves branch pointer to specified commit\n2. Updates working directory to match\n3. Discards ALL uncommitted changes\n4. Cannot be undone easily\n\nUse cases:\n\n**Undo last commit completely:**\ngit reset --hard HEAD~1\n\n**Go back 3 commits:**\ngit reset --hard HEAD~3\n\n**Reset to specific commit:**\ngit reset --hard a1b2c3d\n\nBefore hard reset:\n✓ Make sure you don't need the changes\n✓ Consider creating a backup branch\n✓ Check you're on the right branch\n✗ Never do this on public/shared branches\n\nSafer alternatives:\n• Create a new branch first\n• Use git revert instead\n• Stash changes you might need\n\nRecovery (if needed):\ngit reflog - Shows all recent HEAD positions\ngit reset --hard <reflog-commit>\n\nRemember: With great power comes great responsibility!",
        completed: false,
        duration: 12,
        type: 'animation',
        commands: [
          {
            command: "git reset --hard <commit>",
            description: "Reset to specific commit (destructive)",
          },
          {
            command: "git reflog",
            description: "View command history to recover",
          },
        ],
      },
    ],
  },
];