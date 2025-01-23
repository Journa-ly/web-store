import Image from 'next/image';

const AboutUs = () => {
  return (
    <section className="container mx-auto my-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Image Section */}
        <div>
          <Image
            src="https://journa.ai/cdn/shop/files/9019222915073864337_2048_jpg.webp?v=1721401459&width=1500"
            alt="About Journa.ai"
            width={1500}
            height={1500}
            priority
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>

        {/* Text Section */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About Us
          </h2>
          <div className="text-base text-gray-700 space-y-4">
            <p>
              Welcome to <strong>Journa.ai</strong>, where creativity meets cutting-edge technology.
              We’re proud to offer a unique experience that empowers you to generate
              stunning, one-of-a-kind art using advanced AI models. Whether you're designing for
              personal expression, thoughtful gifts, or standout home decor, Journa.ai helps you
              bring your imagination to life. From prints to custom merchandise, we make it simple 
              to turn your vision into reality.
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
              creativity is the limit, and we’re here to help you transform your ideas into beautiful
              works of art.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
