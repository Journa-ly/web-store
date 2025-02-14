'use client';

import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const faqs = [
  {
    question: 'How does the AI design generation work?',
    answer: 'Our AI system takes your text description and converts it into unique apparel designs. Simply describe what you want to see, add optional text if desired, and click Generate. The AI will create a custom design based on your input that you can then apply to various products.'
  },
  {
    question: 'Can I customize the designs?',
    answer: 'Yes! You can customize designs by providing specific text descriptions, adding custom text to the image, and applying the design to different apparel types. Each generation creates unique variations based on your input.'
  },
  {
    question: 'What happens if I don\'t like the generated design?',
    answer: 'You can easily generate new designs by clicking the "New Generation" button and providing a different description. You can generate multiple designs and choose your favorite one to use.'
  },
  {
    question: 'Can I save my favorite designs?',
    answer: 'Yes! Once you\'re signed in, you can favorite any design by clicking the star icon. Your favorited designs will be saved to your account for future use.'
  },
  {
    question: 'What types of products can I put my designs on?',
    answer: 'You can apply your designs to our full range of apparel products including t-shirts, hoodies, and more. Each product page will show you a preview of how your design will look on that specific item.'
  },
  {
    question: 'How do I share my designs with others?',
    answer: 'You can easily share your designs using the share button. This will generate a link that you can send to friends, family, or share on social media.'
  },
  {
    question: 'What if the design generation fails?',
    answer: 'If a design generation fails, you\'ll see an error message. You can simply delete the failed design and try generating again with the same or modified description.'
  }
];

export default function FAQ() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                        <span className="text-base font-semibold leading-7">{faq.question}</span>
                        <span className="ml-6 flex h-7 items-center">
                          <ChevronDownIcon
                            className={clsx(
                              'h-6 w-6 transform transition-transform duration-200',
                              open ? 'rotate-180' : ''
                            )}
                            aria-hidden="true"
                          />
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
} 