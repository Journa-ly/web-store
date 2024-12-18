import Link from 'next/link';
import React from 'react';

interface CenteredContentProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

const TitleSubtitleButton: React.FC<CenteredContentProps> = ({ title, subtitle, buttonText, buttonLink }) => {
  return (
    <div className="flex py-8 flex-col items-center justify-between px-4 lg:px-0 h-96 mt-16">
      <h1 className="text-5xl lg:text-7xl font-black mb-4 text-center drop-shadow-md">{title}</h1>
      <p className="py-4 lg:text-3xl text-2xl text-center mb-6 max-w-lg">{subtitle}</p>
      <Link className="btn btn-primary px-6 py-3 rounded shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" href={buttonLink}>
        {buttonText}
      </Link>
    </div>
  );
};

export default TitleSubtitleButton;
