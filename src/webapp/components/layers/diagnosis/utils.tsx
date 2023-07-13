import React from "react";
import * as R from "ramda";
import _ from "lodash";

import { DiagnosisFilters, DiagnosisMapType } from "../../../store/types";
import { DIAGNOSIS_STATUS } from "./GeneDeletions/utils";
import pfhrp2Symbols from "./GeneDeletions/symbols";
import hrp23StudiesSymbols from "./Hrp23Studies/symbols";
import { getHrp23StudiesStatusFromStatusId } from "./Hrp23Studies/utils";

export const resolveMapTypeSymbols = (diagnosisFilters: DiagnosisFilters) => {
    switch (diagnosisFilters.mapType) {
        case DiagnosisMapType.GENE_DELETIONS:
            return pfhrp2Symbols;
        case DiagnosisMapType.HRP23_STUDIES:
            return hrp23StudiesSymbols;
        default:
            return <span />;
    }
};

const filterByMostRecentYear = (group: any[]) => {
    const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), group);
    // We filter all studies conducted that year.
    return R.filter(study => parseInt(study.YEAR_START) === parseInt(sortedStudies[0].YEAR_START), group);
};

function getByMostRecentYearAndDeletionType(group: any[], deletionType: string) {
    const filteredStudies = filterByMostRecentYear(group);
    // We sort remaining records by RESISTANCE INTENSITY
    const filteredSortedStudies = R.sortBy(study => -study[deletionType] || 0, filteredStudies);
    return {
        ...filteredSortedStudies[0],
        DELETION_PERCENT:
            filteredSortedStudies[0][deletionType] > 0 ? DIAGNOSIS_STATUS.CONFIRMED : DIAGNOSIS_STATUS.NOT_IDENTIFIED,
    };
}

function getByStudySeqAndStudyStatus(group: any[]) {
    const sortedStudiesByStudySeq = _.orderBy(group, ["STUDY_SEQ"]);

    return {
        ...sortedStudiesByStudySeq[0],
        HRP23_STUDIES_STATUS: getHrp23StudiesStatusFromStatusId(sortedStudiesByStudySeq[0].SURV_STATUS),
    };
}

export const studySelector = (group: any[], mapType: DiagnosisMapType, deletionType: string) => {
    switch (mapType) {
        case DiagnosisMapType.GENE_DELETIONS:
            return getByMostRecentYearAndDeletionType(group, deletionType);
        case DiagnosisMapType.HRP23_STUDIES:
            return getByStudySeqAndStudyStatus(group);
        default:
            return group[0];
    }
};
