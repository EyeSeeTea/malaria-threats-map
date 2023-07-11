export enum MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS {
    ONGOING = "ONGOING",
    PLANNED = "PLANNED",
    COMPLETED_RESULTS_PENDING = "COMPLETED_RESULTS_PENDING",
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

type MolecularMarkersLabel = {
    label: string;
    value: MolecularMarker;
};

export const MOLECULAR_MARKERS_LABELS: MolecularMarkersLabel[] = [
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

export const getMolecularMarkersOngoingStudiesStatusFromStatusId = (statusId: number) => {
    const statusOptions: Record<string, number> = {
        [MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.PLANNED]: 1,
        [MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.ONGOING]: 2,
        [MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.COMPLETED_RESULTS_PENDING]: 3,
    };

    if (statusOptions[MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.PLANNED] === statusId) {
        return MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.PLANNED;
    }

    if (statusOptions[MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.ONGOING] === statusId) {
        return MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.ONGOING;
    }

    if (statusOptions[MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.COMPLETED_RESULTS_PENDING] === statusId) {
        return MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.COMPLETED_RESULTS_PENDING;
    }

    return MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.UNKNOWN;
};
