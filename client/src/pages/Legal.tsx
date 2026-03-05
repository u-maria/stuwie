import { motion } from "framer-motion";

export default function Legal() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-serif font-black">Legal Notice</h1>
          
          <div className="space-y-8 prose prose-slate max-w-none">
            <section className="space-y-2">
              <p className="font-black text-sm uppercase tracking-widest text-muted-foreground">Provider</p>
              <p className="text-xl font-bold">Maria Umerkina</p>
              <p className="text-muted-foreground font-medium">Vienna, Austria</p>
            </section>

            <section className="space-y-4">
              <p className="font-black text-sm uppercase tracking-widest text-muted-foreground">Purpose</p>
              <p className="text-lg text-foreground font-medium leading-relaxed">
                This website is a demonstration project created for educational and portfolio purposes to showcase the author’s approach to web development and digital business thinking. It is not an active service. Any information shown is illustrative and may be incomplete or outdated.
              </p>
            </section>

            <section className="space-y-4 border-t pt-8 border-border/50">
              <p className="font-black text-sm uppercase tracking-widest text-muted-foreground">Disclaimer</p>
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
