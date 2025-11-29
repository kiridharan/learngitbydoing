import { GitState, GitCommit, CommandResult } from '@/types/git.types';

/**
 * Generate a random commit hash (7 characters)
 */
function generateCommitHash(): string {
    return Array.from({ length: 7 }, () =>
        Math.floor(Math.random() * 16).toString(16)
    ).join('');
}

/**
 * Merge a branch into the current branch  
 */
export function mergeBranch(state: GitState, branchName: string): CommandResult {
    if (!state.initialized) {
        return {
            success: false,
            message: 'Not a git repository',
            output: [
                {
                    type: 'error',
                    text: 'fatal: not a git repository',
                    timestamp: Date.now(),
                },
            ],
        };
    }

    // Find the branch to merge
    const branchToMerge = state.branches.find(b => b.name === branchName);
    if (!branchToMerge) {
        return {
            success: false,
            message: 'Branch not found',
            output: [
                {
                    type: 'error',
                    text: `fatal: branch '${branchName}' not found`,
                    timestamp: Date.now(),
                },
            ],
        };
    }

    // Can't merge a branch into itself
    if (branchName === state.currentBranch) {
        return {
            success: false,
            message: 'Already on that branch',
            output: [
                {
                    type: 'error',
                    text: `fatal: cannot merge a branch into itself`,
                    timestamp: Date.now(),
                },
            ],
        };
    }

    // Get current branch
    const currentBranch = state.branches.find(b => b.name === state.currentBranch);
    if (!currentBranch) {
        return {
            success: false,
            message: 'Current branch not found',
            output: [
                {
                    type: 'error',
                    text: 'fatal: current branch not found',
                    timestamp: Date.now(),
                },
            ],
        };
    }

    // Check if there are uncommitted changes
    if (state.stagingArea.length > 0 || state.workingDirectory.length > 0) {
        return {
            success: false,
            message: 'Uncommitted changes',
            output: [
                {
                    type: 'error',
                    text: 'error: Your local changes would be overwritten by merge.',
                    timestamp: Date.now(),
                },
                {
                    type: 'error',
                    text: 'Please commit your changes before you merge.',
                    timestamp: Date.now(),
                },
            ],
        };
    }

    const currentCommit = currentBranch.commit;
    const mergeCommit = branchToMerge.commit;

    // Check for fast-forward merge
    if (currentCommit === mergeCommit) {
        return {
            success: true,
            message: 'Already up-to-date',
            output: [
                {
                    type: 'info',
                    text: 'Already up to date.',
                    timestamp: Date.now(),
                },
            ],
        };
    }

    // Generate merge commit
    const hash = generateCommitHash();
    const message = `Merge branch '${branchName}' into ${state.currentBranch}`;

    // Create merge commit with two parents
    const mergeCommitObj: GitCommit = {
        hash,
        message,
        author: 'You',
        timestamp: Date.now(),
        parents: [currentCommit, mergeCommit].filter(Boolean), // Both parents
        files: [], // Merge commits typically don't have new files
        branch: state.currentBranch,
    };

    // Update current branch to point to merge commit
    const updatedBranches = state.branches.map(b =>
        b.name === state.currentBranch ? { ...b, commit: hash } : b
    );

    const newState: GitState = {
        ...state,
        commits: [...state.commits, mergeCommitObj],
        branches: updatedBranches,
        HEAD: hash,
    };

    return {
        success: true,
        message: 'Merge successful',
        output: [
            {
                type: 'success',
                text: `Merge made by the 'recursive' strategy.`,
                timestamp: Date.now(),
            },
            {
                type: 'info',
                text: `Merged '${branchName}' into '${state.currentBranch}'`,
                timestamp: Date.now(),
            },
        ],
        stateChange: newState,
    };
}

/**
 * Reset staging area (unstage all files)
 */
export function resetStaging(state: GitState): CommandResult {
    if (!state.initialized) {
        return {
            success: false,
            message: 'Not a git repository',
            output: [
                {
                    type: 'error',
                    text: 'fatal: not a git repository',
                    timestamp: Date.now(),
                },
            ],
        };
    }

    if (state.stagingArea.length === 0) {
        return {
            success: true,
            message: 'Nothing to reset',
            output: [
                {
                    type: 'info',
                    text: 'Nothing to reset.',
                    timestamp: Date.now(),
                },
            ],
        };
    }

    // Move files from staging back to working directory
    const unstagedFiles = state.stagingArea.map(f => ({
        ...f,
        status: 'untracked' as const,
    }));

    const newState: GitState = {
        ...state,
        stagingArea: [],
        workingDirectory: [...state.workingDirectory, ...unstagedFiles],
    };

    return {
        success: true,
        message: 'Reset successful',
        output: [
            {
                type: 'success',
                text: `Unstaged changes after reset:`,
                timestamp: Date.now(),
            },
            ...unstagedFiles.map(f => ({
                type: 'info' as const,
                text: `  ${f.name}`,
                timestamp: Date.now(),
            })),
        ],
        stateChange: newState,
    };
}

/**
 * Reset to a specific commit (hard reset)
 */
export function resetToCommit(state: GitState, commitHash: string): CommandResult {
    if (!state.initialized) {
        return {
            success: false,
            message: 'Not a git repository',
            output: [
                {
                    type: 'error',
                    text: 'fatal: not a git repository',
                    timestamp: Date.now(),
                },
            ],
        };
    }

    // Find the commit
    const commit = state.commits.find(c => c.hash.startsWith(commitHash));
    if (!commit) {
        return {
            success: false,
            message: 'Commit not found',
            output: [
                {
                    type: 'error',
                    text: `fatal: ambiguous argument '${commitHash}': unknown revision`,
                    timestamp: Date.now(),
                },
            ],
        };
    }

    // Update current branch to point to the target commit
    const updatedBranches = state.branches.map(b =>
        b.name === state.currentBranch ? { ...b, commit: commit.hash } : b
    );

    const newState: GitState = {
        ...state,
        branches: updatedBranches,
        HEAD: commit.hash,
        stagingArea: [],
        workingDirectory: [],
    };

    return {
        success: true,
        message: 'Reset successful',
        output: [
            {
                type: 'success',
                text: `HEAD is now at ${commit.hash.slice(0, 7)} ${commit.message}`,
                timestamp: Date.now(),
            },
        ],
        stateChange: newState,
    };
}
