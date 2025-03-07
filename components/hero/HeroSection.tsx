import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
            <div className="mx-auto flex w-full max-w-md flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/designs/trending"
                className="btn btn-outline h-12 w-full gap-2 whitespace-nowrap border-neutral-300 text-neutral-800 transition-colors hover:border-neutral-800 hover:bg-neutral-800 hover:text-white sm:w-40"
              >
                <span>Browse Designs</span>
              </Link>
              <Link
                href="/designs/studio"
                className="btn h-12 w-full gap-2 whitespace-nowrap border-none bg-pink-600 text-white hover:bg-pink-700 sm:w-40"
              >
                <span>Create Design</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Design Loop GIF */}
          <div className="relative order-last h-full min-h-[500px] w-full">
            <Image
              src="/videos/journa_demo.gif"
              alt="Design creation process"
              fill
              className="object-contain lg:object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent mix-blend-overlay"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
