import { HeadCell } from "../types";

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

export const headCells: HeadCell<Data>[] = [
    {
        id: "COUNTRY",
        numeric: false,
        disablePadding: false,
        label: "common.report.treatment.country",
    },
    {
        id: "DRUG",
        numeric: false,
        disablePadding: false,
        divider: true,
        label: "common.report.treatment.drug",
    },
    {
        id: "FOLLOW_UP",
        numeric: true,
        disablePadding: false,
        label: "common.report.treatment.follow",
        sortable: true,
        align: "right",
        divider: true,
        decimalPositions: 0,
    },
    {
        id: "STUDY_YEARS",
        numeric: false,
        disablePadding: false,
        label: "common.report.treatment.period",
        sortable: true,
        align: "right",
        divider: true,
    },
    {
        id: "NUMBER_OF_STUDIES",
        numeric: true,
        disablePadding: false,
        label: "common.report.treatment.studies",
        sortable: true,
        align: "right",
        divider: true,
        decimalPositions: 0,
    },
    {
        id: "MEDIAN",
        numeric: true,
        disablePadding: false,
        label: "common.report.treatment.median",
        sortable: true,
        align: "right",
        divider: true,
        decimalPositions: 2,
    },
    {
        id: "MIN",
        numeric: true,
        disablePadding: false,
        label: "Min",
        sortable: true,
        align: "right",
        divider: true,
        decimalPositions: 2,
    },
    {
        id: "MAX",
        numeric: true,
        disablePadding: false,
        label: "Max",
        sortable: true,
        align: "right",
        divider: true,
        decimalPositions: 2,
    },
    {
        id: "PERCENTILE_25",
        numeric: true,
        disablePadding: false,
        label: "common.report.treatment.percentile_25",
        sortable: true,
        align: "right",
        divider: true,
        decimalPositions: 2,
    },
    {
        id: "PERCENTILE_75",
        numeric: true,
        disablePadding: false,
        label: "common.report.treatment.percentile_75",
        sortable: true,
        align: "right",
        divider: true,
        decimalPositions: 2,
    },
];
