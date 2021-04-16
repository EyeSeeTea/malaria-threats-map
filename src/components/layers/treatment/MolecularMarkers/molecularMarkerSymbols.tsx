import { MOLECULAR_MARKER_STATUS } from "./utils";

export const MolecularMarkerColors: { [key: string]: string[] } = {
    [MOLECULAR_MARKER_STATUS.HIGH]: ["#002366", "#001a4d"],
    [MOLECULAR_MARKER_STATUS.MEDIUM_HIGH]: ["#365694", "#2f4b81"],
    [MOLECULAR_MARKER_STATUS.MEDIUM]: ["#5579c2", "#3c60a7"],
    [MOLECULAR_MARKER_STATUS.LOW]: ["#9fb4dd", "#7a97cf"],
    [MOLECULAR_MARKER_STATUS.UNKNOWN]: ["#d3d3d3", "#adadad"],
};

export default {
    "circle-radius": ["case", ["boolean", ["feature-state", "hover"], false], 7, 6],
    "circle-color": [
        "match",
        ["get", "MOLECULAR_MARKER_STATUS"],
        MOLECULAR_MARKER_STATUS.HIGH,
        MolecularMarkerColors[MOLECULAR_MARKER_STATUS.HIGH][0],
        MOLECULAR_MARKER_STATUS.MEDIUM_HIGH,
        MolecularMarkerColors[MOLECULAR_MARKER_STATUS.MEDIUM_HIGH][0],
        MOLECULAR_MARKER_STATUS.MEDIUM,
        MolecularMarkerColors[MOLECULAR_MARKER_STATUS.MEDIUM][0],
        MOLECULAR_MARKER_STATUS.LOW,
        MolecularMarkerColors[MOLECULAR_MARKER_STATUS.LOW][0],
        MolecularMarkerColors[MOLECULAR_MARKER_STATUS.UNKNOWN][0],
    ],
    "circle-opacity": 1,
    "circle-stroke-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "lightgrey",
        [
            "match",
            ["get", "MOLECULAR_MARKER_STATUS"],
            MOLECULAR_MARKER_STATUS.HIGH,
            MolecularMarkerColors[MOLECULAR_MARKER_STATUS.HIGH][1],
            MOLECULAR_MARKER_STATUS.MEDIUM_HIGH,
            MolecularMarkerColors[MOLECULAR_MARKER_STATUS.MEDIUM_HIGH][1],
            MOLECULAR_MARKER_STATUS.MEDIUM,
            MolecularMarkerColors[MOLECULAR_MARKER_STATUS.MEDIUM][1],
            MOLECULAR_MARKER_STATUS.LOW,
            MolecularMarkerColors[MOLECULAR_MARKER_STATUS.LOW][1],
            MolecularMarkerColors[MOLECULAR_MARKER_STATUS.UNKNOWN][1],
        ],
    ],
    "circle-stroke-width": ["case", ["boolean", ["feature-state", "hover"], false], 5, 1],
    "circle-stroke-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.7, 0.7],
};
