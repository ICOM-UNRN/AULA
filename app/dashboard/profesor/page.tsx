import { Metadata } from 'next';
import Table from '@/app/components/dashboard/table';

export const metadata: Metadata = {
  title: 'Profesor',
};

export default function Profesor({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  return <Table searchParams={searchParams} />;
}
