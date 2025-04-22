import { Providers } from './providers';
import { CartProvider } from 'components/cart/cart-context';
import { DesignProvider } from 'components/designs/design-context';
import { TutorialProvider } from '@/contexts/TutorialContext';
import Footer from 'components/layout/footer';
import { Navbar } from 'components/layout/navbar';
import { getCart } from 'lib/shopify';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Inter } from 'next/font/google';
import { cookies, headers } from 'next/headers';
import { ReactNode } from 'react';
import './globals.css';
import { Metadata } from 'next';
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Journa - Discover Unique Designs',
    template: '%s | Journa'
  },
  description: 'Explore and shop thousands of custom designs from independent creators on Journa.',
  appleWebApp: {
    statusBarStyle: 'black-translucent'
  },
  keywords: [
    'custom designs',
    'independent creators',
    'unique products',
    'design marketplace',
    'print on demand',
    'ai design',
    'custom apparel',
    'custom t-shirts',
    'custom hoodies',
    'custom shirts',
    'custom hats',
    'custom bags',
    'ai t-shirt design',
    'ai hoodie design',
    'ai shirt design',
    'ai hat design',
    'ai bag design',
    'ai design marketplace',
    'ai design generator',
    'ai design tool',
    'ai design software',
    'ai design app',
    'ai design platform',
    'ai design marketplace',
    'ai design generator'
  ],
  authors: [{ name: 'Journa Team' }],
  creator: 'Journa',
  publisher: 'Journa',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  robots: {
    follow: true,
    index: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Journa',
    title: 'Journa - Discover Unique Designs',
    description:
      'Explore and shop thousands of custom designs from independent creators on Journa.',
    images: [
      {
        url: `${baseUrl}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: 'Journa - Discover Unique Designs'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Journa - Discover Unique Designs',
    description:
      'Explore and shop thousands of custom designs from independent creators on Journa.',
    creator: '@journa',
    site: '@journa',
    images: [`${baseUrl}/twitter-image.png`]
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'en-US': baseUrl
    }
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
  }
};

const inter = Inter({ subsets: ['latin'] });
const gaId = String(process.env.NEXT_PUBLIC_GA_ID);

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cartId = (await cookies()).get('cartId')?.value;
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart(cartId);

  return (
    <html lang="en" data-theme="journaTheme" className={inter.className}>
      <body>
        <Providers>
          <CartProvider cartPromise={cart}>
            <DesignProvider>
              <TutorialProvider>
                <Navbar />
                <main>{children}</main>
              </TutorialProvider>
            </DesignProvider>
          </CartProvider>
        </Providers>
        <Footer />
        <GoogleAnalytics gaId={gaId} />
      </body>
    </html>
  );
}
