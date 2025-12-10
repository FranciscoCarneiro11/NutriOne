import React from "react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
  hideScrollbar?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  className,
  hideScrollbar = true,
}) => {
  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div
        className={cn(
          "w-full max-w-md min-h-screen flex flex-col bg-background",
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
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  children,
  className,
  leftAction,
  rightAction,
  title,
}) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur-sm",
        className
      )}
    >
      <div className="w-12 flex justify-start">{leftAction}</div>
      <div className="flex-1 text-center">
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
        "flex-1 px-6 py-4",
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
        "sticky bottom-0 px-6 py-4 pb-8 bg-background",
        className
      )}
    >
      {children}
    </footer>
  );
};
