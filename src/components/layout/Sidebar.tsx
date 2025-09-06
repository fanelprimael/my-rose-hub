import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  School,
  GraduationCap,
  BookOpen,
  CreditCard,
  FileText,
  Settings,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navigation = [
  { name: "Tableau de Bord", href: "/", icon: Home },
  { name: "Élèves", href: "/students", icon: Users },
  { name: "Classes", href: "/classes", icon: School },
  { name: "Enseignants", href: "/teachers", icon: GraduationCap },
  { name: "Notes", href: "/grades", icon: BookOpen },
  { name: "Finances", href: "/finances", icon: CreditCard },
  { name: "Rapports", href: "/reports", icon: FileText },
  { name: "Paramètres", href: "/settings", icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-background"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 z-40 w-64 h-full transition-transform duration-300 ease-in-out",
        "bg-sidebar border-r border-sidebar-border",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center p-6 border-b border-sidebar-border">
            <div className="text-center">
              <h1 className="text-xl font-bold text-sidebar-foreground">La Roseraie</h1>
              <p className="text-sm text-sidebar-foreground/70">Gestion Scolaire</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground"
                  )}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="text-xs text-sidebar-foreground/50 text-center">
              © 2024 La Roseraie
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};