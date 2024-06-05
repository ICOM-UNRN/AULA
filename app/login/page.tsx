import { Metadata } from 'next';
import LoginForm from '@/app/components/login/login-form';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center">
      <LoginForm />
    </main>
  );
}
