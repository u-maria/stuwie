import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem("stuwie_demo_bar_dismissed");
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem("stuwie_demo_bar_dismissed", "true");
    } catch (e) {
      // Fallback for private mode/failing localStorage
    }
  };

  if (!isVisible) return null;

  return (
    <div className="h-9 w-full bg-secondary/30 border-b border-border/50 flex items-center justify-center px-4 relative z-[60]">
      <p className="text-[10px] md:text-xs font-bold text-muted-foreground tracking-tight text-center">
        Prototype demo — built for learning & portfolio purposes. Not an active service.
      </p>
      <button 
        onClick={handleDismiss}
        className="absolute right-2 md:right-4 p-1 hover:text-foreground transition-colors text-muted-foreground"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
