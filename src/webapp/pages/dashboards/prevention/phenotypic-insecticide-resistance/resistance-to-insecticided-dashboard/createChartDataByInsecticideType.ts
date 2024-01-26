import i18next from "i18next";
import _ from "lodash";
import { PreventionStudy } from "../../../../../../domain/entities/PreventionStudy";
import { sortInsecticideClasses } from "../../../../../components/filters/InsecticideClassFilter";
import { ResistanceStatusColors } from "../../../../../components/layers/prevention/ResistanceStatus/symbols";
import { ResistanceToInsecticideChartDataByType, ResistanceToInsecticideDataByType } from "../types";

export function createChartDataByInsecticideType(
    allStudies: PreventionStudy[],
    filteredStudies: PreventionStudy[],
    selectedCountries: string[],
    insecticideTypes: string[]
): ResistanceToInsecticideChartDataByType {
    if (insecticideTypes.length === 0) return { kind: "InsecticideByType", data: {} };

    const sortCountries = _.orderBy(selectedCountries, country => i18next.t(country), "asc");

    const result = sortCountries.reduce((acc, countryISO) => {
        const studiesByCountry = filteredStudies.filter(study => study.ISO2 === countryISO);

        const insecticityClasses = sortInsecticideClasses(
            _.uniq(studiesByCountry.map(study => study.INSECTICIDE_CLASS))
        );

        const accByInsecityceClass = insecticityClasses.reduce(
            (acc: ResistanceToInsecticideDataByType, insecticityClass: string) => {
                const studiesByInsecticideClass = studiesByCountry.filter(
                    study => study.INSECTICIDE_CLASS === insecticityClass
                );

                const finalInsecticideTypes = _.uniq(
                    allStudies
                        .filter(
                            study =>
                                study.INSECTICIDE_CLASS === insecticityClass &&
                                insecticideTypes.includes(study.INSECTICIDE_TYPE)
                        )
                        .map(study => study.INSECTICIDE_TYPE)
                ).sort();

                const resistanceConfirmed = createSerieByStatusAndInsecticideType(
                    studiesByInsecticideClass,
                    finalInsecticideTypes,
                    "CONFIRMED_RESISTANCE",
                    i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.confirmed"),
                    ResistanceStatusColors.Confirmed[0]
                );

                const resistancePosible = createSerieByStatusAndInsecticideType(
                    studiesByInsecticideClass,
                    finalInsecticideTypes,
                    "POSSIBLE_RESISTANCE",
                    i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.possible"),
                    ResistanceStatusColors.Possible[0]
                );

                const resistanceSusceptible = createSerieByStatusAndInsecticideType(
                    studiesByInsecticideClass,
                    finalInsecticideTypes,
                    "SUSCEPTIBLE",
                    i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.susceptible"),
                    ResistanceStatusColors.Susceptible[0]
                );

                const countrySeries = {
                    ...acc[countryISO],
                    [insecticityClass]: {
                        categories: finalInsecticideTypes.map(insecticideType => i18next.t(insecticideType)),
                        series: [resistanceSusceptible, resistancePosible, resistanceConfirmed],
                    },
                };

                return {
                    ...acc,
                    [countryISO]: countrySeries,
                };
            },
            acc
        );

        return {
            ...acc,
            ...accByInsecityceClass,
        };
    }, {});

    return { kind: "InsecticideByType", data: result };
}

function createSerieByStatusAndInsecticideType(
    studies: PreventionStudy[],
    insecticideTypes: string[],
    resitanceStatus: string,
    name: string,
    color: string
) {
    const resistanceConfirmedStudies = studies.filter(study => study.RESISTANCE_STATUS === resitanceStatus);

    const serie = {
        type: "bar" as const,
        name,
        color,
        data: getCountByInsecticideType(resistanceConfirmedStudies, insecticideTypes),
    };
    return serie;
}

function getCountByInsecticideType(studies: PreventionStudy[], insecticideTypes: string[]) {
    return insecticideTypes.map(insecticideType => {
        const studiesByType = studies.filter(study => study.INSECTICIDE_TYPE === insecticideType);

        return _(studiesByType)
            .groupBy(study => study.SITE_ID)
            .keys()
            .value().length;
    });
}
