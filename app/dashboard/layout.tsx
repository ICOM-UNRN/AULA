'use client';
import { Toaster } from 'sonner';
import { Button } from '@nextui-org/react';
import clsx from 'clsx';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const section = pathname.split('/')[2];
  const buttons = [
    { label: 'Profesor' },
    { label: 'Aula' },
    { label: 'Materia' },
    { label: 'Edificio' },
    { label: 'Carrera' },
    { label: 'Importar/Exportar' },
  ];
  useEffect(() => {
    if (pathname === '/login') router.push('/dashboard');
  }, []);
  return (
    <main className="flex w-full flex-col items-center justify-center">
      <Toaster
        closeButton
        toastOptions={{
          classNames: {
            toast: 'bg-lightPaper dark:bg-darkPaper',
            title: 'text-foreground dark:text-[#FCF6F5]',
            description: 'text-foreground dark:text-[#FCF6F5]',
            error: 'text-danger 1px solid border-danger',
            success: 'text-success 1px solid border-success ',
            actionButton:
              'bg-lightPaper dark:bg-darkPaper text-foreground dark:text-[#FCF6F5] border-darkPaper dark:border-lightPaper',
            cancelButton:
              'bg-lightPaper dark:bg-darkPaper text-foreground dark:text-[#FCF6F5] border-darkPaper dark:border-lightPaper',
            closeButton:
              'bg-lightPaper dark:bg-darkPaper text-foreground dark:text-[#FCF6F5] border-darkPaper dark:border-lightPaper',
          },
        }}
      />
      <div className="flex w-[80%] flex-col gap-3 rounded-lg bg-lightPaper p-6 shadow-medium dark:bg-darkPaper">
        <div className="flex">
          {(pathname === `/dashboard/${section}` ||
            pathname === '/dashboard') && (
            <div className=" flex flex-col items-center justify-evenly gap-6">
              {buttons.map((button) => (
                <Link
                  href={`/dashboard/${button.label.toLowerCase()}`}
                  key={button.label}
                >
                  <Button
                    color="primary"
                    variant={
                      section === button.label.toLowerCase()
                        ? 'bordered'
                        : 'solid'
                    }
                    className={clsx(
                      'h-12 w-36 text-white',
                      section === button.label.toLowerCase() &&
                        'text-foreground',
                    )}
                  >
                    {button.label}
                  </Button>
                </Link>
              ))}
            </div>
          )}
          {children}
        </div>
      </div>
    </main>
  );
}
