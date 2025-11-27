// import { Button } from "@/components/ui/button";
import { 
  // BarChart3, Settings, Palette, 
  GitBranch } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-black px-6 py-4 flex items-center justify-between border-b border-border">
      <div className="flex items-center gap-2">
        <GitBranch className="w-6 h-6 text-primary-foreground" />
        <h1 className="text-xl font-bold text-primary-foreground">Git Learning Platform</h1>
      </div>
      
      <div className="flex gap-3">
        {/* <Button variant="secondary" size="sm" className="gap-2">
          <BarChart3 className="w-4 h-4" />
          Progress
        </Button>
        <Button variant="secondary" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
        <Button variant="secondary" size="sm" className="gap-2">
          <Palette className="w-4 h-4" />
          Theme
        </Button> */}
      </div>
    </header>
  );
};
