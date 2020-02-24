import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

const fileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

export const exportToCSV = (
  studies: any[],
  csvData: any[],
  fileName: string
) => {
  const primary = XLSX.utils.json_to_sheet(studies);
  const molecular = XLSX.utils.json_to_sheet([]);
  const wb = {
    Sheets: { K13: primary, Molecular: molecular },
    SheetNames: ["K13", "Molecular"]
  };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};
