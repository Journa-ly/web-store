import React from 'react';
import Image from 'next/image';

export default function BreakoutHeroSection() {
  return (
    <section className="relative overflow-visible px-4 md:px-8">
      <div className="mx-auto">
        {/* Hero content with secondary background */}
        <div className="relative rounded-3xl bg-secondary p-8 pb-24 text-center md:p-12 md:pb-32 lg:pb-40">
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

        {/* Breakout image that extends beyond the hero section */}
        <div className="relative mx-auto -mt-16 h-[300px] max-w-3xl md:-mt-20 md:h-[400px] lg:-mt-24 lg:h-[500px]">
          <div className="absolute left-1/2 h-full w-full -translate-x-1/2 transform md:w-[120%]">
            <div className="relative h-full w-full">
              <Image
                src="/images/Sweet_Child_O_Mine_Outline_2.jpg"
                alt="Journa product showcase"
                fill
                className="rounded-2xl object-cover shadow-xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
