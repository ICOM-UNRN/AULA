import { Metadata } from 'next';
import AddAula from '@/app/components/dashboard/aula/add-form';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Agregar aula',
};

export default function CreateAula() {
  return (
    <>
      <Link href="/dashboard/aula" passHref>
        <Button
          startContent={<ArrowLeftIcon className=" h-3 w-3" />}
          variant="light"
          className="mb-5"
        >
          Regresar
        </Button>
      </Link>
      <AddAula />
    </>
  );
}
