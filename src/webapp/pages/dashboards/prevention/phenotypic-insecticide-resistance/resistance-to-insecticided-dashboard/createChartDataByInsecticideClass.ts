import i18next from "i18next";
import _ from "lodash";
import { PreventionStudy } from "../../../../../../domain/entities/PreventionStudy";
import { sortInsecticideClasses } from "../../../../../components/filters/InsecticideClassFilter";
import { ResistanceStatusColors } from "../../../../../components/layers/prevention/ResistanceStatus/symbols";
import { ResistanceToInsecticideChartDataByClass } from "../types";

export function createChartDataByInsecticideClass(
    allStudies: PreventionStudy[],
    studies: PreventionStudy[],
    selectedCountries: string[],
    insecticideClasses: string[]
): ResistanceToInsecticideChartDataByClass {
    if (insecticideClasses.length === 0) return { kind: "InsecticideByClass", data: {} };

    const result = selectedCountries.reduce((acc, countryISO) => {
        const studiesByCountry = studies.filter(study => study.ISO2 === countryISO);

        const finalInsecticideClasses = sortInsecticideClasses(
            _.uniq(
                allStudies
                    .filter(study => insecticideClasses.includes(study.INSECTICIDE_CLASS))
                    .map(study => study.INSECTICIDE_CLASS)
            )
        );

        const resistanceConfirmed = createSerieByStatusAndInsecticideClass(
            studiesByCountry,
            finalInsecticideClasses,
            "CONFIRMED_RESISTANCE",
            i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.confirmed"),
            ResistanceStatusColors.Confirmed[0]
        );

        const resistancePosible = createSerieByStatusAndInsecticideClass(
            studiesByCountry,
            finalInsecticideClasses,
            "POSSIBLE_RESISTANCE",
            i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.possible"),
            ResistanceStatusColors.Possible[0]
        );

        const resistanceSusceptible = createSerieByStatusAndInsecticideClass(
            studiesByCountry,
            finalInsecticideClasses,
            "SUSCEPTIBLE",
            i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.susceptible"),
            ResistanceStatusColors.Susceptible[0]
        );

        const countrySeries = {
            categories: insecticideClasses.map(insecticideClass => i18next.t(insecticideClass)),
            series: [resistanceSusceptible, resistancePosible, resistanceConfirmed],
        };
        return {
            ...acc,
            [countryISO]: countrySeries,
        };
    }, {});

    return { kind: "InsecticideByClass", data: result };
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
