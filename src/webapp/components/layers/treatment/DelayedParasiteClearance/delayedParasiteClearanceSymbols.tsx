import { DELAYED_PARASITE_CLEARANCE_STATUS } from "./utils";

export const DelayedParasiteClearanceColors: { [key: string]: string[] } = {
    [DELAYED_PARASITE_CLEARANCE_STATUS.HIGH]: ["#005a32", "#004124"],
    [DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM_HIGH]: ["#238443", "#134824"],
    [DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM]: ["#41ab5d", "#2c743f"],
    [DELAYED_PARASITE_CLEARANCE_STATUS.LOW]: ["#addd8e", "#82cb53"],
    [DELAYED_PARASITE_CLEARANCE_STATUS.UNKNOWN]: ["#d3d3d3", "#adadad"],
};

const delayedParasiteClearanceSymbols = {
    "circle-radius": ["case", ["boolean", ["feature-state", "hover"], false], 7, 6],
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
    "circle-opacity": 1,
    "circle-stroke-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "lightgrey",
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
    "circle-stroke-width": ["case", ["boolean", ["feature-state", "hover"], false], 5, 1],
    "circle-stroke-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.7, 0.7],
};

export default delayedParasiteClearanceSymbols;
