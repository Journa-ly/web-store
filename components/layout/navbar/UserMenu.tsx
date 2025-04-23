'use client';

import { useAuth } from 'requests/users';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDesign } from 'components/designs/design-context';
import { mutate } from 'swr';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const { setSelectedDesign, setPreviewImage } = useDesign();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      // Clear design context
      setSelectedDesign(null);
      setPreviewImage(null);

      // Clear all SWR cache
      await mutate(
        () => true, // match all keys
        undefined, // data to reset to
        { revalidate: false } // do not revalidate
      );
      router.push('/designs/trending');
    }
  };

  // Don't render anything during SSR or initial mount
  if (!isMounted) {
    return null;
  }

  // Show login/signup menu when not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost px-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 20"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="menu z-[1000] dropdown-content w-52 rounded-box bg-base-100 p-2 shadow"
        >
          <li>
            <Link href="/login">Login</Link>
          </li>
          <li>
            <Link href="/sign-up">Create Account</Link>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost">
        <span>Hi, {user.first_name}</span>
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-[1000] w-52 rounded-box bg-base-100 p-2 shadow"
      >
        <li>
          <Link href="/profile">Profile</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
}
