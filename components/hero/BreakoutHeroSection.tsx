import React from 'react';
import Image from "next/image";

export default function BreakoutHeroSection() {
  return (
    <section className="relative overflow-visible w-full px-4 md:px-8">
      <div className="mx-auto">
        <div className="relative rounded-3xl bg-secondary p-8 pb-32 text-center md:p-12 md:pb-32 lg:pb-40">
          {/* Bold hero text with each sentence on a separate row */}
          <div className="mb-10">
            <h2 className="text-5xl font-black leading-tight tracking-tight text-white md:text-6xl lg:text-7xl xl:text-8xl">
              <div>It doesn't exist.</div>
              <div>Until Now.</div>
            </h2>
          </div>

          {/* Descriptive text */}
          <p className="mx-auto max-w-3xl text-lg text-white/90 md:text-xl">
            Journa lets you throw your brilliant, stupid, or downright questionable ideas onto
            clothing or whatever for yourself, your friends, your family, or that weirdly specific
            thing you're celebrating. Wear it loud, own it proud.
          </p>
        </div>

        {/* Breakout video that extends beyond the hero section */}
        <div className="relative mx-auto -mt-16 w-full md:-mt-20 lg:-mt-24">
          <div className="relative w-full md:w-4/5 lg:w-3/4 mx-auto overflow-hidden rounded-xl shadow-2xl">
            <picture className="block w-full">
              {/* Mobile image */}
              <source
                media="(max-width: 767px)"
                srcSet="/videos/studio_demo_mobile.gif"
              />
              {/* Desktop image */}
              <source
                media="(min-width: 768px)"
                srcSet="/videos/studio_demo.gif"
              />
              {/* Fallback image */}
              <Image
                src="/videos/studio_demo.gif"
                alt="Journa studio demo"
                width={1920}
                height={1080}
                className="w-full h-auto"
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 80vw, 75vw"
                priority
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
}
