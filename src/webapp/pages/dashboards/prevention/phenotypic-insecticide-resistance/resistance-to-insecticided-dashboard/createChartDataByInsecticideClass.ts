import i18next from "i18next";
import _ from "lodash";
import { PreventionStudy } from "../../../../../../domain/entities/PreventionStudy";
import { ResistanceStatusColors } from "../../../../../components/layers/prevention/ResistanceStatus/symbols";
import { PreventionFiltersState } from "../../filters/PreventionFiltersState";
import { ResistanceToInsecticideSeriesGroup } from "../types";

export function createChartDataByInsecticideClass(
    allStudies: PreventionStudy[],
    studies: PreventionStudy[],
    selectedCountries: string[],
    filters: PreventionFiltersState
): ResistanceToInsecticideSeriesGroup {
    if (filters.insecticideClasses.length === 0) return {};

    const result = selectedCountries.reduce((acc, countryISO) => {
        const studiesByCountry = studies.filter(study => study.ISO2 === countryISO);

        const insecticityTypes = _.uniq(studiesByCountry.map(study => study.INSECTICIDE_TYPE));

        const accByInsecityce = insecticityTypes.reduce(
            (acc: ResistanceToInsecticideSeriesGroup, insecticityType: string) => {
                const studiesByInsecticide = studiesByCountry.filter(
                    study => study.INSECTICIDE_TYPE === insecticityType
                );

                const insecticideClasses = _.uniq(
                    allStudies
                        .filter(
                            study =>
                                study.INSECTICIDE_TYPE === insecticityType &&
                                filters.insecticideClasses.includes(study.INSECTICIDE_CLASS)
                        )
                        .map(study => study.INSECTICIDE_CLASS)
                );

                const resistanceConfirmed = createSerieByStatusAndInsecticideClass(
                    studiesByInsecticide,
                    insecticideClasses,
                    "CONFIRMED_RESISTANCE",
                    i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.confirmed"),
                    ResistanceStatusColors.Confirmed[0]
                );

                const resistancePosible = createSerieByStatusAndInsecticideClass(
                    studiesByInsecticide,
                    insecticideClasses,
                    "POSSIBLE_RESISTANCE",
                    i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.possible"),
                    ResistanceStatusColors.Possible[0]
                );

                const resistanceSusceptible = createSerieByStatusAndInsecticideClass(
                    studiesByInsecticide,
                    insecticideClasses,
                    "SUSCEPTIBLE",
                    i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.susceptible"),
                    ResistanceStatusColors.Susceptible[0]
                );

                const countrySeries = {
                    ...acc[countryISO],
                    [insecticityType]: {
                        categories: insecticideClasses.map(insecticideClass => i18next.t(insecticideClass)),
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
            ...accByInsecityce,
        };
    }, {});

    return result;
}

function createSerieByStatusAndInsecticideClass(
    studies: PreventionStudy[],
    classes: string[],
    resitanceStatus: string,
    name: string,
    color: string
) {
    const resistanceConfirmedStudies = studies.filter(study => study.RESISTANCE_STATUS === resitanceStatus);

    const serie = {
        type: "bar" as const,
        name,
        color,
        data: getCountByInsecticideClass(resistanceConfirmedStudies, classes),
    };
    return serie;
}

function getCountByInsecticideClass(studies: PreventionStudy[], insecticideClasses: string[]) {
    return insecticideClasses.map(insecticideClass => {
        const studiesByClass = studies.filter(study => study.INSECTICIDE_CLASS === insecticideClass);

        return _(studiesByClass)
            .groupBy(study => study.SITE_ID)
            .keys()
            .value().length;
    });
}
