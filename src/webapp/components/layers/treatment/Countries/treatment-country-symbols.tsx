export const TreatmentCountryColors = {
  COUNTRIES: ["#5bcdce", "#33a9aa"]
};

export default {
  "circle-radius": [
    "case",
    ["boolean", ["feature-state", "hover"], false],
    ["get", "SIZE_HOVER"],
    ["get", "SIZE"]
  ],
  "circle-color": TreatmentCountryColors.COUNTRIES[0],
  "circle-opacity": 1,
  "circle-stroke-color": [
    "case",
    ["boolean", ["feature-state", "hover"], false],
    "lightgrey",
    TreatmentCountryColors.COUNTRIES[1]
  ],
  "circle-stroke-width": [
    "case",
    ["boolean", ["feature-state", "hover"], false],
    4,
    1
  ],
  "circle-stroke-opacity": [
    "case",
    ["boolean", ["feature-state", "hover"], false],
    0.7,
    0.7
  ]
};
