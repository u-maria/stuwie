import { Link, useLocation } from "wouter";
import { Map, LayoutGrid, Info } from "lucide-react";
import st濒eLogo from "@assets/IMG_0627_1772645584092.PNG";

export function Navigation() {
  const [location] = useLocation();

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
