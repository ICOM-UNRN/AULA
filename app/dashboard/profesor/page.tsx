import { Metadata } from 'next';
import ProfesorsTable from '@/app/components/dashboard/profesor/table';

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
  return <ProfesorsTable searchParams={searchParams} />;
}
