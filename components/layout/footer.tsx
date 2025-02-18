import EmailIntake from 'components/forms/emailIntake';
import FooterMenu from 'components/layout/footer-menu';
import Link from 'next/link';
import Image from 'next/image';
import SocialLinks from './socials';

const menu = [
  {
    title: 'Home',
    path: '/'
  },
  {
    title: 'About Us',
    path: '/about'
  },
  {
    title: 'Contact',
    path: '/contact'
  }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const copyrightName = 'Journa, Inc.';

  return (
    <footer className="footer grid-rows-2 bg-neutral text-neutral-content">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-12 text-sm md:px-4 min-[1320px]:px-0">
        <div className="flex w-full items-center justify-between">
          <Link href="/" className="relative h-[30px] w-[108px]">
            <Image src="/icon_white.svg" alt="Journa" fill className="object-contain" priority />
          </Link>
          <SocialLinks />
        </div>
        <div className="flex w-full items-center gap-4 md:justify-between">
          <FooterMenu menu={menu} />
          <EmailIntake />
        </div>
      </div>
      <div className="mx-auto flex w-full border-t border-neutral-200 py-6 text-sm">
        <div className="mx-auto flex w-full max-w-7xl flex-col-reverse items-center justify-evenly px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
          <p className="block p-2 text-lg md:inline-block md:text-sm">
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} All rights reserved.
          </p>
          <p className="block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm">
            <Link href="/policies/privacy-policy">Privacy Policy</Link>
          </p>
          <p className="block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm">
            <Link href="/policies/shipping-policy">Shipping Policy</Link>
          </p>
          <p className="block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm">
            <Link href="/policies/refund-policy">Refund Policy</Link>
          </p>
          <p className="block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm">
            <Link href="/policies/terms-of-service">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
