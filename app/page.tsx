import { Carousel } from 'components/carousel';
import Hero from 'components/Hero';
import Footer from 'components/layout/footer';

export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <>
      <Hero 
        title="Create the sh*t you wish you could buy." 
        subtitle="Use our AI to create designs for nearly any apparel type. You don’t have to be bougie either.  We promise."
        imageSrc="/images/hero.png"
        altText="Hero Image"
      />
      <Carousel />
      <Footer />
    </>
  );
}
