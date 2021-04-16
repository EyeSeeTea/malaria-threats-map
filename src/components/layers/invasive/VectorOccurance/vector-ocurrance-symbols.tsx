import { INVASIVE_STATUS } from "./utils";

export const InvasiveStatusColors: { [key: string]: string[] } = {
    [INVASIVE_STATUS.INVASIVE]: ["#ed5565", "#de182c"],
    [INVASIVE_STATUS.NATIVE]: ["#5abe86", "#3a926f"],
    [INVASIVE_STATUS.UNKNOWN]: ["#d3d3d3", "#adadad"],
};

export default {
    "circle-radius": ["case", ["boolean", ["feature-state", "hover"], false], 7, 6],
    "circle-color": [
        "match",
        ["get", "INVASIVE_STATUS"],
        INVASIVE_STATUS.INVASIVE,
        InvasiveStatusColors[INVASIVE_STATUS.INVASIVE][0],
        INVASIVE_STATUS.NATIVE,
        InvasiveStatusColors[INVASIVE_STATUS.NATIVE][0],
        InvasiveStatusColors[INVASIVE_STATUS.UNKNOWN][0],
    ],
    "circle-opacity": 1,
    "circle-stroke-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "lightgrey",
        [
            "match",
            ["get", "INVASIVE_STATUS"],
            INVASIVE_STATUS.INVASIVE,
            InvasiveStatusColors[INVASIVE_STATUS.INVASIVE][1],
            INVASIVE_STATUS.NATIVE,
            InvasiveStatusColors[INVASIVE_STATUS.NATIVE][1],
            InvasiveStatusColors[INVASIVE_STATUS.UNKNOWN][1],
        ],
    ],
    "circle-stroke-width": ["case", ["boolean", ["feature-state", "hover"], false], 5, 1],
    "circle-stroke-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.7, 0.7],
};
