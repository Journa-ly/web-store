'use client';

import { PaintBrushIcon, StarIcon, ShoppingCartIcon, ShareIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const steps = [
  {
    id: 1,
    name: 'Describe Your Design',
    description:
      'Start by describing the design you want to create. Be specific about colors, style, and elements you want to include. You can also add optional text that will appear in the design.',
    icon: PaintBrushIcon
  },
  {
    id: 2,
    name: 'Generate & Customize',
    description:
      "Click the Generate button to create your design. Don't like what you see? Generate again! You can create multiple versions until you find the perfect one. Save your favorites by clicking the star icon.",
    icon: StarIcon
  },
  {
    id: 3,
    name: 'Choose Your Product',
    description:
      'Select the product you want to put your design on. Preview how it looks on different items like t-shirts, hoodies, and more. Adjust the size and placement to get it just right.',
    icon: ShoppingCartIcon
  },
  {
    id: 4,
    name: 'Share & Order',
    description:
      'Happy with your design? Share it with friends or on social media using the share button. Ready to buy? Add to cart and complete your purchase to get your custom-designed apparel delivered.',
    icon: ShareIcon
  }
];

export default function HowTo() {
  return (
    <div className="bg-white py-8 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How to Create Your Custom Design
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Follow these simple steps to create and order your custom-designed apparel. No design
            experience needed - our AI does the hard work for you!
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-start">
                <div className="rounded-lg bg-gray-50 p-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <step.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-4 flex flex-col items-start">
                  <div className="flex items-center gap-x-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                      {step.id}
                    </div>
                    <p className="text-lg font-semibold leading-7 text-gray-900">{step.name}</p>
                  </div>
                  <p className="mt-2 text-base leading-7 text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </dl>
        </div>

        {/* Example/Demo Section */}
        <div className="mt-16 rounded-2xl bg-gray-50 p-8">
          <h3 className="text-2xl font-semibold text-gray-900">See it in action</h3>
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h4 className="text-lg font-medium text-gray-900">Example Prompt</h4>
              <div className="mt-2 rounded-lg bg-white p-4 shadow-sm">
                <p className="text-gray-600">
                  "Create a minimalist design with a mountain landscape at sunset, using warm colors
                  and adding the text 'Adventure Awaits' in a modern font"
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">Pro Tips</h4>
              <ul className="mt-2 list-inside list-disc space-y-2 text-gray-600">
                <li>Be specific about colors and style you want</li>
                <li>Mention any text or symbols you'd like included</li>
                <li>Generate multiple versions to explore different options</li>
                <li>Save your favorites to compare later</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
