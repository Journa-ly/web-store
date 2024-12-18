import Image from 'next/image';
import React from 'react';
import { Carousel } from './carousel';

interface HeroProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  altText: string;
  collection: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, imageSrc, altText, collection }) => {
  return (
    <div className="mx-2 lg:mx-6 overflow-hidden mt-16">
      <div className="hero bg-neutral py-12 rounded-xl">
        <div className="container overflow-hidden mx-auto px-4">
          <div className="mb-8">
            <Carousel collection={collection} />
          </div>
          <div className="flex flex-col-reverse lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/2">
              <Image
                src={imageSrc}
                alt={altText}
                className="rounded-lg shadow-lg"
                layout="responsive"
                width={800}
                height={800}
              />
            </div>
            <div className="flex flex-col w-full lg:w-1/2">
              <div className="text-center lg:text-left mb-6 lg:mb-0">
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4 lg:mt-0 mt-8">
                  {title}
                </h1>
                <p className="pt-4 text-lg md:text-xl font-semibold text-white">{subtitle}</p>
              </div>
              <div className="flex pt-8 lg:pt-12 flex-col w-2/3 m-auto">
                <button className="btn btn-secondary text-white">Try Making Something Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
