import { ReactNode } from 'react';
import { LanguageSelector } from './language-selector';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div>
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector />
      </div>
      {children}
    </div>
  );
}
