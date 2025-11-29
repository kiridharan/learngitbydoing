import { useState, useCallback } from 'react';
import { GitState, GitCommand, CommandResult, TerminalLine } from '@/types/git.types';
import { parseGitCommand } from '@/services/gitCommandParser';
import {
    createInitialState,
    initRepository,
    addFiles,
    createCommit,
    getStatus,
    getLog,
    createBranch,
    listBranches,
    checkoutBranch,
    mergeBranch,
    resetStaging,
    resetToCommit,
} from '@/services/gitStateManager';

export function useGitState() {
    const [gitState, setGitState] = useState<GitState>(createInitialState());
    const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
        {
            type: 'info',
            text: 'Welcome to Git Visualizer! Type "git help" to see available commands.',
            timestamp: Date.now(),
        },
    ]);

    /**
     * Execute a Git command
     */
    const executeCommand = useCallback(
        (commandString: string): CommandResult => {
            // Add input to terminal history
            const inputLine: TerminalLine = {
                type: 'input',
                text: commandString,
                timestamp: Date.now(),
            };
            setTerminalHistory(prev => [...prev, inputLine]);

            // Parse the command
            const command: GitCommand = parseGitCommand(commandString);

            // Handle invalid command
            if (!command.valid) {
                const errorResult: CommandResult = {
                    success: false,
                    message: command.error || 'Invalid command',
                    output: [
                        {
                            type: 'error',
                            text: command.error || 'Invalid command',
                            timestamp: Date.now(),
                        },
                    ],
                };
                setTerminalHistory(prev => [...prev, ...errorResult.output]);
                return errorResult;
            }

            // Execute the command based on type
            let result: CommandResult;

            switch (command.type) {
                case 'init':
                    result = initRepository(gitState);
                    break;

                case 'add':
                    result = addFiles(gitState, command.args);
                    break;

                case 'commit':
                    const message = (command.flags.m || command.flags.message) as string;
                    result = createCommit(gitState, message);
                    break;

                case 'status':
                    result = getStatus(gitState);
                    break;

                case 'log':
                    result = getLog(gitState);
                    break;

                case 'branch':
                    if (command.args.length === 0) {
                        result = listBranches(gitState);
                    } else {
                        result = createBranch(gitState, command.args[0]);
                    }
                    break;

                case 'checkout':
                    result = checkoutBranch(gitState, command.args[0]);
                    break;

                case 'merge':
                    result = mergeBranch(gitState, command.args[0]);
                    break;

                case 'reset':
                    // Check for --hard flag
                    if (command.flags.hard && command.args.length > 0) {
                        result = resetToCommit(gitState, command.args[0]);
                    } else {
                        result = resetStaging(gitState);
                    }
                    break;

                case 'help':
                    result = {
                        success: true,
                        message: 'Help',
                        output: [
                            {
                                type: 'info',
                                text: 'Available commands:',
                                timestamp: Date.now(),
                            },
                            {
                                type: 'info',
                                text: '  git init                    - Initialize repository',
                                timestamp: Date.now(),
                            },
                            {
                                type: 'info',
                                text: '  git add <file>              - Add file to staging',
                                timestamp: Date.now(),
                            },
                            {
                                type: 'info',
                                text: '  git add .                   - Add all files',
                                timestamp: Date.now(),
                            },
                            {
                                type: 'info',
                                text: '  git commit -m "message"     - Create commit',
                                timestamp: Date.now(),
                            },
                            {
                                type: 'info',
                                text: '  git status                  - Show status',
                                timestamp: Date.now(),
                            },
                            {
                                type: 'info',
                                text: '  git log                     - Show commit history',
                                timestamp: Date.now(),
                            },
                            {
                                type: 'info',
                                text: '  git branch [name]           - List or create branch',
                                timestamp: Date.now(),
                            },
                            {
                                type: 'info',
                                text: '  git checkout <branch>       - Switch branch',
                                timestamp: Date.now(),
                            },
                            {
                                type: 'info',
                                text: '  git merge <branch>          - Merge branch',
                                timestamp: Date.now(),
                            },
                            {
                                type: 'info',
                                text: '  git reset                   - Unstage all files',
                                timestamp: Date.now(),
                            },
                            {
                                type: 'info',
                                text: '  git reset --hard <commit>   - Reset to commit',
                                timestamp: Date.now(),
                            },
                        ],
                    };
                    break;

                default:
                    result = {
                        success: false,
                        message: 'Command not implemented',
                        output: [
                            {
                                type: 'error',
                                text: `Command '${command.type}' not yet implemented`,
                                timestamp: Date.now(),
                            },
                        ],
                    };
            }

            // Update terminal history
            setTerminalHistory(prev => [...prev, ...result.output]);

            // Update Git state if command was successful
            if (result.success && result.stateChange) {
                setGitState({ ...gitState, ...result.stateChange });
            }

            return result;
        },
        [gitState]
    );

    /**
     * Reset the repository
     */
    const resetRepository = useCallback(() => {
        setGitState(createInitialState());
        setTerminalHistory([
            {
                type: 'info',
                text: 'Repository reset. Type "git init" to start.',
                timestamp: Date.now(),
            },
        ]);
    }, []);

    /**
     * Clear terminal history
     */
    const clearTerminal = useCallback(() => {
        setTerminalHistory([]);
    }, []);

    return {
        gitState,
        terminalHistory,
        executeCommand,
        resetRepository,
        clearTerminal,
    };
}
