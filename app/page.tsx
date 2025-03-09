import Homepage from '@/components/Homepage';

export const metadata = {
  title: 'Journa - Create Custom Apparel with AI',
  description:
    'Design and create custom apparel using AI. Browse community-created designs or make your own unique clothing. Shop trending designs and join a community of creative fashion enthusiasts.',
  openGraph: {
    type: 'website',
    title: 'Journa - Create Custom Apparel with AI',
    description:
      'Design and create custom apparel using AI. Browse community-created designs or make your own unique clothing.',
    url: 'https://journa.ai',
    siteName: 'Journa',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Journa - Create Custom Apparel with AI'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Journa - Create Custom Apparel with AI',
    description:
      'Design and create custom apparel using AI. Browse community-created designs or make your own unique clothing.',
    images: ['/twitter-image']
  },
  themeColor: '#fff'
};

export default function Page() {
  return <Homepage />;
}
