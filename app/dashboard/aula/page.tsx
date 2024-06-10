import { Metadata } from 'next';
import AulasTable from '@/app/components/dashboard/aula/table';

export const metadata: Metadata = {
  title: 'Aula',
};

export default function Aula({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  return <AulasTable searchParams={searchParams}/>
}
