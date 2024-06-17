import { read, utils } from 'xlsx';
import { sql } from '@vercel/postgres';
import { createProfesor } from '@/app/lib/actions';

interface ExcelData {
    [key: string]: any;
}

export const importExcel = async (file: File): Promise<ExcelData> => {
  try {
    const data = await convertToJson(file);
    // Distribuir los datos a la base de datos
    if (data || Array.isArray(data)) {
      // Prueba con un solo profesor
      for (const row of data) {
        console.log(row)
        // Cargar el profesor
        const formData_profesor = new FormData();
        formData_profesor.append('DNI_Docente', row.DNI_Docente);
        formData_profesor.append('Nombre_Docente', row.Nombre_Docente);
        formData_profesor.append('Apellido_Docente', row.Apellido_Docente);
        formData_profesor.append('Condicion', row.Condicion);
        formData_profesor.append('Categoria', row.Categoria);
        formData_profesor.append('Dedicacion', row.Dedicacion);
        formData_profesor.append('Periodo_A_Cargo', row.Periodo_A_Cargo);
        const result_profesor = await createProfesor(formData_profesor);
        console.log(result_profesor);
        // const result_profesor = await sql`
        //   SELECT public.insert_profesor(
        //     ${row.DNI_Docente},
        //     ${row.Nombre_Docente},
        //     ${row.Apellido_Docente},
        //     ${row.Condicion},
        //     ${row.Categoria},
        //     ${row.Dedicacion},
        //     ${row.Periodo_A_Cargo}
        //   ) as result_profesor;
        // `;
        //Cargar materia
        // const result_materia = await sql`
        //   SELECT public.insert_materia(
        //     ${row.Codigo_Guarani},
        //     ${row.Carrera},
        //     ${row.Materia},
        //     ${row.Ano},
        //     ${row.Cuatrimestre},
        //     ${row.Taxonomia},
        //     ${row.Horas_Semanales},
        //     ${row.Comisiones}
        //   ) as result_materia;
        // `;
      }
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
