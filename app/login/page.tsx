import AuthForm from 'components/forms/authForm';
import { AuthFormType } from 'types/authForm';

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-100 pb-24">
      <div className="w-full max-w-lg p-8">
        <AuthForm formType={AuthFormType.LOGIN} />
      </div>
    </div>
  );
};

export default LoginPage;
