import React from 'react';
import { Input, InputProps } from '@nextui-org/react';

export const InputComponent: React.FC<InputProps> = (props) => {
  return (
    <Input
      {...props}
      classNames={{
        inputWrapper: 'p-0 border-stone-400  dark:border-stone-700 rounded-md',
        errorMessage: 'absolute top-0 left-0',
        input: 'font-extralight',
      }}
    />
  );
};

export { Input };
