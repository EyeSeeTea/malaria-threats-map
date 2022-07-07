import React from "react";
import resistanceStatusSymbols, { ResistanceStatusColors }  from "./ResistanceStatus/symbols";
import intensityStatusSymbols from "./IntensityStatus/symbols";
import resistanceMechanismSymbols from "./ResistanceMechanisms/symbols";
import levelOfInvolvementSymbols from "./Involvement/symbols";
import { default as ResistanceStatusLegend } from "./ResistanceStatus/legend";
import { default as IntensityStatusLegend } from "./IntensityStatus/legend";
import { default as ResistanceMechanismsLegend } from "./ResistanceMechanisms/legend";
import { PreventionFilters, PreventionMapType } from "../../../store/types";
import * as R from "ramda";
import { filterByAssayTypes, filterByInsecticideClass, filterByType, filterByYearRange } from "../studies-filters";
import CountrySymbols from "./Countries/PreventionCountrySymbols";
import PreventionCountryLegend from "./Countries/PreventionCountryLegend";
import LevelOfInvolvementLegend from "./Involvement/LevelOfInvolvementLegend";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";
import _ from "lodash";

export const resolveMapTypeSymbols = (preventionFilters: PreventionFilters, countryMode: boolean) => {
    if (countryMode) {
        return CountrySymbols;
    }
    switch (preventionFilters.mapType) {
        case PreventionMapType.RESISTANCE_STATUS:
            return resistanceStatusSymbols;
        case PreventionMapType.INTENSITY_STATUS:
            return intensityStatusSymbols;
        case PreventionMapType.RESISTANCE_MECHANISM:
            return resistanceMechanismSymbols;
        case PreventionMapType.LEVEL_OF_INVOLVEMENT:
            return levelOfInvolvementSymbols;
        default:
            return;
    }

};

export const resolveMapTypeLegend = (preventionFilters: PreventionFilters, countryMode: boolean) => {
    if (countryMode) {
        <PreventionCountryLegend />;
    }
    switch (preventionFilters.mapType) {
        case PreventionMapType.RESISTANCE_STATUS:
            return <ResistanceStatusLegend />;
        case PreventionMapType.INTENSITY_STATUS:
            return <IntensityStatusLegend />;
        case PreventionMapType.RESISTANCE_MECHANISM:
            return <ResistanceMechanismsLegend />;
        case PreventionMapType.LEVEL_OF_INVOLVEMENT:
            return <LevelOfInvolvementLegend />;
        default:
            return <span />;
    }
};

export type PboCriteria = {
    criteria1?: boolean;
    criteria2?: boolean;
    criteria3?: boolean;
};

export function filterByCriteria1(group: PreventionStudy[]) {
    const currentYear = new Date().getFullYear();
    const baseStudies = [
        filterByAssayTypes(["DISCRIMINATING_CONCENTRATION_BIOASSAY"]),
        filterByInsecticideClass("PYRETHROIDS"),
    ].reduce((studies, filter) => studies.filter(filter), group);
    let filteredStudies = baseStudies.filter(filterByYearRange([currentYear - 3, currentYear - 0]));
    if (filteredStudies.length === 0) {
        const maxYear = R.reduce(
            R.max,
            0,
            baseStudies.map(study => parseInt(study.YEAR_START))
        );
        filteredStudies = baseStudies.filter(study => maxYear === parseInt(study.YEAR_START));
    }
    return filteredStudies;
}

export function getMostRecentByCriteria1(studies: PreventionStudy[]): PreventionStudy | undefined {
    const studiesByCriteria1 = studies.filter(study => +study.MORTALITY_ADJUSTED < 0.9);

    const sortedStudiesByYear = R.reverse(R.sortBy(R.prop("YEAR_START"), studiesByCriteria1));

    return sortedStudiesByYear.length > 0 ? sortedStudiesByYear[0] : undefined;
}

export function getMostRecentByCriteria2(studies: PreventionStudy[]): PreventionStudy | undefined {
    const studiesByCriteria2 = studies.filter(
        study => +study.MORTALITY_ADJUSTED >= 0.1 && +study.MORTALITY_ADJUSTED <= 0.8
    );

    const sortedStudiesByYear = R.reverse(R.sortBy(R.prop("YEAR_START"), studiesByCriteria2));

    return sortedStudiesByYear.length > 0 ? sortedStudiesByYear[0] : undefined;
}

export function filterByCriteria3(group: PreventionStudy[]) {
    const filteredStudies = [
        filterByAssayTypes(["SYNERGIST-INSECTICIDE_BIOASSAY", "BIOCHEMICAL_ASSAY", "MOLECULAR_ASSAY"]),
        filterByType("MONO_OXYGENASES"),
    ].reduce((studies, filter) => studies.filter(filter), group);

    return filteredStudies;
}

export function getMostRecentByCriteria3(studies: PreventionStudy[]): PreventionStudy | undefined {
    const studiesByCriteria1 = studies.filter(study => study.MECHANISM_STATUS === "DETECTED");

    const sortedStudiesByYear = R.reverse(R.sortBy(R.prop("YEAR_START"), studiesByCriteria1));

    return sortedStudiesByYear.length > 0 ? sortedStudiesByYear[0] : undefined;
}

export function getMostRecent(studies: PreventionStudy[]): PreventionStudy | undefined {
    const sortedStudiesByYear = R.reverse(R.sortBy(R.prop("YEAR_START"), studies));

    return sortedStudiesByYear.length > 0 ? sortedStudiesByYear[0] : undefined;
}

const filterByMostRecentYear = (group: any[]) => {
    const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), group);
    // We filter all studies conducted that year.
    return R.filter(study => parseInt(study.YEAR_START) === parseInt(sortedStudies[0].YEAR_START), group);
};

function getByMostRecentYearAndMortalityAdjusted(group: any[]) {
    const filteredStudies = filterByMostRecentYear(group);
    // We sort remaining records by MORTALITY_ADJUSTED
    const filteredSortedStudies = R.sortBy(study => parseFloat(study.MORTALITY_ADJUSTED), filteredStudies);
    return filteredSortedStudies[0];
}

const ResistanceIntensityOrder: { [value: string]: number } = {
    NA: 0,
    COULD_NOT_BE_RELIABLY_ASSESSED: 0,
    SUSCEPTIBLE: 1,
    LOW_INTENSITY: 2,
    MODERATE_INTENSITY: 3,
    MODERATE_TO_HIGH_INTENSITY: 4,
    HIGH_INTENSITY: 5,
};

function getByMostRecentYearAndResistanceIntensity(group: any[]) {
    const filteredStudies = filterByMostRecentYear(group);
    // We sort remaining records by RESISTANCE INTENSITY
    const filteredSortedStudies = R.sortBy(
        study => -ResistanceIntensityOrder[study.RESISTANCE_INTENSITY] || 0,
        filteredStudies
    );
    return filteredSortedStudies[0];
}

const ResistanceMechanismOrder: { [value: string]: number } = {
    NA: 0,
    NOT_DETECTED: 0,
    DETECTED: 1,
};

function getByMostRecentYearAndResistanceMechanism(group: any[]) {
    const filteredStudies = filterByMostRecentYear(group);
    // We sort remaining records by RESISTANCE INTENSITY
    const filteredSortedStudies = R.sortBy(
        study => -ResistanceMechanismOrder[study.MECHANISM_STATUS] || 0,
        filteredStudies
    );
    return filteredSortedStudies[0];
}

const InvolvementOrder: { [value: string]: number } = {
    COULD_NOT_BE_RELIABLY_ASSESSED: 0,
    NO_INVOLVEMENT: 0,
    PARTIAL_INVOLVEMENT: 1,
    FULL_INVOLVEMENT: 2,
};

function getByMostRecentYearAndInvolvement(group: any[]) {
    const filteredStudies = filterByMostRecentYear(group);
    // We sort remaining records by RESISTANCE INTENSITY
    const filteredSortedStudies = R.sortBy(study => -InvolvementOrder[study.MECHANISM_PROXY] || 0, filteredStudies);
    return filteredSortedStudies[0];
}

function getChlorfenapyrAllStudiesEvaluation(group: any[]) {
    const chlorfenapyrResistanceStatus = group.map(study => study.RESISTANCE_STATUS);
    const countConfirmedResistance = _.countBy(chlorfenapyrResistanceStatus);
    let groupColor: string[];
    if(countConfirmedResistance["CONFIRMED_RESISTANCE"] >= 3) {
        groupColor = ResistanceStatusColors.Confirmed;
    }
    else if(countConfirmedResistance["UNDETERMINED"] === chlorfenapyrResistanceStatus.length) {
        groupColor = ResistanceStatusColors.Undetermined;
    }
    else if(countConfirmedResistance["SUSCEPTIBLE"] === chlorfenapyrResistanceStatus.length) {
        groupColor = ResistanceStatusColors.Susceptible;
    }
    else groupColor = ResistanceStatusColors.Possible;

    const changedGroup = group.map(study => (
        {
            ...study,
            RESISTANCE_STATUS_COLOR: groupColor
        }));
    return getByMostRecentYearAndMortalityAdjusted(changedGroup);
}

export const studySelector = (group: any[], mapType: PreventionMapType, insecticideClass: string) => {
    if(mapType === PreventionMapType.RESISTANCE_STATUS && insecticideClass === "PYRROLES") {
        return getChlorfenapyrAllStudiesEvaluation(group);
    }
    switch (mapType) {
        case PreventionMapType.RESISTANCE_STATUS:
            return getByMostRecentYearAndMortalityAdjusted(group);
        case PreventionMapType.INTENSITY_STATUS:
            return getByMostRecentYearAndResistanceIntensity(group);
        case PreventionMapType.RESISTANCE_MECHANISM:
            return getByMostRecentYearAndResistanceMechanism(group);
        case PreventionMapType.LEVEL_OF_INVOLVEMENT:
            return getByMostRecentYearAndInvolvement(group);
        default:
            return group[0];
    }
};
