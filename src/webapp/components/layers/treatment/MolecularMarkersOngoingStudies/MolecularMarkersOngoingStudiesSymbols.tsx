import baseSymbols from "../../common/baseSymbols";
import { MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS } from "./utils";

export const MolecularMarkersOngoingStudiesColors: { [key: string]: string[] } = {
    [MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.ONGOING]: ["#5ABE86", "#4DA072"],
    [MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.PLANNED]: ["#4897C7", "#357BA3"],
    [MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.COMPLETED_RESULTS_PENDING]: ["#FD6F21", "#CC5C1E"],
    [MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.UNKNOWN]: ["#d3d3d3", "#adadad"],
};

const PROPERTY = "MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS";

const molecularMarkersOngoingStudiesSymbols = {
    ...baseSymbols,
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 2, 4, 7],
    "circle-color": [
        "match",
        ["get", PROPERTY],
        MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.ONGOING,
        MolecularMarkersOngoingStudiesColors[MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.ONGOING][0],
        MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.PLANNED,
        MolecularMarkersOngoingStudiesColors[MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.PLANNED][0],
        MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.COMPLETED_RESULTS_PENDING,
        MolecularMarkersOngoingStudiesColors[MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.COMPLETED_RESULTS_PENDING][0],
        MolecularMarkersOngoingStudiesColors[MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.UNKNOWN][0],
    ],
    "circle-stroke-color": [
        ...baseSymbols["circle-stroke-color"],
        [
            "match",
            ["get", PROPERTY],
            MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.ONGOING,
            MolecularMarkersOngoingStudiesColors[MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.ONGOING][1],
            MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.PLANNED,
            MolecularMarkersOngoingStudiesColors[MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.PLANNED][1],
            MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.COMPLETED_RESULTS_PENDING,
            MolecularMarkersOngoingStudiesColors[MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.COMPLETED_RESULTS_PENDING][1],
            MolecularMarkersOngoingStudiesColors[MOLECULAR_MARKERS_ONGOING_STUDIES_STATUS.UNKNOWN][1],
        ],
    ],
};

export default molecularMarkersOngoingStudiesSymbols;
