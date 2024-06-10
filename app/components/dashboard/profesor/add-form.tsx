'use client';
import { Input } from '@/app/components/form/input';
import { useState } from 'react';
import { createProfesor } from '@/app/lib/actions';
import { toast } from 'sonner';
import {
  useProfesors,
  useTotalProfesorsPages,
  useTotalProfesors,
} from '@/hooks/swr-hooks';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
type CreateUserFormProps = {
  searchParams?: {
    query?: string;
    page?: string;
  };
};
const AddProfesor = ({ searchParams }: CreateUserFormProps) => {
  const query = searchParams?.query;
  const currentPage = Number(searchParams?.page) || 1;
  const { mutateProfesors } = useProfesors(query, currentPage);
  const { totalProfesorsPages, mutateTotalProfesorsPages } =
    useTotalProfesorsPages();
  const { totalProfesors, mutateTotalProfesors } = useTotalProfesors();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [period, setPeriod] = useState('');
  const [dedication, setDedication] = useState('');
  const [condition, setCondition] = useState('');
  const [category, setCategory] = useState('');

  const [trySubmit, setTrySubmit] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [dniError, setDniError] = useState(false);
  const [periodError, setPeriodError] = useState(false);
  const [dedicationError, setDedicationError] = useState(false);
  const [conditionError, setConditionError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);

  const validateName = (name: string) => {
    const re = /^[A-Za-z\s]+$/;
    if (re.test(name) && name.trim().length > 0) {
      setNameError(false);
    } else {
      setNameError(true);
    }
  };
  const validateLastName = (last_name: string) => {
    const re = /^[A-Za-z\s]+$/;
    if (re.test(last_name) && last_name.trim().length > 0) {
      setLastNameError(false);
    } else {
      setLastNameError(true);
    }
  };
  const validateDni = (dni: string) => {
    const re = /^\d{7,8}$/;
    if (re.test(dni)) {
      setDniError(false);
    } else {
      setDniError(true);
    }
  };
  const validatePeriod = (period: string) => {
    const re = /^[A-Za-z\s]+$/;
    if (re.test(period) && period.trim().length > 0) {
      setPeriodError(false);
    } else {
      setPeriodError(true);
    }
  };
  const validateCondition = (condition: string) => {
    const re = /^[A-Za-z\s]+$/;
    if (re.test(condition) && condition.trim().length > 0) {
      setConditionError(false);
    } else {
      setConditionError(true);
    }
  };
  const validateCategory = (category: string) => {
    const re = /^[A-Za-z\s]+$/;
    if (re.test(category) && category.trim().length > 0) {
      setCategoryError(false);
    } else {
      setCategoryError(true);
    }
  };
  const validateDedication = (dedication: string) => {
    const re = /^[A-Za-z\s]+$/;
    if (re.test(dedication) && dedication.trim().length > 0) {
      setDedicationError(false);
    } else {
      setDedicationError(true);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    toast.promise(
      createProfesor(formData)
        .then(() => {
          if (
            query?.includes(name) ||
            query?.includes(lastName) ||
            query?.includes(dni) ||
            query?.includes(period) ||
            query?.includes(dedication) ||
            query?.includes(condition) ||
            query?.includes(category) ||
            !query
          ) {
            mutateProfesors();
          }
          mutateTotalProfesors(totalProfesors + 1, false);
          if (
            ((query?.includes(name) ||
              query?.includes(lastName) ||
              query?.includes(dni) ||
              query?.includes(period) ||
              query?.includes(dedication) ||
              query?.includes(condition) ||
              query?.includes(category)) &&
              totalProfesors % 6 === 0) ||
            (query == undefined && totalProfesors % 6 === 0)
          ) {
            mutateTotalProfesorsPages(totalProfesorsPages + 1, false);
          }
          setLoading(false);
          setTrySubmit(false);
          setName('');
          setLastName('');
          setDni('');
          setPeriod('');
          setDedication('');
          setCondition('');
          setCategory('');
        })
        .catch((error: string) => {
          console.error(error);
          setLoading(false);
        }),
      {
        loading: 'Creando...',
        success: 'Profesor creado con éxito',
        error: 'Error al crear el profesor',
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
            label="Nombre"
            name="nombre"
            type="text"
            variant="bordered"
            labelPlacement="outside"
            value={name}
            onValueChange={(e: string) => {
              setName(e);
              if (trySubmit) {
                validateName(e);
              }
            }}
            placeholder="Ingresar nombre"
            errorMessage="Ingresa un nombre valido"
            isRequired
            isInvalid={trySubmit && nameError}
            classNames={{
              inputWrapper: 'p-0',
              errorMessage: 'absolute top-0 left-0',
              input: 'font-extralight',
            }}
          />
          <Input
            label="Apellido"
            name="apellido"
            type="text"
            variant="bordered"
            labelPlacement="outside"
            value={lastName}
            onValueChange={(e) => {
              setLastName(e);
              if (trySubmit) {
                validateLastName(e);
              }
            }}
            placeholder="Ingresar apellido"
            errorMessage="Ingrese un apellido valido"
            isRequired
            isInvalid={trySubmit && lastNameError}
            classNames={{
              inputWrapper: 'p-0',
              errorMessage: 'absolute top-0 left-0',
              input: 'font-extralight',
            }}
          />
          <Input
            label="DNI"
            name="documento"
            type="number"
            variant="bordered"
            labelPlacement="outside"
            value={dni}
            onValueChange={(e) => {
              setDni(e);
              if (trySubmit) {
                validateDni(e);
              }
            }}
            placeholder="Ingresar DNI"
            errorMessage="Ingrese un DNI valido"
            isRequired
            isInvalid={trySubmit && dniError}
            classNames={{
              inputWrapper: 'p-0',
              errorMessage: 'absolute top-0 left-0',
              input: 'font-extralight',
            }}
          />
          <Input
            label="Periodo a cargo"
            name="periodo_a_cargo"
            type="string"
            variant="bordered"
            labelPlacement="outside"
            value={period}
            onValueChange={(e: string) => {
              setPeriod(e);
              if (trySubmit) {
                validatePeriod(e);
              }
            }}
            placeholder="Ingresar periodo"
            errorMessage="Ingresa un periodo valido"
            isRequired
            isInvalid={trySubmit && periodError}
            classNames={{
              inputWrapper: 'p-0 px-2',
              errorMessage: 'absolute top-0 left-0',
              input: 'font-extralight',
            }}
          />
        </div>
        <div className="flex w-full flex-row justify-between gap-2">
          <Input
            label="Condición"
            name="condicion"
            type="string"
            variant="bordered"
            labelPlacement="outside"
            value={condition}
            onValueChange={(e: string) => {
              setCondition(e);
              if (trySubmit) {
                validateCondition(e);
              }
            }}
            placeholder="Ingresar condicion"
            errorMessage="Ingresa una condición valida"
            isRequired
            isInvalid={trySubmit && conditionError}
            classNames={{
              inputWrapper: 'p-0 px-2',
              errorMessage: 'absolute top-0 left-0',
              input: 'font-extralight',
            }}
          />
          <Input
            label="Categoria"
            name="categoria"
            type="string"
            variant="bordered"
            labelPlacement="outside"
            value={category}
            onValueChange={(e: string) => {
              setCategory(e);
              if (trySubmit) {
                validateCategory(e);
              }
            }}
            placeholder="Ingresar categoria"
            errorMessage="Ingresa una categoria valida"
            isRequired
            isInvalid={trySubmit && categoryError}
            classNames={{
              inputWrapper: 'p-0 px-2',
              errorMessage: 'absolute top-0 left-0',
              input: 'font-extralight',
            }}
          />
          <Input
            label="Dedicación"
            name="dedicacion"
            type="string"
            variant="bordered"
            labelPlacement="outside"
            value={dedication}
            onValueChange={(e: string) => {
              setDedication(e);
              if (trySubmit) {
                validateDedication(e);
              }
            }}
            placeholder="Ingresar dedicación"
            errorMessage="Ingresa una dedicación valida"
            isRequired
            isInvalid={trySubmit && dedicationError}
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
              validateName(name);
              validateLastName(lastName);
              validateDni(dni);
              validatePeriod(period);
              validateCondition(condition);
              validateCategory(category);
              validateDedication(dedication);
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
          <Link href="/dashboard/profesor">
            <Button
              size="sm"
              color="danger"
              variant="bordered"
              onClick={() => {
                setTrySubmit(false);
                setNameError(false);
                setLastNameError(false);
                setDniError(false);
                setPeriodError(false);
                setDedicationError(false);
                setConditionError(false);
                setCategoryError(false);
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

export default AddProfesor;
