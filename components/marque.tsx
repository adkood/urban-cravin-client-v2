"use client";

import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";



export default function Marquee({
  marqueItems,
  bgColor = '#9b1e22',
  textColor = 'white'
} : {
  marqueItems : string[]
  bgColor ?: string
  textColor ?: string
}) {
  const movingContainer = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline>(null);
  const timelineTimeScaleTween = useRef<gsap.core.Tween>(null);
  const MARQUEE_ITEMS = marqueItems;

  useEffect(() => {
    // Setup infinite marquee timeline
    const setupInfiniteMarqueeTimeline = () => {
      gsap.set(movingContainer.current, {
        xPercent: 0,
      });

      timeline.current = gsap
        .timeline({
          defaults: { ease: "none", repeat: -1 },
        })
        .to(movingContainer.current, {
          xPercent: -36,
          duration: 20,
        });
    };

    setupInfiniteMarqueeTimeline();

    return () => {
      timeline.current?.kill();
      timelineTimeScaleTween.current?.kill();
    };
  }, []);

  const onPointerEnter = () => {
    if (!timeline.current) return;
    timelineTimeScaleTween.current?.kill();
    timelineTimeScaleTween.current = gsap.to(timeline.current, {
      timeScale: 0.25,
      duration: 0.4,
    });
  };

  const onPointerLeave = () => {
    if (!timeline.current) return;
    timelineTimeScaleTween.current?.kill();
    timelineTimeScaleTween.current = gsap.to(timeline.current, {
      timeScale: 1,
      duration: 0.2,
    });
  };

  const list = useMemo(
    () => (
      <div className="flex w-fit items-center gap-8">
        {MARQUEE_ITEMS.map((text, index) => {
          const isLast = index === MARQUEE_ITEMS.length - 1;
          return (
            <div
              key={index}
              className={`flex shrink-0 items-center gap-8 ${
                isLast ? "mr-8" : ""
              }`}
            >
              <span 
                className={`text-sm font-medium tracking-wide uppercase whitespace-nowrap`}
                style={{color : textColor}}
              >
                {text}
              </span>
              <span className="text-white">☆</span>
            </div>
          );
        })}
      </div>
    ),
    []
  );

  return (
    <div
      className={`w-full select-none overflow-hidden bg-[${bgColor}] py-1`}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <div ref={movingContainer} className="flex w-fit">
        {list}
        {list}
      </div>
    </div>
  );
}