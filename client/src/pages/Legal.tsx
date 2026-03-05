import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";

export default function Legal() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6">
      <SEO 
        title="Legal Notice" 
        description="Legal information and provider details for the STUWIE demonstration project." 
        path="/legal"
      />
      <div className="max-w-2xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-serif font-black">Legal Notice</h1>
          
          <div className="space-y-10">
            <section className="space-y-3">
              <p className="font-black text-xs uppercase tracking-[0.2em] text-[#EE9BB6]">Provider</p>
              <div className="space-y-1 text-foreground font-bold text-lg leading-relaxed">
                <p>Maria Umerkina</p>
                <p>Vienna, Austria</p>
                <p>contact@stuwie.example</p>
              </div>
            </section>

            <section className="space-y-4 border-t pt-10 border-border/50">
              <p className="font-black text-xs uppercase tracking-[0.2em] text-[#EE9BB6]">Disclaimer</p>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                This is a demo project for learning and portfolio purposes. It’s not an active service. Information shown may be incomplete or outdated.
              </p>
              <p className="text-muted-foreground font-medium leading-relaxed">
                While we strive for accuracy, we provide no guarantee for the correctness or completeness of the information provided. Data and site content can change at any time without notice.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
