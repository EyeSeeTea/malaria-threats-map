import baseSymbols from "../../common/baseSymbols";
import { DIAGNOSIS_STATUS } from "./utils";

export const DiagnosisStatusColors = {
    [DIAGNOSIS_STATUS.CONFIRMED]: ["#d43501", "#882201"],
    [DIAGNOSIS_STATUS.NOT_IDENTIFIED]: ["#BEBEBE", "#838383"],
};

const geneDeletionsSymbols = {
    ...baseSymbols,
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 2, 4, 7],
    "circle-color": [
        "match",
        ["get", "DELETION_PERCENT"],
        DIAGNOSIS_STATUS.CONFIRMED,
        DiagnosisStatusColors[DIAGNOSIS_STATUS.CONFIRMED][0],
        DiagnosisStatusColors[DIAGNOSIS_STATUS.NOT_IDENTIFIED][0],
    ],
    "circle-stroke-color": [
        ...baseSymbols["circle-stroke-color"],
        [
            "match",
            ["get", "DELETION_PERCENT"],
            DIAGNOSIS_STATUS.CONFIRMED,
            DiagnosisStatusColors[DIAGNOSIS_STATUS.CONFIRMED][1],
            DiagnosisStatusColors[DIAGNOSIS_STATUS.NOT_IDENTIFIED][1],
        ],
    ],
};

export default geneDeletionsSymbols;
