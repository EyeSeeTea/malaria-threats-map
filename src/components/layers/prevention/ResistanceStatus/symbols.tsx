export const ConfirmationStatusColors: { [key: string]: string[] } = {
  Confirmed: ["#D43501", "#882201"],
  Possible: ["#FF9502", "#b56900"],
  Susceptible: ["#32b626", "#26851a"]
};

export default {
  "circle-radius": [
    "case",
    ["boolean", ["feature-state", "hover"], false],
    7,
    6
  ],
  "circle-color": [
    "match",
    ["get", "CONFIRMATION_STATUS"],
    "Confirmed",
    ConfirmationStatusColors.Confirmed[0],
    "Possible",
    ConfirmationStatusColors.Possible[0],
    "Susceptible",
    ConfirmationStatusColors.Susceptible[0],
    /* other */ "#ccc"
  ],
  "circle-opacity": 1,
  "circle-stroke-color": [
    "case",
    ["boolean", ["feature-state", "hover"], false],
    "lightgrey",
    [
      "match",
      ["get", "CONFIRMATION_STATUS"],
      "Confirmed",
      ConfirmationStatusColors.Confirmed[1],
      "Possible",
      ConfirmationStatusColors.Possible[1],
      "Susceptible",
      ConfirmationStatusColors.Susceptible[1],
      /* other */ "#111"
    ]
  ],
  "circle-stroke-width": [
    "case",
    ["boolean", ["feature-state", "hover"], false],
    5,
    1
  ],
  "circle-stroke-opacity": [
    "case",
    ["boolean", ["feature-state", "hover"], false],
    0.7,
    0.7
  ]
};
