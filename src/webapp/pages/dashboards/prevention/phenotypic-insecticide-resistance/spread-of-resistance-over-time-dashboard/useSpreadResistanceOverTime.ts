import i18next from "i18next";
import { range, countBy, uniq } from "lodash";
import React from "react";
import { Option } from "../../../common/types";
import { usePrevention } from "../../usePrevention";
import { SpreadOfResistanceOverTimeChartData, SpreadOfResistanceOverTimeChartType } from "../types";
import { createChartData as createChartDataByInsecticideClass } from "./by-insecticide-class/createChartData";
import { PreventionFiltersState } from "../../filters/PreventionFiltersState";

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
    const { preventionStudies, filteredStudies, selectedCountries, filters, speciesOptions, insecticideClassOptions } =
        usePrevention(baseFilters);

    const [data, setData] = React.useState<SpreadOfResistanceOverTimeChartData>({
        kind: "InsecticideByClass",
        data: { years: [], dataByCountry: {}, maxSumOfConfirmedResistance: 0 },
    });
    const [categoriesCount, setCategoriesCount] = React.useState<Record<string, number>>({});
    const [chartType, setChartType] = React.useState<SpreadOfResistanceOverTimeChartType>("by-insecticide-class");
    const [allInsecticideClasses, setAllInsecticideClasses] = React.useState<string[]>([]);

    React.useEffect(() => {
        filters.onSpeciesChange(speciesOptions.map(option => option.value));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.onSpeciesChange, speciesOptions]);

    React.useEffect(() => {
        filters.onInsecticideClassChange(insecticideClassOptions.map(option => option.value));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.onInsecticideClassChange, insecticideClassOptions]);

    React.useEffect(() => {
        const insecticideClasses = uniq(preventionStudies.map(study => study.INSECTICIDE_CLASS)).sort();
        setAllInsecticideClasses(insecticideClasses);
    }, [preventionStudies]);

    React.useEffect(() => {
        if (filteredStudies.length && filters.insecticideClasses.length) {
            setData(
                createChartDataByInsecticideClass(
                    filteredStudies,
                    selectedCountries,
                    range(filters.years[0], filters.years[1] + 1),
                    filters.insecticideClasses,
                    filters.disaggregateBySpeciesSelection
                )
            );
        }
    }, [
        filteredStudies,
        selectedCountries,
        filters.years,
        filters.disaggregateBySpeciesSelection,
        filters.insecticideClasses,
    ]);

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
        return filters.disaggregateBySpeciesSelection === "disaggregate_species";
    }, [filters.disaggregateBySpeciesSelection]);

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
