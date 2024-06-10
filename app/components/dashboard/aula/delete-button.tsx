'use client';
import { deleteAula } from '@/app/lib/actions';
import { Button } from '@nextui-org/react';
import { useContext } from 'react';
import ThemeContext from '@/context/theme-context';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  useAulas,
  useTotalAulas,
  useTotalAulasPages,
} from '@/hooks/swr-hooks';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Aula } from '@/app/lib/definitions';

export const DeleteAulaButton = ({
  aula,
  searchParams,
  isDisabled,
  setPending,
}: {
  aula: Aula;
  searchParams?: {
    query?: string;
    page?: string;
  };
  isDisabled: boolean;
  setPending: (pending: boolean) => void;
}) => {
  const query = searchParams?.query;
  const currentPage = Number(searchParams?.page) || 1;
  const { aulas, mutateAulas } = useAulas(query, currentPage);
  const { totalAulas, mutateTotalAulas } = useTotalAulas();
  const { totalAulasPages, mutateTotalAulasPages } =
    useTotalAulasPages();
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
          title: `Estas seguro de eliminar a "${aula.nombre}"?`,
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
              deleteAula(aula.id_aula)
                .then(() => {
                  mutateTotalAulas(totalAulas - 1, false);
                  if (totalAulas % 6 === 5 && totalAulasPages > 1) {
                    mutateTotalAulasPages(totalAulasPages - 1, false);
                  }
                  if (aulas.length === 1 && currentPage > 1) {
                    const newPage = currentPage - 1;
                    const newPath = `/dashboard/aula?page=${newPage}${query ? `&query=${query}` : ''}`;
                    router.push(newPath);
                  }
                  mutateAulas();
                })
                .catch((error) => {
                  console.error('Failed to delete aula:', error);
                })
                .finally(() => {
                  setPending(false);
                }),
              {
                loading: 'Eliminando Aula...',
                success: 'Aula eliminada exitosamente!',
                error: 'Error al eliminar aula',
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
