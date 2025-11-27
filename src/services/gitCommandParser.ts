import { GitCommand, GitCommandType } from '@/types/git.types';

/**
 * Parse a Git command string into a structured command object
 */
export function parseGitCommand(input: string): GitCommand {
    const trimmed = input.trim();

    // Empty command
    if (!trimmed) {
        return {
            type: 'unknown',
            args: [],
            flags: {},
            raw: input,
            valid: false,
            error: 'Empty command',
        };
    }

    // Split by spaces, but preserve quoted strings
    const parts = trimmed.match(/(?:[^\s"]+|"[^"]*")+/g) || [];

    // Check if it starts with 'git'
    if (parts[0] !== 'git') {
        return {
            type: 'unknown',
            args: [],
            flags: {},
            raw: input,
            valid: false,
            error: 'Command must start with "git"',
        };
    }

    // Get the command type
    const commandStr = parts[1]?.toLowerCase();
    const type = getCommandType(commandStr);

    // Parse arguments and flags
    const { args, flags } = parseArgsAndFlags(parts.slice(2));

    // Validate the command
    const validation = validateCommand(type, args, flags);

    return {
        type,
        args,
        flags,
        raw: input,
        valid: validation.valid,
        error: validation.error,
    };
}

/**
 * Get the command type from the command string
 */
function getCommandType(cmd: string | undefined): GitCommandType {
    if (!cmd) return 'unknown';

    const commandMap: Record<string, GitCommandType> = {
        'init': 'init',
        'add': 'add',
        'commit': 'commit',
        'status': 'status',
        'log': 'log',
        'branch': 'branch',
        'checkout': 'checkout',
        'merge': 'merge',
        'reset': 'reset',
        'help': 'help',
    };

    return commandMap[cmd] || 'unknown';
}

/**
 * Parse arguments and flags from command parts
 */
function parseArgsAndFlags(parts: string[]): {
    args: string[];
    flags: Record<string, string | boolean>;
} {
    const args: string[] = [];
    const flags: Record<string, string | boolean> = {};

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        // Flag with value (e.g., -m "message" or --message="message")
        if (part.startsWith('-')) {
            const flagMatch = part.match(/^(-+)([^=]+)(?:=(.+))?$/);
            if (flagMatch) {
                const flagName = flagMatch[2];
                let flagValue: string | boolean = true;

                // Check if value is in the same part (--flag=value)
                if (flagMatch[3]) {
                    flagValue = flagMatch[3].replace(/^["']|["']$/g, '');
                }
                // Check if next part is the value
                else if (i + 1 < parts.length && !parts[i + 1].startsWith('-')) {
                    flagValue = parts[i + 1].replace(/^["']|["']$/g, '');
                    i++; // Skip next part
                }

                flags[flagName] = flagValue;
            }
        } else {
            // Regular argument
            args.push(part.replace(/^["']|["']$/g, ''));
        }
    }

    return { args, flags };
}

/**
 * Validate a parsed command
 */
function validateCommand(
    type: GitCommandType,
    args: string[],
    flags: Record<string, string | boolean>
): { valid: boolean; error?: string } {
    switch (type) {
        case 'unknown':
            return { valid: false, error: 'Unknown command. Type "git help" for available commands.' };

        case 'init':
            return { valid: true };

        case 'add':
            if (args.length === 0) {
                return { valid: false, error: 'git add requires at least one file argument' };
            }
            return { valid: true };

        case 'commit':
            if (!flags.m && !flags.message) {
                return { valid: false, error: 'git commit requires a message. Use -m "your message"' };
            }
            return { valid: true };

        case 'status':
        case 'log':
            return { valid: true };

        case 'branch':
            // git branch (list) or git branch <name> (create)
            return { valid: true };

        case 'checkout':
            if (args.length === 0) {
                return { valid: false, error: 'git checkout requires a branch name' };
            }
            return { valid: true };

        case 'merge':
            if (args.length === 0) {
                return { valid: false, error: 'git merge requires a branch name' };
            }
            return { valid: true };

        case 'reset':
            return { valid: true };

        case 'help':
            return { valid: true };

        default:
            return { valid: false, error: 'Command not yet implemented' };
    }
}

/**
 * Get command suggestions based on partial input
 */
export function getCommandSuggestions(input: string): string[] {
    const trimmed = input.trim().toLowerCase();

    if (!trimmed.startsWith('git ')) {
        return ['git '];
    }

    const afterGit = trimmed.slice(4);
    const commands = [
        'init',
        'add .',
        'add ',
        'commit -m ""',
        'status',
        'log',
        'branch ',
        'checkout ',
        'merge ',
        'reset',
        'help',
    ];

    return commands
        .filter(cmd => cmd.startsWith(afterGit))
        .map(cmd => `git ${cmd}`);
}

/**
 * Get help text for a command
 */
export function getCommandHelp(type: GitCommandType): string {
    const helpText: Record<GitCommandType, string> = {
        init: 'git init - Initialize a new Git repository',
        add: 'git add <file> - Add file(s) to staging area. Use "git add ." to add all files',
        commit: 'git commit -m "message" - Create a new commit with staged changes',
        status: 'git status - Show the working tree status',
        log: 'git log - Show commit history',
        branch: 'git branch [name] - List branches or create a new branch',
        checkout: 'git checkout <branch> - Switch to a different branch',
        merge: 'git merge <branch> - Merge a branch into the current branch',
        reset: 'git reset - Unstage all files',
        help: 'git help - Show available commands',
        unknown: 'Unknown command. Type "git help" for available commands.',
    };

    return helpText[type] || helpText.unknown;
}
