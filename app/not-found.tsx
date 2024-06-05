import { Button } from '@nextui-org/react';
import Link from 'next/link';
import not_found from '@/public/not-found.svg';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center p-6">
      <h1 className="text-center text-lg text-primary">
        Acá no hay nada maestro... o si?
      </h1>
      <Image src={not_found} alt="Not Found" priority width={300} />
      <Link href="/">
        <Button color="primary" className="text-white">
          Volver
        </Button>
      </Link>
    </div>
  );
}
