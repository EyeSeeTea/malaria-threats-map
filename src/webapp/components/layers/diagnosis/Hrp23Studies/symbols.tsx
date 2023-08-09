import baseSymbols from "../../common/baseSymbols";
import { HRP23_STUDIES_STATUS } from "./utils";

export const Hrp23StudiesColors: { [key: string]: string[] } = {
    [HRP23_STUDIES_STATUS.ONGOING]: ["#5ABE86", "#4DA072"],
    [HRP23_STUDIES_STATUS.PLANNED]: ["#4897C7", "#357BA3"],
    [HRP23_STUDIES_STATUS.COMPLETED_RESULTS_PENDING]: ["#FD6F21", "#CC5C1E"],
    [HRP23_STUDIES_STATUS.UNKNOWN]: ["#d3d3d3", "#adadad"],
};

const PROPERTY = "HRP23_STUDIES_STATUS";

const hrp23StudiesSymbols = {
    ...baseSymbols,
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 2, 4, 7],
    "circle-color": [
        "match",
        ["get", PROPERTY],
        HRP23_STUDIES_STATUS.ONGOING,
        Hrp23StudiesColors[HRP23_STUDIES_STATUS.ONGOING][0],
        HRP23_STUDIES_STATUS.PLANNED,
        Hrp23StudiesColors[HRP23_STUDIES_STATUS.PLANNED][0],
        HRP23_STUDIES_STATUS.COMPLETED_RESULTS_PENDING,
        Hrp23StudiesColors[HRP23_STUDIES_STATUS.COMPLETED_RESULTS_PENDING][0],
        Hrp23StudiesColors[HRP23_STUDIES_STATUS.UNKNOWN][0],
    ],
    "circle-stroke-color": [
        ...baseSymbols["circle-stroke-color"],
        [
            "match",
            ["get", PROPERTY],
            HRP23_STUDIES_STATUS.ONGOING,
            Hrp23StudiesColors[HRP23_STUDIES_STATUS.ONGOING][1],
            HRP23_STUDIES_STATUS.PLANNED,
            Hrp23StudiesColors[HRP23_STUDIES_STATUS.PLANNED][1],
            HRP23_STUDIES_STATUS.COMPLETED_RESULTS_PENDING,
            Hrp23StudiesColors[HRP23_STUDIES_STATUS.COMPLETED_RESULTS_PENDING][1],
            Hrp23StudiesColors[HRP23_STUDIES_STATUS.UNKNOWN][1],
        ],
    ],
};

export default hrp23StudiesSymbols;
