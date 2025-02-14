import { CartProvider } from 'components/cart/cart-context';
import { DesignProvider } from 'components/designs/design-context';
import Footer from 'components/layout/footer';
import { Navbar } from 'components/layout/navbar';
import { getCart } from 'lib/shopify';
import { Inter } from 'next/font/google';
import { cookies, headers } from 'next/headers';
import { ReactNode } from 'react';
import './globals.css';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Journa',
    template: 'Journa'
  },
  robots: {
    follow: true,
    index: true
  }
  // ...(twitterCreator &&
  //   twitterSite && {
  //     twitter: {
  //       card: 'summary_large_image',
  //       creator: twitterCreator,
  //       site: twitterSite
  //     }
  //   })
};

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cartId = (await cookies()).get('cartId')?.value;
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart(cartId);

  return (
    <html lang="en" data-theme="journaTheme" className={inter.className}>
      <body>
        <CartProvider cartPromise={cart}>
          <DesignProvider>
            <Navbar />
            <main>{children}</main>
          </DesignProvider>
        </CartProvider>
        <Footer />
        {/* <GoogleAnalytics gaId="G-XYZ" /> */}
      </body>
    </html>
  );
}
