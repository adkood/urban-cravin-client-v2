"use client";
import FadeContent from "../ui/FadeContent";

export default function HeroSection() {
  return (
    <section className="relative w-full">
      <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
        <div className="w-full h-[90vh] sm:h-[70vh] lg:h-[80vh]">
          {/* Video for mobile */}
          <video
            src="/vid.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center sm:hidden"
          />
          {/* Image for desktop */}
          <img
            src="/genrage_banner.webp"
            alt="When It Rains Graphic Tee"
            className="w-full h-full object-cover object-center hidden sm:block"
          />
        </div>
      </FadeContent>
    </section>
  );
}