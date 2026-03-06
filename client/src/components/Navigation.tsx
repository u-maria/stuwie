import { Link, useLocation } from "wouter";
import { Map, LayoutGrid, Info, UserPlus, LogOut, ChevronRight } from "lucide-react";
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

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop & Mobile Top Layer */}
        <div className="flex justify-between h-16 md:h-20 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center transition-opacity hover:opacity-80 shrink-0">
              <img src={st濒eLogo} alt="STUWIE" className="h-10 md:h-16 lg:h-20 w-auto object-contain" />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 ml-10">
              <Link href="/" className={`text-base font-medium transition-colors hover:text-primary ${location === "/" ? "text-primary" : "text-muted-foreground"}`}>
                Home
              </Link>
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`text-base font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-muted-foreground"}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-sm font-medium">{user?.firstName || user?.email}</span>
                <Button variant="ghost" size="icon" onClick={() => logout()} className="text-muted-foreground hover:text-destructive rounded-full">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <>
                <Button asChild variant="ghost" className="hidden md:flex rounded-full font-medium text-muted-foreground hover:text-foreground">
                  <Link href="/signup">Sign Up</Link>
                </Button>
                <Button asChild size="sm" className="rounded-full shadow-lg shadow-primary/10 hover:shadow-xl transition-all font-bold px-4 md:px-6 h-9 md:h-11 text-sm md:text-base">
                  <Link href="/signin">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation Layer */}
      <div className="md:hidden border-t border-border/40 bg-background/40">
        <div className="flex justify-around items-center h-12 px-2">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center justify-center gap-1.5 px-3 h-full transition-colors ${
                location === link.href ? "text-primary border-t-2 border-primary -mt-[2px]" : "text-muted-foreground"
              }`}
            >
              <link.icon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
