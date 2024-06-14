import { read, utils } from 'xlsx';
import { sql } from '@vercel/postgres';

interface ExcelData {
    [key: string]: any;
}

export const importExcel = async (file: File): Promise<ExcelData> => {
  try {
    const data = await convertToJson(file);

    // Distribuir los datos a la base de datos
    if (data || Array.isArray(data)) {
      // Prueba con un solo profesor
      const row1 = data[0]
      console.log(row1)
      console.log(row1.DNI_Docente)
      console.log(row1.Nombre_Docente)
      console.log(row1.Apellido_Docente)
      console.log(row1.Condicion)
      console.log(row1.Categoria)
      console.log(row1.Dedicacion)
      console.log(row1.Periodo_A_Cargo)
      const result = await sql`
        SELECT public.insert_profesor(
          ${row1.DNI_Docente},
          ${row1.Nombre_Docente},
          ${row1.Apellido_Docente},
          ${row1.Condicion},
          ${row1.Categoria},
          ${row1.Dedicacion},
          ${row1.Periodo_A_Cargo},
        ) as result;
      `;
      if (result.rows[0].result === 1) {
        return Promise.reject({ message: 'El profesor ya existe.' });
      } else if (result.rows[0].result === 2) {
        return Promise.reject({ message: 'El profesor no existe.' });
      } else {
        return Promise.resolve({message: 'Profesores cargados con exito'});
      }
      // for (const row of data) {
      // }
    }

    return data;
  } catch (error) {
    console.error('Error importing Excel:', error);
    throw error;
  }
};

export const convertToJson = (file: File): Promise<ExcelData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
        try {
            const bstr = event.target?.result;
            const workBook = read(bstr, { type: "binary" });
            const workSheetName = workBook.SheetNames[0];
            const workSheet = workBook.Sheets[workSheetName];
            const fileData = utils.sheet_to_json(workSheet, { header: 1 }) as any[][];
            const headers = fileData[0] as string[];
            const data = fileData.slice(1).map(row => {
                const rowData: ExcelData = {};
                headers.forEach((header, index) => {
                    rowData[header.normalize('NFD').replace(/ /g, "_").replace(/[\u0300-\u036f]/g, '')] = row[index];
                });
            return rowData;
        });
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsBinaryString(file);
  });
};
