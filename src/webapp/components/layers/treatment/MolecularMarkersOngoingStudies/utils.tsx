export enum MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS {
    ONGOING = "ONGOING",
    PLANNED = "PLANNED",
    COMPLETED = "COMPLETED",
    UNKNOWN = "UNKNOWN",
}

export type MM_PFK13 = 1;
export type MM_PFCRT = 2;
export type MM_PFMDR1 = 3;
export type MM_PFPM23 = 4;
export type MM_PFMDR1_CN = 5;
export type MM_PFMDR1_MU = 6;
export type MM_PFDHFR = 7;
export type MM_PFDHPS = 8;
export type MM_PFHRP23 = 9;

export type MolecularMarker =
    | MM_PFK13
    | MM_PFCRT
    | MM_PFMDR1
    | MM_PFPM23
    | MM_PFMDR1_CN
    | MM_PFMDR1_MU
    | MM_PFDHFR
    | MM_PFDHPS
    | MM_PFHRP23;

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

export type MolecularMarkersLabel = {
    key: string;
    label: string;
    value: MolecularMarker;
};

export const MOLECULAR_MARKERS_LABELS: MolecularMarkersLabel[] = [
    {
        key: "MM_PFK13",
        label: "Pfkelch13",
        value: 1,
    },
    {
        key: "MM_PFCRT",
        label: "Pfcrt K76T",
        value: 2,
    },
    {
        key: "MM_PFMDR1",
        label: "Pfmdr1 amplifications",
        value: 3,
    },
    {
        key: "MM_PFPM23",
        label: "Pfplasmepsin 2-3 amplifications",
        value: 4,
    },
    {
        key: "MM_PFMDR1_CN",
        label: "Pfmdr1 copy number",
        value: 5,
    },
    {
        key: "MM_PFMDR1_MU",
        label: "Pfmdr1 mutation",
        value: 6,
    },
    {
        key: "MM_PFDHFR",
        label: "Pfdhfr",
        value: 7,
    },
    {
        key: "MM_PFDHPS",
        label: "Pfdhps",
        value: 8,
    },
    {
        key: "MM_PFHRP23",
        label: "Pfhrp23",
        value: 9,
    },
];

export const getMolecularMarkersOngoingStudiesStatusFromStatusId = (statusId: number) => {
    const statusOptions: Record<string, number> = {
        [MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.PLANNED]: 1,
        [MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.ONGOING]: 2,
        [MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.COMPLETED]: 3,
    };

    if (statusOptions[MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.PLANNED] === statusId) {
        return MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.PLANNED;
    }

    if (statusOptions[MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.ONGOING] === statusId) {
        return MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.ONGOING;
    }

    if (statusOptions[MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.COMPLETED] === statusId) {
        return MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.COMPLETED;
    }

    return MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.UNKNOWN;
};
