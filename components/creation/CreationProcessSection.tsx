import React from 'react';
import Image from 'next/image';

export default function CreationProcessSection() {
  return (
    <section className="px-4 py-12 md:px-8">
      <div className="mx-auto">
        {/* Main Container - Gray Background with Rounded Corners */}
        <div className="relative w-full overflow-hidden rounded-2xl bg-[#f2f2f2] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.1)]">
          {/* Content Container */}
          <div className="relative p-8 md:px-20 md:py-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
              {/* Left Side - Text Content - Full half width on larger screens */}
              <div className="md:pr-4 lg:pr-8">
                {/* "Easy as store bought pie" - smaller font */}
                <h2 className="mb-8 text-left text-xl font-bold underline md:text-2xl">
                  Easy as store bought pie.
                </h2>

                {/* "Create. Print. Ship." - with more space between letters and lines */}
                <div className="mb-10">
                  <div className="space-y-4">
                    <div className="text-left text-6xl font-black text-[#272727] md:text-7xl lg:text-8xl">
                      Create.
                    </div>
                    <div className="text-left text-6xl font-black text-[#272727] md:text-7xl lg:text-8xl">
                      Print.
                    </div>
                    <div className="text-left text-6xl font-black text-[#272727] md:text-7xl lg:text-8xl">
                      Ship.
                    </div>
                  </div>
                </div>

                {/* Description text - no max width constraint */}
                <p className="text-left text-lg text-[#272727]">
                  Generate ideas with words. You know words right? Explain your design idea and let
                  our AI do the rest. Prints & ships Immediately.
                </p>
              </div>

              {/* Right Side - GIF */}
              <div className="flex items-center justify-center">
                <div className="relative aspect-auto w-full">
                  <Image
                    src="/videos/hompage_gif.GIF"
                    alt="Creation process demonstration"
                    width={600}
                    height={400}
                    className="h-auto w-full rounded-2xl"
                    priority
                  />
                </div>
              </div>

              {/* Original Right Side - Image Placeholders (Commented Out) */}
              {/* <div>
                <div className="mb-6 aspect-[563/268] rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.1)]">
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="relative aspect-square">
                    <Image
                      src="/images/create_journa_octo.png"
                      alt="Create your design with AI"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>

                  <div className="relative aspect-square">
                    <Image
                      src="/images/print_journa_octo.png"
                      alt="Print your design"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>

                  <div className="relative aspect-square">
                    <Image
                      src="/images/free_shipping_journa_octo.png"
                      alt="Free shipping"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
