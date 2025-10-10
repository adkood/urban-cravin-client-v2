"use client";
import FadeContent from "../ui/FadeContent";

export default function HeroSection() {
  return (
    <section className="relative w-full">
      <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
        <div className="w-full h-[60vh] sm:h-[70vh] lg:h-[80vh]">
          <img
            src="/genrage_banner.webp"
            alt="When It Rains Graphic Tee"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </FadeContent>
    </section>
  );
}
