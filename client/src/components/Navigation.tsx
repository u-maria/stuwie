import { Link, useLocation } from "wouter";
import { Map, LayoutGrid, User, PlusCircle, LogIn, LogOut, Shield, Info } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import st濒eLogo from "@assets/IMG_0627_1772645584092.PNG";

export function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { href: "/spots", label: "Browse", icon: LayoutGrid },
    { href: "/map", label: "Map", icon: Map },
    { href: "/about", label: "About", icon: Info },
  ];

  if (isAuthenticated) {
    navLinks.push({ href: "/profile", label: "Profile", icon: User });
    navLinks.push({ href: "/submit", label: "Add Spot", icon: PlusCircle });
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
              <img src={st濒eLogo} alt="STUWIE" className="h-8 md:h-10 w-auto object-contain" />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-1.5 text-sm font-bold tracking-tight transition-colors ${
                  location === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated && (
              <Link 
                href="/admin/pending"
                className={`flex items-center gap-1.5 text-sm font-bold tracking-tight transition-colors ${
                  location === "/admin/pending" ? "text-accent" : "text-muted-foreground hover:text-accent"
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-bold">{user?.firstName || user?.email}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => logout()} className="text-muted-foreground hover:text-destructive rounded-full">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button asChild className="rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all font-bold">
                <a href="/api/login">
                  Sign In
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile nav bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-border/50 pb-safe z-50">
        <div className="flex justify-around items-center h-16 px-4">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
