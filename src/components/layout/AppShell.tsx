import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
  hideScrollbar?: boolean;
  fullWidth?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  className,
  hideScrollbar = true,
  fullWidth = false,
}) => {
  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div
        className={cn(
          "min-h-screen flex flex-col",
          fullWidth 
            ? "w-full" 
            : "w-full max-w-md md:max-w-2xl lg:max-w-4xl",
          hideScrollbar && "hide-scrollbar overflow-y-auto",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

interface AppHeaderProps {
  children?: React.ReactNode;
  className?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  children,
  className,
  leftAction,
  rightAction,
  title,
  showBack,
  onBack,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Check if there's browser history to go back to
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        // Fallback to dashboard if no history
        navigate("/dashboard");
      }
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 lg:px-12 py-3 bg-background/95 backdrop-blur-sm",
        className
      )}
    >
      <div className="w-12 flex justify-start">
        {showBack ? (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        ) : (
          leftAction
        )}
      </div>
      <div className="flex-1 text-center max-w-xl mx-auto">
        {title && <h1 className="text-lg font-semibold text-foreground">{title}</h1>}
        {children}
      </div>
      <div className="w-12 flex justify-end">{rightAction}</div>
    </header>
  );
};

interface AppContentProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export const AppContent: React.FC<AppContentProps> = ({
  children,
  className,
  centered = false,
}) => {
  return (
    <main
      className={cn(
        "flex-1 px-6 md:px-8 lg:px-12 py-4 md:py-6 lg:py-8",
        centered && "flex flex-col items-center justify-center",
        className
      )}
    >
      {children}
    </main>
  );
};

interface AppFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const AppFooter: React.FC<AppFooterProps> = ({ children, className }) => {
  return (
    <footer
      className={cn(
        "sticky bottom-0 px-6 md:px-8 lg:px-12 py-4 pb-8 bg-background",
        className
      )}
    >
      <div className="max-w-md mx-auto md:max-w-lg">
        {children}
      </div>
    </footer>
  );
};
