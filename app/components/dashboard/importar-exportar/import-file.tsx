'use client';

import { Button } from '@nextui-org/react';
import { useState } from 'react';

export default function ImportFile() {
  const [file, setFile] = useState<File>();

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    try {
      alert(`Importando archivo "${file.name}"...`);
      // const funcionConExcel(file)
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form
      className="flex flex-col items-center justify-center gap-5"
      onSubmit={onSubmit}
    >
      <input
        type="file"
        accept=".xls, .xlsx, .csv"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            setFile(file);
          }
        }}
      />
      <div className="flex gap-3">
        <Button
          type="submit"
          size="lg"
          color="primary"
          className="w-60"
          disabled={!file}
        >
          Importar
        </Button>
        <Button size="lg" color="primary" className="w-60">
          Exportar
        </Button>
      </div>
    </form>
  );
}
