'use client';
import { Button, Spinner } from '@nextui-org/react';
import { Input } from '@/app/components/form/input';
import { useEffect, useState } from 'react';
import { updateProfesor } from '@/app/lib/actions';
import { toast } from 'sonner';
import { useProfesorById } from '@/hooks/swr-hooks';
import { usePathname } from 'next/navigation';

export const EditProfesor = () => {
  const pathname = usePathname();
  const id = pathname.split('/').pop() ?? '';
  const { profesor, isLoading, mutateProfesor } = useProfesorById(id);
  const [loading, setLoading] = useState(false);
  const [onEdit, setOnEdit] = useState(false);

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

  const [changes, setChanges] = useState(false);

  useEffect(() => {
    setName(profesor?.nombre);
    setLastName(profesor?.apellido);
    setDni(profesor?.documento);
    setPeriod(profesor?.periodo_a_cargo);
    setDedication(profesor?.dedicacion);
    setCondition(profesor?.condicion);
    setCategory(profesor?.categoria);
  }, [profesor]);

  useEffect(() => {
    if (
      name != profesor?.nombre ||
      lastName != profesor?.apellido ||
      dni != profesor?.documento?.toString() ||
      period != profesor?.periodo_a_cargo ||
      dedication != profesor?.dedicacion ||
      condition != profesor?.condicion ||
      category != profesor?.categoria
    ) {
      setChanges(true);
    } else {
      setChanges(false);
    }
  }, [name, lastName, dni, period, dedication, condition, category, profesor]);

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
      updateProfesor(profesor.id, formData)
        .then(() => {
          mutateProfesor();
          setLoading(false);
          setTrySubmit(false);
          setOnEdit(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          setTrySubmit(false);
          setOnEdit(false);
        }),
      {
        loading: 'Editando...',
        success: 'Profesor editado con exito',
        error: 'Error',
      },
    );
  };

  if (isLoading)
    return (
      <div className="flex w-full justify-center p-5">
        <Spinner color="primary" />
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="relative p-5">
      <div className=" flex flex-col items-center justify-evenly gap-5">
        <div className="flex w-full flex-row justify-between gap-2">
          <Input
            label="Nombre"
            name="nombre"
            type="text"
            variant="bordered"
            labelPlacement="outside"
            value={!onEdit ? profesor.nombre : name}
            onValueChange={(e: string) => {
              setName(e);
              if (trySubmit) {
                validateName(e);
              }
            }}
            placeholder="Ingresar nombre"
            errorMessage="Ingresa un nombre valido"
            isReadOnly={!onEdit}
            isRequired={onEdit}
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
            value={!onEdit ? profesor.apellido : lastName}
            onValueChange={(e) => {
              setLastName(e);
              if (trySubmit) {
                validateLastName(e);
              }
            }}
            placeholder="Ingresar apellido"
            errorMessage="Ingrese un apellido valido"
            isReadOnly={!onEdit}
            isRequired={onEdit}
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
            value={!onEdit ? profesor.documento : dni}
            onValueChange={(e) => {
              setDni(e);
              if (trySubmit) {
                validateDni(e);
              }
            }}
            placeholder="Ingresar DNI"
            errorMessage="Ingrese un DNI valido"
            isReadOnly={!onEdit}
            isRequired={onEdit}
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
            value={!onEdit ? profesor.periodo_a_cargo : period}
            onValueChange={(e: string) => {
              setPeriod(e);
              if (trySubmit) {
                validatePeriod(e);
              }
            }}
            placeholder="Ingresar periodo"
            errorMessage="Ingresa un periodo valido"
            isReadOnly={!onEdit}
            isRequired={onEdit}
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
            value={!onEdit ? profesor.condicion : condition}
            onValueChange={(e: string) => {
              setCondition(e);
              if (trySubmit) {
                validateCondition(e);
              }
            }}
            placeholder="Ingresar condicion"
            errorMessage="Ingresa una condición valida"
            isReadOnly={!onEdit}
            isRequired={onEdit}
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
            value={!onEdit ? profesor.categoria : category}
            onValueChange={(e: string) => {
              setCategory(e);
              if (trySubmit) {
                validateCategory(e);
              }
            }}
            placeholder="Ingresar categoria"
            errorMessage="Ingresa una categoria valida"
            isReadOnly={!onEdit}
            isRequired={onEdit}
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
            value={!onEdit ? profesor.dedicacion : dedication}
            onValueChange={(e: string) => {
              setDedication(e);
              if (trySubmit) {
                validateDedication(e);
              }
            }}
            placeholder="Ingresar dedicación"
            errorMessage="Ingresa una dedicación valida"
            isReadOnly={!onEdit}
            isRequired={onEdit}
            isInvalid={trySubmit && dedicationError}
            classNames={{
              inputWrapper: 'p-0 px-2',
              errorMessage: 'absolute top-0 left-0',
              input: 'font-extralight',
            }}
          />
        </div>
        {onEdit ? (
          <>
            <div className="flex gap-2">
              <Button
                size="sm"
                color="success"
                variant="bordered"
                type="submit"
                isLoading={loading}
                isDisabled={!changes}
                onClick={() => {
                  setTrySubmit(true);
                  validateName(name);
                  validateLastName(lastName);
                  validateDni(dni);
                  validatePeriod(period);
                  validateCondition(condition);
                  validateCategory(category);
                }}
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
              >
                Guardar
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="bordered"
                onClick={() => {
                  setOnEdit(false);
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
              >
                Cancelar
              </Button>
            </div>
            <p className="absolute bottom-0 text-xs text-danger">
              {!changes && <>No hay cambios</>}
            </p>
          </>
        ) : (
          <Button
            size="sm"
            color="primary"
            className="text-white hover:bg-primary-600"
            onClick={() => setOnEdit(true)}
            endContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            }
          >
            Editar
          </Button>
        )}
      </div>
    </form>
  );
};
