'use client';
import { useAulas, useTotalAulasPages } from '@/hooks/swr-hooks';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
  Spinner,
  Button,
} from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation';
import { UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Aula } from '@/app/lib/definitions';
import { DeleteAulaButton } from './delete-button';
import { useState } from 'react';

const AulasTable = ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) => {
  const query = searchParams?.query;
  const currentPage = Number(searchParams?.page) || 1;
  const [pending, setPending] = useState(false);
  const { aulas, isLoading } = useAulas(query, currentPage);
  const { totalAulasPages } = useTotalAulasPages(query);
  const { replace } = useRouter();
  const pathname = usePathname();
  const loadingState = isLoading ? 'loading' : 'idle';

  const rows = aulas ?? [];

  const columns = [
    { key: 'edificio', label: 'Edificio' },
    { key: 'horario_habilitado', label: 'Horario Habilitado' },
    { key: 'ocupacion', label: 'Ocupacion maxima' },
    { key: 'materias', label: 'Materias que se dictan' },
    {
      key: 'actions',
      label: 'Acciones',
    },
  ];

  return (
    <Table
      aria-label="Tabla de aulas"
      className="rounded-none"
      classNames={{
        wrapper:
          'bg-transparent text-center relative px-0 rounded-none shadow-none',
        th: 'bg-primary  text-center text-base w-1 rounded-none text-sm font-light text-white',
        tr: 'hover:bg-gray-200 dark:hover:bg-background h-0 rounded-none text-sm',
      }}
      bottomContent={
        totalAulasPages > 0 ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={currentPage}
              total={totalAulasPages}
              onChange={(page) => {
                const params = new URLSearchParams(searchParams);
                params.set('page', page?.toString());
                replace(`${pathname}?${params.toString()}`);
              }}
              classNames={{
                cursor: 'text-white',
                item: 'bg-transparent text-foreground shadow-none ',
                prev: 'bg-transparent text-foreground shadow-none',
                next: 'bg-transparent text-foreground shadow-none',
              }}
            />
          </div>
        ) : null
      }
    >
      <TableHeader columns={columns} aria-label="Header" className="h-0">
        {(column) => (
          <TableColumn key={column.key} className={'text-center'}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={rows}
        loadingState={loadingState}
        loadingContent={<Spinner />}
        aria-label="Contenido tabla usuarios"
        emptyContent="No hay usuarios en esta página"
      >
        {rows.map((aula: Aula) => (
          <TableRow key={aula.id_aula} className="h-0">
            {columns.map((column) => (
              <TableCell key={column.key} className="text-center">
                {column.key === 'actions' ? (
                  <div className="flex items-center justify-center">
                    <Link href={'/dashboard/aula'}>
                      <Button
                        className="border-foreground hover:border-1 hover:text-foreground"
                        variant="light"
                        size="sm"
                      >
                        <UserIcon className="h-6 w-6" />
                      </Button>
                    </Link>
                    <div className="flex items-center justify-center">
                      <DeleteAulaButton
                        aula={aula}
                        searchParams={searchParams}
                        setPending={setPending}
                        isDisabled={pending}
                      />
                    </div>
                  </div>
                ) : (
                  getKeyValue(aula, column.key)
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AulasTable;
