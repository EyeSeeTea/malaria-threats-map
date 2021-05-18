export enum PboDeploymentCountriesStatus {
    ELIGIBLE = "Eligible",
    NOT_ELIGIBLE = "Not eligible",
    NOT_ENOUGH_DATA = "Not enough data",
    NOT_APPLICABLE = "Not applicable",
}

export const PboDeploymentColors = {
    [PboDeploymentCountriesStatus.ELIGIBLE]: ["#869C66", "#5e6e47"],
    [PboDeploymentCountriesStatus.NOT_ELIGIBLE]: ["#FF9502", "#b56900"],
    [PboDeploymentCountriesStatus.NOT_ENOUGH_DATA]: ["#FF9502", "#b56900"],
    [PboDeploymentCountriesStatus.NOT_APPLICABLE]: ["#D43501", "#882201"],
};
