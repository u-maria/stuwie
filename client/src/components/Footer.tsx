import { Link } from "wouter";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="w-full bg-background border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
        <p className="text-sm text-muted-foreground font-medium max-w-md">
          STUWIE is a demo project created to showcase product thinking and web development.
        </p>
        
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors focus-magenta rounded-sm px-1">
            Privacy Policy
          </Link>
          <Link href="/legal" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors focus-magenta rounded-sm px-1">
            Legal Notice
          </Link>
        </div>

        <p className="text-xs text-muted-foreground font-bold tracking-tight">
          © {currentYear} Maria Umerkina. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
