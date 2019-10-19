export enum PboDeploymentStatus {
  ELIGIBLE = "Eligible",
  NOT_ELIGIBLE = "Not eligible",
  NOT_ENOUGH_DATA = "Not enough data"
}

export const PboDeploymentColors = {
  [PboDeploymentStatus.ELIGIBLE]: ["#869C66", "#5e6e47"],
  [PboDeploymentStatus.NOT_ELIGIBLE]: ["#D43501", "#882201"],
  [PboDeploymentStatus.NOT_ENOUGH_DATA]: ["#FF9502", "#b56900"]
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
    ["get", "PBO_DEPLOYMENT_STATUS"],
    PboDeploymentStatus.ELIGIBLE,
    PboDeploymentColors[PboDeploymentStatus.ELIGIBLE][0],
    PboDeploymentStatus.NOT_ELIGIBLE,
    PboDeploymentColors[PboDeploymentStatus.NOT_ELIGIBLE][0],
    PboDeploymentStatus.NOT_ENOUGH_DATA,
    PboDeploymentColors[PboDeploymentStatus.NOT_ENOUGH_DATA][0],
    /* other */ "#ccc"
  ],
  "circle-opacity": 1,
  "circle-stroke-color": [
    "case",
    ["boolean", ["feature-state", "hover"], false],
    "lightgrey",
    [
      "match",
      ["get", "PBO_DEPLOYMENT_STATUS"],
      PboDeploymentStatus.ELIGIBLE,
      PboDeploymentColors[PboDeploymentStatus.ELIGIBLE][1],
      PboDeploymentStatus.NOT_ELIGIBLE,
      PboDeploymentColors[PboDeploymentStatus.NOT_ELIGIBLE][1],
      PboDeploymentStatus.NOT_ENOUGH_DATA,
      PboDeploymentColors[PboDeploymentStatus.NOT_ENOUGH_DATA][1],
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
