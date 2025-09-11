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
  X,
  Calendar,
  LogOut,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const navigation = [
  { name: "Tableau de Bord", href: "/", icon: Home },
  { name: "Élèves", href: "/students", icon: Users },
  { name: "Classes", href: "/classes", icon: School },
  { name: "Enseignants", href: "/teachers", icon: GraduationCap },
  { name: "Notes", href: "/grades", icon: BookOpen },
  { name: "Finances", href: "/finances", icon: CreditCard },
  { name: "Rapports", href: "/reports", icon: FileText },
  { name: "Années Scolaires", href: "/school-years", icon: Calendar },
  { name: "Paramètres", href: "/settings", icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userRole, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

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
          <div className="p-4 border-t border-sidebar-border space-y-3">
            {/* User Profile */}
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-sidebar-accent/50">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-sidebar-foreground/70 bg-sidebar-accent rounded-full p-1" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Administrateur'}
                </div>
                <div className="text-xs text-sidebar-foreground/70 capitalize">
                  {userRole || 'Utilisateur'}
                </div>
              </div>
            </div>
            
            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="w-full justify-start text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
            
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