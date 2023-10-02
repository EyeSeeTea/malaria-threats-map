import { PreventionStudy } from "../../../../../../../domain/entities/PreventionStudy";
import { TableData } from "./TableData";
import * as R from "ramda";
import {
    filterByInsecticideClass,
    filterByResistanceMechanism,
    filterByType,
} from "../../../../../../components/layers/studies-filters";
import i18next from "i18next";
import _ from "lodash";

export function createTableData(studies: PreventionStudy[]) {
    const countryStudyGroups = R.groupBy((study: PreventionStudy) => `${study.ISO2}`, studies);

    const rows: TableData[] = R.flatten(
        Object.entries(countryStudyGroups).map(([country, countryStudies]) => {
            const countrySpeciesGroup = R.groupBy((study: PreventionStudy) => `${study.SPECIES}`, countryStudies);

            const insecticideClasses = R.uniqBy(
                study => study.INSECTICIDE_CLASS,
                countryStudies.filter(study => parseFloat(study.MORTALITY_ADJUSTED) < 0.9)
            );

            const entries = Object.entries(countrySpeciesGroup);
            return entries.map(([species, countrySpeciesStudies]) => {
                const {
                    percentage: pyrethroidsPercentage,
                    sorted: sortedPyrethroidsStudies,
                    n: pyrethroidsStudies,
                } = resolvePyrethroids("PYRETHROIDS", countrySpeciesStudies);
                const {
                    percentage: organochlorinesPercentage,
                    sorted: sortedOrganochlorinesStudies,
                    n: organochlorinesStudies,
                } = resolvePyrethroids("ORGANOCHLORINES", countrySpeciesStudies);
                const {
                    percentage: carbamatesPercentage,
                    sorted: sortedCarbamatesStudies,
                    n: carbamatesStudies,
                } = resolvePyrethroids("CARBAMATES", countrySpeciesStudies);
                const {
                    percentage: organophosphatesPercentage,
                    sorted: sortedOrganophosphatesStudies,
                    n: organophosphatesStudies,
                } = resolvePyrethroids("ORGANOPHOSPHATES", countrySpeciesStudies);

                const { percentage: monoOxygenases, n: monoOxygenasesNumber } = resolveMechanism(
                    "MONO_OXYGENASES",
                    countrySpeciesStudies
                );
                const { percentage: esterases, n: esterasesNumber } = resolveMechanism(
                    "ESTERASES",
                    countrySpeciesStudies
                );
                const { percentage: gsts, n: gstsNumber } = resolveMechanism("GSTS", countrySpeciesStudies);
                const { percentage: kdrL1014s, n: kdrL1014sNumber } = resolveMechanism(
                    "KDR_L1014S",
                    countrySpeciesStudies
                );
                const { percentage: kdrL1014f, n: kdrL1014fNumber } = resolveMechanism(
                    "KDR_L1014F",
                    countrySpeciesStudies
                );
                const { percentage: kdrUnspecified, n: kdrUnspecifiedNumber } = resolveMechanism(
                    "KDR_(MUTATION_UNSPECIFIED)",
                    countrySpeciesStudies
                );
                const { percentage: ace1r, n: ace1rNumber } = resolveMechanism("ACE1R", countrySpeciesStudies);

                return {
                    ID: `${country}_${species}`,
                    ISO2: country,
                    COUNTRY: i18next.t(country),
                    COUNTRY_NUMBER: entries.length,
                    SPECIES: species,
                    INSECTICIDE_CLASSES: `${insecticideClasses.length}`,
                    PYRETHROIDS_AVERAGE_MORTALITY: pyrethroidsPercentage,
                    PYRETHROIDS_LAST_YEAR: `${
                        sortedPyrethroidsStudies.length ? sortedPyrethroidsStudies[0].YEAR_START : "-"
                    }`,
                    PYRETHROIDS_N: pyrethroidsStudies,
                    ORGANOCHLORINES_AVERAGE_MORTALITY: organochlorinesPercentage,
                    ORGANOCHLORINES_LAST_YEAR: `${
                        sortedOrganochlorinesStudies.length ? sortedOrganochlorinesStudies[0].YEAR_START : "-"
                    }`,

                    ORGANOCHLORINES_N: organochlorinesStudies,
                    CARBAMATES_AVERAGE_MORTALITY: carbamatesPercentage,
                    CARBAMATES_LAST_YEAR: `${
                        sortedCarbamatesStudies.length ? sortedCarbamatesStudies[0].YEAR_START : "-"
                    }`,
                    CARBAMATES_N: carbamatesStudies,
                    ORGANOPHOSPHATES_AVERAGE_MORTALITY: organophosphatesPercentage,
                    ORGANOPHOSPHATES_LAST_YEAR: `${
                        sortedOrganophosphatesStudies.length ? sortedOrganophosphatesStudies[0].YEAR_START : "-"
                    }`,
                    ORGANOPHOSPHATES_N: organophosphatesStudies,
                    MONOXYGENASES_PERCENT_SITES_DETECTED: monoOxygenases,
                    MONOXYGENASES_PERCENT_SITES_DETECTED_NUMBER_SITES: monoOxygenasesNumber,
                    ESTERASES_PERCENT_SITES_DETECTED: esterases,
                    ESTERASES_PERCENT_SITES_DETECTED_NUMBER_SITES: esterasesNumber,
                    GSTS_PERCENT_SITES_DETECTED: gsts,
                    GSTS_PERCENT_SITES_DETECTED_NUMBER_SITES: gstsNumber,
                    K1014S_PERCENT_SITES_DETECTED: kdrL1014s,
                    K1014S_PERCENT_SITES_DETECTED_NUMBER_SITES: kdrL1014sNumber,
                    K1014F_PERCENT_SITES_DETECTED: kdrL1014f,
                    K1014F_PERCENT_SITES_DETECTED_NUMBER_SITES: kdrL1014fNumber,
                    KDR_UNSPECIFIED_PERCENT_SITES_DETECTED: kdrUnspecified,
                    KDR_UNSPECIFIED_PERCENT_SITES_DETECTED_NUMBER_SITES: kdrUnspecifiedNumber,
                    ACE1R_PERCENT_SITES_DETECTED: ace1r,
                    ACE1R_PERCENT_SITES_DETECTED_NUMBER_SITES: ace1rNumber,
                };
            });
        })
    );

    const sortedRows = _.orderBy(rows, ["COUNTRY"], ["asc"]);

    return sortedRows;
}

export function resolvePyrethroids(insecticideClass: string, countrySpeciesStudies: PreventionStudy[]) {
    const studies = countrySpeciesStudies.filter(filterByInsecticideClass(insecticideClass));
    const detectedPyrethroidsStudies = studies.filter(study => parseFloat(study.MORTALITY_ADJUSTED) < 0.9);
    const percentage: number | "-" = studies.length
        ? Number(((detectedPyrethroidsStudies.length * 100) / studies.length).toFixed(2))
        : "-";
    const sorted = R.sortBy(study => -parseInt(study.YEAR_START), studies);
    return {
        percentage,
        sorted,
        n: detectedPyrethroidsStudies.length,
    };
}

export function resolveMechanism(type: string, countrySpeciesStudies: PreventionStudy[]) {
    const studies = [filterByResistanceMechanism, filterByType(type)].reduce(
        (studies, filter) => studies.filter(filter),
        countrySpeciesStudies
    );
    const detected = studies.filter(study => study.MECHANISM_STATUS === "DETECTED");
    const percentage = (detected.length * 100) / studies.length;
    return {
        percentage,
        n: detected.length,
    };
}
