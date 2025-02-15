import Hero from 'components/Hero';
import HeroWithCarousel from 'components/heroWithCarousel';
import Stats from 'components/stats';
import TitleSubtitleButton from 'components/TitleSubtitleButton';

export const metadata = {
  title: 'Journa - Create Custom Apparel with AI',
  description:
    'Design and create custom apparel using AI. Browse community-created designs or make your own unique clothing. Shop trending designs and join a community of creative fashion enthusiasts.',
  openGraph: {
    type: 'website',
    title: 'Journa - Create Custom Apparel with AI',
    description:
      'Design and create custom apparel using AI. Browse community-created designs or make your own unique clothing.',
    url: 'https://journa.ai', // Replace with your actual domain
    siteName: 'Journa'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Journa - Create Custom Apparel with AI',
    description:
      'Design and create custom apparel using AI. Browse community-created designs or make your own unique clothing.'
  }
};

export default function HomePage() {
  return (
    <>
      <Hero
        title="Create the sh*t you wish you could buy."
        subtitle="Use our AI to create designs for nearly any apparel type. You don't have to be bougie either.  We promise."
        imageSrc="/images/image_0.png"
        altText="Hero Image"
      />
      <HeroWithCarousel
        title="Stop searching.  Start creating."
        subtitle="Sometimes you have to do it yourself.  We aren't here to tell you what fashion is.  The community creates, likes and shares their own flavors.  You don't need a company telling you what is good.  Let the people choose."
        imageSrc="/images/image_0.png"
        altText="Hero Image"
        collection="apparel"
      />
      <TitleSubtitleButton
        title="Designs That Don't Suck."
        subtitle="Sometimes other people have better ideas than you, and that's O.K. Buy them instead."
        buttonText="Shop Trending Designs"
        buttonLink="/collections/trending"
      />
      <Stats />
    </>
  );
}
