import React from 'react';

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

              {/* Right Side - Image Placeholders */}
              <div>
                {/* Landscape image on top (563x268 in Figma) */}
                <div className="mb-6 aspect-[563/268] rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.1)]">
                  {/* Empty content as per Figma design */}
                </div>

                {/* Three square images in a row */}
                <div className="grid grid-cols-3 gap-4">
                  {/* First Card (173x173 in Figma) */}
                  <div className="aspect-square rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.1)]">
                    {/* Empty content as per Figma design */}
                  </div>

                  {/* Second Card (173x173 in Figma) */}
                  <div className="aspect-square rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.1)]">
                    {/* Empty content as per Figma design */}
                  </div>

                  {/* Third Card (173x173 in Figma) */}
                  <div className="aspect-square rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.1)]">
                    {/* Empty content as per Figma design */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
