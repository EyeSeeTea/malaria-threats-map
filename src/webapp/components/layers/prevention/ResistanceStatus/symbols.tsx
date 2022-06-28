export const ResistanceStatusColors: { [key: string]: string[] } = {
    Confirmed: ["#D43501", "#882201"],
    Possible: ["#FF9502", "#b56900"],
    Susceptible: ["#869C66", "#5e6e47"],
    Undetermined: ["#BEBEBE", "#838383"],
};

const resistanceStatusSymbols = {
    "circle-radius": ["case", ["boolean", ["feature-state", "hover"], false], 7, 6],
    "circle-color": [
        "match",
        ["get", "RESISTANCE_STATUS"],
        "CONFIRMED_RESISTANCE",
        ResistanceStatusColors.Confirmed[0],
        "POSSIBLE_RESISTANCE",
        ResistanceStatusColors.Possible[0],
        "SUSCEPTIBLE",
        ResistanceStatusColors.Susceptible[0],
        "UNDETERMINED",
        ResistanceStatusColors.Undetermined[0],
        /* other */ "#ccc",
    ],
    "circle-opacity": 1,
    "circle-stroke-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "lightgrey",
        [
            "match",
            ["get", "RESISTANCE_STATUS"],
            "CONFIRMED_RESISTANCE",
            ResistanceStatusColors.Confirmed[1],
            "POSSIBLE_RESISTANCE",
            ResistanceStatusColors.Possible[1],
            "SUSCEPTIBLE",
            ResistanceStatusColors.Susceptible[1],
            "UNDETERMINED",
            ResistanceStatusColors.Undetermined[1],
            /* other */ "#111",
        ],
    ],
    "circle-stroke-width": ["case", ["boolean", ["feature-state", "hover"], false], 5, 1],
    "circle-stroke-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.7, 0.7],
};

export default resistanceStatusSymbols;
