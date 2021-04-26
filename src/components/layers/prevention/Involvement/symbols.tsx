import { LEVEL_OF_INVOLVEMENT } from "./utils";

const PROPERTY = "MECHANISM_PROXY";

export const LevelOfInvolvementColors = {
    [LEVEL_OF_INVOLVEMENT.FULL_INVOLVEMENT]: ["#8E4585", "#5b2c55"],
    [LEVEL_OF_INVOLVEMENT.PARTIAL_INVOLVEMENT]: ["#DAACD5", "#c277ba"],
    [LEVEL_OF_INVOLVEMENT.NO_INVOLVEMENT]: ["#d3d3d3", "#adadad"],
};

const involvementSymbols = {
    "circle-radius": ["case", ["boolean", ["feature-state", "hover"], false], 7, 6],
    "circle-color": [
        "match",
        ["get", PROPERTY],
        LEVEL_OF_INVOLVEMENT.FULL_INVOLVEMENT,
        LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.FULL_INVOLVEMENT][0],
        LEVEL_OF_INVOLVEMENT.PARTIAL_INVOLVEMENT,
        LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.PARTIAL_INVOLVEMENT][0],
        LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.NO_INVOLVEMENT][0],
    ],
    "circle-opacity": 1,
    "circle-stroke-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "lightgrey",
        [
            "match",
            ["get", PROPERTY],
            LEVEL_OF_INVOLVEMENT.FULL_INVOLVEMENT,
            LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.FULL_INVOLVEMENT][1],
            LEVEL_OF_INVOLVEMENT.PARTIAL_INVOLVEMENT,
            LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.PARTIAL_INVOLVEMENT][1],
            LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.NO_INVOLVEMENT][1],
        ],
    ],
    "circle-stroke-width": ["case", ["boolean", ["feature-state", "hover"], false], 5, 1],
    "circle-stroke-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.7, 0.7],
};

export default involvementSymbols;
