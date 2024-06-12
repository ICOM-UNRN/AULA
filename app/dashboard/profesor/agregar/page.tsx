import { Metadata } from 'next';
import AddProfesor from '@/app/components/dashboard/profesor/add-form';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Agregar profesor',
};

export default function CreateProfesor() {
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
      <h1 className="text-xl font-bold">Agregar profesor</h1>
      <AddProfesor />
    </>
  );
}
