import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiGoogle, SiApple, SiFacebook } from "react-icons/si";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";

export default function Signup() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background flex items-center justify-center p-6">
      <SEO 
        title="Join STUWIE" 
        description="Create your STUWIE account to save your favorite study spots and check in." 
        path="/signup"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card p-10 rounded-[40px] shadow-2xl border border-border/50"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-black mb-3">Create your account</h1>
          <p className="text-muted-foreground font-bold tracking-tight">Join the STUWIE community today!</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="font-black text-sm uppercase tracking-widest ml-1">Name</Label>
            <Input placeholder="Your full name" className="h-14 rounded-2xl border-2 focus:ring-2 focus:ring-[#EE9BB6] text-lg px-5 font-medium" />
          </div>
          <div className="space-y-2">
            <Label className="font-black text-sm uppercase tracking-widest ml-1">Email</Label>
            <Input type="email" placeholder="maria@example.com" className="h-14 rounded-2xl border-2 focus:ring-2 focus:ring-[#EE9BB6] text-lg px-5 font-medium" />
          </div>
          <div className="space-y-2">
            <Label className="font-black text-sm uppercase tracking-widest ml-1">Password</Label>
            <Input type="password" placeholder="••••••••" className="h-14 rounded-2xl border-2 focus:ring-2 focus:ring-[#EE9BB6] text-lg px-5 font-medium" />
          </div>

          <Button 
            className="w-full h-16 rounded-2xl text-xl font-black shadow-lg shadow-[#EE9BB6]/20 mt-4 bg-primary hover:bg-primary/90"
            onClick={(e) => e.preventDefault()}
          >
            Create account
          </Button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
              <span className="bg-card px-4 text-muted-foreground">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Button variant="outline" className="h-14 rounded-2xl border-2 hover:border-[#EE9BB6] hover:bg-[#EE9BB6]/5 transition-all" onClick={(e) => e.preventDefault()}>
              <SiGoogle className="w-6 h-6" />
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl border-2 hover:border-[#EE9BB6] hover:bg-[#EE9BB6]/5 transition-all" onClick={(e) => e.preventDefault()}>
              <SiApple className="w-6 h-6" />
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl border-2 hover:border-[#EE9BB6] hover:bg-[#EE9BB6]/5 transition-all" onClick={(e) => e.preventDefault()}>
              <SiFacebook className="w-6 h-6" />
            </Button>
          </div>

          <p className="text-center text-sm font-bold text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link href="/signin" className="text-[#EE9BB6] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
