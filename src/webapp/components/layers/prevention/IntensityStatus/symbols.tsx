import { INTENSITY_STATUS } from "./utils";

export const IntensityStatusColors: { [key: string]: string[] } = {
    [INTENSITY_STATUS.HIGH_INTENSITY]: ["#540307", "#0a0001"],
    [INTENSITY_STATUS.MODERATE_TO_HIGH_INTENSITY]: ["#81252a", "#461417"],
    [INTENSITY_STATUS.MODERATE_INTENSITY]: ["#ad5c61", "#7d3f43"],
    [INTENSITY_STATUS.LOW_INTENSITY]: ["#e7a98e", "#da794f"],
    [INTENSITY_STATUS.SUSCEPTIBLE]: ["#869c66", "#5e6e47"],
    [INTENSITY_STATUS.UNKNOWN]: ["#d3d3d3", "#adadad"],
};

const intensityStatusSymbols = {
    "circle-radius": ["case", ["boolean", ["feature-state", "hover"], false], 7, 6],
    "circle-color": [
        "match",
        ["get", "RESISTANCE_INTENSITY"],
        INTENSITY_STATUS.HIGH_INTENSITY,
        IntensityStatusColors[INTENSITY_STATUS.HIGH_INTENSITY][0],
        INTENSITY_STATUS.MODERATE_TO_HIGH_INTENSITY,
        IntensityStatusColors[INTENSITY_STATUS.MODERATE_TO_HIGH_INTENSITY][0],
        INTENSITY_STATUS.MODERATE_INTENSITY,
        IntensityStatusColors[INTENSITY_STATUS.MODERATE_INTENSITY][0],
        INTENSITY_STATUS.LOW_INTENSITY,
        IntensityStatusColors[INTENSITY_STATUS.LOW_INTENSITY][0],
        IntensityStatusColors[INTENSITY_STATUS.SUSCEPTIBLE][0],
    ],
    "circle-opacity": 1,
    "circle-stroke-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "lightgrey",
        [
            "match",
            ["get", "RESISTANCE_INTENSITY"],
            INTENSITY_STATUS.HIGH_INTENSITY,
            IntensityStatusColors[INTENSITY_STATUS.HIGH_INTENSITY][1],
            INTENSITY_STATUS.MODERATE_TO_HIGH_INTENSITY,
            IntensityStatusColors[INTENSITY_STATUS.MODERATE_TO_HIGH_INTENSITY][1],
            INTENSITY_STATUS.MODERATE_INTENSITY,
            IntensityStatusColors[INTENSITY_STATUS.MODERATE_INTENSITY][1],
            INTENSITY_STATUS.LOW_INTENSITY,
            IntensityStatusColors[INTENSITY_STATUS.LOW_INTENSITY][1],
            IntensityStatusColors[INTENSITY_STATUS.SUSCEPTIBLE][1],
        ],
    ],
    "circle-stroke-width": ["case", ["boolean", ["feature-state", "hover"], false], 5, 1],
    "circle-stroke-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.7, 0.7],
};

export default intensityStatusSymbols;
