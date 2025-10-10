import React from 'react';
import { TESTIMONIALS as testimonials } from '@/lib/constants';
import AnimatedContent from './ui/AnimatedContent';

export default function TestimonialGrid() {
  return (
    <div className="min-h-screen bg-[#f8f8f8] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            What Our People Are Saying
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            see why our community can't get enough of our fits, comfort, and bold energy.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
                <AnimatedContent
                  distance={150}
                  key={index}
                  direction="vertical"
                  reverse={false}
                  duration={0.6}
                  initialOpacity={0}
                  animateOpacity
                  scale={1.1}
                  threshold={0.2}
                  delay={0.2+0.1*index}
                >

            <div 
              className="relative flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
              <div className="relative mt-4 mx-4 rounded-xl overflow-hidden bg-white flex gap-3 items-center">
                <img 
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="inline-block relative object-cover object-center rounded-full w-14 h-14"
                  />
                <div>
                  <div className="flex items-center gap-2">
                    <h6 className="text-base font-semibold text-gray-900">
                      {testimonial.name}
                    </h6>
                  </div>
                </div>
              </div>

              <div className="p-6 px-4 flex-grow">
                <p className="text-base font-normal text-gray-600 italic leading-relaxed">
                  “{testimonial.content}”
                </p>
              </div>

              <div className="p-6 flex justify-between items-center text-gray-500 text-sm">
                <span>{testimonial.date}</span>
                <span className="font-medium uppercase tracking-wide text-gray-800">
                  Verified Buyer
                </span>
              </div>
            </div>
                  </AnimatedContent>
          ))}
        </div>
      </div>
    </div>
  );
}
