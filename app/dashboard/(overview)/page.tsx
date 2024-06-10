import UserInfo from '@/app/components/dashboard/user-info';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Dashboard() {
  return (
    <div className="flex w-full items-center justify-center">
      <UserInfo />
    </div>
  );
}
