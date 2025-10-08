import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative w-full">
      <div className="w-full aspect-[1568/662]">
        <img
          src="/hero-image.jpg.bv.webp"
          alt="When It Rains Graphic Tee"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}