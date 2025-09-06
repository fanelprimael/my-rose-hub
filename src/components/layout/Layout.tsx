import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-64 overflow-auto">
        <div className="p-6 pt-16 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
};