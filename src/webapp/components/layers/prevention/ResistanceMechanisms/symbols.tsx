import { RESISTANCE_MECHANISM } from "./utils";
import { INTENSITY_STATUS } from "../IntensityStatus/utils";
import baseSymbols from "../../common/baseSymbols";

export const ResistanceMechanismColors: { [key: string]: string[] } = {
    [RESISTANCE_MECHANISM.CONFIRMED]: ["#d43501", "#882201"],
    [RESISTANCE_MECHANISM.NOT_CONFIRMED]: ["#ff9502", "#b56900"],
    [INTENSITY_STATUS.UNKNOWN]: ["#d3d3d3", "#adadad"],
};

const resistanceMechanismSymbols = {
    ...baseSymbols,
    "circle-color": [
        "match",
        ["get", "MECHANISM_STATUS"],
        RESISTANCE_MECHANISM.CONFIRMED,
        ResistanceMechanismColors[RESISTANCE_MECHANISM.CONFIRMED][0],
        ResistanceMechanismColors[RESISTANCE_MECHANISM.NOT_CONFIRMED][0],
    ],
    "circle-stroke-color": [
        ...baseSymbols["circle-stroke-color"],
        [
            "match",
            ["get", "MECHANISM_STATUS"],
            RESISTANCE_MECHANISM.CONFIRMED,
            ResistanceMechanismColors[RESISTANCE_MECHANISM.CONFIRMED][1],
            ResistanceMechanismColors[RESISTANCE_MECHANISM.NOT_CONFIRMED][1],
        ],
    ],
};

export default resistanceMechanismSymbols;
