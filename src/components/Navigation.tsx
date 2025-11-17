import { Link, useLocation } from "react-router-dom";
import { Home, Box, Database, Plug, FileText, BookTemplate, TestTube, Bug } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/ui-components", label: "UI Components", icon: Box },
  { path: "/database", label: "Database", icon: Database },
  { path: "/integrations", label: "Integrations", icon: Plug },
  { path: "/forms", label: "Forms", icon: FileText },
  { path: "/templates", label: "Templates", icon: BookTemplate },
  { path: "/mode-test", label: "Mode Test", icon: TestTube },
  { path: "/error-test", label: "Error Test", icon: Bug }
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <TestTube className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">Buildy Test Suite</span>
          </div>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}