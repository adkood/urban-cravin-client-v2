"use client"
import FadeContent from "../ui/FadeContent"

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
        <div className="relative w-full h-[90vh] sm:h-[70vh] lg:h-[69vh]">
          {/* Video for mobile */}
          <video
            src="/vid.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover sm:hidden"
          />

          {/* Video for desktop */}
          <video
            src="/lifting_the_weight.mov"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover hidden sm:block"
          />

          {/* Optional dark overlay for readability */}
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </FadeContent>
    </section>
  )
}
