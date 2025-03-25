import AuthForm from 'components/forms/authForm';
import { AuthFormType } from 'types/authForm';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-base-100 px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-base-content">Welcome Back</h2>
          <p className="mt-2 text-base-content/70">
            Sign in to your account to access your profile and designs.
          </p>
        </div>

        <div className="mt-8">
          <AuthForm formType={AuthFormType.LOGIN} />
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-4">
            <Link href="/sign-up" className="text-sm text-base-content/70 hover:text-primary">
              Create Account
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

export default LoginPage;
