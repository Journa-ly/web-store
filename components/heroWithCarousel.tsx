import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Carousel } from './carousel';

interface HeroProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  altText: string;
  collection: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, imageSrc, altText }) => {
  return (
    <div className="mx-2 mt-16 overflow-hidden lg:mx-6">
      <div className="hero rounded-xl bg-neutral py-12">
        <div className="container mx-auto overflow-hidden px-4">
          <div className="flex flex-col-reverse items-center gap-8 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <Image
                src={imageSrc}
                alt={altText}
                className="rounded-lg shadow-lg"
                width={800}
                height={800}
              />
            </div>
            <div className="flex w-full flex-col lg:w-1/2">
              <div className="mb-6 text-center lg:mb-0 lg:text-left">
                <h1 className="mb-4 mt-8 text-4xl font-black text-white md:text-6xl lg:mt-0">
                  {title}
                </h1>
                <p className="pt-4 text-lg font-semibold text-white md:text-xl">{subtitle}</p>
              </div>
              <div className="m-auto flex w-2/3 flex-col pt-8 lg:pt-12">
                <Link href="/designs/studio" className="btn btn-secondary text-white">
                  Try Making Something Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
