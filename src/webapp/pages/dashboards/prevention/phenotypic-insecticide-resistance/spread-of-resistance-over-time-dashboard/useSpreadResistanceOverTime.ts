import i18next from "i18next";
import { range, countBy, uniq } from "lodash";
import React from "react";
import { Option } from "../../../common/types";
import { usePrevention } from "../../usePrevention";
import { PreventionFiltersState } from "../../filters/PreventionFiltersState";
import {
    SpreadOfResistanceOverTimeChartDataByClass,
    SpreadOfResistanceOverTimeChartDataByType,
    SpreadOfResistanceOverTimeChartType,
} from "../types";
import { createBarChartData as createBarChartDataByInsecticideClass } from "./by-insecticide-class/createBarChartData";
import { createLineChartData } from "./createLineChartData";

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

    const [lineChartDataByClass, setLineChartDataByClass] = React.useState<SpreadOfResistanceOverTimeChartDataByClass>({
        kind: "InsecticideByClass",
        data: { years: [], dataByCountry: {}, maxValue: 0 },
    });

    const [lineChartDataByType, setLineChartDataByType] = React.useState<SpreadOfResistanceOverTimeChartDataByType>({
        kind: "InsecticideByType",
        data: { years: [], dataByCountry: {}, maxValue: 0 },
    });

    const [barChartData, setBarChartData] = React.useState<SpreadOfResistanceOverTimeChartDataByClass>({
        kind: "InsecticideByClass",
        data: { years: [], dataByCountry: {}, maxValue: 0 },
    });
    const [categoriesCount, setCategoriesCount] = React.useState<Record<string, number>>({});
    const [chartType, setChartType] = React.useState<SpreadOfResistanceOverTimeChartType>("by-insecticide-class");
    const [allInsecticideClasses, setAllInsecticideClasses] = React.useState<string[]>([]);
    const [multipleSelectedInsecticideClasses, setMultipleSelectedInsecticideClasses] = React.useState<string[]>([]);
    const [singleSelectedInsecticideClass, setSingleSelectedInsecticideClass] = React.useState<string | undefined>(
        undefined
    );
    const [allInsecticides, setAllInsecticides] = React.useState<string[]>([]);
    const [multipleSelectedInsecticides, setMultipleSelectedInsecticides] = React.useState<string[]>([]);
    const [singleSelectedInsecticide, setSingleSelectedInsecticide] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        filters.onSpeciesChange(speciesOptions.map(option => option.value));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [speciesOptions]);

    React.useEffect(() => {
        filters.onInsecticideClassChange(chartType === "by-insecticide-class" ? [] : ["PYRETHROIDS"]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allInsecticideClasses, chartType]);

    React.useEffect(() => {
        if (chartType === "by-insecticide-class") {
            const insecticideClasses = uniq(preventionStudies.map(study => study.INSECTICIDE_CLASS)).sort();
            setAllInsecticideClasses(insecticideClasses);
            setMultipleSelectedInsecticideClasses(insecticideClasses);
            setSingleSelectedInsecticideClass(insecticideClasses[0]);
        }

        if (chartType === "by-insecticide") {
            const insecticides = uniq(preventionStudies.map(study => study.INSECTICIDE_TYPE)).sort();
            setAllInsecticides(insecticides);
            setMultipleSelectedInsecticides(insecticides);
            setSingleSelectedInsecticide(insecticides[0]);
        }
    }, [chartType, preventionStudies]);

    React.useEffect(() => {
        if (chartType === "by-insecticide-class") {
            const yearsRange = range(filters.years[0], filters.years[1] + 1);
            setLineChartDataByClass(
                createLineChartData(
                    filteredStudies,
                    selectedCountries,
                    yearsRange,
                    multipleSelectedInsecticideClasses,
                    filters.disaggregateBySpeciesSelection,
                    "by-insecticide-class"
                ) as SpreadOfResistanceOverTimeChartDataByClass
            );

            setBarChartData(
                createBarChartDataByInsecticideClass(
                    filteredStudies,
                    selectedCountries,
                    yearsRange,
                    singleSelectedInsecticideClass,
                    filters.disaggregateBySpeciesSelection
                )
            );
        }
    }, [
        chartType,
        filteredStudies,
        filters.disaggregateBySpeciesSelection,
        filters.years,
        multipleSelectedInsecticideClasses,
        multipleSelectedInsecticides,
        selectedCountries,
        singleSelectedInsecticideClass,
    ]);

    React.useEffect(() => {
        if (chartType === "by-insecticide") {
            const yearsRange = range(filters.years[0], filters.years[1] + 1);
            setLineChartDataByType(
                createLineChartData(
                    filteredStudies,
                    selectedCountries,
                    yearsRange,
                    multipleSelectedInsecticides,
                    filters.disaggregateBySpeciesSelection,
                    "by-insecticide"
                ) as SpreadOfResistanceOverTimeChartDataByType
            );
        }
    }, [
        chartType,
        filteredStudies,
        filters.disaggregateBySpeciesSelection,
        filters.years,
        multipleSelectedInsecticideClasses,
        multipleSelectedInsecticides,
        selectedCountries,
        singleSelectedInsecticideClass,
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
        multipleSelectedInsecticideClasses,
        singleSelectedInsecticideClass,
        setMultipleSelectedInsecticideClasses,
        setSingleSelectedInsecticideClass,
        allInsecticides,
        multipleSelectedInsecticides,
        singleSelectedInsecticide,
        setMultipleSelectedInsecticides,
        setSingleSelectedInsecticide,
        filteredStudies,
        categoriesCount,
        chartTypes,
        chartType,
        lineChartDataByClass,
        lineChartDataByType,
        barChartData,
        filters: {
            ...filters,
            onInsecticideClassesChange: chartType === "by-insecticide" ? filters.onInsecticideClassChange : undefined,
            onTypeChange: undefined,
            onInsecticideTypesChange: undefined,
        } as PreventionFiltersState,
        speciesOptions,
        isDisaggregatedBySpecies,
        onChartTypeChange,
    };
}
