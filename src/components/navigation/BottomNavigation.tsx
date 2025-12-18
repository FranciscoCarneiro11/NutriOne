import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Utensils, Dumbbell, User, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

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
        "relative flex flex-col items-center justify-center gap-1 py-2 px-2 transition-all duration-200",
        isActive 
          ? "text-white" 
          : "text-white/50 hover:text-white/80"
      )}
    >
      <div className={cn(
        "transition-transform duration-200",
        isActive && "scale-110"
      )}>
        {icon}
      </div>
      <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
      
      {/* Active indicator dot */}
      <div className={cn(
        "absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary transition-all duration-300",
        isActive 
          ? "opacity-100 scale-100" 
          : "opacity-0 scale-0"
      )} />
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

  return (
    <div className={cn("fixed bottom-4 left-0 right-0 z-50 px-4", className)}>
      <div className="max-w-md mx-auto">
        {/* Navigation Bar - Dark rounded pill */}
        <nav className="grid grid-cols-5 items-center bg-zinc-900/95 backdrop-blur-md rounded-full px-1 py-2 shadow-2xl border border-white/5">
          {/* Home */}
          <NavItem
            to="/dashboard"
            icon={<Home className="w-5 h-5" />}
            label="Home"
            isActive={currentPath === "/dashboard"}
          />
          
          {/* Dieta */}
          <NavItem
            to="/diet"
            icon={<Utensils className="w-5 h-5" />}
            label="Dieta"
            isActive={currentPath === "/diet"}
          />

          {/* Center Scan Button */}
          <button
            onClick={onScanClick}
            className="flex flex-col items-center justify-center gap-1 py-1 text-white/70 hover:text-white transition-all duration-200"
          >
            <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center border border-white/20 hover:bg-white/15 transition-colors">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wide">Scan</span>
          </button>

          {/* Treino */}
          <NavItem
            to="/workout"
            icon={<Dumbbell className="w-5 h-5" />}
            label="Treino"
            isActive={currentPath === "/workout"}
          />

          {/* Perfil */}
          <NavItem
            to="/profile"
            icon={<User className="w-5 h-5" />}
            label="Perfil"
            isActive={currentPath === "/profile"}
          />
        </nav>
      </div>
    </div>
  );
};
