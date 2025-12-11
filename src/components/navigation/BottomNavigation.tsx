import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Utensils, Dumbbell, User, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => {
  return (
    <NavLink
      to={to}
      className={cn(
        "flex flex-col items-center justify-center gap-1 py-2 px-3 transition-colors",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      <div className={cn("transition-transform", isActive && "scale-110")}>
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </NavLink>
  );
};

interface BottomNavigationProps {
  className?: string;
  onScanClick?: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  className,
  onScanClick,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { to: "/dashboard", icon: <Home className="w-5 h-5" />, label: "Início" },
    { to: "/diet", icon: <Utensils className="w-5 h-5" />, label: "Dieta" },
    { to: "/workout", icon: <Dumbbell className="w-5 h-5" />, label: "Treino" },
    { to: "/profile", icon: <User className="w-5 h-5" />, label: "Perfil" },
  ];

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 z-50", className)}>
      <div className="max-w-md mx-auto relative">
        {/* Navigation Bar */}
        <nav className="flex items-center justify-around bg-card/95 backdrop-blur-md border-t border-border px-2 pb-6 pt-2 shadow-card">
          {/* Left Nav Items */}
          {navItems.slice(0, 2).map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={currentPath === item.to}
            />
          ))}

          {/* Center FAB Spacer */}
          <div className="w-16" />

          {/* Right Nav Items */}
          {navItems.slice(2).map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={currentPath === item.to}
            />
          ))}
        </nav>

        {/* Floating Action Button */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
          {/* Glow Effect */}
          <div className="absolute inset-0 w-16 h-16 bg-primary/30 rounded-full blur-xl animate-glow-pulse" />
          
          <Button
            variant="coral"
            onClick={onScanClick}
            className="relative h-16 w-16 rounded-full shadow-fab hover:scale-105 transition-transform"
          >
            <Camera className="w-7 h-7" />
          </Button>
        </div>
      </div>
    </div>
  );
};
