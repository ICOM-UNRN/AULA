/* eslint-disable indent */
'use client';
import { Button } from '@nextui-org/react';
import clsx from 'clsx';
import { Suspense, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Search from '../components/dashboard/search';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const section = pathname.split('/')[2];
  const buttons = [
    { label: 'Profesor', link: '/dashboard/profesor' },
    { label: 'Aula', link: '/dashboard/aula' },
    { label: 'Materia', link: '/dashboard/materia' },
    { label: 'Edificio', link: '/dashboard/edificio' },
    { label: 'Carrera', link: '/dashboard/carrera' },
    { label: 'Importar/Exportar', link: '/dashboard/importar-exportar' },
  ];
  useEffect(() => {
    if (pathname === '/login') router.push('/dashboard');
  }, []);
  return (
    <main className="flex w-full flex-col items-center justify-center">
      <div className="flex w-[80%] flex-col gap-3 rounded-lg bg-lightPaper p-6 shadow-medium dark:bg-darkPaper">
        <div className="flex">
          {(pathname === `/dashboard/${section}` ||
            pathname === '/dashboard') && (
            <div className=" flex flex-col items-center justify-evenly gap-6">
              {buttons.map((button) => (
                <Link href={button.link} key={button.label}>
                  <Button
                    color="primary"
                    variant={pathname === button.link ? 'bordered' : 'solid'}
                    className={clsx(
                      'h-12 w-36 text-white',
                      pathname === button.link && 'text-foreground',
                    )}
                  >
                    {button.label}
                  </Button>
                </Link>
              ))}
            </div>
          )}
          <div
            className={clsx(
              'flex w-full flex-col px-5 ',
              (pathname === '/dashboard' || section === 'importar-exportar') &&
                'justify-center',
              pathname === `/dashboard/${section}` &&
                section !== 'importar-exportar' &&
                'justify-between',
            )}
          >
            <div>
              {pathname === `/dashboard/${section}` &&
                section !== 'importar-exportar' && (
                  <>
                    <h1 className="text-bold font-xl mb-1">Filtrar</h1>
                    <Search placeholder={`Buscar ${section}`} />
                  </>
                )}
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </div>
            {pathname === `/dashboard/${section}` &&
              section !== 'importar-exportar' && (
                <Link href={`/dashboard/${section}/agregar`}>
                  <Button className="w-full">Agregar {section}</Button>
                </Link>
              )}
          </div>
        </div>
      </div>
    </main>
  );
}
