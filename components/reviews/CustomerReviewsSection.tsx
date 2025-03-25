import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

// Sample review data
const reviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    date: 'June 12, 2024',
    title: 'Absolutely Love My New Shirt!',
    content:
      'The design came out exactly as I imagined. The quality is fantastic and it fits perfectly. Will definitely be ordering more designs soon!'
  },
  {
    id: 2,
    name: 'Michael Chen',
    rating: 5,
    date: 'May 28, 2024',
    title: 'Best Custom Hoodie Ever',
    content:
      'I was skeptical about ordering custom apparel online, but this exceeded my expectations. The AI design tool was so easy to use and the final product looks amazing.'
  },
  {
    id: 3,
    name: 'Jessica Williams',
    rating: 4,
    date: 'July 3, 2024',
    title: 'Great Quality and Fast Shipping',
    content:
      'The design looks even better in person than it did online. Shipping was faster than expected and the quality is top-notch. Would recommend!'
  },
  {
    id: 4,
    name: 'David Rodriguez',
    rating: 5,
    date: 'June 20, 2024',
    title: 'Perfect Gift for My Friend',
    content:
      "I created a custom design for my friend's birthday and they absolutely loved it! The colors are vibrant and the print quality is excellent."
  },
  {
    id: 5,
    name: 'Emily Thompson',
    rating: 5,
    date: 'July 15, 2024',
    title: 'Exceeded My Expectations',
    content:
      'The quality of the print and fabric is outstanding. I was worried about how the design would turn out, but it looks even better than I imagined!'
  },
  {
    id: 6,
    name: 'Alex Patel',
    rating: 4,
    date: 'June 5, 2024',
    title: 'Great Customer Service',
    content:
      'Had a small issue with my order but the customer service team was incredibly helpful and resolved it quickly. The final product is amazing!'
  }
];

export default function CustomerReviewsSection() {
  return (
    <div className="bg-white px-4 py-4 md:px-8">
      <div className="w-full">
        <div className="px-4 py-12 md:px-8">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-6 text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl">
              What Our <span className="text-pink-600">Customers</span> Say
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl">
              Don't just take our word for it. See what people are saying about their custom
              designs.
            </p>
          </div>

          {/* Reviews Grid */}
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className={`h-full rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg ${index >= 3 ? 'hidden md:block' : ''}`}
              >
                {/* Review Header */}
                <div className="mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">{review.name}</h3>
                    <div className="flex items-center">
                      <div className="mr-2 flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div>
                  <h4 className="mb-2 font-medium text-gray-800">{review.title}</h4>
                  <p className="text-sm text-gray-600">{review.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* View All Reviews Link (Mobile Only)
          <div className="mt-8 text-center block md:hidden">
            <a 
              href="/reviews" 
              className="rounded-md bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            >
              View All Reviews
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
}
