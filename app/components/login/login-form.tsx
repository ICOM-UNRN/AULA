'use client';

import { useFormState, useFormStatus } from 'react-dom';

import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import { authenticate } from '@/app/lib/actions';
import { InputComponent as Input } from '@/app/components/login/input';
import { useState } from 'react';

export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const [isVisible, setIsVisible] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [trySubmit, setTrySubmit] = useState(false);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    if (re.test(email)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  return (
    <form
      action={dispatch}
      className=" bg-lightPaper dark:bg-darkPaper w-96 space-y-3 rounded-md text-foreground"
      style={{
        boxShadow:
          'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
      }}
    >
      <div className="flex-1 rounded-md px-6 pb-4 pt-8 ">
        <h1 className="mb-3 text-center text-2xl ">Iniciar sesión</h1>
        <div className="flex flex-col gap-4">
          <Input
            label="Email"
            name="email"
            type="email"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Ingresar email"
            isRequired
            errorMessage="Ingresa un mail valido"
            isInvalid={trySubmit && emailError}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (trySubmit) {
                validateEmail(e.target.value);
              }
            }}
            startContent={
              <div className={emailError ? 'text-danger' : 'text-[#6b7280]'}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="pointer-events-none h-5 w-5 flex-shrink-0 pl-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              </div>
            }
          />
          <Input
            label="Contraseña"
            name="password"
            id="password"
            type={isVisible ? 'text' : 'password'}
            variant="bordered"
            labelPlacement="outside"
            placeholder="Ingresar contraseña"
            isRequired
            minLength={6}
            errorMessage="Debe contener al menos 6 caracteres"
            isInvalid={trySubmit && passwordError}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              if (trySubmit) {
                validatePassword(e.target.value);
              }
            }}
            startContent={
              <div className={passwordError ? 'text-danger' : 'text-[#6b7280]'}>
                <svg
                  id="password"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="pointer-events-none h-5 w-5 flex-shrink-0 pl-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                  />
                </svg>
              </div>
            }
            endContent={
              <button
                className={'mr-2 text-[#6b7280]  focus:outline-none'}
                type="button"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? (
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
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                ) : (
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
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                )}
              </button>
            }
          />
        </div>
        <SubmitButton
          onClick={() => {
            setTrySubmit(true);
            validateEmail(formData.email);
            validatePassword(formData.password);
          }}
        />
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-danger" />
              <p className="text-sm text-danger">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

type SubmitButtonProps = {
  onClick?: () => void;
};

const SubmitButton = ({ onClick }: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      color="primary"
      className="mt-4 w-full rounded-md text-white"
      isLoading={pending}
      type="submit"
      onClick={onClick}
    >
      {!pending && <>Aceptar</>}
    </Button>
  );
};
