import CartModal from 'components/cart/modal';
import DesignStudioButton from 'components/designStudioButton';
import Link from 'next/link';
import Image from 'next/image';
import Menu from '../search/menu';
import UserMenu from './UserMenu';

export function Navbar() {
  const menu = [
    { title: 'Trending', path: '/designs/trending' },
    { title: 'Ready to Ship', path: '/collections/ready-to-ship' },
    { title: 'Categories', path: '/designs/categories' }
  ];

  return (
    <div className="mx-2 pb-8 pt-4 lg:mx-6">
      <div className="navbar rounded-box bg-base-100 shadow-lg">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <div
              tabIndex={0}
              className="dropdown-content menu-sm z-[1] mb-12 mt-4 w-52 rounded-lg bg-base-100"
            >
              <Menu />
            </div>
          </div>
          <Link href="/" className="relative h-[28px] w-[107px] px-2 pl-2">
            <Image src="/icon_black.svg" alt="Journa" fill className="object-contain" priority />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {menu.length
              ? menu.map((item) => (
                  <li key={item.title}>
                    <Link href={item.path}>{item.title}</Link>
                  </li>
                ))
              : null}
          </ul>
        </div>
        <div className="navbar-end gap-2">
          <UserMenu />
          <DesignStudioButton />
          <CartModal />
        </div>
      </div>
    </div>
  );
}
