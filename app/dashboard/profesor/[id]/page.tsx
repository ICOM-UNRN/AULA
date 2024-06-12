import { EditProfesor } from '@/app/components/dashboard/profesor/edit-form';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button, Spinner } from '@nextui-org/react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Profesor detalle',
};

export default function DetallesProfesor() {
  return (
    <>
      <Link href="/dashboard/profesor" passHref>
        <Button
          startContent={<ArrowLeftIcon className=" h-4 w-4" />}
          variant="light"
          className="mb-5 underline "
        >
          Regresar
        </Button>
      </Link>
      <h1 className="text-xl font-bold">Detalles profesor</h1>
      <Suspense fallback={<Spinner color="primary" />}>
        <EditProfesor />
      </Suspense>
    </>
  );
}
