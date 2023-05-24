import i18next from "i18next";
import _ from "lodash";
import React from "react";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import { ResistanceStatusColors } from "../../../../components/layers/prevention/ResistanceStatus/symbols";
import { Option } from "../../common/types";
import { PreventionFiltersState } from "../filters/PreventionFiltersState";
import { ResistanceToInsecticideChartType } from "../types";
import { usePrevention } from "../usePrevention";
import { ResistanceToInsecticideSeriesGroup } from "./types";

const chartTypes: Option<ResistanceToInsecticideChartType>[] = [
    {
        label: i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.byInsecticideClass"),
        value: "by-insecticide-class",
    },
    {
        label: i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.byInsecticide"),
        value: "by-insecticide",
    },
];

export function useResistanceToInsecticide() {
    const {
        filteredStudies,
        insecticideClassOptions,
        insecticideTypeOptions,
        selectedCountries,
        filters,
        onInsecticideClassChange,
        onSpeciesChange,
        onInsecticideTypesChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    } = usePrevention();

    const [data, setData] = React.useState<ResistanceToInsecticideSeriesGroup>({});
    const [categories, setCategories] = React.useState<string[]>([]);
    const [categoriesCount, setCategoriesCount] = React.useState<Record<string, number>>({});
    const [chartType, setChartType] = React.useState<ResistanceToInsecticideChartType>("by-insecticide-class");

    React.useEffect(() => {
        setData(createChartData(filteredStudies, selectedCountries, filters, chartType));
    }, [filteredStudies, selectedCountries, filters, chartType]);

    React.useEffect(() => {
        if (chartType === "by-insecticide-class") {
            setCategories(filters.insecticideClasses.map(insecticideClass => i18next.t(insecticideClass)));
        } else {
            setCategories(filters.insecticideTypes.map(insecticideType => i18next.t(insecticideType)));
        }
    }, [chartType, filters.insecticideClasses, filters.insecticideTypes]);

    React.useEffect(() => {
        if (chartType === "by-insecticide-class") {
            onInsecticideClassChange(insecticideClassOptions.map(op => op.value));
            onInsecticideTypesChange([]);
        } else {
            onInsecticideClassChange([]);
            onInsecticideTypesChange(insecticideTypeOptions.map(op => op.value));
        }
    }, [
        chartType,
        onInsecticideClassChange,
        onInsecticideTypesChange,
        insecticideClassOptions,
        insecticideTypeOptions,
    ]);

    React.useEffect(() => {
        if (chartType === "by-insecticide-class") {
            setCategoriesCount(_.countBy(filteredStudies, "INSECTICIDE_CLASS"));
        } else {
            setCategoriesCount(_.countBy(filteredStudies, "INSECTICIDE_TYPE"));
        }
    }, [chartType, filteredStudies]);

    const onChartTypeChange = React.useCallback((type: ResistanceToInsecticideChartType) => {
        setChartType(type);
    }, []);

    return {
        insecticideTypeOptions,
        filteredStudies,
        categoriesCount,
        chartTypes,
        chartType,
        categories,
        data,
        filters,
        onChartTypeChange,
        onInsecticideClassChange,
        onSpeciesChange,
        onInsecticideTypesChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    };
}

export function createChartData(
    studies: PreventionStudy[],
    selectedCountries: string[],
    filters: PreventionFiltersState,
    type: ResistanceToInsecticideChartType
): ResistanceToInsecticideSeriesGroup {
    if (type === "by-insecticide") {
        return createChartDataByInsecticideType(studies, selectedCountries, filters, type);
    } else {
        return createChartDataByInsecticideClass(studies, selectedCountries, filters, type);
    }
}

export function createChartDataByInsecticideClass(
    studies: PreventionStudy[],
    selectedCountries: string[],
    filters: PreventionFiltersState,
    type: ResistanceToInsecticideChartType
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

                const resistanceConfirmed = createSerieByStatus(
                    studiesByInsecticide,
                    type,
                    filters,
                    "CONFIRMED_RESISTANCE",
                    i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.confirmed"),
                    ResistanceStatusColors.Confirmed[0]
                );

                const resistancePosible = createSerieByStatus(
                    studiesByInsecticide,
                    type,
                    filters,
                    "POSSIBLE_RESISTANCE",
                    i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.possible"),
                    ResistanceStatusColors.Possible[0]
                );

                const resistanceSusceptible = createSerieByStatus(
                    studiesByInsecticide,
                    type,
                    filters,
                    "SUSCEPTIBLE",
                    i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.susceptible"),
                    ResistanceStatusColors.Susceptible[0]
                );

                const countrySeries = {
                    ...acc[countryISO],
                    [insecticityType]: [resistanceSusceptible, resistancePosible, resistanceConfirmed],
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

export function createChartDataByInsecticideType(
    studies: PreventionStudy[],
    selectedCountries: string[],
    filters: PreventionFiltersState,
    type: ResistanceToInsecticideChartType
): ResistanceToInsecticideSeriesGroup {
    if (filters.insecticideTypes.length === 0) return {};

    const result = selectedCountries.reduce((acc, countryISO) => {
        const studiesByCountry = studies.filter(study => study.ISO2 === countryISO);

        const insecticityClasses = _.uniq(studiesByCountry.map(study => study.INSECTICIDE_CLASS));

        const accByInsecityceClass = insecticityClasses.reduce(
            (acc: ResistanceToInsecticideSeriesGroup, insecticityClass: string) => {
                const studiesByInsecticideClass = studiesByCountry.filter(
                    study => study.INSECTICIDE_CLASS === insecticityClass
                );

                const resistanceConfirmed = createSerieByStatus(
                    studiesByInsecticideClass,
                    type,
                    filters,
                    "CONFIRMED_RESISTANCE",
                    i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.confirmed"),
                    ResistanceStatusColors.Confirmed[0]
                );

                const resistancePosible = createSerieByStatus(
                    studiesByInsecticideClass,
                    type,
                    filters,
                    "POSSIBLE_RESISTANCE",
                    i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.possible"),
                    ResistanceStatusColors.Possible[0]
                );

                const resistanceSusceptible = createSerieByStatus(
                    studiesByInsecticideClass,
                    type,
                    filters,
                    "SUSCEPTIBLE",
                    i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.susceptible"),
                    ResistanceStatusColors.Susceptible[0]
                );

                const countrySeries = {
                    ...acc[countryISO],
                    [insecticityClass]: [resistanceSusceptible, resistancePosible, resistanceConfirmed],
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

function createSerieByStatus(
    studies: PreventionStudy[],
    type: string,
    filters: PreventionFiltersState,
    resitanceStatus: string,
    name: string,
    color: string
) {
    const resistanceConfirmedStudies = studies.filter(study => study.RESISTANCE_STATUS === resitanceStatus);

    const resistanceConfirmed = {
        type: "bar" as const,
        name,
        color,
        data:
            type === "by-insecticide-class"
                ? getCountByInsecticideClass(resistanceConfirmedStudies, filters.insecticideClasses)
                : getCountByInsecticideType(resistanceConfirmedStudies, filters.insecticideTypes),
    };
    return resistanceConfirmed;
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

function getCountByInsecticideType(studies: PreventionStudy[], insecticideTypes: string[]) {
    return insecticideTypes.map(insecticideType => {
        const studiesByType = studies.filter(study => study.INSECTICIDE_TYPE === insecticideType);

        return _(studiesByType)
            .groupBy(study => study.SITE_ID)
            .keys()
            .value().length;
    });
}
