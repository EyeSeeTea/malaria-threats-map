import { PreventionStudy } from "../../../../../../../domain/entities/PreventionStudy";
import { GraphData } from "./GraphData";
import * as R from "ramda";
import {
    filterByInsecticideClass,
    filterByResistanceMechanism,
    filterByResistanceStatus,
    filterByType,
} from "../../../../../../components/layers/studies-filters";
import i18next from "i18next";

export function createGraphData(studies: PreventionStudy[]): GraphData[] {
    const countryStudyGroups = R.groupBy((study: PreventionStudy) => `${study.ISO2}`, studies);

    const rows: GraphData[] = R.flatten(
        Object.entries(countryStudyGroups).map(([country, countryStudies]) => {
            const countrySpeciesGroup = R.groupBy((study: PreventionStudy) => `${study.SPECIES}`, countryStudies);

            const entries = Object.entries(countrySpeciesGroup);
            return entries.map(([species, countrySpeciesStudies]) => {
                const { percentage: pyrethroidsPercentage, n: pyrethroidsStudies } = resolvePyrethroids(
                    "PYRETHROIDS",
                    countrySpeciesStudies
                );
                const { percentage: organochlorinesPercentage, n: organochlorinesStudies } = resolvePyrethroids(
                    "ORGANOCHLORINES",
                    countrySpeciesStudies
                );
                const { percentage: carbamatesPercentage, n: carbamatesStudies } = resolvePyrethroids(
                    "CARBAMATES",
                    countrySpeciesStudies
                );
                const { percentage: organophosphatesPercentage, n: organophosphatesStudies } = resolvePyrethroids(
                    "ORGANOPHOSPHATES",
                    countrySpeciesStudies
                );

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
                    PYRETHROIDS_AVERAGE_MORTALITY: pyrethroidsPercentage,

                    PYRETHROIDS_N: pyrethroidsStudies,
                    ORGANOCHLORINES_AVERAGE_MORTALITY: organochlorinesPercentage,

                    ORGANOCHLORINES_N: organochlorinesStudies,
                    CARBAMATES_AVERAGE_MORTALITY: carbamatesPercentage,

                    CARBAMATES_N: carbamatesStudies,
                    ORGANOPHOSPHATES_AVERAGE_MORTALITY: organophosphatesPercentage,

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

    return rows;
}

export function resolvePyrethroids(insecticideClass: string, countrySpeciesStudies: PreventionStudy[]) {
    const studies = [filterByResistanceStatus, filterByInsecticideClass(insecticideClass)].reduce(
        (studies, filter) => studies.filter(filter),
        countrySpeciesStudies
    );

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
