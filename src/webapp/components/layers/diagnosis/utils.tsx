import React from "react";
import pfhrp2Symbols from "./GeneDeletions/symbols";
import Pfhrp2Legend from "./GeneDeletions/legend";
import { DiagnosisFilters, DiagnosisMapType } from "../../../store/types";
import * as R from "ramda";
import { DIAGNOSIS_STATUS } from "./GeneDeletions/utils";
import DiagnosisCountrySymbols from "./Countries/DiagnosisCountrySymbols";
import DiagnosisCountryLegend from "./Countries/DiagnosisCountryLegend";

export const resolveMapTypeSymbols = (diagnosisFilters: DiagnosisFilters, countryMode: boolean) => {
    if (countryMode) {
        return DiagnosisCountrySymbols;
    }
    return pfhrp2Symbols;
};

export const resolveMapTypeLegend = (diagnosisFilters: DiagnosisFilters, countryMode: boolean) => {
    if (countryMode) {
        return <DiagnosisCountryLegend />;
    }
    return <Pfhrp2Legend />;
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

export const studySelector = (group: any[], mapType: DiagnosisMapType, deletionType: string) => {
    if (mapType === DiagnosisMapType.GENE_DELETIONS) {
        return getByMostRecentYearAndDeletionType(group, deletionType);
    } else {
        return group[0];
    }
};
