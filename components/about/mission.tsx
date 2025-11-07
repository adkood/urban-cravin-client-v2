"use client"

import { motion, Variants } from "framer-motion"

export default function Mission() {
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
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <section className="py-20 bg-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="relative h-96 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg overflow-hidden order-2 md:order-1"
          >
            <img
              src="/fashion-design-studio.jpg"
              alt="Urban Cravin design process"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6 order-1 md:order-2"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block text-xs font-medium tracking-widest text-primary uppercase mb-4">
                Our Mission
              </span>
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-6">
                Innovating Fashion Daily
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We aim to innovate and perfect our craft day by day, ensuring each article conveys the finest quality
                and presents unique designs that are uncompared. Our mission is to make fashion more sophisticated,
                rare, and custom-made for people who crave something extraordinary.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4 pt-4">
              <div className="flex gap-4">
                <div className="w-1 bg-primary flex-shrink-0"></div>
                <p className="text-muted-foreground">Continuous improvement in design and quality standards</p>
              </div>
              <div className="flex gap-4">
                <div className="w-1 bg-primary flex-shrink-0"></div>
                <p className="text-muted-foreground">Bespoke creations for the discerning fashion enthusiast</p>
              </div>
              <div className="flex gap-4">
                <div className="w-1 bg-primary flex-shrink-0"></div>
                <p className="text-muted-foreground">Setting trends that inspire and influence the industry</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
