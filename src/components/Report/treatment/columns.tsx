type NumberOrHyphen = number | string;

export interface Data {
  ID: string;
  ISO2: string;
  COUNTRY: string;
  COUNTRY_NUMBER: number;
  DRUG: string;
  FOLLOW_UP: NumberOrHyphen;
  STUDY_YEARS: string;
  NUMBER_OF_STUDIES: NumberOrHyphen;
  MEDIAN: NumberOrHyphen;
  MIN: NumberOrHyphen;
  MAX: NumberOrHyphen;
  PERCENTILE_25: NumberOrHyphen;
  PERCENTILE_75: NumberOrHyphen;
}

export interface HeadCell {
  id: keyof Data;
  numeric: boolean;
  disablePadding: boolean;
  label: string;
  sortable?: boolean;
  align?: "right" | "left";
  divider?: boolean;
  decimalPositions?: number;
}

export const headCells: HeadCell[] = [
  {
    id: "COUNTRY",
    numeric: false,
    disablePadding: false,
    label: "Country"
  },
  {
    id: "DRUG",
    numeric: false,
    disablePadding: false,
    divider: true,
    label: "Drug"
  },
  {
    id: "FOLLOW_UP",
    numeric: true,
    disablePadding: false,
    label: "Follow Up (days)",
    sortable: true,
    align: "right",
    divider: true,
    decimalPositions: 0
  },
  {
    id: "STUDY_YEARS",
    numeric: false,
    disablePadding: false,
    label: "Study years",
    sortable: true,
    align: "right",
    divider: true
  },
  {
    id: "NUMBER_OF_STUDIES",
    numeric: true,
    disablePadding: false,
    label: "Number of studies",
    sortable: true,
    align: "right",
    divider: true,
    decimalPositions: 0
  },
  {
    id: "MEDIAN",
    numeric: true,
    disablePadding: false,
    label: "Median",
    sortable: true,
    align: "right",
    divider: true,
    decimalPositions: 3
  },
  {
    id: "MIN",
    numeric: true,
    disablePadding: false,
    label: "Min",
    sortable: true,
    align: "right",
    divider: true,
    decimalPositions: 3
  },
  {
    id: "MAX",
    numeric: true,
    disablePadding: false,
    label: "Max",
    sortable: true,
    align: "right",
    divider: true,
    decimalPositions: 3
  },
  {
    id: "PERCENTILE_25",
    numeric: true,
    disablePadding: false,
    label: "Percentile 25th",
    sortable: true,
    align: "right",
    divider: true,
    decimalPositions: 3
  },
  {
    id: "PERCENTILE_75",
    numeric: true,
    disablePadding: false,
    label: "Percentile 75th",
    sortable: true,
    align: "right",
    divider: true,
    decimalPositions: 3
  }
];
