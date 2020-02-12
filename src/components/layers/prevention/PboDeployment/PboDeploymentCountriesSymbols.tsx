export enum PboDeploymentCountriesStatus {
  ELIGIBLE = "Eligible",
  NOT_ELIGIBLE = "Not eligible",
  NOT_ENOUGH_DATA = "Not enough data",
  NOT_APPLICABLE = "Not applicable"
}

export const PboDeploymentColors = {
  [PboDeploymentCountriesStatus.ELIGIBLE]: ["#869C66", "#5e6e47"],
  [PboDeploymentCountriesStatus.NOT_ELIGIBLE]: ["#D43501", "#882201"],
  [PboDeploymentCountriesStatus.NOT_ENOUGH_DATA]: ["#FF9502", "#b56900"],
  [PboDeploymentCountriesStatus.NOT_APPLICABLE]: ["#d3d3d3", "#adadad"]
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
    PboDeploymentCountriesStatus.ELIGIBLE,
    PboDeploymentColors[PboDeploymentCountriesStatus.ELIGIBLE][0],
    PboDeploymentCountriesStatus.NOT_ELIGIBLE,
    PboDeploymentColors[PboDeploymentCountriesStatus.NOT_ELIGIBLE][0],
    PboDeploymentCountriesStatus.NOT_ENOUGH_DATA,
    PboDeploymentColors[PboDeploymentCountriesStatus.NOT_ENOUGH_DATA][0],
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
      PboDeploymentCountriesStatus.ELIGIBLE,
      PboDeploymentColors[PboDeploymentCountriesStatus.ELIGIBLE][1],
      PboDeploymentCountriesStatus.NOT_ELIGIBLE,
      PboDeploymentColors[PboDeploymentCountriesStatus.NOT_ELIGIBLE][1],
      PboDeploymentCountriesStatus.NOT_ENOUGH_DATA,
      PboDeploymentColors[PboDeploymentCountriesStatus.NOT_ENOUGH_DATA][1],
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
