import { Metadata } from 'next';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Agregar materia',
};

export default function CreateMateria() {
  return (
    <>
      <Link href="/dashboard/materia" passHref>
        <Button
          startContent={<ArrowLeftIcon className=" h-3 w-3" />}
          variant="light"
          className="mb-5"
        >
          Regresar
        </Button>
      </Link>
      <h1>Campos materia</h1>
    </>
  );
}
