export enum PboDeploymentStatus {
    ELIGIBLE = "Eligible",
    NOT_ELIGIBLE = "Not eligible",
    NOT_ENOUGH_DATA = "Not enough data",
    NO_DATA = "No data",
}

export const PboDeploymentColors = {
    [PboDeploymentStatus.ELIGIBLE]: ["#869C66", "#5e6e47"],
    [PboDeploymentStatus.NOT_ELIGIBLE]: ["#D43501", "#882201"],
    [PboDeploymentStatus.NOT_ENOUGH_DATA]: ["#FF9502", "#b56900"],
    [PboDeploymentStatus.NO_DATA]: ["#d3d3d3", "#adadad"],
};

export default {
    "circle-radius": ["case", ["boolean", ["feature-state", "hover"], false], 7, 6],
    "circle-color": [
        "match",
        ["get", "PBO_DEPLOYMENT_STATUS"],
        PboDeploymentStatus.ELIGIBLE,
        PboDeploymentColors[PboDeploymentStatus.ELIGIBLE][0],
        PboDeploymentStatus.NOT_ELIGIBLE,
        PboDeploymentColors[PboDeploymentStatus.NOT_ELIGIBLE][0],
        PboDeploymentStatus.NOT_ENOUGH_DATA,
        PboDeploymentColors[PboDeploymentStatus.NOT_ENOUGH_DATA][0],
        /* other */ "#d3d3d3",
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
            /* other */ "#adadad",
        ],
    ],
    "circle-stroke-width": ["case", ["boolean", ["feature-state", "hover"], false], 5, 1],
    "circle-stroke-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.7, 0.7],
};
