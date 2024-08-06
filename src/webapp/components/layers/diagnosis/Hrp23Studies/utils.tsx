import _ from "lodash";
import { DiagnosisStudy } from "../../../../../domain/entities/DiagnosisStudy";

export enum HRP23_STUDIES_STATUS {
    ONGOING = "ONGOING",
    PLANNED = "PLANNED",
    COMPLETED = "COMPLETED",
    UNKNOWN = "UNKNOWN",
}

export const getHrp23StudiesStatusFromStatusId = (statusId: number) => {
    const statusOptions: Record<string, number> = {
        [HRP23_STUDIES_STATUS.PLANNED]: 1,
        [HRP23_STUDIES_STATUS.ONGOING]: 2,
        [HRP23_STUDIES_STATUS.COMPLETED]: 3,
    };

    if (statusOptions[HRP23_STUDIES_STATUS.PLANNED] === statusId) {
        return HRP23_STUDIES_STATUS.PLANNED;
    }

    if (statusOptions[HRP23_STUDIES_STATUS.ONGOING] === statusId) {
        return HRP23_STUDIES_STATUS.ONGOING;
    }

    if (statusOptions[HRP23_STUDIES_STATUS.COMPLETED] === statusId) {
        return HRP23_STUDIES_STATUS.COMPLETED;
    }

    return HRP23_STUDIES_STATUS.UNKNOWN;
};

export function sortHrp23Studies(studies: DiagnosisStudy[]) {
    return _.orderBy(studies, ["SURV_ID", "STUDY_SEQ"]);
}
