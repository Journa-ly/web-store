import Link from 'next/link';
import React from 'react';

interface CenteredContentProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

const TitleSubtitleButton: React.FC<CenteredContentProps> = ({
  title,
  subtitle,
  buttonText,
  buttonLink
}) => {
  return (
    <div className="mt-16 flex h-96 flex-col items-center justify-between px-4 py-8 lg:px-0">
      <h1 className="mb-4 text-center text-5xl font-black drop-shadow-md lg:text-7xl">{title}</h1>
      <p className="mb-6 max-w-lg py-4 text-center text-2xl lg:text-3xl">{subtitle}</p>
      <Link
        className="btn btn-primary transform rounded px-6 py-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        href={buttonLink}
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default TitleSubtitleButton;
