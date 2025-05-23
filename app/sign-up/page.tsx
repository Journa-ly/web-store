// pages/sign-up.tsx
import AuthForm from 'components/forms/authForm';
import { AuthFormType } from 'types/authForm';
import Link from 'next/link';

const SignUpPage = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-base-100 px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-base-content">Create Your Account</h2>
          <p className="mt-2 text-base-content/70">
            Join Journa to discover and shop unique designs from independent creators.
          </p>
        </div>

        <div className="mt-8">
          <AuthForm formType={AuthFormType.SIGNUP} />
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-4">
            <Link href="/login" className="text-sm text-base-content/70 hover:text-primary">
              Login
            </Link>
            <span className="text-base-content/30">•</span>
            <Link
              href="/forgot-password"
              className="text-sm text-base-content/70 hover:text-primary"
            >
              Forgot Password
            </Link>
            <span className="text-base-content/30">•</span>
            <Link href="/" className="text-sm text-base-content/70 hover:text-primary">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
