import { TREATMENT_FAILURE_STATUS } from "./utils";

export const TreatmentFailureColors: { [key: string]: string[] } = {
    [TREATMENT_FAILURE_STATUS.HIGH]: ["#420608", "#130202"],
    [TREATMENT_FAILURE_STATUS.MEDIUM_HIGH]: ["#940d12", "#65090c"],
    [TREATMENT_FAILURE_STATUS.MEDIUM]: ["#c0575b", "#93373b"],
    [TREATMENT_FAILURE_STATUS.LOW]: ["#db9fa1", "#c6676b"],
    [TREATMENT_FAILURE_STATUS.UNKNOWN]: ["#d3d3d3", "#adadad"],
};

const treatmentLayerSymbols = {
    "circle-radius": ["case", ["boolean", ["feature-state", "hover"], false], 7, 6],
    "circle-color": [
        "match",
        ["get", "TREATMENT_FAILURE_STATUS"],
        TREATMENT_FAILURE_STATUS.HIGH,
        TreatmentFailureColors[TREATMENT_FAILURE_STATUS.HIGH][0],
        TREATMENT_FAILURE_STATUS.MEDIUM_HIGH,
        TreatmentFailureColors[TREATMENT_FAILURE_STATUS.MEDIUM_HIGH][0],
        TREATMENT_FAILURE_STATUS.MEDIUM,
        TreatmentFailureColors[TREATMENT_FAILURE_STATUS.MEDIUM][0],
        TREATMENT_FAILURE_STATUS.LOW,
        TreatmentFailureColors[TREATMENT_FAILURE_STATUS.LOW][0],
        TreatmentFailureColors[TREATMENT_FAILURE_STATUS.UNKNOWN][0],
    ],
    "circle-opacity": 1,
    "circle-stroke-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "lightgrey",
        [
            "match",
            ["get", "TREATMENT_FAILURE_STATUS"],
            TREATMENT_FAILURE_STATUS.HIGH,
            TreatmentFailureColors[TREATMENT_FAILURE_STATUS.HIGH][1],
            TREATMENT_FAILURE_STATUS.MEDIUM_HIGH,
            TreatmentFailureColors[TREATMENT_FAILURE_STATUS.MEDIUM_HIGH][1],
            TREATMENT_FAILURE_STATUS.MEDIUM,
            TreatmentFailureColors[TREATMENT_FAILURE_STATUS.MEDIUM][1],
            TREATMENT_FAILURE_STATUS.LOW,
            TreatmentFailureColors[TREATMENT_FAILURE_STATUS.LOW][1],
            TreatmentFailureColors[TREATMENT_FAILURE_STATUS.UNKNOWN][1],
        ],
    ],
    "circle-stroke-width": ["case", ["boolean", ["feature-state", "hover"], false], 5, 1],
    "circle-stroke-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.7, 0.7],
};

export default treatmentLayerSymbols;
