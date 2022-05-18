import baseSymbols from "../../common/baseSymbols";
import { INVASIVE_STATUS } from "./utils";

export const InvasiveStatusColors: { [key: string]: string[] } = {
    [INVASIVE_STATUS.INVASIVE]: ["#ed5565", "#de182c"],
    [INVASIVE_STATUS.NATIVE]: ["#5abe86", "#3a926f"],
    [INVASIVE_STATUS.UNKNOWN]: ["#d3d3d3", "#adadad"],
};

const vectorOcurranceSymbols = {
    ...baseSymbols,
    "circle-color": [
        "match",
        ["get", "INVASIVE_STATUS"],
        INVASIVE_STATUS.INVASIVE,
        InvasiveStatusColors[INVASIVE_STATUS.INVASIVE][0],
        INVASIVE_STATUS.NATIVE,
        InvasiveStatusColors[INVASIVE_STATUS.NATIVE][0],
        InvasiveStatusColors[INVASIVE_STATUS.UNKNOWN][0],
    ],
    "circle-stroke-color": [
        ...baseSymbols["circle-stroke-color"],
        [
            "match",
            ["get", "INVASIVE_STATUS"],
            INVASIVE_STATUS.INVASIVE,
            InvasiveStatusColors[INVASIVE_STATUS.INVASIVE][1],
            INVASIVE_STATUS.NATIVE,
            InvasiveStatusColors[INVASIVE_STATUS.NATIVE][1],
            InvasiveStatusColors[INVASIVE_STATUS.UNKNOWN][1],
        ],
    ],
};

export default vectorOcurranceSymbols;
