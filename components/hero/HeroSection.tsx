import React from 'react';
import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/24/solid';

export default function HeroSection() {
  return (
    <div className="relative bg-white">
      <div className="">
        <div className="grid min-h-[675px] grid-cols-1 lg:grid-cols-2">
          {/* Left Column: Text and Buttons */}
          <div className="order-first flex flex-col justify-center px-8 pb-2 pt-6 text-left md:py-12 md:pl-24">
            {/* Main Heading with shadow effect - Increased text size */}
            <h1 className="mb-8 text-6xl font-black text-neutral-800 drop-shadow-[0_4px_4px_rgba(255,0,211,0.6)] md:text-7xl lg:text-8xl">
              Create things you wish you could buy.
            </h1>

            {/* Subtitle */}
            <p className="mb-10 max-w-xl text-lg text-gray-600 md:text-xl">
              Use our AI to create designs for nearly any apparel type. You don't have to be bougie
              either. <span className="font-bold">We promise.</span>
            </p>

            {/* Action Buttons - Matching the Figma design */}
            <div className="mx-auto flex w-full max-w-md flex-row justify-center gap-3">
              <Link
                href="/designs/trending"
                className="btn btn-outline h-12 flex-1 gap-2 whitespace-nowrap border-neutral-300 text-neutral-800 transition-colors hover:border-neutral-800 hover:bg-neutral-800 hover:text-white sm:w-40"
              >
                <span>Browse Designs</span>
              </Link>
              <Link
                href="/designs/studio"
                className="btn h-12 flex-1 gap-2 whitespace-nowrap border-none bg-secondary text-white hover:bg-accent sm:w-40"
              >
                <span>Create Designs</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Responsive Videos */}
          <div className="relative order-last flex h-full min-h-[550px] w-full items-center justify-center overflow-hidden px-4 py-4 md:min-h-[600px] md:py-12 lg:min-h-[675px]">
            {/* Mobile Video (hidden on lg screens) */}
            <video
              className="absolute inset-0 h-full w-full object-contain object-center lg:hidden"
              playsInline
              muted
              loop
              autoPlay
              poster="/videos/journa_demo.gif"
            >
              <source src="/videos/homepage_hero_mobile.mp4" type="video/mp4" />
            </video>

            {/* Desktop Video (hidden on smaller screens) */}
            <video
              className="absolute inset-0 hidden h-full w-full object-contain object-center lg:block"
              playsInline
              muted
              loop
              autoPlay
              poster="/videos/journa_demo.gif"
            >
              <source src="/videos/homepage_hero_desktop.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent mix-blend-overlay"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
