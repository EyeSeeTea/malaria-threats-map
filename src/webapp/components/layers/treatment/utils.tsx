import React from "react";
import { TreatmentFilters, TreatmentMapType } from "../../../store/types";
import treatmentLayerSymbols from "./TreatmentFailure/treatmentLayerSymbols";
import delayedParasiteClearanceSymbols from "./DelayedParasiteClearance/delayedParasiteClearanceSymbols";
import molecularMarkerSymbols from "./MolecularMarkers/molecularMarkerSymbols";
import * as R from "ramda";
import { TREATMENT_FAILURE_STATUS } from "./TreatmentFailure/utils";
import { DELAYED_PARASITE_CLEARANCE_STATUS } from "./DelayedParasiteClearance/utils";
import { MOLECULAR_MARKER_STATUS } from "./MolecularMarkers/utils";
import { MolecularMarkerStudy, TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import therapeuticEfficacyStudiesSymbols from "./TherapeuticEfficacyStudies/therapeuticEfficacyStudiesSymbols";
import {
    getTherapeuticEfficacyStudiesStatusFromStatusId,
    sortTherapeuticEfficacyStudies,
} from "./TherapeuticEfficacyStudies/utils";

export const resolveMapTypeSymbols = (treatmentFilters: TreatmentFilters) => {
    switch (treatmentFilters.mapType) {
        case TreatmentMapType.TREATMENT_FAILURE:
            return treatmentLayerSymbols;
        case TreatmentMapType.DELAYED_PARASITE_CLEARANCE:
            return delayedParasiteClearanceSymbols;
        case TreatmentMapType.MOLECULAR_MARKERS:
            return molecularMarkerSymbols;
        case TreatmentMapType.THERAPEUTIC_EFFICACY_STUDIES:
            return therapeuticEfficacyStudiesSymbols;
        default:
            return <span />;
    }
};

const filterByMostRecentYear = (group: any[]) => {
    const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), group);
    // We filter all studies conducted that year.
    return R.filter(study => parseInt(study.YEAR_START) === parseInt(sortedStudies[0].YEAR_START), group);
};

const resolveTreatmentFailureStatus = (percentage: number) => {
    if (percentage > 0.2) {
        return TREATMENT_FAILURE_STATUS.HIGH;
    } else if (percentage > 0.1 && percentage <= 0.2) {
        return TREATMENT_FAILURE_STATUS.MEDIUM_HIGH;
    } else if (percentage > 0.05 && percentage <= 0.1) {
        return TREATMENT_FAILURE_STATUS.MEDIUM;
    } else if (percentage <= 0.05) {
        return TREATMENT_FAILURE_STATUS.LOW;
    }
    return TREATMENT_FAILURE_STATUS.UNKNOWN;
};

function getByMostRecentYearAndTreatmentFailure(group: any[]) {
    const enrichedGroup = group.map(study => ({
        ...study,
        TREATMENT_FAILURE:
            study.TREATMENT_FAILURE_PP.trim() !== "NA" ? study.TREATMENT_FAILURE_PP : study.TREATMENT_FAILURE_KM,
    }));
    const filteredStudies = filterByMostRecentYear(enrichedGroup);
    // We sort remaining records by RESISTANCE INTENSITY
    const filteredSortedStudies = R.sortBy(study => -study.TREATMENT_FAILURE, filteredStudies);
    return {
        ...filteredSortedStudies[0],
        TREATMENT_FAILURE_STATUS: resolveTreatmentFailureStatus(filteredSortedStudies[0].TREATMENT_FAILURE),
    };
}

const resolveDelayedParasiteClearanceStatus = (percentage: number) => {
    if (percentage > 0.2) {
        return DELAYED_PARASITE_CLEARANCE_STATUS.HIGH;
    } else if (percentage > 0.1 && percentage <= 0.2) {
        return DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM_HIGH;
    } else if (percentage > 0.05 && percentage <= 0.1) {
        return DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM;
    } else if (percentage <= 0.05) {
        return DELAYED_PARASITE_CLEARANCE_STATUS.LOW;
    }
    return DELAYED_PARASITE_CLEARANCE_STATUS.UNKNOWN;
};

function getByMostRecentYearAndPositiveDay3(group: any[]) {
    const filteredStudies = filterByMostRecentYear(group);
    // We sort remaining records by RESISTANCE INTENSITY
    const filteredSortedStudies = R.sortBy(study => -study.POSITIVE_DAY_3, filteredStudies);
    return {
        ...filteredSortedStudies[0],
        DELAYED_PARASITE_CLEARANCE_STATUS: resolveDelayedParasiteClearanceStatus(
            filteredSortedStudies[0].POSITIVE_DAY_3
        ),
    };
}

const resolveMolecularMarker = (value: number) => {
    if (value > 0.8) {
        return MOLECULAR_MARKER_STATUS.HIGH;
    } else if (value > 0.5 && value <= 0.8) {
        return MOLECULAR_MARKER_STATUS.MEDIUM_HIGH;
    } else if (value > 0.1 && value <= 5) {
        return MOLECULAR_MARKER_STATUS.MEDIUM;
    } else if (value <= 0.1) {
        return MOLECULAR_MARKER_STATUS.LOW;
    }
    return MOLECULAR_MARKER_STATUS.UNKNOWN;
};

export function getMolecularMarkerStudies(studies: TreatmentStudy[]): MolecularMarkerStudy[] {
    return studies.map(study => {
        const value = study.groupStudies.reduce((acc: number, item: any) => {
            return acc + (item.GENOTYPE === "WT" ? 0 : parseFloat(item.PROPORTION));
        }, 0);
        return { ...study, VALUE: value };
    });
}

function getByMostRecentYearAndMolecularMarker(group: any[]) {
    const filteredStudies = filterByMostRecentYear(group);

    const valueStudies = getMolecularMarkerStudies(filteredStudies);

    // We sort remaining records by RESISTANCE INTENSITY
    const filteredSortedStudies = R.sortBy(study => -study.VALUE, valueStudies);
    return {
        ...filteredSortedStudies[0],
        MOLECULAR_MARKER_STATUS: resolveMolecularMarker(filteredSortedStudies[0].VALUE),
    };
}

function getByStudySeqAndTherapeuticEfficacyStudiesStatus(group: TreatmentStudy[]) {
    const sortedStudiesByStudySeq = sortTherapeuticEfficacyStudies(group);

    return {
        ...sortedStudiesByStudySeq[0],
        THERAPEUTIC_EFFICACY_STUDIES_STATUS: getTherapeuticEfficacyStudiesStatusFromStatusId(
            sortedStudiesByStudySeq[0].SURV_STATUS
        ),
    };
}

export const studySelector = (group: any[], mapType: TreatmentMapType) => {
    switch (mapType) {
        case TreatmentMapType.TREATMENT_FAILURE:
            return getByMostRecentYearAndTreatmentFailure(group);
        case TreatmentMapType.DELAYED_PARASITE_CLEARANCE:
            return getByMostRecentYearAndPositiveDay3(group);
        case TreatmentMapType.MOLECULAR_MARKERS:
            return getByMostRecentYearAndMolecularMarker(group);
        case TreatmentMapType.THERAPEUTIC_EFFICACY_STUDIES:
            return getByStudySeqAndTherapeuticEfficacyStudiesStatus(group);
        default:
            return group[0];
    }
};
