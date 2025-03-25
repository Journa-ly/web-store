import React from 'react';

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
      <div className="relative mt-8 w-full md:m-auto md:-mt-20 md:max-w-[64rem] md:rounded-lg lg:-mt-24">
        <div className="relative w-full overflow-hidden">
          <video
            className="h-auto w-full md:rounded-lg"
            autoPlay
            muted
            loop
            playsInline
            poster="/videos/scratch_that_cat_desktop.mp4"
          >
            <source
              src="/videos/scratch_that_cat_desktop.mp4"
              type="video/mp4"
              media="(min-width: 768px)"
            />
            <source
              src="/videos/scratch_that_cat_mobile.mp4"
              type="video/mp4"
              media="(max-width: 767px)"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}
