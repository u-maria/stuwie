import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6">
      <SEO 
        title="Privacy Policy" 
        description="Privacy information for STUWIE demonstration project. No tracking cookies or marketing." 
        path="/privacy"
      />
      <div className="max-w-2xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-serif font-black">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            This website is a demonstration project. We value your privacy and aim to be transparent about how data is handled.
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-bold">Operator</h2>
            <p className="text-muted-foreground font-medium">
              Maria Umerkina<br />
              Vienna, Austria
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold">Data Processing</h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              To operate this website securely and stably, certain technical data is automatically processed in server logs. This may include your IP address, browser type, and time of access. This data is used solely for technical maintenance and security purposes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold">Cookies</h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              We use only technically necessary cookies (such as for theme preferences or session management). We do not use any tracking, analytics, or marketing cookies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold">User Rights</h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              You have the right to request access to, deletion of, or objection to the processing of your data. As this is a demo project with minimal data storage, we aim to fulfill these requests promptly.
            </p>
          </section>

          <section className="space-y-4 border-t pt-8 border-border/50">
            <h2 className="text-xl font-bold">Contact</h2>
            <p className="text-muted-foreground font-medium italic">
              contact@stuwie.example (Placeholder)
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
