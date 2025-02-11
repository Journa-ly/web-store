import Image from 'next/image';

const AboutUs = () => {
  return (
    <section className="container mx-auto my-10 px-4">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        {/* Image Section */}
        <div>
          <Image
            src="https://journa.ai/cdn/shop/files/9019222915073864337_2048_jpg.webp?v=1721401459&width=1500"
            alt="About Journa.ai"
            width={1500}
            height={1500}
            priority
            className="h-auto w-full rounded-lg shadow-md"
          />
        </div>

        {/* Text Section */}
        <div>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">About Us</h2>
          <div className="space-y-4 text-base text-gray-700">
            <p>
              Welcome to <strong>Journa.ai</strong>, where creativity meets cutting-edge technology.
              We’re proud to offer a unique experience that empowers you to generate stunning,
              one-of-a-kind art using advanced AI models. Whether you're designing for personal
              expression, thoughtful gifts, or standout home decor, Journa.ai helps you bring your
              imagination to life. From prints to custom merchandise, we make it simple to turn your
              vision into reality.
            </p>
            <p>
              Journa was founded by three dads—Derry, Michael, and Nick—united by their shared
              passion for art, technology, and family. As parents, we understand the importance of
              creating meaningful, memorable experiences. That’s why we built Journa.ai: to make it
              easy and accessible for everyone to unleash their creativity. Our mission is to blend
              the power of AI with the timeless joy of creating something truly your own.
            </p>
            <p>
              Join us on this journey of discovery, imagination, and innovation. At Journa.ai, your
              creativity is the limit, and we’re here to help you transform your ideas into
              beautiful works of art.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
