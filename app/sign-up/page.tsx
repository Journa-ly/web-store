// pages/login.tsx
import AuthForm from 'components/forms/authForm';
import { AuthFormType } from 'types/authForm';

const SignUpPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-100 pb-24">
      <div className="w-full max-w-xl p-8">
        <AuthForm formType={AuthFormType.SIGNUP} />
      </div>
    </div>
  );
};

export default SignUpPage;
