import * as xlsx from 'xlsx';

interface Head {
    title: string;
    field: string;
}

interface ExcelData {
    [key: string]: any;
}

export const importExcel = (file: File): Promise<ExcelData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
        try {
            const bstr = event.target?.result;
            const workBook = xlsx.read(bstr, { type: "binary" });
            const workSheetName = workBook.SheetNames[0];
            const workSheet = workBook.Sheets[workSheetName];
            const fileData = xlsx.utils.sheet_to_json(workSheet, { header: 1 }) as any[][];
            const headers = fileData[0] as string[];
            const data = fileData.slice(1).map(row => {
                const rowData: ExcelData = {};
                headers.forEach((header, index) => {
                    rowData[header] = row[index];
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
