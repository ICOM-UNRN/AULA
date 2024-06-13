import ImportFile from '@/app/components/dashboard/importar-exportar/import-file';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Materia',
};

export default function Materia() {
  return (
    <div className=" flex flex-row justify-center gap-3">
      <ImportFile />
    </div>
  );
}
