import { Metadata } from 'next';
import AddProfesor from '@/app/components/dashboard/profesor/add-form';

export const metadata: Metadata = {
  title: 'Agregar profesor',
};

export default function CreateProfesor() {
  return <AddProfesor />;
}
