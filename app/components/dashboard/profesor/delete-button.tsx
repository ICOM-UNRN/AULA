'use client';
import { deleteProfesor } from '@/app/lib/actions';
import { Button } from '@nextui-org/react';
import { useContext } from 'react';
import ThemeContext from '@/context/theme-context';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  useProfesors,
  useTotalProfesors,
  useTotalProfesorsPages,
} from '@/hooks/swr-hooks';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Profesor } from '@/app/lib/definitions';

export const DeleteProfesorButton = ({
  profesor,
  searchParams,
  isDisabled,
  setPending,
}: {
  profesor: Profesor;
  searchParams?: {
    query?: string;
    page?: string;
  };
  isDisabled: boolean;
  setPending: (pending: boolean) => void;
}) => {
  const query = searchParams?.query;
  const currentPage = Number(searchParams?.page) || 1;
  const { profesors, mutateProfesors } = useProfesors(query, currentPage);
  const { totalProfesors, mutateTotalProfesors } = useTotalProfesors();
  const { totalProfesorsPages, mutateTotalProfesorsPages } =
    useTotalProfesorsPages();
  const router = useRouter();
  const { theme } = useContext(ThemeContext);

  return (
    <Button
      className="border-danger font-bold hover:border-1 hover:text-danger"
      variant="light"
      size="sm"
      isDisabled={isDisabled}
      onClick={() => {
        Swal.fire({
          title: `Estas seguro de eliminar a "${profesor.nombre} ${profesor.apellido}"?`,
          icon: 'warning',
          showCancelButton: true,
          iconColor: 'red',
          background: theme === 'dark' ? '#212529' : '#ddd4d3',
          color: theme === 'dark' ? '#ddd4d3' : '#212529',
          confirmButtonColor: 'red',
          confirmButtonText: 'Si, deseo eliminarlo!',
          cancelButtonColor: theme === 'dark' ? '#212529' : '#ddd4d3',
          cancelButtonText: `<span style="color: ${theme === 'dark' ? '#ddd4d3' : '#212529'}">Cancelar</span>`,
        }).then((result) => {
          if (result.isConfirmed) {
            setPending(true);
            toast.promise(
              deleteProfesor(profesor.id)
                .then(() => {
                  mutateTotalProfesors(totalProfesors - 1, false);
                  if (totalProfesors % 6 === 5 && totalProfesorsPages > 1) {
                    mutateTotalProfesorsPages(totalProfesorsPages - 1, false);
                  }
                  if (profesors.length === 1 && currentPage > 1) {
                    const newPage = currentPage - 1;
                    const newPath = `/dashboard/profesor?page=${newPage}${query ? `&query=${query}` : ''}`;
                    router.push(newPath);
                  }
                  mutateProfesors();
                })
                .catch((error) => {
                  console.error('Failed to delete profesor:', error);
                })
                .finally(() => {
                  setPending(false);
                }),
              {
                loading: 'Eliminando profesor...',
                success: 'Profesor eliminado exitosamente!',
                error: 'Error al eliminar profesor',
              },
            );
          }
        });
      }}
    >
      <TrashIcon className="h-6 w-6" />
    </Button>
  );
};
