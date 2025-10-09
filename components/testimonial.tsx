// components/Testimonials.tsx
import React from 'react';

interface Testimonial {
  id: number;
  text: string;
  highlight: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "The progress tracker is fantastic. It's motivating to see how much I've improved over time. The app has a great mix of common and ",
    highlight: "challenging",
    author: {
      name: "Fatima Khoury",
      handle: "dlfatory_curtains_98",
      avatar: "FK"
    }
  },
  {
    id: 2,
    text: "The progress tracker is fantastic. It's motivating to see how much I've improved over time. The app has a great mix of common and ",
    highlight: "challenging",
    author: {
      name: "Hassan Ali",
      handle: "turbulent_unicorn_29",
      avatar: "HA"
    }
  },
  {
    id: 3,
    text: "The progress tracker is fantastic. It's motivating to see how much I've improved over time. The app has a great mix of common and ",
    highlight: "challenging",
    author: {
      name: "Jorge Martínez",
      handle: "nefarious_jellybeans_91",
      avatar: "JM"
    }
  },
  {
    id: 4,
    text: "The progress tracker is fantastic. It's motivating to see how much I've improved over time. The app has a great mix of common and ",
    highlight: "challenging",
    author: {
      name: "Nicolás Sánchez",
      handle: "pervasive_inker_83",
      avatar: "NS"
    }
  },
  {
    id: 5,
    text: "The progress tracker is fantastic. It's motivating to see how much I've improved over time. The app has a great mix of common and ",
    highlight: "challenging",
    author: {
      name: "Noel Jensen",
      handle: "nefarious_shop_47",
      avatar: "NJ"
    }
  },
  {
    id: 6,
    text: "The progress tracker is fantastic. It's motivating to see how much I've improved over time. The app has a great mix of common and ",
    highlight: "challenging",
    author: {
      name: "Ahmad Khan",
      handle: "antic_circus_76",
      avatar: "AK"
    }
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 px-5 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-orange-500 border-2 border-orange-500 px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase mb-5">
            TESTIMONIALS
          </span>
          <h2 className="text-5xl font-bold text-gray-900">Our trusted clients</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            > 
              <p className="text-gray-700 text-base leading-relaxed mb-8">
                {testimonial.text}
                <span className="text-orange-500 font-semibold">
                  {testimonial.highlight}
                </span>
                {" words."}
              </p>

              <div className="flex items-center gap-4 pt-5 border-t border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-semibold text-lg">
                  {testimonial.author.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-base">
                    {testimonial.author.name}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {testimonial.author.handle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}