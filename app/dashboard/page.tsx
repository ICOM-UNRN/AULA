import { Metadata } from 'next';
import DashboardPanel from '../components/dashboard/panel';

export const metadata: Metadata = {
  title: 'Admin',
};

export default function Dashboard() {
  return (
    <main className="flex w-full flex-col items-center justify-center">
      <DashboardPanel />
    </main>
  );
}
