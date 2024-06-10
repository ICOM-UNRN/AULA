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
          startContent={<ArrowLeftIcon className=" h-3 w-3" />}
          variant="light"
          className="mb-5"
        >
          Regresar
        </Button>
      </Link>
      <AddProfesor />
    </>
  );
}
