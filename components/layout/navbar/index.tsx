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
        <div className="navbar-start flex items-center">
          <details className="dropdown lg:hidden">
            <summary className="btn btn-ghost m-1">
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
            </summary>
            <div className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-52">
              <Menu />
            </div>
          </details>
          <Link href="/" className="relative h-[28px] w-[107px] ml-4 mt-2">
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
