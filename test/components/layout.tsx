import { ReactNode } from "react";
import { LanguageSelector } from "./language-selector";
import { BorderToggle } from "./border-toggle";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div>
      <div className="fixed top-4 right-4 z-50 flex flex-row gap-2">
        <LanguageSelector />
        <BorderToggle />
      </div>
      {children}
    </div>
  );
}
