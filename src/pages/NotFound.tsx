import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page introuvable</p>
        <Link 
          to="/" 
          className={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            "bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          )}
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
