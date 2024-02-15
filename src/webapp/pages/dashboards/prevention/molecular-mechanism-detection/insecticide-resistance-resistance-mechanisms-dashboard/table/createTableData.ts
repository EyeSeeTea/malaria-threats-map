import { PreventionStudy } from "../../../../../../../domain/entities/PreventionStudy";
import { TableData } from "./TableData";
import * as R from "ramda";
import {
    filterByInsecticideClass,
    filterByProxyType,
    filterByResistanceMechanism,
    filterByResistanceStatus,
} from "../../../../../../components/layers/studies-filters";
import i18next from "i18next";
import _ from "lodash";

export function createTableData(studies: PreventionStudy[]): TableData[] {
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
                const { percentage: pyrethroidsPercentage, sorted: sortedPyrethroidsStudies } = resolvePyrethroids(
                    "PYRETHROIDS",
                    countrySpeciesStudies
                );
                const { percentage: organochlorinesPercentage, sorted: sortedOrganochlorinesStudies } =
                    resolvePyrethroids("ORGANOCHLORINES", countrySpeciesStudies);
                const { percentage: carbamatesPercentage, sorted: sortedCarbamatesStudies } = resolvePyrethroids(
                    "CARBAMATES",
                    countrySpeciesStudies
                );
                const { percentage: organophosphatesPercentage, sorted: sortedOrganophosphatesStudies } =
                    resolvePyrethroids("ORGANOPHOSPHATES", countrySpeciesStudies);

                const monoOxygenases = resolveMechanism("MONO_OXYGENASES", countrySpeciesStudies);
                const esterases = resolveMechanism("ESTERASES", countrySpeciesStudies);
                const gsts = resolveMechanism("GSTS", countrySpeciesStudies);
                const kdrL1014s = resolveMechanism("KDR_L1014S", countrySpeciesStudies);
                const kdrL1014f = resolveMechanism("KDR_L1014F", countrySpeciesStudies);
                const kdrUnspecified = resolveMechanism("KDR_(MUTATION_UNSPECIFIED)", countrySpeciesStudies);
                const ace1r = resolveMechanism("ACE1R", countrySpeciesStudies);

                return {
                    ID: `${country}_${species}`,
                    ISO2: country,
                    COUNTRY: i18next.t(`countries.${country}`, { defaultValue: i18next.t(country) }),
                    COUNTRY_NUMBER: entries.length,
                    SPECIES: species,
                    INSECTICIDE_CLASSES: `${insecticideClasses.length}`,
                    PYRETHROIDS_AVERAGE_MORTALITY: pyrethroidsPercentage,
                    PYRETHROIDS_LAST_YEAR: `${
                        sortedPyrethroidsStudies.length ? sortedPyrethroidsStudies[0].YEAR_START : "-"
                    }`,
                    ORGANOCHLORINES_AVERAGE_MORTALITY: organochlorinesPercentage,
                    ORGANOCHLORINES_LAST_YEAR: `${
                        sortedOrganochlorinesStudies.length ? sortedOrganochlorinesStudies[0].YEAR_START : "-"
                    }`,

                    CARBAMATES_AVERAGE_MORTALITY: carbamatesPercentage,
                    CARBAMATES_LAST_YEAR: `${
                        sortedCarbamatesStudies.length ? sortedCarbamatesStudies[0].YEAR_START : "-"
                    }`,
                    ORGANOPHOSPHATES_AVERAGE_MORTALITY: organophosphatesPercentage,
                    ORGANOPHOSPHATES_LAST_YEAR: `${
                        sortedOrganophosphatesStudies.length ? sortedOrganophosphatesStudies[0].YEAR_START : "-"
                    }`,
                    MONOXYGENASES_PERCENT_SITES_DETECTED: monoOxygenases,
                    ESTERASES_PERCENT_SITES_DETECTED: esterases,
                    GSTS_PERCENT_SITES_DETECTED: gsts,
                    K1014S_PERCENT_SITES_DETECTED: kdrL1014s,
                    K1014F_PERCENT_SITES_DETECTED: kdrL1014f,
                    KDR_UNSPECIFIED_PERCENT_SITES_DETECTED: kdrUnspecified,
                    ACE1R_PERCENT_SITES_DETECTED: ace1r,
                };
            });
        })
    );

    const sortedRows = _.orderBy(rows, ["COUNTRY"], ["asc"]);

    return sortedRows;
}

export function resolvePyrethroids(insecticideClass: string, countrySpeciesStudies: PreventionStudy[]) {
    const studies = [filterByResistanceStatus, filterByInsecticideClass(insecticideClass)].reduce(
        (studies, filter) => studies.filter(filter),
        countrySpeciesStudies
    );
    const detectedPyrethroidsStudies = studies.filter(study => parseFloat(study.MORTALITY_ADJUSTED) < 0.9);
    const percentage: string = studies.length
        ? `${Number(((detectedPyrethroidsStudies.length * 100) / studies.length).toFixed(2))}% (${
              detectedPyrethroidsStudies.length
          })`
        : "-";

    const sorted = R.sortBy(study => -study.YEAR_START, studies);

    return {
        percentage,
        sorted,
    };
}

export function resolveMechanism(type: string, countrySpeciesStudies: PreventionStudy[]) {
    const studies = [filterByResistanceMechanism, filterByProxyType(type)].reduce(
        (studies, filter) => studies.filter(filter),
        countrySpeciesStudies
    );
    const detected = studies.filter(study => study.MECHANISM_STATUS === "DETECTED");
    const mechanism = studies.length ? `${(detected.length * 100) / studies.length}% (${detected.length})` : "-";

    return mechanism;
}
