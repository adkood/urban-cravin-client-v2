"use client"

import { motion, Variants } from "framer-motion"

export default function Vision() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
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
    <section className="py-20 bg-secondary px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block text-xs font-medium tracking-widest text-primary uppercase mb-4">
                Our Vision
              </span>
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-6">
                Excellence in Every Stitch
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Urban Cravin, we believe in providing top-quality fashion that is synonymous with excellence and
                superior workmanship. We are committed to producing distinctive designs that establish new trends and
                provide a unique identity to each wearer.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4 pt-4">
              <div className="flex gap-4">
                <div className="w-1 bg-primary flex-shrink-0"></div>
                <p className="text-muted-foreground">
                  Crafted with precision and passion for those who demand more than ordinary
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-1 bg-primary flex-shrink-0"></div>
                <p className="text-muted-foreground">Every piece tells a story of innovation and attention to detail</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="relative h-96 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg overflow-hidden"
          >
            <img
              src="/luxury-fashion-fabric-texture.jpg"
              alt="Urban Cravin fabric quality"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
