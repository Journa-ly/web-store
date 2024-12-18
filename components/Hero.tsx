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
    <div className="mx-2 lg:mx-6 overflow-hidden">
      <div className="hero bg-primary py-12 rounded-xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="flex flex-col">
              <div className="text-center lg:text-left lg:w-2/3 mb-6 lg:mb-0">
                <h1 className="text-6xl font-black text-white mb-4">{title}</h1>
                <p className="pt-8 text-xl font-semibold text-neutral">{subtitle}</p>
              </div>
              <div className="flex gap-4 pt-12 m-auto w-1/2 lg:w-2/3 flex-col lg:flex-row">
                <button className="btn">Shop Trending Designs</button>
                <button className="btn btn-secondary text-white">Design Your Own</button>
              </div>
            </div>
            {/* Image Section */}
            <div className="lg:w-1/2">
              <Image
                src={imageSrc}
                alt={altText}
                className="w-full max-w-md mx-auto lg:mx-0 rounded-lg shadow-lg pt-12 lg:pt-0"
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
