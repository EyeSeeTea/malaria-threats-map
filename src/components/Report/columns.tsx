export interface Data {
  ID: string;
  ISO2: string;
  COUNTRY: string;
  COUNTRY_NUMBER: number;
  SPECIES: string;
  INSECTICIDE_CLASSES: string;
  PYRETHROIDS_PERCENTAGE: number | "-";
  PYRETHROIDS_YEARS: string;
  ORGANOCHLORINES_PERCENTAGE: number | "-";
  ORGANOCHLORINES_YEARS: string;
  CARBAMATES_PERCENTAGE: number | "-";
  CARBAMATES_YEARS: string;
  ORGANOPHOSPHATES_PERCENTAGE: number | "-";
  ORGANOPHOSPHATES_YEARS: string;
  MONOOXYGENASES: number | "-";
  MONOOXYGENASES_NUMBER: number;
  ESTERASES: number | "-";
  ESTERASES_NUMBER: number;
  GSTS: number | "-";
  GSTS_NUMBER: number;
  K1014S: number | "-";
  K1014S_NUMBER: number;
  K1014F: number | "-";
  K1014F_NUMBER: number;
  KDR_UNSPECIFIED: number | "-";
  KDR_UNSPECIFIED_NUMBER: number;
  ACE1R: number | "-";
  ACE1R_NUMBER: number;
}

export const ERROR_COLUMNS = [
  "PYRETHROIDS_PERCENTAGE",
  "ORGANOCHLORINES_PERCENTAGE",
  "CARBAMATES_PERCENTAGE",
  "ORGANOPHOSPHATES_PERCENTAGE"
];

export const GREY_COLUMNS = [
  "MONOOXYGENASES",
  "ESTERASES",
  "GSTS",
  "K1014S",
  "K1014F",
  "KDR_UNSPECIFIED",
  "ACE1R"
];

export const COLUMNS = [
  "ID",
  "INSECTICIDE_CLASSES",
  "COUNTRY",
  "COUNTRY_NUMBER",
  "ISO2",
  "PYRETHROIDS_N",
  "ORGANOCHLORINES_N",
  "CARBAMATES_N",
  "ORGANOPHOSPHATES_N",
  "MONOOXYGENASES_NUMBER",
  "ESTERASES_NUMBER",
  "GSTS_NUMBER",
  "K1014S_NUMBER",
  "K1014F_NUMBER",
  "KDR_UNSPECIFIED_NUMBER",
  "ACE1R_NUMBER"
];

export interface HeadCell {
  id: keyof Data;
  numeric: boolean;
  disablePadding: boolean;
  label: string;
  sortable?: boolean;
  align?: "right" | "left";
  divider?: boolean;
}

export const headCells: HeadCell[] = [
  {
    id: "COUNTRY",
    numeric: false,
    disablePadding: false,
    label: "Country"
  },
  {
    id: "SPECIES",
    numeric: false,
    disablePadding: false,
    label: "Vector species"
  },
  {
    id: "PYRETHROIDS_PERCENTAGE",
    numeric: true,
    disablePadding: false,
    label: "% sites exhibiting resistance (n*)",
    sortable: true,
    align: "right",
    divider: true
  },
  {
    id: "PYRETHROIDS_YEARS",
    numeric: false,
    disablePadding: false,
    label: "Year of last reports",
    sortable: true,
    align: "right"
  },
  {
    id: "ORGANOCHLORINES_PERCENTAGE",
    numeric: true,
    disablePadding: false,
    label: "% sites exhibiting resistance (n*)",
    sortable: true,
    align: "right"
  },
  {
    id: "ORGANOCHLORINES_YEARS",
    numeric: false,
    disablePadding: false,
    label: "Year of last reports",
    sortable: true,
    align: "right"
  },
  {
    id: "CARBAMATES_PERCENTAGE",
    numeric: true,
    disablePadding: false,
    label: "% sites exhibiting resistance (n*)",
    sortable: true,
    align: "right"
  },
  {
    id: "CARBAMATES_YEARS",
    numeric: false,
    disablePadding: false,
    label: "Year of last reports",
    sortable: true,
    align: "right"
  },
  {
    id: "ORGANOPHOSPHATES_PERCENTAGE",
    numeric: true,
    disablePadding: false,
    label: "% sites exhibiting resistance (n*)",
    sortable: true,
    align: "right"
  },
  {
    id: "ORGANOPHOSPHATES_YEARS",
    numeric: false,
    disablePadding: false,
    label: "Year of last reports",
    sortable: true,
    align: "right"
  },
  {
    id: "MONOOXYGENASES",
    numeric: true,
    disablePadding: false,
    label: "Mono oxygenases",
    align: "right",
    divider: true
  },
  {
    id: "ESTERASES",
    numeric: true,
    disablePadding: false,
    label: "Esterases",
    align: "right"
  },
  {
    id: "GSTS",
    numeric: true,
    disablePadding: false,
    label: "GSTs",
    align: "right"
  },
  {
    id: "K1014S",
    numeric: true,
    disablePadding: false,
    label: "kdr (K1014S)",
    align: "right"
  },
  {
    id: "K1014F",
    numeric: true,
    disablePadding: false,
    label: "kdr (K1014F)",
    align: "right"
  },
  {
    id: "KDR_UNSPECIFIED",
    numeric: true,
    disablePadding: false,
    label: "kdr (unspecified mutation)",
    align: "right"
  },
  {
    id: "ACE1R",
    numeric: true,
    disablePadding: false,
    label: "Ace-1R",
    align: "right"
  }
];
