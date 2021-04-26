export const PreventionCountryColors = {
    COUNTRIES: ["#5abe86", "#3a926f"],
};

const preventionCountrySymbols = {
    "circle-radius": ["case", ["boolean", ["feature-state", "hover"], false], ["get", "SIZE_HOVER"], ["get", "SIZE"]],
    "circle-color": PreventionCountryColors.COUNTRIES[0],
    "circle-opacity": 1,
    "circle-stroke-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "lightgrey",
        PreventionCountryColors.COUNTRIES[1],
    ],
    "circle-stroke-width": ["case", ["boolean", ["feature-state", "hover"], false], 4, 1],
    "circle-stroke-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.7, 0.7],
};

export default preventionCountrySymbols;
