import { Button } from '@nextui-org/react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Materia',
};

export default function Materia() {
  return (
    <div className=" flex flex-row justify-center gap-3">
      <Button size="lg" color="primary" className="w-60">
        Importar
      </Button>
      <Button size="lg" color="primary" className="w-60">
        Exportar
      </Button>
    </div>
  );
}
