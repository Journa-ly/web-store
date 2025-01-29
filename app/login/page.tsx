import AuthForm from 'components/authForm';
import { AuthFormType } from 'types/authForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 pb-24">
      <div className="w-full max-w-lg p-8">
        <AuthForm formType={AuthFormType.LOGIN} />
      </div>
    </div>
  );
};

export default LoginPage;
