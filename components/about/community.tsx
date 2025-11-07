"use client"

import { motion, Variants } from "framer-motion"

export default function Community() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section className="py-20 bg-secondary px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-medium tracking-widest text-primary uppercase mb-4">
            Our Community
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-6">Celebrating Individuality</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Together, we celebrate individuality, empower each other, and redefine the fashion landscape. Our community
            is the heart of everything we do.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            {
              title: "Creative Expression",
              description:
                "We believe fashion is a form of self-expression. Every design celebrates your unique identity.",
              icon: "✨",
            },
            {
              title: "Quality Craftsmanship",
              description:
                "Meticulous attention to detail ensures every piece meets our exacting standards of excellence.",
              icon: "🎯",
            },
            {
              title: "Sustainable Fashion",
              description: "We are committed to ethical practices and sustainable materials in our production process.",
              icon: "🌿",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="p-8 bg-background rounded-lg border border-border hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
