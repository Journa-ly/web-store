'use client';

import { useAuth } from 'requests/users';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();

  // Show nothing while initially loading to prevent flash
  if (isLoading) {
    return null;
  }

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push('/');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
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
          className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
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
        <span>Hi, {user?.first_name}</span>
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
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
