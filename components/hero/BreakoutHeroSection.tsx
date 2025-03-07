import React from 'react';
import Image from 'next/image';

export default function BreakoutHeroSection() {
  return (
    <section className="relative w-full overflow-visible">
      {/* Hero content with text */}
      <div className="px-4 md:px-8">
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
      </div>

      {/* Breakout video that extends beyond the hero section and spans full width */}
      <div className="relative mt-8 w-full md:m-auto md:max-w-[64rem] md:rounded-lg md:-mt-20 lg:-mt-24">
        <div className="relative w-full overflow-hidden">
          <picture className="block w-full">
            {/* Mobile image */}
            {/* <source media="(max-width: 767px)" srcSet="/videos/journa_demo.gif" /> */}
            {/* Desktop image */}
            <source srcSet="/videos/studio_demo.gif" />
            {/* Fallback image */}
            <Image
              src="/videos/studio_demo.gif"
              alt="Journa studio demo"
              width={1920}
              height={1080}
              className="h-auto w-full rounded-lg"
              sizes="100vw"
              priority
            />
          </picture>
        </div>
      </div>
    </section>
  );
}
