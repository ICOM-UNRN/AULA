import { Metadata } from 'next';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Agregar edificio',
};

export default function CreateEdificio() {
  return (
    <>
      <Link href="/dashboard/edificio" passHref>
        <Button
          startContent={<ArrowLeftIcon className=" h-3 w-3" />}
          variant="light"
          className="mb-5"
        >
          Regresar
        </Button>
      </Link>
      <h1>Campos edificio</h1>
    </>
  );
}
