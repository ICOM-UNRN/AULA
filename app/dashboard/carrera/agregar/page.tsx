import { Metadata } from 'next';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Agregar carrera',
};

export default function CreateCarrera() {
  return (
    <>
      <Link href="/dashboard/carrera" passHref>
        <Button
          startContent={<ArrowLeftIcon className=" h-3 w-3" />}
          variant="light"
          className="mb-5"
        >
          Regresar
        </Button>
      </Link>
      <h1>Campos carrera</h1>
    </>
  );
}
