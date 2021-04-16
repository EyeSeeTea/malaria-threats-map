import { RESISTANCE_MECHANISM } from "./utils";
import { INTENSITY_STATUS } from "../IntensityStatus/utils";

export const ResistanceMechanismColors: { [key: string]: string[] } = {
    [RESISTANCE_MECHANISM.CONFIRMED]: ["#d43501", "#882201"],
    [RESISTANCE_MECHANISM.NOT_CONFIRMED]: ["#ff9502", "#b56900"],
    [INTENSITY_STATUS.UNKNOWN]: ["#d3d3d3", "#adadad"],
};

export default {
    "circle-radius": ["case", ["boolean", ["feature-state", "hover"], false], 7, 6],
    "circle-color": [
        "match",
        ["get", "MECHANISM_STATUS"],
        RESISTANCE_MECHANISM.CONFIRMED,
        ResistanceMechanismColors[RESISTANCE_MECHANISM.CONFIRMED][0],
        ResistanceMechanismColors[RESISTANCE_MECHANISM.NOT_CONFIRMED][0],
    ],
    "circle-opacity": 1,
    "circle-stroke-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "lightgrey",
        [
            "match",
            ["get", "MECHANISM_STATUS"],
            RESISTANCE_MECHANISM.CONFIRMED,
            ResistanceMechanismColors[RESISTANCE_MECHANISM.CONFIRMED][1],
            ResistanceMechanismColors[RESISTANCE_MECHANISM.NOT_CONFIRMED][1],
        ],
    ],
    "circle-stroke-width": ["case", ["boolean", ["feature-state", "hover"], false], 5, 1],
    "circle-stroke-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.7, 0.7],
};
