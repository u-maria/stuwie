import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";

export default function Legal() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6">
      <SEO title="Legal Notice" description="Legal information for STUWIE." path="/legal" />
      <div className="max-w-2xl mx-auto space-y-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <h1 className="text-3xl md:text-4xl font-bold">Legal Notice</h1>
          
          <div className="space-y-10">
            <section className="space-y-4">
              <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-[#EE9BB6]">Provider</p>
              <div className="space-y-1 text-muted-foreground font-medium text-base leading-relaxed">
                <p>Maria Umerkina</p>
                <p>Vienna, Austria</p>
                <p>contact@stuwie.example</p>
              </div>
            </section>

            <section className="space-y-4 border-t pt-10 border-border/50">
              <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-[#EE9BB6]">Disclaimer</p>
              <div className="space-y-4 text-muted-foreground font-medium text-base leading-relaxed">
                <p>
                  This is a demo project for learning and portfolio purposes. It’s not an active service. Information shown may be incomplete or outdated.
                </p>
                <p>
                  While we strive for accuracy, we provide no guarantee for the correctness or completeness of the information provided. Data and site content can change at any time without notice.
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
