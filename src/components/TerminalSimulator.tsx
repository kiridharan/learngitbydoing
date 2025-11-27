import { Terminal, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { TerminalLine } from "@/types/git.types";

interface TerminalSimulatorProps {
  terminalHistory: TerminalLine[];
  onExecuteCommand: (command: string) => void;
  onClear: () => void;
  onReset: () => void;
}

export const TerminalSimulator = ({
  terminalHistory,
  onExecuteCommand,
  onClear,
  onReset,
}: TerminalSimulatorProps) => {
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output appears
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!currentInput.trim()) return;

    // Execute the command
    onExecuteCommand(currentInput);

    // Add to command history
    setCommandHistory((prev) => [...prev, currentInput]);
    setHistoryIndex(-1);

    // Clear input
    setCurrentInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      // Navigate up in history
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      // Navigate down in history
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput("");
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Simple autocomplete for "git "
      if (currentInput === "gi" || currentInput === "g") {
        setCurrentInput("git ");
      }
    }
  };

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "input":
        return "text-foreground";
      case "success":
        return "text-green-400";
      case "error":
        return "text-red-400";
      case "info":
        return "text-blue-400";
      case "output":
        return "text-terminal-text/80";
      default:
        return "text-terminal-text";
    }
  };

  return (
    <div className="h-64 bg-terminal-bg border-t border-border flex flex-col" data-tour="terminal-simulator">
      <div className="px-4 py-2 bg-terminal-bg/80 border-b border-border flex items-center justify-between" data-tour="terminal-actions">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-terminal-text" />
          <span className="text-sm font-semibold text-terminal-text">
            Terminal Simulator
          </span>
        </div>

        <div className="flex gap-2" data-tour="terminal-actions">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-muted-foreground hover:text-foreground"
            onClick={onClear}
            title="Clear terminal"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-muted-foreground hover:text-foreground"
            onClick={onReset}
            title="Reset repository"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div ref={scrollRef} className="p-4 space-y-1 font-mono text-sm" data-tour="terminal-output">
            {terminalHistory.map((line, index) => (
              <div key={index} className="flex">
                {line.type === "input" ? (
                  <>
                    <span className="text-terminal-text mr-2">$</span>
                    <span className="text-foreground">{line.text}</span>
                  </>
                ) : (
                  <span className={getLineColor(line.type)}>{line.text}</span>
                )}
              </div>
            ))}

            {/* Input line */}
            <div className="flex items-center">
              <span className="text-terminal-text mr-2">$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-foreground caret-foreground"
                placeholder="Type a git command..."
                spellCheck={false}
                autoComplete="off"
                data-tour="terminal-input"
              />
              
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
