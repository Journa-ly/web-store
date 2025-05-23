import CartModal from 'components/cart/modal';
import DesignStudioButton from 'components/designStudioButton';
import Link from 'next/link';
import Image from 'next/image';
import Menu from '../search/menu';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';

export function Navbar() {
  const menu = [
    { title: 'Trending', path: '/designs/trending' },
    { title: 'Ready to Ship', path: '/collections/ready-to-ship' },
    { title: 'Categories', path: '/designs/categories' }
  ];

  return (
    <div className="mb-2 mt-1 bg-white px-2 shadow lg:px-4 lg:shadow-none">
      <div className="navbar bg-base-100 lg:rounded-box lg:shadow-md">
        <div className="navbar-start flex items-center">
          <MobileMenu>
            <Menu />
          </MobileMenu>
          <Link href="/" className="relative ml-2 h-[28px] w-[107px]">
            <Image src="/icon_black.svg" alt="Journa" fill className="object-contain" priority />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-4 px-1">
            {menu.length
              ? menu.map((item) => (
                  <li key={item.title}>
                    <Link href={item.path}>{item.title}</Link>
                  </li>
                ))
              : null}
          </ul>
        </div>
        <div className="navbar-end">
          <UserMenu />
          <DesignStudioButton />
          <CartModal />
        </div>
      </div>
    </div>
  );
}
