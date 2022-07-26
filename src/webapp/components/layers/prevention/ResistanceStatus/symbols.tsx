export const ResistanceStatusColors: { [key: string]: string[] } = {
    Confirmed: ["#D43501", "#882201"],
    Possible: ["#FF9502", "#b56900"],
    Susceptible: ["#869C66", "#5e6e47"],
    Undetermined: ["#BEBEBE", "#838383"],
};

const resistanceStatusSymbols = {
    "circle-radius": ["case", ["boolean", ["feature-state", "hover"], false], 7, 6],
    "circle-color": ["string", ["at", 0, ["get", "RESISTANCE_STATUS_COLOR"]]],
    "circle-opacity": 1,
    "circle-stroke-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "lightgrey",
        ["string", ["at", 1, ["get", "RESISTANCE_STATUS_COLOR"]]],
    ],
    "circle-stroke-width": ["case", ["boolean", ["feature-state", "hover"], false], 5, 1],
    "circle-stroke-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.7, 0.7],
};

export default resistanceStatusSymbols;
