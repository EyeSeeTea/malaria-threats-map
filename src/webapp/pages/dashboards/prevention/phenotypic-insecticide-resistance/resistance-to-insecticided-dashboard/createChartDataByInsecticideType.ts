import i18next from "i18next";
import _ from "lodash";
import { PreventionStudy } from "../../../../../../domain/entities/PreventionStudy";
import { ResistanceStatusColors } from "../../../../../components/layers/prevention/ResistanceStatus/symbols";
import { PreventionFiltersState } from "../../filters/PreventionFiltersState";
import { ResistanceToInsecticideSeriesGroup } from "../types";

export function createChartDataByInsecticideType(
    allStudies: PreventionStudy[],
    filteredStudies: PreventionStudy[],
    selectedCountries: string[],
    filters: PreventionFiltersState
): ResistanceToInsecticideSeriesGroup {
    if (filters.insecticideTypes.length === 0) return {};

    const result = selectedCountries.reduce((acc, countryISO) => {
        const studiesByCountry = filteredStudies.filter(study => study.ISO2 === countryISO);

        const insecticityClasses = _.uniq(studiesByCountry.map(study => study.INSECTICIDE_CLASS));

        const accByInsecityceClass = insecticityClasses.reduce(
            (acc: ResistanceToInsecticideSeriesGroup, insecticityClass: string) => {
                const studiesByInsecticideClass = studiesByCountry.filter(
                    study => study.INSECTICIDE_CLASS === insecticityClass
                );

                const insecticideTypes = _.uniq(
                    allStudies
                        .filter(
                            study =>
                                study.INSECTICIDE_CLASS === insecticityClass &&
                                filters.insecticideTypes.includes(study.INSECTICIDE_TYPE)
                        )
                        .map(study => study.INSECTICIDE_TYPE)
                );

                const resistanceConfirmed = createSerieByStatusAndInsecticideType(
                    studiesByInsecticideClass,
                    insecticideTypes,
                    "CONFIRMED_RESISTANCE",
                    i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.confirmed"),
                    ResistanceStatusColors.Confirmed[0]
                );

                const resistancePosible = createSerieByStatusAndInsecticideType(
                    studiesByInsecticideClass,
                    insecticideTypes,
                    "POSSIBLE_RESISTANCE",
                    i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.possible"),
                    ResistanceStatusColors.Possible[0]
                );

                const resistanceSusceptible = createSerieByStatusAndInsecticideType(
                    studiesByInsecticideClass,
                    insecticideTypes,
                    "SUSCEPTIBLE",
                    i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.susceptible"),
                    ResistanceStatusColors.Susceptible[0]
                );

                const countrySeries = {
                    ...acc[countryISO],
                    [insecticityClass]: {
                        categories: insecticideTypes.map(insecticideType => i18next.t(insecticideType)),
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

    return result;
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
