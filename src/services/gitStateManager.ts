import {
    GitState,
    GitFile,
    GitCommit,
    GitBranch,
    CommandResult,
    TerminalLine,
} from '@/types/git.types';

/**
 * Create initial empty Git state
 */
export function createInitialState(): GitState {
    return {
        initialized: false,
        workingDirectory: [],
        stagingArea: [],
        commits: [],
        branches: [],
        currentBranch: '',
        HEAD: '',
    };
}

/**
 * Initialize a Git repository
 */
export function initRepository(state: GitState): CommandResult {
    if (state.initialized) {
        return {
            success: false,
            message: 'Repository already initialized',
            output: [
                {
                    type: 'error',
                    text: 'Reinitialized existing Git repository',
                    timestamp: Date.now(),
                },
            ],
        };
    }

    const newState: GitState = {
        ...state,
        initialized: true,
        branches: [{ name: 'main', commit: '' }],
        currentBranch: 'main',
        HEAD: 'main',
        // Add some sample files to working directory
        workingDirectory: [
            {
                name: 'README.md',
                content: '# My Project\n\nWelcome to my project!',
                status: 'untracked',
                lastModified: Date.now(),
            },
            {
                name: 'index.html',
                content: '<!DOCTYPE html>\n<html>\n<body>\n<h1>Hello World</h1>\n</body>\n</html>',
                status: 'untracked',
                lastModified: Date.now(),
            },
        ],
    };

    return {
        success: true,
        message: 'Initialized empty Git repository',
        output: [
            {
                type: 'success',
                text: 'Initialized empty Git repository in .git/',
                timestamp: Date.now(),
            },
        ],
        stateChange: newState,
    };
}

/**
 * Add files to staging area
 */
export function addFiles(state: GitState, filePatterns: string[]): CommandResult {
    if (!state.initialized) {
        return {
            success: false,
            message: 'Not a git repository',
            output: [
                {
                    type: 'error',
                    text: 'fatal: not a git repository (or any of the parent directories): .git',
                    timestamp: Date.now(),
                },
            ],
        };
    }

    const filesToAdd: GitFile[] = [];
    const addedNames: string[] = [];

    // Handle "." pattern (add all)
    if (filePatterns.includes('.')) {
        filesToAdd.push(...state.workingDirectory);
        addedNames.push(...state.workingDirectory.map(f => f.name));
    } else {
        // Add specific files
        for (const pattern of filePatterns) {
            const file = state.workingDirectory.find(f => f.name === pattern);
            if (file) {
                filesToAdd.push(file);
                addedNames.push(file.name);
            }
        }
    }

    if (filesToAdd.length === 0) {
        return {
            success: false,
            message: 'No files matched',
            output: [
                {
                    type: 'error',
                    text: `fatal: pathspec '${filePatterns.join(', ')}' did not match any files`,
                    timestamp: Date.now(),
                },
            ],
        };
    }

    // Update file status and move to staging
    const updatedFiles = filesToAdd.map(f => ({
        ...f,
        status: 'staged' as const,
    }));

    const newState: GitState = {
        ...state,
        stagingArea: [
            ...state.stagingArea.filter(f => !addedNames.includes(f.name)),
            ...updatedFiles,
        ],
        workingDirectory: state.workingDirectory.filter(
            f => !addedNames.includes(f.name)
        ),
    };

    return {
        success: true,
        message: `Added ${filesToAdd.length} file(s)`,
        output: [
            {
                type: 'success',
                text: `Added: ${addedNames.join(', ')}`,
                timestamp: Date.now(),
            },
        ],
        stateChange: newState,
    };
}

/**
 * Create a commit
 */
export function createCommit(
    state: GitState,
    message: string
): CommandResult {
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
            success: false,
            message: 'Nothing to commit',
            output: [
                {
                    type: 'info',
                    text: 'nothing to commit, working tree clean',
                    timestamp: Date.now(),
                },
            ],
        };
    }

    // Generate commit hash
    const hash = generateCommitHash();

    // Get parent commit (last commit on current branch)
    const currentBranch = state.branches.find(b => b.name === state.currentBranch);
    const parent = currentBranch?.commit || null;

    // Create commit
    const commit: GitCommit = {
        hash,
        message,
        author: 'You',
        timestamp: Date.now(),
        parent,
        files: state.stagingArea.map(f => ({ ...f, status: 'committed' as const })),
        branch: state.currentBranch,
    };

    // Update branch to point to new commit
    const updatedBranches = state.branches.map(b =>
        b.name === state.currentBranch ? { ...b, commit: hash } : b
    );

    const newState: GitState = {
        ...state,
        commits: [...state.commits, commit],
        branches: updatedBranches,
        HEAD: hash,
        stagingArea: [],
    };

    const fileCount = commit.files.length;
    const fileWord = fileCount === 1 ? 'file' : 'files';

    return {
        success: true,
        message: 'Commit created',
        output: [
            {
                type: 'success',
                text: `[${state.currentBranch} ${hash.slice(0, 7)}] ${message}`,
                timestamp: Date.now(),
            },
            {
                type: 'info',
                text: `${fileCount} ${fileWord} changed`,
                timestamp: Date.now(),
            },
        ],
        stateChange: newState,
    };
}

/**
 * Show repository status
 */
export function getStatus(state: GitState): CommandResult {
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

    const output: TerminalLine[] = [
        {
            type: 'info',
            text: `On branch ${state.currentBranch}`,
            timestamp: Date.now(),
        },
    ];

    if (state.commits.length === 0) {
        output.push({
            type: 'info',
            text: 'No commits yet',
            timestamp: Date.now(),
        });
    }

    if (state.stagingArea.length > 0) {
        output.push({
            type: 'success',
            text: '\nChanges to be committed:',
            timestamp: Date.now(),
        });
        state.stagingArea.forEach(file => {
            output.push({
                type: 'success',
                text: `  new file:   ${file.name}`,
                timestamp: Date.now(),
            });
        });
    }

    if (state.workingDirectory.length > 0) {
        output.push({
            type: 'info',
            text: '\nUntracked files:',
            timestamp: Date.now(),
        });
        state.workingDirectory.forEach(file => {
            output.push({
                type: 'info',
                text: `  ${file.name}`,
                timestamp: Date.now(),
            });
        });
    }

    if (state.stagingArea.length === 0 && state.workingDirectory.length === 0) {
        output.push({
            type: 'info',
            text: 'nothing to commit, working tree clean',
            timestamp: Date.now(),
        });
    }

    return {
        success: true,
        message: 'Status retrieved',
        output,
    };
}

/**
 * Show commit log
 */
export function getLog(state: GitState): CommandResult {
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

    if (state.commits.length === 0) {
        return {
            success: true,
            message: 'No commits yet',
            output: [
                {
                    type: 'info',
                    text: 'No commits yet',
                    timestamp: Date.now(),
                },
            ],
        };
    }

    const output: TerminalLine[] = [];

    // Show commits in reverse chronological order
    const sortedCommits = [...state.commits].reverse();

    sortedCommits.forEach(commit => {
        output.push({
            type: 'info',
            text: `commit ${commit.hash}`,
            timestamp: Date.now(),
        });
        output.push({
            type: 'info',
            text: `Author: ${commit.author}`,
            timestamp: Date.now(),
        });
        output.push({
            type: 'info',
            text: `Date:   ${new Date(commit.timestamp).toLocaleString()}`,
            timestamp: Date.now(),
        });
        output.push({
            type: 'info',
            text: `\n    ${commit.message}\n`,
            timestamp: Date.now(),
        });
    });

    return {
        success: true,
        message: 'Log retrieved',
        output,
    };
}

/**
 * Create a new branch
 */
export function createBranch(state: GitState, branchName: string): CommandResult {
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

    if (state.branches.find(b => b.name === branchName)) {
        return {
            success: false,
            message: 'Branch already exists',
            output: [
                {
                    type: 'error',
                    text: `fatal: A branch named '${branchName}' already exists.`,
                    timestamp: Date.now(),
                },
            ],
        };
    }

    const currentBranch = state.branches.find(b => b.name === state.currentBranch);
    const newBranch: GitBranch = {
        name: branchName,
        commit: currentBranch?.commit || '',
    };

    const newState: GitState = {
        ...state,
        branches: [...state.branches, newBranch],
    };

    return {
        success: true,
        message: 'Branch created',
        output: [
            {
                type: 'success',
                text: `Created branch '${branchName}'`,
                timestamp: Date.now(),
            },
        ],
        stateChange: newState,
    };
}

/**
 * List all branches
 */
export function listBranches(state: GitState): CommandResult {
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

    const output: TerminalLine[] = state.branches.map(branch => ({
        type: 'info',
        text: branch.name === state.currentBranch ? `* ${branch.name}` : `  ${branch.name}`,
        timestamp: Date.now(),
    }));

    return {
        success: true,
        message: 'Branches listed',
        output,
    };
}

/**
 * Checkout a branch
 */
export function checkoutBranch(state: GitState, branchName: string): CommandResult {
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

    const branch = state.branches.find(b => b.name === branchName);
    if (!branch) {
        return {
            success: false,
            message: 'Branch not found',
            output: [
                {
                    type: 'error',
                    text: `error: pathspec '${branchName}' did not match any file(s) known to git`,
                    timestamp: Date.now(),
                },
            ],
        };
    }

    const newState: GitState = {
        ...state,
        currentBranch: branchName,
        HEAD: branch.commit || branchName,
    };

    return {
        success: true,
        message: 'Switched branch',
        output: [
            {
                type: 'success',
                text: `Switched to branch '${branchName}'`,
                timestamp: Date.now(),
            },
        ],
        stateChange: newState,
    };
}

/**
 * Generate a random commit hash
 */
function generateCommitHash(): string {
    return Array.from({ length: 7 }, () =>
        Math.floor(Math.random() * 16).toString(16)
    ).join('');
}
