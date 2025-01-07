import Image from 'next/image';
import React from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  altText: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, imageSrc, altText }) => {
  return (
    <div className="mx-2 overflow-hidden lg:mx-6">
      <div className="hero rounded-xl bg-primary py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center lg:flex-row">
            <div className="flex flex-col">
              <div className="mb-6 text-center lg:mb-0 lg:w-2/3 lg:text-left">
                <h1 className="mb-4 text-6xl font-black text-white">{title}</h1>
                <p className="pt-8 text-xl font-semibold text-neutral">{subtitle}</p>
              </div>
              <div className="m-auto flex w-1/2 flex-col gap-4 pt-12 lg:w-2/3 lg:flex-row">
                <button className="btn">Shop Trending Designs</button>
                <button className="btn btn-secondary text-white">Design Your Own</button>
              </div>
            </div>
            {/* Image Section */}
            <div className="lg:w-1/2">
              <Image
                src={imageSrc}
                alt={altText}
                className="mx-auto w-full max-w-md rounded-lg pt-12 shadow-lg lg:mx-0 lg:pt-0"
                height={800}
                width={800}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
