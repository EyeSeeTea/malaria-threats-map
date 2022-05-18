import baseSymbols from "../../common/baseSymbols";
import { DELAYED_PARASITE_CLEARANCE_STATUS } from "./utils";

export const DelayedParasiteClearanceColors: { [key: string]: string[] } = {
    [DELAYED_PARASITE_CLEARANCE_STATUS.HIGH]: ["#f52c05", "#f06800"],
    [DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM_HIGH]: ["#ff6f00", "#f07c24"],
    [DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM]: ["#ffa159", "#f09957"],
    [DELAYED_PARASITE_CLEARANCE_STATUS.LOW]: ["#fccfa6", "#f2b484"],
    [DELAYED_PARASITE_CLEARANCE_STATUS.UNKNOWN]: ["#d3d3d3", "#adadad"],
};

const delayedParasiteClearanceSymbols = {
    ...baseSymbols,
    "circle-radius": ['interpolate', ['linear'], ['zoom'], 1, 2, 4, 7],
    "circle-color": [
        "match",
        ["get", "DELAYED_PARASITE_CLEARANCE_STATUS"],
        DELAYED_PARASITE_CLEARANCE_STATUS.HIGH,
        DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.HIGH][0],
        DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM_HIGH,
        DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM_HIGH][0],
        DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM,
        DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM][0],
        DELAYED_PARASITE_CLEARANCE_STATUS.LOW,
        DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.LOW][0],
        DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.UNKNOWN][0],
    ],
    "circle-stroke-color": [
        ...baseSymbols["circle-stroke-color"],
        [
            "match",
            ["get", "DELAYED_PARASITE_CLEARANCE_STATUS"],
            DELAYED_PARASITE_CLEARANCE_STATUS.HIGH,
            DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.HIGH][1],
            DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM_HIGH,
            DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM_HIGH][1],
            DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM,
            DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM][1],
            DELAYED_PARASITE_CLEARANCE_STATUS.LOW,
            DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.LOW][1],
            DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.UNKNOWN][1],
        ],
    ],
};

export default delayedParasiteClearanceSymbols;
