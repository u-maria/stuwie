import { Link, useLocation } from "wouter";
import { Map, LayoutGrid, User, PlusCircle, LogIn, LogOut, Shield, Info, UserPlus, Home as HomeIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import st濒eLogo from "@assets/IMG_0627_1772645584092.PNG";

export function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/spots", label: "Browse", icon: LayoutGrid },
    { href: "/map", label: "Map", icon: Map },
    { href: "/about", label: "About", icon: Info },
  ];

  if (isAuthenticated) {
    navLinks.push({ href: "/profile", label: "Profile", icon: User });
    navLinks.push({ href: "/submit", label: "Add Spot", icon: PlusCircle });
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
              <img src={st濒eLogo} alt="STUWIE" className="h-12 md:h-16 lg:h-20 w-auto object-contain block" />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-1.5 text-base font-bold tracking-tight transition-colors relative py-2 ${
                  location === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {location === link.href && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            ))}
            
            {isAuthenticated && (
              <Link 
                href="/admin/pending"
                className={`flex items-center gap-1.5 text-base font-bold tracking-tight transition-colors relative py-2 ${
                  location === "/admin/pending" ? "text-[#EE9BB6]" : "text-muted-foreground hover:text-[#EE9BB6]"
                }`}
              >
                Admin
                {location === "/admin/pending" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-bold">{user?.firstName || user?.email}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => logout()} className="text-muted-foreground hover:text-destructive rounded-full">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button asChild variant="ghost" className="hidden sm:flex rounded-full font-bold text-muted-foreground hover:text-foreground">
                  <Link href="/signup">Sign Up</Link>
                </Button>
                <Button asChild className="rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all font-bold px-6">
                  <Link href="/signin">
                    Sign In
                  </Link>
                </Button>
              </div>
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
          {!isAuthenticated && (
             <Link 
              href="/signup"
              className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
                location === "/signup" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <UserPlus className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Join</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
