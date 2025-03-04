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
          <div className="order-first flex flex-col justify-center px-8 py-12 text-left md:pl-16">
            {/* Main Heading with shadow effect - Increased text size */}
            <h1 className="mb-8 text-6xl font-bold text-neutral-800 drop-shadow-[0_4px_4px_rgba(255,0,211,0.6)] md:text-7xl lg:text-8xl">
              Create things you wish you could buy.
            </h1>

            {/* Subtitle */}
            <p className="mb-10 max-w-xl text-lg text-gray-600 md:text-xl">
              Use our AI to create designs for nearly any apparel type. You don't have to be bougie
              either. <span className="font-bold">We promise.</span>
            </p>

            {/* Action Buttons - Matching the Figma design */}
            <div className="flex max-w-md flex-col gap-4 sm:flex-row">
              <Link
                href="/designs/trending"
                className="btn btn-outline h-12 flex-1 gap-2 border-neutral-300 text-neutral-800 transition-colors hover:border-neutral-800 hover:bg-neutral-800 hover:text-white"
              >
                <HeartIcon className="h-4 w-4" />
                <span>Browse Designs</span>
              </Link>
              <Link
                href="/designs/studio"
                className="btn h-12 flex-1 gap-2 border-none bg-pink-600 text-white hover:bg-pink-700"
              >
                <HeartIcon className="h-4 w-4 text-blue-100" />
                <span>Create Design</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Design Loop GIF */}
          <div className="relative order-last h-full min-h-[500px] w-full">
            <Image
              src="/hompage_gif.GIF"
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
