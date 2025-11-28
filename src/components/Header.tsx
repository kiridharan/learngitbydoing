import { GitBranch } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-black px-4 md:px-6 py-3 md:py-4 flex items-center justify-between border-b border-border transition-smooth">
      <div className="flex items-center gap-2">
        <img src="/favicon.svg" alt="Git Logo" className="w-5 h-5 md:w-6 md:h-6" />
        <h1 className="text-lg md:text-xl font-bold text-primary-foreground">
          Learn Git By Doing
        </h1>
      </div>

      <div className="flex items-center gap-2 text-muted-foreground">
        <GitBranch className="w-4 h-4" />
        <span className="hidden md:inline text-sm">Interactive Learning</span>
      </div>
    </header>
  );
};
