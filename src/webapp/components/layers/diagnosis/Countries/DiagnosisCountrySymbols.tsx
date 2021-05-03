export const DiagnosisCountryColors = {
    COUNTRIES: ["#0099cc", "#006080"],
};

const DiagnosisCountrySymbols = {
    "circle-radius": ["case", ["boolean", ["feature-state", "hover"], false], ["get", "SIZE_HOVER"], ["get", "SIZE"]],
    "circle-color": DiagnosisCountryColors.COUNTRIES[0],
    "circle-opacity": 1,
    "circle-stroke-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "lightgrey",
        DiagnosisCountryColors.COUNTRIES[1],
    ],
    "circle-stroke-width": ["case", ["boolean", ["feature-state", "hover"], false], 4, 1],
    "circle-stroke-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.7, 0.7],
};

export default DiagnosisCountrySymbols;
