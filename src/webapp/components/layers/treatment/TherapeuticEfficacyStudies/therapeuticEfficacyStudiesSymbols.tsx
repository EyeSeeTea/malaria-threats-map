import baseSymbols from "../../common/baseSymbols";
import { THERAPEUTIC_EFFICACY_STUDIES_STATUS } from "./utils";

export const TherapeuticEfficacyStudiesColors: { [key: string]: string[] } = {
    [THERAPEUTIC_EFFICACY_STUDIES_STATUS.ONGOING]: ["#5ABE86", "#4DA072"],
    [THERAPEUTIC_EFFICACY_STUDIES_STATUS.PLANNED]: ["#365694", "#2c4371"],
    [THERAPEUTIC_EFFICACY_STUDIES_STATUS.COMPLETED_RESULTS_PENDING]: ["#FD6F21", "#CC5C1E"],
    [THERAPEUTIC_EFFICACY_STUDIES_STATUS.UNKNOWN]: ["#d3d3d3", "#adadad"],
};

const PROPERTY = "THERAPEUTIC_EFFICACY_STUDIES_STATUS";

const therapeuticEfficacyStudiesSymbols = {
    ...baseSymbols,
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 2, 4, 7],
    "circle-color": [
        "match",
        ["get", PROPERTY],
        THERAPEUTIC_EFFICACY_STUDIES_STATUS.ONGOING,
        TherapeuticEfficacyStudiesColors[THERAPEUTIC_EFFICACY_STUDIES_STATUS.ONGOING][0],
        THERAPEUTIC_EFFICACY_STUDIES_STATUS.PLANNED,
        TherapeuticEfficacyStudiesColors[THERAPEUTIC_EFFICACY_STUDIES_STATUS.PLANNED][0],
        THERAPEUTIC_EFFICACY_STUDIES_STATUS.COMPLETED_RESULTS_PENDING,
        TherapeuticEfficacyStudiesColors[THERAPEUTIC_EFFICACY_STUDIES_STATUS.COMPLETED_RESULTS_PENDING][0],
        TherapeuticEfficacyStudiesColors[THERAPEUTIC_EFFICACY_STUDIES_STATUS.UNKNOWN][0],
    ],
    "circle-stroke-color": [
        ...baseSymbols["circle-stroke-color"],
        [
            "match",
            ["get", PROPERTY],
            THERAPEUTIC_EFFICACY_STUDIES_STATUS.ONGOING,
            TherapeuticEfficacyStudiesColors[THERAPEUTIC_EFFICACY_STUDIES_STATUS.ONGOING][1],
            THERAPEUTIC_EFFICACY_STUDIES_STATUS.PLANNED,
            TherapeuticEfficacyStudiesColors[THERAPEUTIC_EFFICACY_STUDIES_STATUS.PLANNED][1],
            THERAPEUTIC_EFFICACY_STUDIES_STATUS.COMPLETED_RESULTS_PENDING,
            TherapeuticEfficacyStudiesColors[THERAPEUTIC_EFFICACY_STUDIES_STATUS.COMPLETED_RESULTS_PENDING][1],
            TherapeuticEfficacyStudiesColors[THERAPEUTIC_EFFICACY_STUDIES_STATUS.UNKNOWN][1],
        ],
    ],
};

export default therapeuticEfficacyStudiesSymbols;
