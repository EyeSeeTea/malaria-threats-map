import { HeadCell } from "../types";

export interface Data {
    ID: string;
    ISO2: string;
    COUNTRY: string;
    COUNTRY_NUMBER: number;
    SPECIES: string;
    INSECTICIDE_CLASSES: string;
    PYRETHROIDS_AVERAGE_MORTALITY: number | "-";
    PYRETHROIDS_LAST_YEAR: string;
    ORGANOCHLORINES_AVERAGE_MORTALITY: number | "-";
    ORGANOCHLORINES_LAST_YEAR: string;
    CARBAMATES_AVERAGE_MORTALITY: number | "-";
    CARBAMATES_LAST_YEAR: string;
    ORGANOPHOSPHATES_AVERAGE_MORTALITY: number | "-";
    ORGANOPHOSPHATES_LAST_YEAR: string;
    MONOXYGENASES_PERCENT_SITES_DETECTED: number | "-";
    MONOXYGENASES_PERCENT_SITES_DETECTED_NUMBER_SITES: number;
    ESTERASES_PERCENT_SITES_DETECTED: number | "-";
    ESTERASES_PERCENT_SITES_DETECTED_NUMBER_SITES: number;
    GSTS_PERCENT_SITES_DETECTED: number | "-";
    GSTS_PERCENT_SITES_DETECTED_NUMBER_SITES: number;
    K1014S_PERCENT_SITES_DETECTED: number | "-";
    K1014S_PERCENT_SITES_DETECTED_NUMBER_SITES: number;
    K1014F_PERCENT_SITES_DETECTED: number | "-";
    K1014F_PERCENT_SITES_DETECTED_NUMBER_SITES: number;
    KDR_UNSPECIFIED_PERCENT_SITES_DETECTED: number | "-";
    KDR_UNSPECIFIED_PERCENT_SITES_DETECTED_NUMBER_SITES: number;
    ACE1R_PERCENT_SITES_DETECTED: number | "-";
    ACE1R_PERCENT_SITES_DETECTED_NUMBER_SITES: number;
}

export const ERROR_COLUMNS = [
    "PYRETHROIDS_AVERAGE_MORTALITY",
    "ORGANOCHLORINES_AVERAGE_MORTALITY",
    "CARBAMATES_AVERAGE_MORTALITY",
    "ORGANOPHOSPHATES_AVERAGE_MORTALITY",
];

export const GREY_COLUMNS = [
    "MONOXYGENASES_PERCENT_SITES_DETECTED",
    "ESTERASES_PERCENT_SITES_DETECTED",
    "GSTS_PERCENT_SITES_DETECTED",
    "K1014S_PERCENT_SITES_DETECTED",
    "K1014F_PERCENT_SITES_DETECTED",
    "KDR_UNSPECIFIED_PERCENT_SITES_DETECTED",
    "ACE1R_PERCENT_SITES_DETECTED",
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
    "MONOXYGENASES_PERCENT_SITES_DETECTED_NUMBER_SITES",
    "ESTERASES_PERCENT_SITES_DETECTED_NUMBER_SITES",
    "GSTS_PERCENT_SITES_DETECTED_NUMBER_SITES",
    "K1014S_PERCENT_SITES_DETECTED_NUMBER_SITES",
    "K1014F_PERCENT_SITES_DETECTED_NUMBER_SITES",
    "KDR_UNSPECIFIED_PERCENT_SITES_DETECTED_NUMBER_SITES",
    "ACE1R_PERCENT_SITES_DETECTED_NUMBER_SITES",
];

export const headCells: HeadCell<Data>[] = [
    {
        id: "COUNTRY",
        numeric: false,
        disablePadding: false,
        label: "report.prevention.country",
    },
    {
        id: "INSECTICIDE_CLASSES",
        numeric: false,
        disablePadding: false,
        label: "report.prevention.insecticide",
        align: "center",
        divider: true,
    },
    {
        id: "SPECIES",
        numeric: false,
        disablePadding: false,
        label: "report.prevention.species",
        divider: true,
    },
    {
        id: "PYRETHROIDS_AVERAGE_MORTALITY",
        numeric: true,
        disablePadding: false,
        label: "report.prevention.resistance_percentage",
        sortable: true,
        align: "right",
        divider: true,
    },
    {
        id: "PYRETHROIDS_LAST_YEAR",
        numeric: false,
        disablePadding: false,
        label: "report.prevention.resistance_year",
        sortable: true,
        align: "right",
    },
    {
        id: "ORGANOCHLORINES_AVERAGE_MORTALITY",
        numeric: true,
        disablePadding: false,
        label: "report.prevention.resistance_percentage",
        sortable: true,
        align: "right",
        divider: true,
    },
    {
        id: "ORGANOCHLORINES_LAST_YEAR",
        numeric: false,
        disablePadding: false,
        label: "report.prevention.resistance_year",
        sortable: true,
        align: "right",
    },
    {
        id: "CARBAMATES_AVERAGE_MORTALITY",
        numeric: true,
        disablePadding: false,
        label: "report.prevention.resistance_percentage",
        sortable: true,
        align: "right",
        divider: true,
    },
    {
        id: "CARBAMATES_LAST_YEAR",
        numeric: false,
        disablePadding: false,
        label: "report.prevention.resistance_year",
        sortable: true,
        align: "right",
    },
    {
        id: "ORGANOPHOSPHATES_AVERAGE_MORTALITY",
        numeric: true,
        disablePadding: false,
        label: "report.prevention.resistance_percentage",
        sortable: true,
        align: "right",
        divider: true,
    },
    {
        id: "ORGANOPHOSPHATES_LAST_YEAR",
        numeric: false,
        disablePadding: false,
        label: "report.prevention.resistance_year",
        sortable: true,
        align: "right",
    },
    {
        id: "MONOXYGENASES_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "report.prevention.mechanism_percentage",
        align: "right",
        divider: true,
    },
    {
        id: "ESTERASES_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "report.prevention.mechanism_percentage",
        align: "right",
    },
    {
        id: "GSTS_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "report.prevention.mechanism_percentage",
        align: "right",
    },
    {
        id: "K1014S_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "report.prevention.mechanism_percentage",
        align: "right",
    },
    {
        id: "K1014F_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "report.prevention.mechanism_percentage",
        align: "right",
    },
    {
        id: "KDR_UNSPECIFIED_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "report.prevention.mechanism_percentage",
        align: "right",
    },
    {
        id: "ACE1R_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "report.prevention.mechanism_percentage",
        align: "right",
    },
];
