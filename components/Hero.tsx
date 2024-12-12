import React from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  altText: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, imageSrc, altText }) => {
  return (
    <div className="mx-8">
      <div className="hero bg-primary py-12 rounded-xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="flex flex-col">
              <div className="text-center lg:text-left lg:w-2/3 mb-6 lg:mb-0">
                <h1 className="text-6xl font-bold mb-4">{title}</h1>
                <p className="pt-8 text-xl text-gray-600">{subtitle}</p>
              </div>
              <div className="flex gap-4 pt-12 lg:w-2/3 items-center justify-center">
                <button className="btn rounded-full">Shop Trending Designs</button>
                <button className="btn btn-secondary text-white rounded-full">Design Your Own</button>
              </div>
            </div>
            {/* Image Section */}
            <div className="lg:w-1/2">
              <img
                src={imageSrc}
                alt={altText}
                className="w-full max-w-md mx-auto lg:mx-0 rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
