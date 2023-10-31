import { InvasiveMapType } from "../../../store/types";
import vectorOcurranceSymbols from "./VectorOccurance/vector-ocurrance-symbols";
import * as R from "ramda";
import { INVASIVE_STATUS } from "./VectorOccurance/utils";

export const resolveMapTypeSymbols = () => {
    return vectorOcurranceSymbols;
};

const filterByMostRecentYear = (group: any[]) => {
    const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), group);
    if (!sortedStudies[0].YEAR_START) return group;
    // We filter all studies conducted that year.
    return R.filter(study => parseInt(study.YEAR_START) === parseInt(sortedStudies[0].YEAR_START), group);
};

export const InvasiveStatusOrder: { [value: string]: number } = {
    [INVASIVE_STATUS.UNKNOWN]: 0,
    [INVASIVE_STATUS.NATIVE]: 1,
    [INVASIVE_STATUS.INVASIVE]: 2,
};

function getByMostRecentYearAndInvasiveStatus(group: any[]) {
    const filteredStudies = filterByMostRecentYear(group);
    // We sort remaining records by RESISTANCE INTENSITY
    const filteredSortedStudies = R.sortBy(study => -InvasiveStatusOrder[study.INVASIVE_STATUS] || 0, filteredStudies);
    return filteredSortedStudies[0];
}

export const studySelector = (group: any[], mapType: InvasiveMapType) => {
    switch (mapType) {
        case InvasiveMapType.VECTOR_OCCURANCE:
            return getByMostRecentYearAndInvasiveStatus(group);
        default:
            return group[0];
    }
};
