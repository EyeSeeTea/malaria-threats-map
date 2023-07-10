export enum MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS {
    ONGOING = "ONGOING",
    PLANNED = "PLANNED",
    COMPLETED_RESULTS_PENDING = "COMPLETED_RESULTS_PENDING",
    UNKNOWN = "UNKNOWN",
}

export const MOLECULAR_MARKERS_MAP = {
    MM_PFK13: 1,
    MM_PFCRT: 2,
    MM_PFMDR1: 3,
    MM_PFPM23: 4,
    MM_PFMDR1_CN: 5,
    MM_PFMDR1_MU: 6,
    MM_PFDHFR: 7,
    MM_PFDHPS: 8,
    MM_PFHRP23: 9,
};

export const MOLECULAR_MARKERS_LABELS = [
    {
        label: "Pfkelch13",
        value: 1,
    },
    {
        label: "Pfcrt",
        value: 2,
    },
    {
        label: "Pfmdr1",
        value: 3,
    },
    {
        label: "Pfplasmepsin 2-3",
        value: 4,
    },
    {
        label: "Pfmdr1 copy number",
        value: 5,
    },
    {
        label: "Pfmdr1 mutation",
        value: 6,
    },
    {
        label: "Pfdhfr",
        value: 7,
    },
    {
        label: "Pfdhps",
        value: 8,
    },
    {
        label: "Pfhrp23",
        value: 9,
    },
];
