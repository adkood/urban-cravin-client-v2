"use client"

import { motion, Variant, Variants } from "framer-motion"

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants : Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8 pt-20 pb-10">
      <motion.div className="max-w-4xl text-center" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-block text-sm font-medium tracking-widest text-primary uppercase">Urban Cravin</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 tracking-tight"
        >
          Redefining Fashion Excellence
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto"
        >
          We create distinctive designs that transcend ordinary fashion and establish new trends in the industry
        </motion.p>

        <motion.div variants={itemVariants} className="flex gap-4 justify-center">
          <button className="px-8 py-3 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
            Our Story
          </button>
          <button className="px-8 py-3 border border-foreground text-foreground hover:bg-foreground/5 transition-colors">
            Shop Now
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}
