"use client"

import { motion, Variants } from "framer-motion"

export default function CTA() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section className="py-20 bg-foreground px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center space-y-8"
        >
          <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-serif font-bold text-background">
            Be Part of Our Fashion Story
          </motion.h2>

          <motion.p variants={itemVariants} className="text-lg text-background/80 leading-relaxed max-w-2xl mx-auto">
            Join a community that celebrates excellence, individuality, and the art of fashion. Discover pieces that
            speak to your unique style.
          </motion.p>

          <motion.div variants={itemVariants} className="flex gap-4 justify-center pt-6">
            <button className="px-8 py-3 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
              Explore Collection
            </button>
            <button className="px-8 py-3 border border-background text-background hover:bg-background/10 transition-colors">
              Contact Us
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
