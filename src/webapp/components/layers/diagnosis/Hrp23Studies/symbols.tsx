import baseSymbols from "../../common/baseSymbols";
import { HRP23_STUDIES_STATUS } from "./utils";

export const Hrp23StudiesColors: { [key: string]: string[] } = {
    [HRP23_STUDIES_STATUS.ONGOING]: ["#5ABE86", "#4DA072"],
    [HRP23_STUDIES_STATUS.PLANNED]: ["#365694", "#2c4371"],
    [HRP23_STUDIES_STATUS.COMPLETED]: ["#FD6F21", "#CC5C1E"],
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
        HRP23_STUDIES_STATUS.COMPLETED,
        Hrp23StudiesColors[HRP23_STUDIES_STATUS.COMPLETED][0],
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
            HRP23_STUDIES_STATUS.COMPLETED,
            Hrp23StudiesColors[HRP23_STUDIES_STATUS.COMPLETED][1],
            Hrp23StudiesColors[HRP23_STUDIES_STATUS.UNKNOWN][1],
        ],
    ],
};

export default hrp23StudiesSymbols;
