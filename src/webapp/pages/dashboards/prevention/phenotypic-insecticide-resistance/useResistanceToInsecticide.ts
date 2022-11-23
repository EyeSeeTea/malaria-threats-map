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
    const result = selectedCountries.reduce((acc, countryISO) => {
        const studiesByCountry = studies.filter(study => study.ISO2 === countryISO);

        const resistanceConfirmedStudies = studiesByCountry.filter(
            study => study.RESISTANCE_STATUS === "CONFIRMED_RESISTANCE"
        );

        const resistanceConfirmed = {
            type: "bar" as const,
            name: i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.confirmed"),
            color: ResistanceStatusColors.Confirmed[0],
            data:
                type === "by-insecticide-class"
                    ? getCountByInsecticideClass(resistanceConfirmedStudies, filters.insecticideClasses)
                    : getCountByInsecticideType(resistanceConfirmedStudies, filters.insecticideTypes),
        };

        const resistancePosibleStudies = studiesByCountry.filter(
            study => study.RESISTANCE_STATUS === "POSSIBLE_RESISTANCE"
        );

        const resistancePosible = {
            type: "bar" as const,
            name: i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.possible"),
            color: ResistanceStatusColors.Possible[0],
            data:
                type === "by-insecticide-class"
                    ? getCountByInsecticideClass(resistancePosibleStudies, filters.insecticideClasses)
                    : getCountByInsecticideType(resistancePosibleStudies, filters.insecticideTypes),
        };

        const resistanceSusceptibleStudies = studiesByCountry.filter(
            study => study.RESISTANCE_STATUS === "SUSCEPTIBLE"
        );

        const resistanceSusceptible = {
            type: "bar" as const,
            name: i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.susceptible"),
            color: ResistanceStatusColors.Susceptible[0],
            data:
                type === "by-insecticide-class"
                    ? getCountByInsecticideClass(resistanceSusceptibleStudies, filters.insecticideClasses)
                    : getCountByInsecticideType(resistanceSusceptibleStudies, filters.insecticideTypes),
        };

        return { ...acc, [countryISO]: [resistanceSusceptible, resistancePosible, resistanceConfirmed] };
    }, {});

    return result;
}

function getCountByInsecticideClass(studies: PreventionStudy[], insecticideClasses: string[]) {
    return insecticideClasses.map(
        insecticideClass => studies.filter(study => study.INSECTICIDE_CLASS === insecticideClass).length
    );
}

function getCountByInsecticideType(studies: PreventionStudy[], insecticideTypes: string[]) {
    return insecticideTypes.map(
        insecticideType => studies.filter(study => study.INSECTICIDE_TYPE === insecticideType).length
    );
}
