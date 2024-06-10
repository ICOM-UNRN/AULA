'use client';
import { Input } from '@/app/components/form/input';
import { useState } from 'react';
import { createAula } from '@/app/lib/actions';
import { toast } from 'sonner';
import {
  useAulas,
  useTotalAulasPages,
  useTotalAulas,
} from '@/hooks/swr-hooks';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
type CreateUserFormProps = {
  searchParams?: {
    query?: string;
    page?: string;
  };
};
const AddAula = ({ searchParams }: CreateUserFormProps) => {
  const query = searchParams?.query;
  const currentPage = Number(searchParams?.page) || 1;
  const { mutateAulas } = useAulas(query, currentPage);
  const { totalAulasPages, mutateTotalAulasPages } =
    useTotalAulasPages();
  const { totalAulas, mutateTotalAulas } = useTotalAulas();
  const [loading, setLoading] = useState(false);

  const [building, setBuilding] = useState('');
  const [schedule, setSchedule] = useState('');
  const [maxOcupation, setMaxOcupation] = useState('');
  const [classes, setClasses] = useState('');

  const [trySubmit, setTrySubmit] = useState(false);
  const [buildingError, setBuildingError] = useState(false);
  const [scheduleError, setScheduleError] = useState(false);
  const [maxOcupationError, setMaxOcupationError] = useState(false);
  const [classesError, setClassesError] = useState(false);

  const validateBuilding = (building: string) => {
    const re = /^[A-Za-z\s]+$/;
    if (re.test(building) && building.trim().length > 0) {
      setBuildingError(false);
    } else {
      setBuildingError(true);
    }
  };
  const validateSchedule = (schedule: string) => {
    const re = /^[A-Za-z\s]+$/;
    if (re.test(schedule) && schedule.trim().length > 0) {
      setScheduleError(false);
    } else {
      setScheduleError(true);
    }
  };
  const validateMaxOcupation = (maxOcupation: string) => {
    const re = /^\d{7,8}$/;
    if (re.test(maxOcupation)) {
      setMaxOcupationError(false);
    } else {
      setMaxOcupationError(true);
    }
  };
  const validateClasses = (classes: string) => {
    const re = /^[A-Za-z\s]+$/;
    if (re.test(classes) && classes.trim().length > 0) {
      setClassesError(false);
    } else {
      setClassesError(true);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    toast.promise(
      createAula(formData)
        .then(() => {
          if (
            query?.includes(building) ||
            query?.includes(schedule) ||
            query?.includes(maxOcupation) ||
            query?.includes(classes) ||
            !query
          ) {
            mutateAulas();
          }
          mutateTotalAulas(totalAulas + 1, false);
          if (
            ((query?.includes(building) ||
              query?.includes(schedule) ||
              query?.includes(maxOcupation) ||
              query?.includes(classes)) &&
              totalAulas % 6 === 0) ||
            (query == undefined && totalAulas % 6 === 0)
          ) {
            mutateTotalAulasPages(totalAulasPages + 1, false);
          }
          setLoading(false);
          setTrySubmit(false);
          setBuilding('');
          setSchedule('');
          setMaxOcupation('');
          setClasses('');
        })
        .catch((error: string) => {
          console.error(error);
          setLoading(false);
        }),
      {
        loading: 'Creando...',
        success: 'Aula creada con éxito',
        error: 'Error al crear el aula',
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full  bg-lightPaper dark:bg-darkPaper"
    >
      <div className=" flex flex-col items-center justify-evenly gap-5">
        <div className="flex w-full flex-row justify-between gap-2">
          <Input
            label="Edificio"
            name="edificio"
            type="text"
            variant="bordered"
            labelPlacement="outside"
            value={building}
            onValueChange={(e: string) => {
              setBuilding(e);
              if (trySubmit) {
                validateBuilding(e);
              }
            }}
            placeholder="Ingresar edificio"
            errorMessage="Ingresa un nombre valido"
            isRequired
            isInvalid={trySubmit && buildingError}
            classNames={{
              inputWrapper: 'p-0',
              errorMessage: 'absolute top-0 left-0',
              input: 'font-extralight',
            }}
          />
          <Input
            label="Horario"
            name="horario"
            type="text"
            variant="bordered"
            labelPlacement="outside"
            value={schedule}
            onValueChange={(e) => {
              setSchedule(e);
              if (trySubmit) {
                validateSchedule(e);
              }
            }}
            placeholder="Ingresar Horario"
            errorMessage="Ingrese un Horario valido"
            isRequired
            isInvalid={trySubmit && scheduleError}
            classNames={{
              inputWrapper: 'p-0',
              errorMessage: 'absolute top-0 left-0',
              input: 'font-extralight',
            }}
          />
          <Input
            label="Ocupacion"
            name="ocupacion"
            type="number"
            variant="bordered"
            labelPlacement="outside"
            value={maxOcupation}
            onValueChange={(e) => {
              setMaxOcupation(e);
              if (trySubmit) {
                validateMaxOcupation(e);
              }
            }}
            placeholder="Ingresar maxima ocupacion"
            errorMessage="Ingrese una cantidad valida"
            isRequired
            isInvalid={trySubmit && maxOcupationError}
            classNames={{
              inputWrapper: 'p-0',
              errorMessage: 'absolute top-0 left-0',
              input: 'font-extralight',
            }}
          />
          <Input
            label="Clases dictadas"
            name="clases_a_cargo"
            type="string"
            variant="bordered"
            labelPlacement="outside"
            value={classes}
            onValueChange={(e: string) => {
              setClasses(e);
              if (trySubmit) {
                validateClasses(e);
              }
            }}
            placeholder="Ingresar clases"
            errorMessage="Ingresa clases validas"
            isRequired
            isInvalid={trySubmit && classesError}
            classNames={{
              inputWrapper: 'p-0 px-2',
              errorMessage: 'absolute top-0 left-0',
              input: 'font-extralight',
            }}
          />
        </div>
        <div className="ml-2 flex flex-col gap-1 md:flex-row">
          <Button
            size="sm"
            color="success"
            variant="bordered"
            type="submit"
            isLoading={loading}
            onClick={() => {
              setTrySubmit(true);
              validateBuilding(building);
              validateSchedule(schedule);
              validateMaxOcupation(maxOcupation);
              validateClasses(classes);
            }}
            isDisabled={loading}
            endContent={
              !loading && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              )
            }
          ></Button>
          <Link href="/dashboard/aula">
            <Button
              size="sm"
              color="danger"
              variant="bordered"
              onClick={() => {
                setTrySubmit(false);
                setBuildingError(false);
                setScheduleError(false);
                setMaxOcupationError(false);
                setClassesError(false);
              }}
              endContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              }
            ></Button>
          </Link>
        </div>
      </div>
    </form>
  );
};

export default AddAula;
