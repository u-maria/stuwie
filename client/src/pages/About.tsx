import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

export default function About() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6">
      <SEO 
        title="About STUWIE" 
        description="Learn more about Maria's journey to build STUWIE — Vienna's curated study spot directory." 
        path="/about"
      />
      <div className="max-w-[700px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-10"
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">About</h1>
            <p className="text-xl text-muted-foreground italic">Meet the team behind this project!</p>
          </div>

          <div className="prose prose-lg dark:prose-invert prose-slate max-w-none space-y-6 text-foreground/90 leading-relaxed">
            <p>
              Meet the team behind this project! Except… the only member is me, Maria.
            </p>
            <p>
              I am a Computer Science student who is known among her friends for not being able to fully concentrate on anything at home. I always rely on getting ready and studying outside in order to feel motivated and to be more productive.
            </p>
            <p>
              At some point I realized: I am not alone in this. The libraries and cafes are constantly full of busy students looking for some focus to finish their tasks. But as a long time student I can confidently say: looking for a study spot in Vienna is not always an easy task.
            </p>
            <p>
              You always have to spend lots of time on research, ask your friends, look it up on TikTok etc… and in the end you never know whether you will actually like this study spot.
            </p>
            <p>
              Do they have good Wi-Fi? Are there any power outlets? Are they laptop friendly or will I get kicked out for just trying to study there? Is it too pricey for a student? Do other people even study there or will I look weird and out of place?
            </p>
            <p>
              So many questions remain unanswered.
            </p>
            <p>
              So I decided to come up with a curated list of <span className="font-bold italic">ACTUAL</span> good study spots in Vienna that just don’t disappoint. And if you have any doubts, you can always rely on other users’ reviews.
            </p>
            <p>
              Any suggestions on improving the website and overall experience are always welcome!
            </p>
            
            <div className="pt-12 space-y-4">
              <Button asChild variant="default" className="rounded-2xl h-16 px-10 shadow-xl shadow-[#EE9BB6]/20 hover:shadow-2xl transition-all bg-primary hover:bg-primary/90 font-black text-xl">
                <a href="mailto:contact@stuwie.example" target="_blank">
                  Contact me
                </a>
              </Button>
              <p className="text-sm font-bold text-muted-foreground ml-2">Found a great study spot? Tell me.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
