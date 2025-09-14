import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  MessageCircle,
  Users,
  BookOpen,
  Settings,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    description: "Overview & AI Support",
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: Calendar,
    description: "Book counselling sessions",
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageCircle,
    description: "Chat with counsellors",
  },
  {
    title: "Forum",
    url: "/forum",
    icon: Users,
    description: "Peer support community",
  },
  {
    title: "Resources",
    url: "/resources",
    icon: BookOpen,
    description: "Wellness materials",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    description: "Account preferences",
  },
];

export function MentalHealthSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-gradient-card border-r border-border transition-all duration-300 h-screen",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">MindCare</h1>
              <p className="text-xs text-muted-foreground">Student Support</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.url);

          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                active
                  ? "bg-gradient-primary text-primary-foreground shadow-soft"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                )}
              />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "font-medium truncate",
                      active ? "text-primary-foreground" : "text-foreground"
                    )}
                  >
                    {item.title}
                  </div>
                  <div
                    className={cn(
                      "text-xs truncate",
                      active ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}
                  >
                    {item.description}
                  </div>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {!isCollapsed && (
          <div className="bg-accent-light p-3 rounded-lg">
            <p className="text-xs text-accent-foreground font-medium">
              Need immediate help?
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Crisis hotline: 1800-599-0019
            </p>
            <Button variant="soft" size="sm" className="w-full mt-2">
              Emergency Support
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}