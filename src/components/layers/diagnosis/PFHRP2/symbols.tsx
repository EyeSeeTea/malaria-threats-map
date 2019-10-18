import { DIAGNOSIS_STATUS } from "./utils";

export const DiagnosisStatusColors = {
  [DIAGNOSIS_STATUS.CONFIRMED]: ["#d43501", "#882201"],
  [DIAGNOSIS_STATUS.NOT_IDENTIFIED]: ["#BEBEBE", "#838383"]
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
    ["get", "DIAGNOSIS_STATUS"],
    DIAGNOSIS_STATUS.CONFIRMED,
    DiagnosisStatusColors[DIAGNOSIS_STATUS.CONFIRMED][0],
    DiagnosisStatusColors[DIAGNOSIS_STATUS.NOT_IDENTIFIED][0]
  ],
  "circle-opacity": 1,
  "circle-stroke-color": [
    "case",
    ["boolean", ["feature-state", "hover"], false],
    "lightgrey",
    [
      "match",
      ["get", "DIAGNOSIS_STATUS"],
      DIAGNOSIS_STATUS.CONFIRMED,
      DiagnosisStatusColors[DIAGNOSIS_STATUS.CONFIRMED][1],
      DiagnosisStatusColors[DIAGNOSIS_STATUS.NOT_IDENTIFIED][1]
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
