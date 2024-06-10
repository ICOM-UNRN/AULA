'use client';
import { Button } from '@nextui-org/react';
import Search from './search';
import ProfesorsTable from './profesor/table';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const List = ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) => {
  const pathname = usePathname();
  const section = pathname.split('/')[2];
  return (
    <div className="flex w-full flex-col justify-between px-5">
      <div>
        <h1 className="text-bold font-xl mb-1">Filtrar {section}</h1>
        <div className="flex justify-between gap-2">
          <Search placeholder={`Buscar ${section}`} />
          <Button color="primary" className="text-white">
            Buscar
          </Button>
        </div>
        {section === 'profesor' ? (
          <ProfesorsTable searchParams={searchParams} section={section} />
        ) : null}
      </div>

      <Link href={`/dashboard/${section}/agregar`}>
        <Button className="w-full">Agregar {section}</Button>
      </Link>
    </div>
  );
};

export default List;
