import { Button } from '@nextui-org/react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-grow flex-col items-center justify-center gap-8 p-6">
      <div className="flex flex-col justify-center align-middle">
        <span className="text-center text-xl font-bold ">SEDE ANDINA</span>
        <h1 className="text-center text-9xl font-bold text-primary">AULA</h1>
        <span className="text-center text-xl">
          Administración Unificada de Lugares Académicos
        </span>
      </div>
      <Link href="/horarios">
        <Button
          variant="bordered"
          size="lg"
          className="w-48 border-foreground text-foreground"
        >
          Ver horarios
        </Button>
      </Link>
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
          width: '200px',
          aspectRatio: 1,
          clipPath: 'polygon(0 100%,100% 0,100% 100%)',
          background: '#eb1f3f',
        }}
      ></div>
    </main>
  );
}
