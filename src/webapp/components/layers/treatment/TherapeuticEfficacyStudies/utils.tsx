import _ from "lodash";
import { TreatmentStudy } from "../../../../../domain/entities/TreatmentStudy";

export enum THERAPEUTIC_EFFICACY_STUDIES_STATUS {
    ONGOING = "ONGOING",
    PLANNED = "PLANNED",
    COMPLETED_RESULTS_PENDING = "COMPLETED_RESULTS_PENDING",
    UNKNOWN = "UNKNOWN",
}

export const getTherapeuticEfficacyStudiesStatusFromStatusId = (statusId: number) => {
    const statusOptions: Record<string, number> = {
        [THERAPEUTIC_EFFICACY_STUDIES_STATUS.PLANNED]: 1,
        [THERAPEUTIC_EFFICACY_STUDIES_STATUS.ONGOING]: 2,
        [THERAPEUTIC_EFFICACY_STUDIES_STATUS.COMPLETED_RESULTS_PENDING]: 3,
    };

    if (statusOptions[THERAPEUTIC_EFFICACY_STUDIES_STATUS.PLANNED] === statusId) {
        return THERAPEUTIC_EFFICACY_STUDIES_STATUS.PLANNED;
    }

    if (statusOptions[THERAPEUTIC_EFFICACY_STUDIES_STATUS.ONGOING] === statusId) {
        return THERAPEUTIC_EFFICACY_STUDIES_STATUS.ONGOING;
    }

    if (statusOptions[THERAPEUTIC_EFFICACY_STUDIES_STATUS.COMPLETED_RESULTS_PENDING] === statusId) {
        return THERAPEUTIC_EFFICACY_STUDIES_STATUS.COMPLETED_RESULTS_PENDING;
    }

    return THERAPEUTIC_EFFICACY_STUDIES_STATUS.UNKNOWN;
};

export const sortTherapeuticEfficacyStudies = (studies: TreatmentStudy[]) => {
    return _.orderBy(studies, ["STUDY_SEQ"]);
};
