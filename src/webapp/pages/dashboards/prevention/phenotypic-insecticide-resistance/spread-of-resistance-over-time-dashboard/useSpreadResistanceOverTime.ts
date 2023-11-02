import i18next from "i18next";
import { range, countBy, uniq } from "lodash";
import React from "react";
import { Option } from "../../../common/types";
import { usePrevention } from "../../usePrevention";
import { SpreadOfResistanceOverTimeChartData, SpreadOfResistanceOverTimeChartType } from "../types";
import { createChartData as createChartDataByInsecticideClass } from "./by-insecticide-class/createChartData";
import { PreventionFiltersState } from "../../filters/PreventionFiltersState";
import { sortInsecticideClasses } from "../../../../../components/filters/InsecticideClassFilter";

const chartTypes: Option<SpreadOfResistanceOverTimeChartType>[] = [
    {
        label: i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.byInsecticideClass"),
        value: "by-insecticide-class",
    },
    {
        label: i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.byInsecticide"),
        value: "by-insecticide",
    },
];

const baseFilters: ((study: any) => boolean)[] = [];

export function useSpreadResistanceOverTime() {
    const { preventionStudies, filteredStudies, selectedCountries, filters, speciesOptions } =
        usePrevention(baseFilters);

    const {
        disableSpeciesFilter,
        disaggregateBySpeciesSelection,
        years,
        insecticideClasses,
        onDisableSpeciesFilter,
        onDisaggregateBySpeciesChange,
        onSpeciesChange,
        onInsecticideClassChange,
    } = filters;

    const [data, setData] = React.useState<SpreadOfResistanceOverTimeChartData>({
        kind: "InsecticideByClass",
        data: { years: [], dataByCountry: {}, maxSumOfConfirmedResistance: 0 },
    });
    const [categoriesCount, setCategoriesCount] = React.useState<Record<string, number>>({});
    const [chartType, setChartType] = React.useState<SpreadOfResistanceOverTimeChartType>("by-insecticide-class");
    const [allInsecticideClasses, setAllInsecticideClasses] = React.useState<string[]>([]);

    React.useEffect(() => {
        const hasToBeDisabledSpeciesFilter =
            onDisaggregateBySpeciesChange && disaggregateBySpeciesSelection === "aggregate_species";

        if (!disableSpeciesFilter && hasToBeDisabledSpeciesFilter) {
            onDisableSpeciesFilter(hasToBeDisabledSpeciesFilter);
        }

        if (disableSpeciesFilter && !hasToBeDisabledSpeciesFilter) {
            onDisableSpeciesFilter(false);
        }
    }, [disableSpeciesFilter, disaggregateBySpeciesSelection, onDisableSpeciesFilter, onDisaggregateBySpeciesChange]);

    React.useEffect(() => {
        onSpeciesChange(speciesOptions.map(option => option.value));
    }, [onSpeciesChange, speciesOptions]);

    React.useEffect(() => {
        onInsecticideClassChange(allInsecticideClasses.map(option => option));
    }, [allInsecticideClasses, onInsecticideClassChange]);

    React.useEffect(() => {
        const insecticideClasses = sortInsecticideClasses(
            uniq(preventionStudies.map(study => study.INSECTICIDE_CLASS))
        );

        setAllInsecticideClasses(insecticideClasses);
    }, [preventionStudies]);

    React.useEffect(() => {
        setData(
            createChartDataByInsecticideClass(
                filteredStudies,
                selectedCountries,
                range(years[0], years[1] + 1),
                insecticideClasses,
                disaggregateBySpeciesSelection
            )
        );
    }, [disaggregateBySpeciesSelection, filteredStudies, insecticideClasses, selectedCountries, years]);

    React.useEffect(() => {
        if (chartType === "by-insecticide-class") {
            setCategoriesCount(countBy(filteredStudies, "INSECTICIDE_CLASS"));
        } else {
            setCategoriesCount(countBy(filteredStudies, "INSECTICIDE_TYPE"));
        }
    }, [chartType, filteredStudies]);

    const onChartTypeChange = React.useCallback((type: SpreadOfResistanceOverTimeChartType) => {
        setChartType(type);
    }, []);

    const isDisaggregatedBySpecies = React.useMemo(() => {
        return disaggregateBySpeciesSelection === "disaggregate_species";
    }, [disaggregateBySpeciesSelection]);

    return {
        allInsecticideClasses,
        filteredStudies,
        categoriesCount,
        chartTypes,
        chartType,
        data,
        filters: {
            ...filters,
            onInsecticideClassesChange: undefined,
            onTypeChange: undefined,
            onInsecticideTypesChange: undefined,
        } as PreventionFiltersState,
        speciesOptions,
        isDisaggregatedBySpecies,
        onChartTypeChange,
    };
}
